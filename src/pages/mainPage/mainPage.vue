<template>
    <div class="mainPage">
        <div class="mainPage__sideBlock">
            <div class="mainPage__sideBlock__title">
                Схема
            </div>
        </div>

        <div class="mainPage__mainBlock">
            <div class="mainPage__mainBlock__title">
                Редактор
            </div>

            <div ref="canvasContainer" class="mainPage__mainBlock__canvasContainer">
                <canvas ref="canvasTag" id="canvasEditor"></canvas>
            </div>
        </div>

        <div class="mainPage__sideBlock">
            <div class="mainPage__sideBlock__title">
                Стили
            </div>

            <div v-if="Object.values(selectedRectObj).length === 1" class="mainPage__sideBlock__content">
                {{ Object.values(selectedRectObj)[0].getStyles() }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import customRect from '@/helpers/customRect/customRect';

const canvasContainer = ref(null);
const canvasTag = ref(null);

const canvas = ref(undefined);
const ctx = ref(undefined);

const rectObjList = ref([]);
const selectedRectObj = ref({});

function mountFunction() {
    canvas.value = document.getElementById("canvasEditor");
    ctx.value = canvas.value.getContext("2d");

    const colors = ["#000", "#F00", "#0F0", "#00F"];
    const defaultWidth = 150;
    const defaultHeight = 100;
    const gap = 20;
    const padding = {
        x: 20,
        y: 20,
    };

    for (let i in colors) {
        const sizing = {
            x: padding.x + (defaultWidth + gap) * i,
            y: padding.y,
            w: defaultWidth,
            h: defaultHeight,
        }

        const styles = {
            borderColor: colors[i],
            hoverBorderColor: "#388",
            borderRadius: (i + 1) * 2,
            lineWidth: 2,
        }

        rectObjList.value.push(
            new customRect(canvas.value, {
                sizing, styles
            })
        );
    }
}

function collisionRectWithPoint(rect, point) {
    let res = false;

    if (
        point.x >= rect.x && point.x <= (rect.x + rect.w) &&
        point.y >= rect.y && point.y <= (rect.y + rect.h)
    ) {
        res = true;
    }

    return res;
}

function mouseMoveHandler(ev) {
    const rect = canvasTag.value.getBoundingClientRect(),
        x = ev.clientX - rect.x,
        y = ev.clientY - rect.y;


    for (let rect of rectObjList.value) {
        if (collisionRectWithPoint(rect.getShowingSizing(), { x, y })) {
            rect.setHoveredState();
            canvasTag.value.style.cursor = "pointer";
        } else if (rect.getIsHover()) {
            rect.removeHoveredState();
            canvasTag.value.style.cursor = "auto";
        }
    }
}

function clickHandler(ev) {
    const rect = canvasTag.value.getBoundingClientRect(),
        x = ev.clientX - rect.x,
        y = ev.clientY - rect.y;

    for (let rect of rectObjList.value) {
        const isCtrlLikeKeyDown = ev.ctrlKey || ev.metaKey;

        if (collisionRectWithPoint(rect.getShowingSizing(), { x, y })) {
            if (isCtrlLikeKeyDown && rect.getIsSelected()) {
                rect.removeSelectedState(false);
                delete selectedRectObj.value[rect.getId()];
            } else {
                rect.setSelectedState();
                selectedRectObj.value[rect.getId()] = rect;
            }
        } else if (rect.getIsSelected()) {
            if (!isCtrlLikeKeyDown) {
                rect.removeSelectedState(false);
                delete selectedRectObj.value[rect.getId()];
            }
        }
    }
}

function mountCanvas() {
    canvasTag.value = document.getElementById("canvasEditor");
    const editorWidth = canvasContainer.value.clientWidth;
    const editorHeight = canvasContainer.value.clientHeight;

    canvasTag.value.width = editorWidth;
    canvasTag.value.height = editorHeight;

    // cameraObj.value.cameraOffset = { x: canvasTag.value.clientWidth / 2, y: canvasTag.value.clientHeight / 2 };

    canvasContainer.value.addEventListener("mousemove", mouseMoveHandler)
    canvasContainer.value.addEventListener("click", clickHandler)

    // canvasContainer.value.addEventListener('mousedown', onPointerDown);
    // canvasContainer.value.addEventListener('mousemove', onPointerMove);
    // canvasContainer.value.addEventListener('mouseup', onPointerUp);
    canvasContainer.value.addEventListener('wheel', (e) => adjustZoom(e.deltaY * cameraObj.value.SCROLL_SENSITIVITY));
}

const cameraObj = ref({
    cameraOffset: { x: 0, y: 0 },
    cameraZoom: 1,
    lastZoom: 1,
    MAX_ZOOM: 5,
    MIN_ZOOM: 0.1,
    SCROLL_SENSITIVITY: 0.0005,
})

const dragObj = ref({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
})

function getEventLocation(e) {
    if (e.touches && e.touches.length == 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY }
    }
}

function onPointerDown(e) {
    // dragObj.value.isDragging = true;

    // dragObj.value.dragStart.x = getEventLocation(e).x / cameraObj.value.cameraZoom - cameraObj.value.cameraOffset.x;
    // dragObj.value.dragStart.y = getEventLocation(e).y / cameraObj.value.cameraZoom - cameraObj.value.cameraOffset.y;
}

function onPointerMove(e) {
    // if (dragObj.value.isDragging) {
    //     cameraObj.value.cameraOffset.x = getEventLocation(e).x / cameraObj.value.cameraZoom - dragObj.value.dragStart.x;
    //     cameraObj.value.cameraOffset.y = getEventLocation(e).y / cameraObj.value.cameraZoom - dragObj.value.dragStart.y;
    // }
}

function onPointerUp(e) {
    // dragObj.value.isDragging = false;
    // initialPinchDistance = null
    // cameraObj.value.lastZoom = cameraObj.value.cameraZoom;
}

function adjustZoom(zoomAmount) {
    if (!dragObj.value.isDragging) {
        if (zoomAmount) {
            cameraObj.value.cameraZoom += zoomAmount;
        }

        cameraObj.value.cameraZoom = Math.min(cameraObj.value.cameraZoom, cameraObj.value.MAX_ZOOM);
        cameraObj.value.cameraZoom = Math.max(cameraObj.value.cameraZoom, cameraObj.value.MIN_ZOOM);

        for (let item of rectObjList.value) {
            item.setX(item.getX() * cameraObj.value.cameraZoom);
            item.setY(item.getY() * cameraObj.value.cameraZoom);
            item.setW(item.getW() * cameraObj.value.cameraZoom);
            item.setH(item.getH() * cameraObj.value.cameraZoom);

            // item.setBorderRadius(item.getBorderRadius() * cameraObj.value.cameraZoom);
            item.setLineWidth(item.getLineWidth() * cameraObj.value.cameraZoom);
            item.setSelectedLineWidth(item.getSelectedLineWidth() * cameraObj.value.cameraZoom);
        }

        render();
    }
}

function render() {
    ctx.value.clearRect(0, 0, canvasTag.value.clientWidth, canvasTag.value.clientHeight);
    for (let item of rectObjList.value) {
        item.render();
    }
}

onMounted(() => {
    mountCanvas();
    mountFunction();
})
</script>

<style scoped lang="scss" src="./style.scss"></style>