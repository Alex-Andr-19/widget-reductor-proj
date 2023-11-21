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

    for (let i in colors) {
        const sizing = {
            x: 20 + (defaultWidth + gap) * i,
            y: 20,
            w: defaultWidth,
            h: defaultHeight
        }

        const styles = {
            borderColor: colors[i],
            hoverBorderColor: "#388",
            borderRadius: (i + 1) * 2
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
        if (collisionRectWithPoint(rect.getSizing(), { x, y })) {
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

        if (collisionRectWithPoint(rect.getSizing(), { x, y })) {
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
    const canvasTag = document.getElementById("canvasEditor");
    const editorWidth = canvasContainer.value.clientWidth;
    const editorHeight = canvasContainer.value.clientHeight;

    canvasTag.setAttribute("width", editorWidth);
    canvasTag.setAttribute("height", editorHeight);

    canvasContainer.value.addEventListener("mousemove", mouseMoveHandler)
    canvasContainer.value.addEventListener("click", clickHandler)
}

onMounted(() => {
    mountCanvas();
    mountFunction();

    // setTimeout(() => {
    //     console.log("Here!!!");

    //     for (let rect of rectObjList.value) {
    //         rect.clearArea();
    //     }
    //     ctx.value.scale(1.2, 1.2);
    //     for (let rect of rectObjList.value) {
    //         rect.render();
    //     }
    // }, 4000)
})
</script>

<style scoped lang="scss" src="./style.scss"></style>