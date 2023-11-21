import GettersSetters from "./modules/getters-setters";

export default class customRect extends GettersSetters {
    constructor(canvas, options) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.id = new Date().getTime() + Object.values(options.sizing).reduce((total, x) => total+= x, 0);

        /*
            x, y, w, h
        */
        this.sizing = options.sizing;

        /*
            borderColor, borderRadius, lineWidth, slectedLineWidth, selectedBorderColor
        */
        this.styles = options.styles;
        if (options.styles.lineWidth === undefined) {
            this.styles.lineWidth = 1;
        }
        if (options.styles.selectedLineWidth === undefined) {
            this.styles.selectedLineWidth = 3;
            this.styles.selectedBorderColor = "#663";
        }

        this.stateObj = {
            hover: false,
            selected: false,
        };

        this.render();
    }

    render() {
        this.clearArea();

        this.ctx.beginPath();
        this.ctx.roundRect(this.sizing.x, this.sizing.y, this.sizing.w, this.sizing.h, this.styles.borderRadius);
        this.ctx.strokeStyle = this.stateObj.hover ? this.styles.hoverBorderColor :
            this.stateObj.selected ? this.styles.selectedBorderColor : this.styles.borderColor;
        this.ctx.lineWidth = this.stateObj.selected ?  this.styles.selectedLineWidth : this.styles.lineWidth;
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

    setSelectedState() {
        this.clearArea();
        this.setIsSelected(true);
        this.render();
    }
    removeSelectedState() {
        this.clearArea();
        this.setIsSelected(false);
        this.render();
    }

    getId() {
        return this.id;
    }

    clearArea() {
        const clearingArea = {
            x: this.sizing.x - this.styles.lineWidth,
            y: this.sizing.y - this.styles.lineWidth,
            w: this.sizing.w + (this.styles.lineWidth * 2),
            h: this.sizing.h + (this.styles.lineWidth * 2),
        }

        if (this.stateObj.selected) {
            clearingArea.x = this.sizing.x - this.styles.selectedLineWidth;
            clearingArea.y = this.sizing.y - this.styles.selectedLineWidth;
            clearingArea.w = this.sizing.w + (this.styles.selectedLineWidth * 2);
            clearingArea.h = this.sizing.h + (this.styles.selectedLineWidth * 2);
        }

        this.ctx.clearRect(...Object.values(clearingArea));
    }
}