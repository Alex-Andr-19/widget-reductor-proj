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
    const sizing = {
        width: Math.round(Math.random() * 50 + 50),
        height: Math.round(Math.random() * 50 + 50),
    };

    const group = new Konva.Group({
        x: Math.round(Math.random() * coordinatesObj.value.centerDelta.x * 2),
        y: Math.round(Math.random() * coordinatesObj.value.centerDelta.y * 2),
        ...sizing,
    })

    group.add(new Konva.Rect({
        x: 0,
        y: 0,
        ...sizing,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 1,
    }))

    return group;
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

    scaleSizingGroups();

    stage.value.position(newPos);
}

function scaleSizingGroups() {
    const toolRectSizing = {
        width: 7 / stage.value.scaleX(),
        height: 7 / stage.value.scaleX(),
    }
    for (let i in selectedRects.value) {
        selectedRects.value[i].children[0].strokeWidth(3 / stage.value.scaleX());

        selectedRects.value[i].children[1].x(0);
        selectedRects.value[i].children[1].y(0);
        selectedRects.value[i].children[1].width(selectedRects.value[i].attrs.width);
        selectedRects.value[i].children[1].height(selectedRects.value[i].attrs.height);

        const toolRectPositions = [
            {
                x: -toolRectSizing.width / 2,
                y: -toolRectSizing.height / 2,
            },
            {
                x: selectedRects.value[i].attrs.width - toolRectSizing.width / 2,
                y: -toolRectSizing.height / 2,
            },
            {
                x: selectedRects.value[i].attrs.width - toolRectSizing.width / 2,
                y: selectedRects.value[i].attrs.height - toolRectSizing.height / 2,
            },
            {
                x: -toolRectSizing.width / 2,
                y: selectedRects.value[i].attrs.height - toolRectSizing.height / 2,
            },
        ];

        for (let j in selectedRects.value[i].children[1].children) {
            selectedRects.value[i].children[1].children[j].x(toolRectPositions[j].x);
            selectedRects.value[i].children[1].children[j].y(toolRectPositions[j].y);
            selectedRects.value[i].children[1].children[j].width(toolRectSizing.width);
            selectedRects.value[i].children[1].children[j].height(toolRectSizing.height);
            selectedRects.value[i].children[1].children[j].strokeWidth(1 / stage.value.scaleX());
        }
    }
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
            // const _rect = selectedRects.value[i].children[0];
            disableGroupSelect(selectedRects.value[i]);
        }
        selectedRects.value = [];
    })
}

function createLayer() {
    const layer = new Konva.Layer();

    stage.value.add(layer);
}

function addDragstartHandler(group) {
    group.on("dragstart", function (evt) {
        const target = evt.target;
        stage.value.children[0].children = [...stage.value.children[0].children.filter(el => el._id !== group._id), target];
    });
}

function addClickHandler(group) {
    const rect = group.children[group.children.length - 1];
    rect.on("click", function (evt) {
        const _group = group;

        evt.cancelBubble = true;

        if (evt.evt.ctrlKey || evt.evt.metaKey) {
            if (selectedRects.value.map(el => el._id).includes(_group._id)) {
                disableGroupSelect(_group);
                selectedRects.value = selectedRects.value.filter(el => el._id !== this._id);
            } else {
                selectedRects.value.push(_group);
            }
        } else {
            for (let i in selectedRects.value) {
                disableGroupSelect(selectedRects.value[i]);
            }
            selectedRects.value = [_group];
        }

        if (selectedRects.value.map(el => el._id).includes(_group._id)) {
            setGroupSelected(_group);
        }
    });
}

function disableGroupSelect(group) {
    const rect = group.children[0];
    group.children = [rect];
    rect.strokeWidth(1);
    rect.stroke("black");
    group.draggable(false);
}

function setGroupSelected(group) {
    const resizeToolGroup = new Konva.Group({
        x: 0,
        y: 0,
        width: group.attrs.width,
        height: group.attrs.height,
    })

    const toolRectSizing = {
        width: 7 / stage.value.scaleX(),
        height: 7 / stage.value.scaleX(),
    }
    const toolRectPositions = [
        {
            x: -toolRectSizing.width / 2,
            y: -toolRectSizing.height / 2,
        },
        {
            x: group.attrs.width - toolRectSizing.width / 2,
            y: -toolRectSizing.height / 2,
        },
        {
            x: group.attrs.width - toolRectSizing.width / 2,
            y: group.attrs.height - toolRectSizing.height / 2,
        },
        {
            x: -toolRectSizing.width / 2,
            y: group.attrs.height - toolRectSizing.height / 2,
        },
    ];

    for (let i in toolRectPositions) {
        const toolRect = new Konva.Rect({
            ...toolRectPositions[i],
            ...toolRectSizing,
            fill: "white",
            stroke: "black",
            strokeWidth: 1 / stage.value.scaleX(),
        })

        toolRect.on("mouseover", function () {
            if (i % 2 === 0) {
                document.getElementById("canvasContainer").style.cursor = "nwse-resize";
            } else {
                document.getElementById("canvasContainer").style.cursor = "nesw-resize";
            }
        })
        toolRect.on("mouseleave", function () {
            document.getElementById("canvasContainer").style.cursor = "auto"
        })

        resizeToolGroup.add(toolRect);
    }
    group.add(resizeToolGroup);
    // console.log(stage.value.scaleX());

    const rect = group.children[0];
    rect.strokeWidth(3 / stage.value.scaleX());
    // rect.strokeWidth(3);
    rect.stroke("purple");
    group.draggable(true);
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