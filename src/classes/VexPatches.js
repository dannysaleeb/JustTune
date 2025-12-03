import { TextBracket } from "vexflow";

class TextBracketNoLineTop extends TextBracket {
    draw() {
        const ctx = this.context;
        const stave = this.start.getStave();
        const y = stave.getYForTopText(this.line);

        ctx.save();
        ctx.font = "italic 15pt Times New Roman";
        ctx.fillText(this.text, this.start.getAbsoluteX(), y);
        ctx.restore();

        return this;
    }
}

class TextBracketNoLineBottom extends TextBracket {
    draw() {
        const ctx = this.context;
        const stave = this.start.getStave();
        const y = stave.getYForBottomText(this.line);

        ctx.save();
        ctx.font = "italic 15pt Times New Roman";
        ctx.fillText(this.text, this.start.getAbsoluteX(), y);
        ctx.restore();

        return this;
    }
}

export { TextBracketNoLineTop, TextBracketNoLineBottom };
