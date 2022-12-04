<script lang="ts">
    import { draggable } from "@neodrag/svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import type { Node } from "../lib/interface";

    const dispatch = createEventDispatcher();

    // Node components
    import Input from "../nodes/Input.svelte";
    import Output from "../nodes/Output.svelte";
    import And from "../nodes/And.svelte";
    import Not from "../nodes/Not.svelte";
    import Or from "../nodes/Or.svelte";
    import Xor from "../nodes/Xor.svelte";
    import Nor from "../nodes/Nor.svelte";

    const node_components: { [index: string]: any } = {
        Input: Input,
        Output: Output,
        And: And,
        Not: Not,
        Or: Or,
        Xor: Xor,
        Nor: Nor,
    };

    export let node: Node;
    node.component = node_components[node.type];

    let input_buttons: Array<HTMLElement>;

    onMount(() => {
        dispatch("drawEdges");
    });

    function dragEvent(x: number, y: number) {
        node.position = { x, y };
        dispatch("drawEdges");
    }
</script>

<div
    class="node-container"
    use:draggable={{
        bounds: "parent",
        position: { x: node.position.x, y: node.position.y },
        onDrag: ({ offsetX, offsetY }) => dragEvent(offsetX, offsetY),
        onDragEnd: ({ offsetX, offsetY }) => dragEvent(offsetX, offsetY),
    }}
>
    <div class="inputs">
        {#each node.inputs as input, io_index}
            <div class="input">
                <button
                    on:click={() =>
                        dispatch("input_clicked", {
                            node_name: node.name,
                            io: io_index,
                        })}
                    id={"node" + node.name + "input" + io_index}
                    style:background-color={input ? "#6a9955" : "#dcdcaa"}
                />
            </div>
        {/each}
    </div>
    <div class="node">
        <svelte:component this={node.component} bind:node>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="node-control">
                <img
                    src="trash.svg"
                    alt="delete node"
                    on:click={() => dispatch("delete_node", node.name)}
                />
            </div>
        </svelte:component>
    </div>
    <div class="outputs">
        {#each node.outputs as output, io_index}
            <div class="output">
                <button
                    on:click={() =>
                        dispatch("output_clicked", {
                            node_name: node.name,
                            io: io_index,
                        })}
                    id={"node" + node.name + "output" + io_index}
                    style:background-color={output ? "#6a9955" : "#dcdcaa"}
                />
            </div>
        {/each}
    </div>
</div>

<style>
    .node-container {
        position: absolute;
        border: 2px solid #569cd6;
        border-radius: 2px;
        background-color: #252526;
        color: #cccccc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
    }

    .inputs,
    .outputs {
        display: flex;
        flex-direction: column;
        min-width: 60px;
        line-height: 0;
        justify-content: space-evenly;
    }

    .input,
    .output {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .inputs {
        margin-left: -20px;
    }

    .outputs {
        text-align: right;
        margin-right: -20px;
    }

    .input button,
    .output button {
        padding: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #dcdcaa;
        border: 1px solid transparent;
        font-family: inherit;
        color: #cccccc;
        transition: none;
        box-shadow: none;
    }

    .node-control {
        text-align: center;
    }
</style>
