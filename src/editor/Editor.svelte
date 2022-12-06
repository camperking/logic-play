<script lang="ts">
    import { v4 as uuidv4 } from "uuid";
    import panzoom from "panzoom";
    import { onMount, createEventDispatcher } from "svelte";
    import type { Node, Target, Edge } from "../lib/interface";

    import NodeView from "./NodeView.svelte";
    import { updateInputs } from "../lib/graph";

    const dispatch = createEventDispatcher();

    // bindings
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let editor: HTMLElement;

    // zoom level of editor, needed for other ui actions
    export let editor_scale = 1;

    let showCursorNode = false;
    let cursorNode: Node;

    onMount(() => {
        const panzoom_editor = panzoom(editor, {
            beforeMouseDown: function (e) {
                // ignore mouse_down if left mouse button is pressed
                const shouldIgnore = e.buttons === 1;
                return shouldIgnore;
            },
            maxZoom: 1,
            minZoom: 0.4,
        });

        panzoom_editor.on(
            "transform",
            () => (editor_scale = panzoom_editor.getTransform().scale)
        );

        const origin_rect = canvas.getBoundingClientRect();
        canvas.width = origin_rect.width;
        canvas.height = origin_rect.height;

        ctx = canvas.getContext("2d");

        edges.forEach((edge) => drawEdge(edge));
    });

    export let nodes: { [index: string]: Node } = {};
    export let edges: Array<Edge> = [];

    $: graph = { nodes, edges };

    // // // //
    // Editing

    export const place_node = function (e: CustomEvent<string>) {
        const node_type = e.detail;

        const name = uuidv4();

        const node: Node = {
            inputs: [],
            outputs: [],
            update: () => {},
            ready: false,
            position: {
                x: -1000,
                y: -1000,
            },
            type: node_type,
            name,
        };

        cursorNode = node;

        const origin = editor.getBoundingClientRect();
        
        const place_node_here = function (e: MouseEvent) {

            node.position = {
                x: (e.clientX - origin.x) / editor_scale,
                y: (e.clientY - origin.y) / editor_scale,
            };

            nodes[name] = node;
            nodes = nodes;

            editor.removeEventListener("click", place_node_here);
            editor.removeEventListener("mousemove", handleCursorNode);
            editor.style.cursor = "default";
            showCursorNode = false;
        };

        const handleCursorNode = function (e: MouseEvent) {
            cursorNode.position.x = (e.clientX - origin.x) / editor_scale;
            cursorNode.position.y = (e.clientY - origin.y) / editor_scale;
        };

        showCursorNode = true;
        editor.style.cursor = "crosshair";
        editor.addEventListener("click", place_node_here);
        editor.addEventListener("mousemove", handleCursorNode);
    };

    let conn_edit_active = false;
    let conn_edit_start: Target;
    let clicked_type: "input" | "output";

    function endClicked(output: CustomEvent<Target>) {
        if (conn_edit_active) {
            // clicked the same twice
            if (conn_edit_start.node_name === output.detail.node_name) {
                conn_edit_active = false;
                return;
            }

            if (clicked_type === "input") {
                addEdge({ start: conn_edit_start, end: output.detail });
                conn_edit_active = false;
                return;
            }
            return;
        }
        conn_edit_active = true;
        conn_edit_start = output.detail;
        clicked_type = "output";
    }

    function startClicked(input: CustomEvent<Target>) {
        if (conn_edit_active) {
            if (conn_edit_start.node_name === input.detail.node_name) {
                conn_edit_active = false;
                return;
            }

            if (clicked_type === "output") {
                addEdge({ start: input.detail, end: conn_edit_start });
                conn_edit_active = false;
                return;
            }
            return;
        }
        conn_edit_active = true;
        conn_edit_start = input.detail;
        clicked_type = "input";
    }

    function addEdge(edge: Edge) {
        // check if edge exists
        const edge_exists = edges.findIndex((e) => {
            return (
                e.end.node_name === edge.end.node_name &&
                e.end.io === edge.end.io &&
                e.start.node_name === edge.start.node_name &&
                e.start.io === edge.start.io
            );
        });
        if (edge_exists >= 0) {
            edges.splice(edge_exists, 1);
        } else {
            edges.push(edge);
        }

        updateInputs(graph, nodes[edge.end.node_name]);
        nodes = nodes;

        edges.forEach((edge) => {
            const start_element = document
                .getElementById(
                    "node" + edge.start.node_name + "output" + edge.start.io
                );

            const end_element = document
                .getElementById(
                    "node" + edge.end.node_name + "input" + edge.end.io
                );

            const rel_start_pos = {
                x: start_element.offsetLeft + start_element.offsetWidth,
                y: start_element.offsetTop + (start_element.offsetHeight / 2)
            };

            const rel_end_pos = {
                x: end_element.offsetLeft,
                y: end_element.offsetTop + (end_element.offsetHeight / 2)
            };

            edge.start.position = rel_start_pos;
            edge.end.position = rel_end_pos;
        });

        drawEdges();
    }

    function deleteNode(e: CustomEvent<string>) {
        dispatch("stopSim");
        const node_name = e.detail;

        const new_edges = edges.filter(
            (edge) =>
                edge.start.node_name !== node_name &&
                edge.end.node_name !== node_name
        );
        edges = new_edges;

        delete nodes[node_name];
        nodes = nodes;
        drawEdges();
        dispatch("startSim");
    }

    // // // //
    // Drawing

    function drawEdge(edge: Edge) {
        const start_node_pos = nodes[edge.start.node_name].position;
        const start = {
            x: edge.start.position.x + start_node_pos.x,
            y: edge.start.position.y + start_node_pos.y,
        };

        const end_node_pos = nodes[edge.end.node_name].position;
        const end = {
            x: edge.end.position.x + end_node_pos.x,
            y: edge.end.position.y + end_node_pos.y,
        };

        ctx.beginPath();
        ctx.lineWidth = 4 * editor_scale;
        ctx.strokeStyle = "#cc3e42";
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    function drawEdges() {
        ctx.clearRect(0, 0, 2048, 2048);
        edges.forEach((edge) => drawEdge(edge));
    }
</script>

<div class="editor" bind:this={editor}>
    <div class="nodes">
        {#each Object.keys(nodes) as node}
            <NodeView
                bind:node={nodes[node]}
                on:input_clicked={endClicked}
                on:output_clicked={startClicked}
                on:drawEdges={drawEdges}
                on:delete_node={deleteNode}
            />
        {/each}
    </div>
    <canvas bind:this={canvas} />
    {#if showCursorNode}
        <div class="cursor-node">
            <NodeView bind:node={cursorNode} />
        </div>
    {/if}
</div>

<style>
    .editor {
        margin: auto;
        width: 2048px;
        height: 2048px;
        position: relative;
        background-color: #1e1e1e;
    }

    .nodes {
        position: absolute;
        width: inherit;
        height: inherit;
        z-index: 99;
    }

    canvas {
        left: 0;
        position: absolute;
        width: inherit;
        height: inherit;
    }

    .cursor-node {
        position: absolute;
    }
</style>
