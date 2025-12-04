import { useRef, useEffect } from "react";
import { Renderer, Stave, StaveConnector, Voice, Formatter, TextBracket } from "vexflow";
import {TextBracketNoLineTop, TextBracketNoLineBottom } from "../classes/VexPatches";

export default function Notation({partials, maxPartials, setFlippedNotes }) {

  const containerRef = useRef(null);
  // Flow.setMusicFont("Petaluma");

  useEffect(() => {

    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const staveWidth = 400; // this will be derived from layout later

    // draw stave
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(450, 400);

    const context = renderer.getContext();

    // Create the staves
    const top = new Stave(25, 50, staveWidth);
    const bottom = new Stave(25, 150, staveWidth);

    top.addClef('treble');
    bottom.addClef('bass');

    const brace = new StaveConnector(top, bottom).setType(3);
    const lineLeft = new StaveConnector(top, bottom).setType(1);
    const lineRight = new StaveConnector(top, bottom).setType(7);

    top.setContext(context).draw();
    bottom.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    // return if no partials
    if (!partials || partials.length < 1) return;

    // get vexflow StaveNotes
    const notes = partials.map(partial => (
      partial.getRenderable()
    ));

    // assign notes to relevant stave
    for (let i = 0; i < notes.length; i++) {
      if (partials[i].note.clef === "treble") {
        notes[i].setStave(top)
      } else { 
        notes[i].setStave(bottom) 
      }
    };

    const voice = new Voice({
      num_beats: notes.length,
      beat_value: 4
    });
    voice.addTickables(notes);

    let octava = {
      "8va": [],
      "8vb": [],
      "15ma": [],
      "15mb": []
    };

    partials.forEach((partial, index) => {
      if (partial.note.octava) {
        switch (partial.note.octava) {
          case 1:
            octava["8va"].push(index);
            break
          case -1:
            octava["8vb"].push(index);
            break
          case 2:
            octava["15ma"].push(index);
            break
          case -2:
            octava["15mb"].push(index);
          default:
            break
        }
      };
    });

    // draw brackets based on contents of octava ... 

    let bracket_top_one = null;
    let bracket_top_two = null;
    let bracket_bottom_one = null;
    let bracket_bottom_two = null;

    // HANDLE 8VA SYMBOL/BRACKET
    if (octava["8va"].length > 0) {
      const start = notes[octava["8va"][0]];
      const stop = notes[octava["8va"][octava["8va"].length - 1]];

      // use Annotation if start and stop are the same
      if (start === stop) {
        bracket_top_one = new TextBracketNoLineTop({
          start: start,
          stop: stop,
          text: "8va",
          position: TextBracket.Position.TOP
        });
        bracket_top_one.setLine(3.5);
      } else {
        bracket_top_one = new TextBracket({
          start: start,
          stop: stop,
          text: "8va",
          position: TextBracket.Position.TOP
        });
        bracket_top_one.setLine(3.5);
      }      
    };

    // HANDLE 15ma SYMBOL BRACKET
    if (octava["15ma"].length > 0) {
      const start = notes[octava["15ma"][0]];
      const stop = notes[octava["15ma"][octava["15ma"].length - 1]];

      // HANDLE vertically shifting bracket relative to highest pitch
      const partials_midi = partials.map(partial => partial.midikey);
      const highest_midi = Math.max(...partials_midi);
      
      // into range 102-115 (13)
      const value = highest_midi - 107;
      // clamp to 0 lower bound
      const lineHeight = value >= 0 ? value : 0;

      // get increments of 0.5 above 3.5;
      const line = (Math.round(lineHeight / 4) * 0.5) + 3.5;

      // ! DO SAME FOR 8VA, 8VB, 15MB

      // use Annotation if start and stop are the same
      if (start === stop) {
        bracket_top_two = new TextBracketNoLineTop({
          start: start,
          stop: stop,
          text: "15ma",
          position: TextBracket.Position.TOP
        });
        bracket_top_two.setLine(line);
      } else {
        bracket_top_two = new TextBracket({
          start: start,
          stop: stop,
          text: "15ma",
          position: TextBracket.Position.TOP
        });
        bracket_top_two.setLine(line);
      }      
    };

    // HANDLE 8VB SYMBOL/BRACKET
    if (octava["8vb"].length > 0) {
      const start = notes[octava["8vb"][0]];
      const stop = notes[octava["8vb"][octava["8vb"].length - 1]];

      // HANDLE vertically shifting bracket relative to highest pitch
      const partials_midi = partials.map(partial => partial.midikey);
      const lowest_midi = Math.min(...partials_midi);

      let noBracketLine, bracketLine;

      if (lowest_midi < 20) {noBracketLine = 7; bracketLine = 6} else {
        noBracketLine = 4; bracketLine = 3;
      };

      // use Annotation if start and stop are the same
      if (start === stop) {
        bracket_bottom_one = new TextBracketNoLineBottom({
          start: start,
          stop: stop,
          text: "8vb",
          position: TextBracket.Position.BOTTOM
        });
        bracket_bottom_one.setLine(noBracketLine);
      } else {
        bracket_bottom_one = new TextBracket({
          start: start,
          stop: stop,
          text: "8vb",
          position: TextBracket.Position.BOTTOM
        });
        bracket_bottom_one.setLine(bracketLine);
      }      
    };

    new Formatter().joinVoices([voice]).format([voice], 350);

    // constrain notes to set x positions
    const margins = staveWidth * 0.2;
    const offset = (staveWidth - margins) / maxPartials;

    for (let i = 0; i < notes.length; i++) {
      notes[i].getTickContext().setX((offset * i) + (margins * 0.4))
    };

    voice.draw(context);
   
    if (bracket_top_one instanceof TextBracket) { 
      bracket_top_one.setContext(context).draw(); 
    };

    if (bracket_top_two instanceof TextBracket) {
      bracket_top_two.setContext(context).draw();
    }

    if (bracket_bottom_one instanceof TextBracket) {
      bracket_bottom_one.setContext(context).draw();
    }

    if (bracket_bottom_two instanceof TextBracket) {
      bracket_bottom_two.setContext(context).draw();
    };

    // make click-able for enharmonic re-spelling
    notes.forEach((note, index) => {
      const ele = note.getSVGElement();
      if (ele) {
        ele.style.cursor = "pointer";
        ele.addEventListener("click", () => {
          // on click, flip bit at flippedNotes[partialNumber - 1], otherwise return existing fn
          setFlippedNotes(prev => 
            prev.map((fn, j) => 
              j === partials[index].partialNumber - 1 ? !fn : fn
            )
          )
        });
      }
    });

  }, [partials, maxPartials, setFlippedNotes]);

  return (
    <div ref={containerRef}></div>
  )
}

// to do:
// double flats/sharps toggle
// enharmonic flip button for whole series
// centDeviation text all black
// 12-edo version no arrows, no centDeviation text
// make partialSelector buttons match colours
// tidy code ... 

// FIN?
// bugfix for fundamental auto-select
// drag select for partials grid
