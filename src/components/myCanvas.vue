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

const rotationSnaps = [];
for (let i = 0; i < 360; i += 90) rotationSnaps.push(i);

const selectionRectangleConf = ref({
    coords: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    },

    selecting: false,
})

function getLayer(name = "mainLayer") {
    return stage.value.find(`.${name}`)[0];
}

function getTransformer() {
    return getLayer().find(".transformer")[0];
}

function getSelectionRectangle() {
    return getLayer().find(".selectionRectangle")[0];
}

function getAllRootGroups() {
    return getLayer().find(".group_0");
}

function checkPixelInRect(rect, pixel) {
    return Konva.Util.haveIntersection(rect, { ...pixel, width: 1, height: 1 });
}

function createRandomRect() {
    const sizing = {
        width: Math.round(Math.random() * 50 + 50),
        height: Math.round(Math.random() * 50 + 50),
    };

    const group = new Konva.Group({
        name: "group_0",
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
    const selectionRectangle = getSelectionRectangle();

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

        selectionRectangle.offsetX(-newPos.x);
        selectionRectangle.offsetY(-newPos.y);
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
        const transformer = getTransformer();

        if (transformer !== undefined) {
            transformer.nodes([]);
            layer.children = layer.children.filter(el => el._id !== transformer._id);
        }
    })

    stage.value.on('mousedown touchstart', function (evt) {
        // do nothing if we mousedown on any shape
        if (evt.target._id !== stage.value._id) {
            return;
        }
        evt.evt.preventDefault();

        selectionRectangleConf.value.coords.x1 = selectionRectangleConf.value.coords.x2 = (stage.value.getPointerPosition().x - stage.value.position().x) / stage.value.scale().x;
        selectionRectangleConf.value.coords.y1 = selectionRectangleConf.value.coords.y2 = (stage.value.getPointerPosition().y - stage.value.position().y) / stage.value.scale().y;

        const selectionRectangle = getSelectionRectangle();
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        selectionRectangleConf.value.selecting = true;
    });

    stage.value.on('mousemove touchmove', function (evt) {
        // do nothing if we didn't start selection
        if (!selectionRectangleConf.value.selecting) {
            return;
        }
        evt.evt.preventDefault();
        selectionRectangleConf.value.coords.y2 = (stage.value.getPointerPosition().y - stage.value.position().y) / stage.value.scale().y;
        selectionRectangleConf.value.coords.x2 = (stage.value.getPointerPosition().x - stage.value.position().x) / stage.value.scale().x;

        getSelectionRectangle().setAttrs({
            visible: true,
            x: Math.min(selectionRectangleConf.value.coords.x1, selectionRectangleConf.value.coords.x2),
            y: Math.min(selectionRectangleConf.value.coords.y1, selectionRectangleConf.value.coords.y2),
            width: Math.abs(selectionRectangleConf.value.coords.x2 - selectionRectangleConf.value.coords.x1),
            height: Math.abs(selectionRectangleConf.value.coords.y2 - selectionRectangleConf.value.coords.y1),
        });
    });

    stage.value.on('mouseup touchend', function (evt) {
        selectionRectangleConf.value.selecting = false;
        const selectionRectangle = getSelectionRectangle();

        if (!selectionRectangle.visible()) {
            return;
        }
        evt.evt.preventDefault();

        selectionRectangle.visible(false);

        var shapes = stage.value.find('Group');
        var box = selectionRectangle.getClientRect();
        var selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));

        let rootTransformer = getTransformer();
        if (selected.length > 0) {
            if (rootTransformer === undefined) {
                const layer = getLayer();

                const transformer = new Konva.Transformer({
                    nodes: [],
                    name: "transformer",
                    shouldOverdrawWholeArea: true,
                    rotationSnaps,
                    ignoreStroke: true,
                    padding: 3,
                });
                transformer.on("click", transformerClickHandler)

                layer.add(transformer);
            }

            rootTransformer = getTransformer();

            rootTransformer.nodes(selected);
        }

    });
}

function createLayer() {
    const layer = new Konva.Layer({
        name: "mainLayer",
    });
    stage.value.add(layer);

    for (let i = 0; i < 10; i++) addRectToFirstLayer();

    const selectionRectangle = new Konva.Rect({
        name: "selectionRectangle",
        fill: 'rgba(0,0,255,0.3)',
        visible: false,
    });
    layer.add(selectionRectangle);
}

function addClickHandler(group) {
    group.on("click", function (evt) {
        evt.cancelBubble = true;

        const layer = evt.currentTarget.parent;
        let groups = layer.children.filter(el => el.nodes === undefined);
        groups = [...groups.filter(el => el._id !== this._id), this];
        layer.children = [...groups, getTransformer()].filter(el => el !== undefined);

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
            transformer = new Konva.Transformer({
                nodes: [group],
                name: "transformer",
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
        x: (stage.value.getPointerPosition().x + stage.value.offsetX() - stage.value.position().x) / stage.value.scale().x,
        y: (stage.value.getPointerPosition().y + stage.value.offsetY() - stage.value.position().y) / stage.value.scale().x,
    };

    let targetGroup;
    const groups = getAllRootGroups();
    const nodes = this.nodes();

    for (let i in groups) {
        const rectSizing = {
            x: groups[i].x(),
            y: groups[i].y(),
            width: groups[i].width() * stage.value.scale().x,
            height: groups[i].height() * stage.value.scale().x,
        };

        if (checkPixelInRect(rectSizing, clickPos)) {
            targetGroup = groups[i];
            break;
        }
    }

    let inTransformer = false;
    if (targetGroup !== undefined) {
        const shapeSizing = {
            x: (this.x() + stage.value.offsetX() - stage.value.position().x) / stage.value.scale().x,
            y: (this.y() + stage.value.offsetY() - stage.value.position().y) / stage.value.scale().x,
            width: this.width() * stage.value.scale().x,
            height: this.height() * stage.value.scale().x,
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
})

console.log("Created");
</script>

<style lang="scss">
#canvasContainer {
    width: 100%;
    height: 100%;
}
</style>