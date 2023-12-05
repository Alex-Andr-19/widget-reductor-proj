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

            <div class="mainPage__mainBlock__canvas">
                <myCanvas />
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
import myCanvas from '@/components/myCanvas';
</script>

<style scoped lang="scss" src="./style.scss"></style>