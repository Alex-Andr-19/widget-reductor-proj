const SizingGettersSetters = (template) => class extends template {
    getSizing() {
        return this.sizing;
    }
    getShowingSizing() {
        return this.showingSizing;
    }
    setSizing(value) {
        this.sizing = value;
    }
    setShowingSizing(value) {
        this.showingSizing = value;
    }

    getX() {
        return this.sizing.x;
    }
    getShowingX() {
        return this.showingSizing.x;
    }
    setX(value) {
        this.sizing.x = value;
    }
    setShowingX(value) {
        this.showingSizing.x = value;
    }
    
    getY() {
        return this.sizing.y;
    }
    getShowingY() {
        return this.showingSizing.y;
    }
    setY(value) {
        this.sizing.y = value;
    }
    setShowingY(value) {
        this.showingSizing.y = value;
    }
    
    getW() {
        return this.sizing.w;
    }
    getShowingW() {
        return this.showingSizing.w;
    }
    setW(value) {
        this.sizing.w = value;
    }
    setShowingW(value) {
        this.showingSizing.w = value;
    }
    
    getH() {
        return this.sizing.h;
    }
    getShowingH() {
        return this.showingSizing.h;
    }
    setH(value) {
        this.sizing.h = value;
    }
    setShowingH(value) {
        this.showingSizing.h = value;
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
    getShowingStyles() {
        return this.showingStyles;
    }
    setStyles(value) {
        this.showingStyles = value;
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
    getShowingBorderRadius() {
        return this.showingStyles.borderRadius;
    }
    setBorderRadius(value) {
        this.showingStyles.borderRadius = value;
    }

    getLineWidth() {
        return this.styles.lineWidth;
    }
    getShowingLineWidth() {
        return this.showingStyles.lineWidth;
    }
    setLineWidth(value) {
        this.showingStyles.lineWidth = value;
    }

    getSelectedLineWidth() {
        return this.styles.selectedLineWidth;
    }
    getShowingSelectedLineWidth() {
        return this.showingStyles.selectedLineWidth;
    }
    setSelectedLineWidth(value) {
        this.showingStyles.selectedLineWidth = value;
    }
}

export default class GettersSetters extends StateGettersSetters(SizingGettersSetters(StylesGettersSetters)) {}