<template>
    <div id="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Konva from "konva";

const stage = ref(undefined);

const cameraObj = ref({
    ZOOM_SENSITIVITY: 1.031,
    OFFSET_SENSITIVITY: 1.031,
});


/* ===== Widget Settings ===== */

const ratioValue = 16 / 9;
const sizing = {
    width: 260 * ratioValue,
    height: 260,
}
const today = new Date();
const datetime = {
    date: today.toLocaleDateString("ru"),
    time: `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`,
}

/* =========================== */


function initStage() {
    stage.value = new Konva.Stage({
        container: "canvasContainer",
        width: document.querySelector(".mainPage__mainBlock__canvas").clientWidth,
        height: document.querySelector(".mainPage__mainBlock__canvas").clientHeight,
    })

    createStageEventListeners();
}

function createStageEventListeners() {
    stage.value.on("wheel", scrollHandler);
}

function scrollHandler(e) {
    e.evt.preventDefault();

    if (e.evt.deltaX % 1 === 0 && e.evt.deltaY % 1 === 0) {
        const currentOffset = {
            x: stage.value.offsetX(),
            y: stage.value.offsetY(),
        }

        const newPos = {
            x: currentOffset.x + e.evt.deltaX * cameraObj.value.OFFSET_SENSITIVITY / Math.abs(stage.value.scale().x),
            y: currentOffset.y + e.evt.deltaY * cameraObj.value.OFFSET_SENSITIVITY / Math.abs(stage.value.scale().x),
        }
        stage.value.offsetX(newPos.x);
        stage.value.offsetY(newPos.y);

        selectionRectangle.offsetX(-newPos.x);
        selectionRectangle.offsetY(-newPos.y);
    } else {
        const oldScale = stage.value.scaleX();
        const pointer = stage.value.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.value.x()) / oldScale,
            y: (pointer.y - stage.value.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? -1 : 1;

        if (e.evt.metaKey) {
            direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * cameraObj.value.ZOOM_SENSITIVITY : oldScale / cameraObj.value.ZOOM_SENSITIVITY;

        stage.value.scale({ x: newScale, y: newScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.value.position(newPos);
    }
}

function createLayer() {
    const layer = new Konva.Layer({
        name: "mainLayer",
    });
    stage.value.add(layer);

    addRectToFirstLayer();
}

function addRectToFirstLayer() {
    const group = createWidgetLayout();

    const layer = stage.value.children[0];
    layer.add(group);
}

function createWidgetLayout() {
    const position = {
        x: Math.round(stage.value.attrs.width / 2 - sizing.width / 2),
        y: Math.round(stage.value.attrs.height / 2 - sizing.height / 2),
    }

    const widgetGroup = new Konva.Group({
        name: "widgetGroup",
        ...position,
        ...sizing,
    });

    createWidgetTemplateChildren(widgetGroup);

    return widgetGroup;
}

function createWidgetTemplateChildren(widgetGroup) {
    createWidgetTemplateRects(widgetGroup);

    createWidgetTemplateText(widgetGroup);
}

function createWidgetTemplateRects(widgetGroup) {
    const rects = [];
    rects.push(new Konva.Rect({
        x: 0,
        y: 0,
        ...sizing,
        fill: '#18191c',
        cornerRadius: 6,
    }))
    rects.push(new Konva.Rect({
        x: 0,
        y: 0,
        ...sizing,
        height: 30,
        fillLinearGradientStartPoint: { x: 0, y: 30 },
        fillLinearGradientEndPoint: { x: sizing.width, y: 0 },
        fillLinearGradientColorStops: [0, '#18191c', 1, '#40434c'],
        cornerRadius: [6, 6, 0, 0],
    }))
    rects.push(new Konva.Line({
        points: [0, 30, sizing.width, 30],
        stroke: "#40434c",
        strokeWidth: 1,
    }))

    for (let i in rects) {
        widgetGroup.add(rects[i]);
    }
}

function createWidgetTemplateText(widgetGroup) {
    const texts = [];

    texts.push(new Konva.Text({
        name: "widgetName",
        x: 10,
        y: 10,
        text: "Название виджета",
        fill: "#fff",
    }))
    texts.push(new Konva.Text({
        name: "widgetUpdateTime",
        x: sizing.width - 62,
        y: 6,
        text: `${datetime.date}\n${datetime.time}`,
        fill: "#fff",
        fontSize: 10,
        align: "right",
    }))
    texts.push(new Konva.TextPath({
        x: 10,
        y: sizing.height - 10,
        text: "Some text",
        fill: "#fff",
        data: 'C0,0 0,0 0,100',
        rotation: 180,
    }))

    for (let i in texts) {
        widgetGroup.add(texts[i]);
    }
}

onMounted(() => {
    initStage();

    createLayer();
})

console.log("Created");
</script>

<style lang="scss">
#canvasContainer {
    width: 100%;
    height: 100%;
}
</style>