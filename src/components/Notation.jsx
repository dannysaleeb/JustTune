import { useRef, useEffect, useCallback } from "react";
import { Renderer, Stave, StaveConnector, Voice, Formatter, TextBracket, Glyph } from "vexflow";
import { TextBracketNoLineTop, TextBracketNoLineBottom } from "../classes/VexPatches";

export default function Notation({ partials, settings, setFlippedNotes }) {
  const containerRef = useRef(null);

  const render = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    const { width } = containerRef.current.getBoundingClientRect();

    const fontSize = Math.max(10, Math.min(16, width / 40));
    const fontStyle = { family: "Adamina-Regular, serif", size: fontSize, weight: "italic" };

    const musicScale = 0.85;
    
    const staveWidth = (width / musicScale) - 75; 

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, 280); 

    const context = renderer.getContext();
    context.scale(musicScale, musicScale);

    const topStaveY = 70;    
    const bottomStaveY = 145; 

    const top = new Stave(40, topStaveY, staveWidth);
    const bottom = new Stave(40, bottomStaveY, staveWidth);

    top.addClef('treble');
    bottom.addClef('bass');

    if (settings.centDeviation === 50) {
      Glyph.renderGlyph(context, 59, topStaveY + 2, 40, "accidentalQuarterToneSharpStein");
    } else if (settings.centDeviation === -50) {
      Glyph.renderGlyph(context, 55, bottomStaveY + 110, 40, "accidentalQuarterToneFlatStein");
    }

    const brace = new StaveConnector(top, bottom).setType(3);
    const lineLeft = new StaveConnector(top, bottom).setType(1);
    const lineRight = new StaveConnector(top, bottom).setType(7);

    top.setContext(context).draw();
    bottom.setContext(context).draw();
    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    if (!partials || partials.length < 1) return;

    const notes = partials.map(partial => partial.getRenderable());
    for (let i = 0; i < notes.length; i++) {
      notes[i].setStave(partials[i].note.clef === "treble" ? top : bottom);
    }

    const voice = new Voice({ num_beats: notes.length, beat_value: 4 }).addTickables(notes);

    let octava = { "8va": [], "8vb": [], "15ma": [], "15mb": [] };
    partials.forEach((partial, index) => {
      if (partial.note.octava) {
        switch (partial.note.octava) {
          case 1: octava["8va"].push(index); break;
          case -1: octava["8vb"].push(index); break;
          case 2: octava["15ma"].push(index); break;
          case -2: octava["15mb"].push(index); break;
          default: break;
        }
      }
    });

    let bracket_top_one = null, bracket_top_two = null, bracket_bottom_one = null;
    if (octava["8va"].length > 0) {
      const start = notes[octava["8va"][0]];
      const stop = notes[octava["8va"][octava["8va"].length - 1]];
      const params = { start, stop, text: "8va", position: TextBracket.Position.TOP };
      bracket_top_one = (start === stop) ? new TextBracketNoLineTop(params) : new TextBracket(params);
      bracket_top_one.setLine(4.5).setFont(fontStyle);
    }
    if (octava["15ma"].length > 0) {
      const start = notes[octava["15ma"][0]];
      const stop = notes[octava["15ma"][octava["15ma"].length - 1]];
      const highest_midi = Math.max(...partials.map(p => p.midikey));
      const value = highest_midi - 107;
      const line = (Math.round((value >= 0 ? value : 0) / 4) * 0.5) + 6.0;
      const params = { start, stop, text: "15ma", position: TextBracket.Position.TOP };
      bracket_top_two = (start === stop) ? new TextBracketNoLineTop(params) : new TextBracket(params);
      bracket_top_two.setLine(line).setFont(fontStyle);
    }
    if (octava["8vb"].length > 0) {
      const start = notes[octava["8vb"][0]];
      const stop = notes[octava["8vb"][octava["8vb"].length - 1]];
      const lowest_midi = Math.min(...partials.map(p => p.midikey));
      let line = lowest_midi < 24 ? (start === stop ? 8 : 7) : (start === stop ? 5 : 4.5);
      const params = { start, stop, text: "8vb", position: TextBracket.Position.BOTTOM };
      bracket_bottom_one = (start === stop) ? new TextBracketNoLineBottom(params) : new TextBracket(params);
      bracket_bottom_one.setLine(line).setFont(fontStyle);
    }

    new Formatter().joinVoices([voice]).format([voice], staveWidth * 0.7);

    const margins = staveWidth * 0.2;
    const offset = (staveWidth - margins) / settings.maxPartials;
    for (let i = 0; i < notes.length; i++) {
      // Returned this to your original math (removing the +40)
      notes[i].getTickContext().setX((offset * i) + (margins * 0.4));
    }

    voice.draw(context);
    if (bracket_top_one instanceof TextBracket) bracket_top_one.setContext(context).draw();
    if (bracket_top_two instanceof TextBracket) bracket_top_two.setContext(context).draw();
    if (bracket_bottom_one instanceof TextBracket) bracket_bottom_one.setContext(context).draw();

    notes.forEach((note, index) => {
      const ele = note.getSVGElement();
      if (ele) {
        ele.style.cursor = "pointer";
        ele.addEventListener("click", () => {
          setFlippedNotes(prev => prev.map((fn, j) => j === partials[index].partialNumber - 1 ? !fn : fn));
        });
      }
    });
  }, [partials, settings.maxPartials, settings.centDeviation, setFlippedNotes]);

  useEffect(() => {
    if (!containerRef.current) return;
    render();
    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(() => render());
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [render]);

	return (
	  <div
		ref={containerRef}
		style={{
		  width: "110%",
		  overflow: "hidden",
		  height: "270px",
		  marginTop: "-12px",
		  transform: "translateX(-22px)",
		  display: "flex",
		  alignItems: "flex-start",

		  userSelect: "none",
		  WebkitUserSelect: "none",
		  msUserSelect: "none",

		  WebkitTapHighlightColor: "transparent",
		}}
	  />
	);
}