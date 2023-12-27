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

function getLayer() {
    return stage.value.children[0];
}

function checkPixelInRect(rect, pixel) {
    return pixel.x >= rect.x && pixel.x <= (rect.x + rect.width) && pixel.y >= rect.y && pixel.y <= (rect.y + rect.height)
}

function createRandomRect() {
    const sizing = {
        width: Math.round(Math.random() * 50 + 50),
        height: Math.round(Math.random() * 50 + 50),
    };

    const group = new Konva.Group({
        x: Math.round(Math.random() * Math.round(stage.value.attrs.width / 2) * 2),
        y: Math.round(Math.random() * Math.round(stage.value.attrs.height / 2) * 2),
        ...sizing,
    })

    group.on("transform", function (evt) {
        const newSizing = {
            width: group.width() * group.scaleX(),
            height: group.height() * group.scaleY(),
            scaleX: 1,
            scaleY: 1,
        }

        group.setAttrs(newSizing);
        group.children[0].setAttrs(newSizing);
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
    const group = createRandomRect();
    addClickHandler(group);

    const layer = stage.value.children[0];
    layer.add(group);
}

function scaleHandler(e) {
    e.evt.preventDefault();

    if (e.evt.deltaX % 1 === 0 && e.evt.deltaY % 1 === 0) {
        const currentOffset = {
            x: stage.value.offsetX(),
            y: stage.value.offsetY(),
        }

        stage.value.offsetX(currentOffset.x + e.evt.deltaX * cameraObj.value.OFFSET_SENSITIVITY)
        stage.value.offsetY(currentOffset.y + e.evt.deltaY * cameraObj.value.OFFSET_SENSITIVITY)
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

function initStage() {
    stage.value = new Konva.Stage({
        container: "canvasContainer",
        width: document.querySelector(".mainPage__mainBlock__canvas").clientWidth,
        height: document.querySelector(".mainPage__mainBlock__canvas").clientHeight,
    })

    stage.value.on("wheel", scaleHandler);

    stage.value.on("click", function (evt) {
        const layer = getLayer();
        if (layer.children[layer.children.length - 1].nodes) {
            layer.children[layer.children.length - 1].nodes([]);
            layer.children.splice(layer.children.length - 1, 1);
        }
    })
}

function createLayer() {
    const layer = new Konva.Layer();
    stage.value.add(layer);
}

function addClickHandler(group) {
    group.on("click", function (evt) {
        evt.cancelBubble = true;

        const layer = evt.currentTarget.parent;
        let groups = layer.children.filter(el => el.nodes === undefined);
        groups = [...groups.filter(el => el._id !== this._id), this];
        layer.children = [...groups, layer.children.find(el => el.nodes !== undefined)].filter(el => el !== undefined);

        const lastElement = layer.children[layer.children.length - 1];

        let transformer;
        if (lastElement.nodes !== undefined) {
            if (evt.evt.ctrlKey || evt.evt.metaKey) {
                const nodes = lastElement.nodes();

                if (nodes.map(el => el._id).includes(group._id)) {
                    lastElement.nodes(nodes.filter(el => el._id !== group.id));
                } else {
                    lastElement.nodes([...nodes, group]);
                }
            } else {
                lastElement.nodes([group]);
            }
        } else {
            const rotationSnaps = [];
            for (let i = 0; i < 360; i += 90) rotationSnaps.push(i);

            transformer = new Konva.Transformer({
                nodes: [group],
                shouldOverdrawWholeArea: true,
                rotationSnaps,
                ignoreStroke: true,
                padding: 3,
            });
            transformer.on("click", transformerClickHandler)

            layer.add(transformer);
        }
    });
}

function transformerClickHandler(_evt) {
    const clickPos = {
        x: _evt.evt.layerX,
        y: _evt.evt.layerY
    };

    let targetGroup;
    const groups = this.parent.children.filter(el => el.nodes === undefined);
    const nodes = this.nodes();

    for (let i in groups) {
        const rectSizing = {
            x: groups[i].x(),
            y: groups[i].y(),
            width: groups[i].width(),
            height: groups[i].height(),
        };

        if (checkPixelInRect(rectSizing, clickPos)) {
            targetGroup = groups[i];
            break;
        }
    }

    let inTransformer = false;
    if (targetGroup !== undefined) {
        const shapeSizing = {
            x: this.x(),
            y: this.y(),
            width: this.width(),
            height: this.height(),
        };
        inTransformer = checkPixelInRect(shapeSizing, clickPos);
    }

    if (inTransformer && targetGroup !== undefined) {
        if (_evt.evt.ctrlKey || _evt.evt.metaKey) {
            if (nodes.map(el => el._id).includes(targetGroup._id)) {
                this.nodes(nodes.filter(el => el._id !== targetGroup._id))
            } else {
                this.nodes([...nodes, targetGroup]);
            }
        }
        _evt.cancelBubble = true;
    }
}

onMounted(() => {
    initStage();
    createLayer();

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