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

            <div @click="createRandomRect" class="mainPage__mainBlock__canvas">
                <v-stage
                    v-if="configKonva !== undefined"
                    :config="configKonva"
                    
                    ref="stageRef"
                >
                    <v-layer>
                        <v-rect v-for="rect in rectList" :config="rect"></v-rect>
                    </v-layer>
                </v-stage>
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

const configKonva = ref(undefined);
const configCircle = ref(undefined);

const stageRef = ref(null);
const stage = ref(undefined);

const rectList = ref([]);

const cameraObj = ref({
    zoom: 1,
    ZOOM_SENSITIVITY: 0.0005,
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

function createRandomRect() {
    rectList.value.push({
        x: Math.round(Math.random() * coordinatesObj.value.centerDelta.x * 2),
        y: Math.round(Math.random() * coordinatesObj.value.centerDelta.y * 2),
        width: Math.round(Math.random() * 50 + 50),
        height: Math.round(Math.random() * 50 + 50),
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2,
    })
}

onMounted(() => {
    configKonva.value = {
        width: document.querySelector(".mainPage__mainBlock__canvas").clientWidth,
        height: document.querySelector(".mainPage__mainBlock__canvas").clientHeight,
    }

    coordinatesObj.value.centerDelta.x = Math.round(configKonva.value.width / 2);
    coordinatesObj.value.centerDelta.y = Math.round(configKonva.value.height / 2);

    createRandomRect();

    setTimeout(() => {
        stage.value = stageRef.value.getStage();
    }, 1000);
})

console.log("Created");
</script>

<style scoped lang="scss" src="./style.scss"></style>