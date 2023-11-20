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
}

class StylesGettersSetters {
    getStyles() {
        return this.styles;
    }
    setStyles(value) {
        this.styles = value;
    }

    getBC() {
        return this.styles.bc;
    }
    setBC(value) {
        this.styles.bc = value;
    }

    getR() {
        return this.styles.r;
    }
    setR(value) {
        this.styles.r = value;
    }

    getLW() {
        return this.styles.LW;
    }
    setLW(value) {
        this.styles.LW = value;
    }
}

export default class StylesSizingGettersSetters extends StateGettersSetters(SizingGettersSetters(StylesGettersSetters)) {}