export default class customRect {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.x = options.sizing.x;
        this.y = options.sizing.y;
        this.w = options.sizing.w;
        this.h = options.sizing.h;
        this.bc = options.styles.bc;
        this.r = options.styles.r;

        this.render();
        this.createHoverHandler();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.roundRect(this.x, this.y, this.w, this.h, this.r);
        this.ctx.strokeStyle = this.bc;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    createHoverHandler() {
        this.canvas.onmousemove = (ev) => {
            console.log(ev);
        }
    }
}