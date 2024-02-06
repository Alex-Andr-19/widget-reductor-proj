<template>
    <div id="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Konva from "konva";

import { clamp, collision } from "@/helpers/neccessary";

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

const parrentContainer = "canvasContainer";

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

    if (document.querySelector(`#${parrentContainer} > input`) === null) {
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
}

function createLayer() {
    const layer = new Konva.Layer({
        name: "mainLayer",
    });
    stage.value.add(layer);

    addRectToFirstLayer();
}

function getMainLayer() {
    return stage.value.find(".mainLayer")[0];
}
function getWidgetGroup() {
    return stage.value.find(".widgetGroup")[0];
}
function getWidgetWrapperGroup() {
    return stage.value.find(".widgetWrapper")[0];
}
// function getTriggerRect() {
//     return stage.value.find(".triggerRect")[0];
// }
function getTriggerGroup() {
    return stage.value.find(".triggerGroup")[0];
}
function getWidgetWrapperFonRect() {
    return stage.value.find(".widgetWrapperFonRect")[0];
}

function addRectToFirstLayer() {
    const group = createWidgetLayout();
    const layer = getMainLayer();
    layer.add(group);

    const allTemplateEditableText = layer.find(".editableText");
    for (let i in allTemplateEditableText) {
        addEditableToText(allTemplateEditableText[i]);
    }
    createFonRectMousemoveHandler();
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

    widgetGroup.on("mouseleave", function (e) {
        const triggerGroup = getTriggerGroup();
        const triggerRect = triggerGroup.children[0];
        const triggerPlus = triggerGroup.children[1];

        setTimeout(() => {
            triggerRect.setAttrs({
                // x: 0, y: 0,
                width: 0, height: 0,
            });
            triggerPlus.text("");
        }, 50)
    })

    return widgetGroup;
}

function addEditableToText(editableText) {
    editableText.on('dblclick dbltap', () => {
        var textPosition = editableText.getAbsolutePosition();

        var stageBox = stage.value.container().getBoundingClientRect();

        const parrentNode = document.getElementById(parrentContainer);
        const { x: parrentNodeOffsetX, y: parrentNodeOffsetY } = parrentNode.getBoundingClientRect();

        var areaPosition = {
            x: stageBox.left + textPosition.x - parrentNodeOffsetX,
            y: stageBox.top + textPosition.y - parrentNodeOffsetY,
        };

        var input = document.createElement('input');

        input.type = "text";
        input.value = editableText.text();
        input.style.position = 'absolute';

        let topPosition = areaPosition.y;
        let leftPosition = areaPosition.x;

        const scaleValue = stage.value.scaleX();

        input.style.fontSize = `${14 * scaleValue}px`;

        const inputWidth = clamp(100, (editableText.textWidth + 50), sizing.height - 30) * scaleValue;
        input.style.width = inputWidth + "px";

        topPosition -= 3 * scaleValue;
        leftPosition -= 3 * scaleValue;

        if (editableText.attrs.rotation !== undefined) {
            const rad = Math.PI * editableText.attrs.rotation / 180;
            const translateX = (inputWidth / 2) * (1 - Math.cos(rad));
            const translateY = (-inputWidth / 2) * -Math.sin(rad) + 6 * scaleValue;

            input.style = input.style.cssText + `transform:
                                                            rotate(${editableText.attrs.rotation}deg)
                                                            translateX(${translateX}px)
                                                            translateY(${translateY}px);
                                                `;
        }

        input.style.top = topPosition + 'px';
        input.style.left = leftPosition + 'px';

        parrentNode.appendChild(input);
        input.focus();

        function removeInput() {
            parrentNode.removeChild(input);
        }

        input.addEventListener('keydown', function (e) {
            if ([13, 27].includes(e.keyCode)) {
                if (e.keyCode === 13) {
                    editableText.text(input.value.slice(0, editableText.attrs.maxLength ?? input.value.length));
                }

                input.removeEventListener("blur", removeInput);
                removeInput()
            }
        });

        input.addEventListener("blur", removeInput)
    });
}

function createWidgetTemplateChildren(widgetGroup) {
    createWidgetTemplateRects(widgetGroup);

    createWidgetTemplateText(widgetGroup);

    createWidgetWrapperGroup(widgetGroup);
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
        id: "widgetTitle",
        name: "editableText",
        x: 10,
        y: 10,
        text: "Название виджета",
        fill: "#fff",
        maxLength: 66,
    }))
    texts.push(new Konva.Text({
        id: "widgetUpdateTime",
        name: "text",
        x: sizing.width - 62,
        y: 6,
        text: `${datetime.date}\n${datetime.time}`,
        fill: "#fff",
        fontSize: 10,
        align: "right",
    }))
    texts.push(new Konva.Text({
        id: "widgetAsideText",
        name: "editableText",
        x: 5,
        y: sizing.height - 10,
        text: "Краткое описание",
        fill: "#fff",
        data: 'C0,0 0,0 0,100',
        rotation: -90,
        maxLength: 35,
    }))

    for (let i in texts) {
        widgetGroup.add(texts[i]);
    }
}

function createWidgetWrapperGroup(widgetGroup) {
    const width = sizing.width - 26;
    const height = sizing.height - 31;
    const padding = 12;

    const fonRect = new Konva.Rect({
        name: "widgetWrapperFonRect",
        x: 0,
        y: 0,
        width,
        height,
        cornerRadius: [0, 0, 6, 0],
        stroke: "#40434c",
        strokeWidth: 1,
    })

    const triggerGroup = new Konva.Group({
        name: "triggerGroup",
        x: padding,
        y: padding,
        width: 0,
        height: 0,
    })
    const triggerRect = new Konva.Rect({
        name: "triggerRect",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        stroke: "#40434c",
        strokeWidth: 2,
        cornerRadius: 6,
    });
    const triggerPlus = new Konva.Text({
        id: "triggerPlus",
        name: "triggerPlus",
        x: 0,
        y: 0,
        text: "",
        fontSize: 56,
        fill: "#6b7181",
    })

    triggerGroup.add(triggerRect);
    triggerGroup.add(triggerPlus);
    triggerRect.on("mousemove", (e) => {
        fonRect.fire("mousemove", e)
    })

    const widgetWrapperGroup = new Konva.Group({
        name: "widgetWrapper",
        x: 25,
        y: 30,
        width: sizing.width - 25,
        height: sizing.height - 30,
        padding,
    })

    widgetWrapperGroup.add(fonRect);
    widgetWrapperGroup.add(triggerGroup);

    widgetGroup.add(widgetWrapperGroup);
}

function createFonRectMousemoveHandler() {
    const rect = getWidgetWrapperFonRect();
    const width = rect.width();
    const height = rect.height();

    const padding = getWidgetWrapperGroup().attrs.padding;
    const realWidth = width - padding * 2;
    const realHeight = height - padding * 2;

    const triggersObj = [
        {
            name: "topLeftRect",
            trigger: {
                x: 0,
                y: 0,
                width: width / 2 - width / 32,
                height: height / 2 - height / 18,
            },
            target: {
                x: padding,
                y: padding,
                width: realWidth / 2,
                height: realHeight / 2,
            },
        },
        {
            name: "topRow",
            trigger: {
                x: width / 2 - width / 32,
                y: 0,
                width: width / 16,
                height: height / 2 - height / 18,
            },
            target: {
                x: padding,
                y: padding,
                width: realWidth,
                height: realHeight / 2,
            },
        },
        {
            name: "topRightRect",
            trigger: {
                x: width / 2 + width / 32,
                y: 0,
                width: width / 2 - width / 32,
                height: height / 2 - height / 18,
            },
            target: {
                x: realWidth / 2 + padding,
                y: padding,
                width: realWidth / 2,
                height: realHeight / 2,
            },
        },
        {
            name: "rightColumn",
            trigger: {
                x: width / 2 + width / 32,
                y: height / 2 - height / 18,
                width: width / 2 - width / 32,
                height: height / 9,
            },
            target: {
                x: realWidth / 2 + padding,
                y: padding,
                width: realWidth / 2,
                height: realHeight,
            },
        },
        {
            name: "bottomRightRect",
            trigger: {
                x: width / 2 + width / 32,
                y: height / 2 + height / 18,
                width: width / 2 - width / 32,
                height: height / 2 - height / 18,
            },
            target: {
                x: realWidth / 2 + padding,
                y: realHeight / 2 + padding,
                width: realWidth / 2,
                height: realHeight / 2,
            },
        },
        {
            name: "bottomRow",
            trigger: {
                x: width / 2 - width / 32,
                y: height / 2 + height / 18,
                width: width / 16,
                height: height / 2 - height / 18,
            },
            target: {
                x: padding,
                y: realHeight / 2 + padding,
                width: realWidth,
                height: realHeight / 2,
            },
        },
        {
            name: "bottomLeftRect",
            trigger: {
                x: padding,
                y: height / 2 + height / 18,
                width: width / 2 - width / 32,
                height: height / 2 - height / 18,
            },
            target: {
                x: padding,
                y: realHeight / 2 + padding,
                width: realWidth / 2,
                height: realHeight / 2,
            },
        },
        {
            name: "leftColumn",
            trigger: {
                x: 0,
                y: height / 2 - height / 18,
                width: width / 2 - width / 32,
                height: height / 9,
            },
            target: {
                x: padding,
                y: padding,
                width: realWidth / 2,
                height: realHeight,
            },
        },
        {
            name: "center",
            trigger: {
                x: width / 2 - width / 32,
                y: height / 2 - height / 18,
                width: width / 16,
                height: height / 9,
            },
            target: {
                x: padding,
                y: padding,
                width: realWidth,
                height: realHeight,
            },
        },
    ];

    rect.on("mousemove", function (e) {
        const triggerGroup = getTriggerGroup();
        const triggerRect = triggerGroup.children[0];
        const triggerPlus = triggerGroup.children[1];

        let hasCollision = false;

        for (let i in triggersObj) {
            const pointerPixel = {
                ...rect.getRelativePointerPosition(),
                width: 1,
                height: 1,
            }
            if (collision(triggersObj[i].trigger, pointerPixel)) {
                // animateRectResizing(triggerRect, triggersObj[i].target);
                triggerGroup.setAttrs(triggersObj[i].target);
                triggerRect.setAttrs({
                    x: 0,
                    y: 0,
                    width: triggerGroup.width(),
                    height: triggerGroup.height(),
                });
                triggerPlus.setAttrs({
                    text: "+",
                    x: Math.round(triggerGroup.width() / 2) - Math.round(triggerPlus.fontSize() / 2) + 13,
                    y: Math.round(triggerGroup.height() / 2) - Math.round(triggerPlus.fontSize() / 2) + 5,
                })

                hasCollision = true;
                break;
            }
        }

        if (!hasCollision) {
            triggerRect.setAttrs({
                width: 0, height: 0,
            });
        }
    })
}

function animateRectResizing(rectFrom, rectTo, animationDuration = 60) {
    const oldSizing = {
        x: rectFrom.x(),
        y: rectFrom.y(),
        width: rectFrom.width(),
        height: rectFrom.height(),
    }

    const steps = {
        x: rectTo.x - oldSizing.x,
        y: rectTo.y - oldSizing.y,
        width: rectTo.width - oldSizing.width,
        height: rectTo.height - oldSizing.height,
    };

    let animation = new Konva.Animation((frame) => {
        let percent = frame.time / animationDuration;

        rectFrom.setAttrs({
            x: oldSizing.x + (steps.x * percent),
            y: oldSizing.y + (steps.y * percent),
            width: oldSizing.width + (steps.width * percent),
            height: oldSizing.height + (steps.height * percent),
        })

        if (frame.time > animationDuration) {
            animation.stop();
            rectFrom.setAttrs(rectTo);
        }
    }, getMainLayer());
    if (!animation.isRunning()) {
        animation.start();
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
    position: relative;

    width: 100%;
    height: 100%;

    overflow: clip;
}
</style>