import StylesSizingGettersSetters from "./modules/getters-setters";

export default class customRect extends StylesSizingGettersSetters {
    constructor(canvas, options) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        /*
            x, y, w, h
        */
        this.sizing = options.sizing;

        /*
            bc, r
        */
        this.styles = options.styles;
        if (options.styles.lineWidth === undefined) {
            this.styles.lineWidth = 1;
        }

        this.stateObj = {
            hover: false
        };

        this.render();
    }

    render() {
        const clearingArea = {
            x: this.sizing.x - this.styles.lineWidth,
            y: this.sizing.y - this.styles.lineWidth,
            w: this.sizing.w + (this.styles.lineWidth * 2),
            h: this.sizing.h + (this.styles.lineWidth * 2),
        }
        this.ctx.clearRect(...Object.values(clearingArea));

        this.ctx.beginPath();
        this.ctx.roundRect(this.sizing.x, this.sizing.y, this.sizing.w, this.sizing.h, this.styles.r);
        this.ctx.strokeStyle = this.stateObj.hover ? this.styles.hbc : this.styles.bc;
        this.ctx.lineWidth = this.styles.lineWidth;
        this.ctx.stroke();
    }

    setHoveredState() {
        this.setIsHover(true);
        this.render();
    }
    removeHoveredState() {
        this.setIsHover(false);
        this.render();
    }
}