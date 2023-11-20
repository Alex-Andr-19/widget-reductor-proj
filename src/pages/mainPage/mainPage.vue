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
                <canvas id="canvasEditor"></canvas>
            </div>
        </div>

        <div class="mainPage__sideBlock">
            <div class="mainPage__sideBlock__title">
                Стили
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import customRect from '@/helpers/customRect'

const canvasContainer = ref(null);
const canvas = ref(undefined);
const ctx = ref(undefined);

const firstCustomRect = ref(undefined);

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
            bc: colors[i],
            r: (i + 1) * 2
        }

        new customRect(canvas.value, {
            sizing,
            styles
        });
    }
}

function createRoundRect(x, y, w, h, c, r = 0) {
    ctx.value.beginPath();
    ctx.value.roundRect(x, y, w, h, r);
    ctx.value.strokeStyle = c;
    ctx.value.lineWidth = 1;
    ctx.value.stroke();
}

function mountCanvas() {
    const canvasTag = document.getElementById("canvasEditor");
    const editorWidth = canvasContainer.value.clientWidth;
    const editorHeight = canvasContainer.value.clientHeight;

    canvasTag.setAttribute("width", editorWidth);
    canvasTag.setAttribute("height", editorHeight);
}

onMounted(() => {
    mountCanvas();
    mountFunction();
})
</script>

<style scoped lang="scss" src="./style.scss"></style>