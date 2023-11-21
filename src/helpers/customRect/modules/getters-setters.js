const SizingGettersSetters = (template) => class extends template {
    getSizing() {
        return this.sizing;
    }
    setSizing(value) {
        this.sizing = value;
    }

    getX() {
        return this.sizing.x;
    }
    setX(value) {
        this.sizing.x = value;
    }
    
    getY() {
        return this.sizing.y;
    }
    setY(value) {
        this.sizing.y = value;
    }
    
    getW() {
        return this.sizing.w;
    }
    setW(value) {
        this.sizing.w = value;
    }
    
    getH() {
        return this.sizing.h;
    }
    setH(value) {
        this.sizing.h = value;
    }
}

const StateGettersSetters = (template) => class extends template {
    getStateObj() {
        return this.stateObj;
    }
    setStateObj(value) {
        this.stateObj = value;
    }

    getIsHover() {
        return this.stateObj.hover;
    }
    setIsHover(value) {
        this.stateObj.hover = value;
    }

    getIsSelected() {
        return this.stateObj.selected;
    }
    setIsSelected(value) {
        this.stateObj.selected = value;
    }
}

class StylesGettersSetters {
    getStyles() {
        return this.styles;
    }
    setStyles(value) {
        this.styles = value;
    }

    getBorderColor() {
        return this.styles.borderColor;
    }
    setBorderColor(value) {
        this.styles.borderColor = value;
    }
    gethoverBorderColor() {
        return this.styles.hoverBorderColor;
    }
    sethoverBorderColor(value) {
        this.styles.hoverBorderColor = value;
    }

    getBorderRadius() {
        return this.styles.borderRadius;
    }
    setBorderRadius(value) {
        this.styles.borderRadius = value;
    }

    getLineWidth() {
        return this.styles.lineWidth;
    }
    setLineWidth(value) {
        this.styles.lineWidth = value;
    }

    getSelectedLineWidth() {
        return this.styles.selectedLineWidth;
    }
    setSelectedLineWidth(value) {
        this.styles.selectedLineWidth = value;
    }
}

export default class GettersSetters extends StateGettersSetters(SizingGettersSetters(StylesGettersSetters)) {}