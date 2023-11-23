import deepClone from "../deepClone";
import GettersSetters from "./modules/getters-setters";

export default class customRect extends GettersSetters {
    constructor(canvas, options) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.id = new Date().getTime() + Object.values(options.sizing).reduce((total, x) => total += x, 0);

        /*
            x, y, w, h
        */
        this.sizing = deepClone(options.sizing);
        this.showingSizing = deepClone(options.sizing);

        /*
            borderColor, borderRadius, lineWidth, slectedLineWidth, selectedBorderColor
        */
        this.styles = deepClone(options.styles);
        this.showingStyles = deepClone(options.styles);

        this.styles.lineWidth = options.styles.lineWidth ?? 1;

        this.styles.selectedLineWidth = options.styles.selectedLineWidth ?? 3;

        this.styles.selectedBorderColor = options.styles.selectedBorderColor ?? "#663";

        this.stateObj = {
            hover: false,
            selected: false,
        };

        this.render();
    }

    render() {
        this.clearArea();

        this.ctx.beginPath();
        this.ctx.roundRect(this.showingSizing.x, this.showingSizing.y, this.showingSizing.w, this.showingSizing.h, this.showingStyles.borderRadius);
        this.ctx.strokeStyle = this.stateObj.hover ? this.styles.hoverBorderColor :
            this.stateObj.selected ? this.styles.selectedBorderColor : this.styles.borderColor;
        this.ctx.lineWidth = this.stateObj.selected ? this.showingStyles.selectedLineWidth : this.showingStyles.lineWidth;
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
            x: this.showingSizing.x - this.showingStyles.lineWidth - 3,
            y: this.showingSizing.y - this.showingStyles.lineWidth - 3,
            w: this.showingSizing.w + (this.showingStyles.lineWidth * 2) + 6,
            h: this.showingSizing.h + (this.showingStyles.lineWidth * 2) + 6,
        }

        if (this.stateObj.selected) {
            clearingArea.x = this.showingSizing.x - this.showingStyles.selectedLineWidth - 3;
            clearingArea.y = this.showingSizing.y - this.showingStyles.selectedLineWidth - 3;
            clearingArea.w = this.showingSizing.w + (this.showingStyles.selectedLineWidth * 2) + 6;
            clearingArea.h = this.showingSizing.h + (this.showingStyles.selectedLineWidth * 2) + 6;
        }

        this.ctx.clearRect(...Object.values(clearingArea));
    }
}