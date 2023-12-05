<template>
    <div id="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Konva from "konva";

const stage = ref(undefined);

const cameraObj = ref({
    zoom: 1,
    ZOOM_SENSITIVITY: 1.031,
    centerDelta: {
        x: 0,
        y: 0,
    },
});

const coordinatesObj = ref({
    centerDelta: {
        x: 0,
        y: 0,
    },
})

function createRandomRect(e) {
    return new Konva.Rect({
        // x: e.offsetX,
        // y: e.offsetY,
        x: Math.round(Math.random() * coordinatesObj.value.centerDelta.x * 2),
        y: Math.round(Math.random() * coordinatesObj.value.centerDelta.y * 2),
        width: Math.round(Math.random() * 50 + 50),
        height: Math.round(Math.random() * 50 + 50),
        fill: 'green',
        // stroke: 'black',
        // strokeWidth: 2,
        draggable: true,
    });
}

function addRectToFirstLayer(e = { evt: { offsetX: 0, offsetY: 0 } }) {
    stage.value.children[0].add(createRandomRect(e.evt));
}

function scaleHandler(e) {
    e.evt.preventDefault();

    const oldScale = stage.value.scaleX();
    const pointer = stage.value.getPointerPosition();

    const mousePointTo = {
        x: (pointer.x - stage.value.x()) / oldScale,
        y: (pointer.y - stage.value.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

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

function initStage() {
    stage.value = new Konva.Stage({
        container: "canvasContainer",
        width: document.querySelector(".mainPage__mainBlock__canvas").clientWidth,
        height: document.querySelector(".mainPage__mainBlock__canvas").clientHeight,
        draggable: true,
    })

    stage.value.on("wheel", scaleHandler);
}

function createLayer() {
    const layer = new Konva.Layer();
    stage.value.add(layer);
}

onMounted(() => {
    initStage();
    createLayer();

    coordinatesObj.value.centerDelta.x = Math.round(stage.value.attrs.width / 2);
    coordinatesObj.value.centerDelta.y = Math.round(stage.value.attrs.height / 2);

    for (let i = 0; i < 10; i++) addRectToFirstLayer();
})

console.log("Created");
</script>

<style lang="scss">
#canvasContainer {
    width: 100%;
    height: 100%;
}
</style>