export interface IRange {
    start: number;
    end: number;
}

const Nope = -1;

export class Cursor {
    public off = true;
    public parentSpan: HTMLSpanElement;
    public editSpan: HTMLSpanElement;
    public mark = Nope;
    protected bgColor = "blue";
    protected enabled = true;
    protected blinkCount = 0;
    protected blinkTimer: any;

    constructor(public viewportDiv: HTMLDivElement, public pos = 0) {
        this.makeSpan();
    }

    /**
     * Enable the cursor - makes the cursor visible
     */
    public enable() {
        if (this.enabled) {
            return;
        }

        this.enabled = true;
        this.show();

        this.blinkCursor();
    }

    /**
     * Disable the cursor - hides the cursor and prevents it from showing up
     */
    public disable() {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;
        this.hide(true);
        this.clearSelection();

        if (this.blinkTimer) {
            clearTimeout(this.blinkTimer);
            this.blinkTimer = undefined;
        }
    }

    public tryMark() {
        if (this.mark === Nope) {
            this.mark = this.pos;
        }
    }

    public emptySelection() {
        return this.mark === this.pos;
    }

    public clearSelection() {
        this.mark = Nope;
    }

    public getSelection() {
        if (this.mark !== Nope) {
            return {
                end: Math.max(this.mark, this.pos),
                start: Math.min(this.mark, this.pos),
            } as IRange;
        }
    }

    public hide(hidePresenceDiv: boolean = false) {
        this.editSpan.style.visibility = "hidden";
    }

    public show() {
        if (!this.enabled) {
            return;
        }

        this.editSpan.style.backgroundColor = this.bgColor;
        this.editSpan.style.visibility = "visible";
    }

    public makeSpan() {
        this.editSpan = document.createElement("span");
        this.editSpan.innerText = "\uFEFF";
        this.editSpan.style.zIndex = "3";
        this.editSpan.style.position = "absolute";
        this.editSpan.style.left = "0px";
        this.editSpan.style.top = "0px";
        this.editSpan.style.width = "2px";
        this.show();
    }

    public rect() {
        return this.editSpan.getBoundingClientRect();
    }

    public scope() {
        this.bgColor = "gray";
        this.editSpan.style.backgroundColor = this.bgColor;
        this.editSpan.style.zIndex = "4";
        this.editSpan.style.width = "1px";
    }

    public lateralMove(x: number) {
        this.editSpan.style.left = `${x}px`;
    }

    public assignToLine(x: number, h: number, lineDiv: HTMLDivElement) {
        this.editSpan.style.left = `${x}px`;
        this.editSpan.style.height = `${h}px`;
        if (this.editSpan.parentElement) {
            this.editSpan.parentElement.removeChild(this.editSpan);
        }
        lineDiv.appendChild(this.editSpan);
        if (this.blinkTimer) {
            clearTimeout(this.blinkTimer);
        }
        this.blinkCursor();
    }

    protected blinker = () => {
        if (!this.enabled) {
            return;
        }

        if (this.off) {
            this.show();
        } else {
            this.hide();
        }
        this.off = !this.off;
        if (this.blinkCount > 0) {
            this.blinkCount--;
            this.blinkTimer = setTimeout(this.blinker, 500);
        } else {
            this.show();
        }
    }

    protected blinkCursor() {
        this.blinkCount = 30;
        this.off = true;
        this.blinkTimer = setTimeout(this.blinker, 20);
    }

}
