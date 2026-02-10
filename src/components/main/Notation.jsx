import { useRef, useEffect, useCallback } from "react";
import {
  Renderer,
  Stave,
  StaveConnector,
  Voice,
  Formatter,
  TextBracket,
  Glyph,
} from "vexflow";
import { TextBracketNoLineTop, TextBracketNoLineBottom } from "../../classes/VexPatches";

/**
 * Responsive + vertically centered VexFlow notation.
 * - Uses ResizeObserver to redraw on container resize
 * - Uses container width/height (SVG matches panel height)
 * - Centers the "notation block" vertically within the available height
 */
export default function Notation({ partials, settings, setFlippedNotes }) {
  const containerRef = useRef(null);

  const render = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clear previous SVG
    el.innerHTML = "";

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (!width) return;

    // If the panel hasn't resolved a height yet (common in some flex layouts),
    // fall back to a sensible default. We'll still vertically center within that.
    const svgHeight = height > 0 ? height : 250;

    // Scale based on width (clamped)
    const scale = Math.max(0.7, Math.min(0.95, width / 650));

    // Convert screen units -> VexFlow "internal" units
    // because we scale the context after renderer.resize().
    const innerWidth = width / scale;
    const innerHeight = svgHeight / scale;

    const widthFactor = 0.9;

    // Horizontal layout in internal units
    const leftPad = 20;
    const usableInnerWidth = Math.max(10, innerWidth - leftPad * 2);

    const staveWidth = usableInnerWidth * widthFactor;

    const staveX = (innerWidth - staveWidth) / 2;

    // Vertical centering:
    // This is the approximate "block height" used by two staves + gap + a bit of bracket room.
    // Tweak notationHeight if your brackets feel tight.
    const notationHeight = 190;

    // Keep it from going negative (if the panel is very short).
    const yOffset = Math.max(0, (innerHeight - notationHeight) / 2);

    // Stave Y positions in internal units
    const topY = yOffset;
    const staveGap = 75; // distance between staves (internal units)
    const bottomY = topY + staveGap;

    // Create renderer sized to the actual panel
    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, svgHeight);

    const context = renderer.getContext();
    context.scale(scale, scale);

    // Create staves
    const top = new Stave(staveX, topY, staveWidth);
    const bottom = new Stave(staveX, bottomY, staveWidth);

    top.addClef("treble");
    bottom.addClef("bass");

    // Quarter-tone glyphs (positioned relative to staves)
    if (settings.centDeviation === 50) {
      Glyph.renderGlyph(
        context,
        staveX + 18,
        topY + 2,
        40,
        "accidentalQuarterToneSharpStein"
      );
    } else if (settings.centDeviation === -50) {
      // Keep your original intent, but tie to bottomY so it moves with centering.
      // (If this ends up too low/high, we can tune this after CSS is sorted.)
      Glyph.renderGlyph(
        context,
        staveX + 14,
        bottomY + 105,
        40,
        "accidentalQuarterToneFlatStein"
      );
    }

    // Connectors
    const brace = new StaveConnector(top, bottom).setType(3);
    const lineLeft = new StaveConnector(top, bottom).setType(1);
    const lineRight = new StaveConnector(top, bottom).setType(7);

    // Draw staves + connectors
    top.setContext(context).draw();
    bottom.setContext(context).draw();
    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    if (!partials || partials.length < 1) return;

    const notes = partials.map((partial) => partial.getRenderable());

    // assign notes to relevant stave
    for (let i = 0; i < notes.length; i++) {
      notes[i].setStave(partials[i].note.clef === "treble" ? top : bottom);
    }

    const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes);

    // --- octava detection (kept from your version) ---
    let octava = { "8va": [], "8vb": [], "15ma": [], "15mb": [] };

    partials.forEach((partial, index) => {
      if (partial.note.octava) {
        switch (partial.note.octava) {
          case 1:
            octava["8va"].push(index);
            break;
          case -1:
            octava["8vb"].push(index);
            break;
          case 2:
            octava["15ma"].push(index);
            break;
          case -2:
            octava["15mb"].push(index);
            break;
          default:
            break;
        }
      }
    });

    let bracket_top_one = null;
    let bracket_top_two = null;
    let bracket_bottom_one = null;
    let bracket_bottom_two = null;

    if (octava["8va"].length > 0) {
      const start = notes[octava["8va"][0]];
      const stop = notes[octava["8va"][octava["8va"].length - 1]];
      bracket_top_one =
        start === stop
          ? new TextBracketNoLineTop({
              start,
              stop,
              text: "8va",
              position: TextBracket.Position.TOP,
            })
          : new TextBracket({
              start,
              stop,
              text: "8va",
              position: TextBracket.Position.TOP,
            });
      bracket_top_one.setLine(3.5);
    }

    if (octava["15ma"].length > 0) {
      const start = notes[octava["15ma"][0]];
      const stop = notes[octava["15ma"][octava["15ma"].length - 1]];

      const partials_midi = partials.map((p) => p.midikey);
      const highest_midi = Math.max(...partials_midi);
      const value = highest_midi - 107;
      const lineHeight = value >= 0 ? value : 0;
      const line = Math.round(lineHeight / 4) * 0.5 + 3.5;

      bracket_top_two =
        start === stop
          ? new TextBracketNoLineTop({
              start,
              stop,
              text: "15ma",
              position: TextBracket.Position.TOP,
            })
          : new TextBracket({
              start,
              stop,
              text: "15ma",
              position: TextBracket.Position.TOP,
            });
      bracket_top_two.setLine(line);
    }

    if (octava["8vb"].length > 0) {
      const start = notes[octava["8vb"][0]];
      const stop = notes[octava["8vb"][octava["8vb"].length - 1]];

      const partials_midi = partials.map((p) => p.midikey);
      const lowest_midi = Math.min(...partials_midi);

      let noBracketLine, bracketLine;
      if (lowest_midi < 20) {
        noBracketLine = 7;
        bracketLine = 6;
      } else {
        noBracketLine = 4;
        bracketLine = 3;
      }

      bracket_bottom_one =
        start === stop
          ? new TextBracketNoLineBottom({
              start,
              stop,
              text: "8vb",
              position: TextBracket.Position.BOTTOM,
            })
          : new TextBracket({
              start,
              stop,
              text: "8vb",
              position: TextBracket.Position.BOTTOM,
            });

      bracket_bottom_one.setLine(start === stop ? noBracketLine : bracketLine);
    }

    // Format to available stave width (responsive!)
    new Formatter().joinVoices([voice]).format([voice], staveWidth * 0.72);

    // Constrain notes (kept from your approach, now based on staveWidth)
    const margins = staveWidth * 0.2;
    const offset = (staveWidth - margins) / settings.maxPartials;

    for (let i = 0; i < notes.length; i++) {
      notes[i].getTickContext().setX(offset * i + margins * 0.4);
    }

    voice.draw(context);

    if (bracket_top_one instanceof TextBracket) bracket_top_one.setContext(context).draw();
    if (bracket_top_two instanceof TextBracket) bracket_top_two.setContext(context).draw();
    if (bracket_bottom_one instanceof TextBracket) bracket_bottom_one.setContext(context).draw();
    if (bracket_bottom_two instanceof TextBracket) bracket_bottom_two.setContext(context).draw();

    // click-to-flip enharmonics
    notes.forEach((note, index) => {
      const svgEl = note.getSVGElement();
      if (!svgEl) return;

      svgEl.style.cursor = "pointer";
      svgEl.addEventListener("click", () => {
        setFlippedNotes((prev) =>
          prev.map((fn, j) => (j === partials[index].partialNumber - 1 ? !fn : fn))
        );
      });
    });

    // Make the produced SVG behave like a block element (avoids baseline gaps)
    const svg = el.querySelector("svg");
    if (svg) svg.style.display = "block";
  }, [partials, settings.maxPartials, settings.centDeviation, setFlippedNotes]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial draw
    render();

    // Redraw on resize
    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(render);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [render]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%", // IMPORTANT: lets the panel dictate the SVG height
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    />
  );
}
