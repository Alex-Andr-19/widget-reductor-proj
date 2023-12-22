<template>
    <div id="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Konva from "konva";

const stage = ref(undefined);

const selectedRects = ref([]);

const cameraObj = ref({
    ZOOM_SENSITIVITY: 1.031,
});

const coordinatesObj = ref({
    centerDelta: {
        x: 0,
        y: 0,
    },
})

function createRandomRect() {
    return new Konva.Rect({
        x: Math.round(Math.random() * coordinatesObj.value.centerDelta.x * 2),
        y: Math.round(Math.random() * coordinatesObj.value.centerDelta.y * 2),
        width: Math.round(Math.random() * 50 + 50),
        height: Math.round(Math.random() * 50 + 50),
        fill: 'green',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
    });
}

function addRectToFirstLayer() {
    const rect = createRandomRect();
    addDragstartHandler(rect);
    addClickHandler(rect);
    stage.value.children[0].add(rect);
}

function scaleHandler(e) {
    e.evt.preventDefault();

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

function initStage() {
    stage.value = new Konva.Stage({
        container: "canvasContainer",
        width: document.querySelector(".mainPage__mainBlock__canvas").clientWidth,
        height: document.querySelector(".mainPage__mainBlock__canvas").clientHeight,
        draggable: true,
    })

    stage.value.on("wheel", scaleHandler);

    stage.value.on("click", function () {
        for (let i in selectedRects.value) {
            selectedRects.value[i].strokeWidth(1);
            selectedRects.value[i].stroke("black");
        }
        selectedRects.value = [];
    })
}

function createLayer() {
    const layer = new Konva.Layer();

    stage.value.add(layer);
}

function addDragstartHandler(rect) {
    rect.on("dragstart", function (evt) {
        const target = evt.target;
        stage.value.children[0].children = [...stage.value.children[0].children.filter(el => el._id !== rect._id), target];
    });
}

function addClickHandler(rect) {
    rect.on("click", function (evt) {
        evt.cancelBubble = true;
        const target = evt.target;
        if (selectedRects.value.length > 0 && !(evt.evt.ctrlKey || evt.evt.metaKey)) {
            for (let i in selectedRects.value) {
                selectedRects.value[i].strokeWidth(1);
                selectedRects.value[i].stroke("black");
            }
        }

        if (evt.evt.ctrlKey || evt.evt.metaKey) {
            selectedRects.value.push(target);
        } else {
            selectedRects.value = [target];
        }
        
        this.strokeWidth(3);
        this.stroke("purple");
    });
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