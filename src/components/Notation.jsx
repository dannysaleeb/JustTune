import { useRef, useEffect } from "react";
import { Renderer, Stave, StaveConnector, Voice, Formatter, Flow, TextBracket, Annotation } from "vexflow";
import TextBracketNoLine from "../classes/VexPatches";

export default function Notation({partials, maxPartials}) {

  const containerRef = useRef(null);
  // Flow.setMusicFont("Petaluma");

  useEffect(() => {

    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const staveWidth = 400; // this will be derived from layout later

    // draw stave
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(450, 300);

    const context = renderer.getContext();

    // Create the staves
    var top = new Stave(25, 50, staveWidth);
    var bottom = new Stave(25, 150, staveWidth);

    top.addClef('treble');
    bottom.addClef('bass');

    var brace = new StaveConnector(top, bottom).setType(3);
    var lineLeft = new StaveConnector(top, bottom).setType(1);
    var lineRight = new StaveConnector(top, bottom).setType(7);

    top.setContext(context).draw();
    bottom.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    // return if no partials
    if (partials.length < 1) return;

    // get vexflow StaveNotes
    const notes = partials.map(partial => (
      partial.getRenderable()
    ));

    // assign notes to relevant stave
    for (let i = 0; i < notes.length; i++) {
      if (partials[i].note.clef === "treble") {
        notes[i].setStave(top)
      } else { notes[i].setStave(bottom) }
    }

    // create vexflow voice
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

    // HANDLE 8VA SYMBOL/BRACKET
    if (octava["8va"].length > 0) {
      const start = notes[octava["8va"][0]];
      const stop = notes[octava["8va"][octava["8va"].length - 1]];

      // use Annotation if start and stop are the same
      if (start === stop) {
        bracket_top_one = new TextBracketNoLine({
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
        bracket_top_two = new TextBracketNoLine({
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

    new Formatter().joinVoices([voice]).format([voice], 350);

    // constrain notes to set x positions
    const margins = staveWidth * 0.2;
    const offset = (staveWidth - margins) / maxPartials;

    for (let i = 0; i < notes.length; i++) {
      notes[i].getTickContext().setX((offset * i) + (margins * 0.4))
    };

    // render voice
    voice.draw(context);
   
    if (bracket_top_one instanceof TextBracket) { 
      bracket_top_one.setContext(context).draw(); 
    };

    if (bracket_top_two instanceof TextBracket) {
      bracket_top_two.setContext(context).draw();
    }

    notes.forEach((note, index) => {
      const ele = note.getSVGElement(); // VexFlow SVG <g> group for the note

      if (ele) {
        ele.style.cursor = "pointer";
        ele.addEventListener("click", () => {
          partials[index].enharmonicSwitch();
        });
      }
    });

  }, [partials]);

  return (
    <div ref={containerRef}></div>
  )
}

// FIRST PULL CHANGES AND COMMIT ... 

// to do: add 8vb / 15mb indicators ... 
// Still got octave bug 
// introduce arrowed accidentals;
// make centDeviation text move out of way of very low notes, maybe make it appear above bass clef stave; 
// maybe make centDeviation text all black ... (these are ideals for end ... )
// add enharmonic switch ... ALMOST!! make it persist for life of a fundamental? Or immediately change at least ... add switches to Fundamental?? (to indicate if a partial has been switched)
// need to make auto-enharmonic switch work ... 
// pull Fin's changes -- merge with mine
