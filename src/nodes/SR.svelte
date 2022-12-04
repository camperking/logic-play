<script lang="ts">
    import type { Node } from "../lib/interface";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let node: Node;

    node.inputs = [false, false];
    node.outputs = [false];
    node.state = false;
    node.update = function () {
        if (node.inputs[0]) node.state = true;
        if (!node.inputs[0] && node.inputs[1]) node.state = false;
        node.outputs[0] = node.state;
    };
</script>

<div>
    <div class="name">{node.type}</div>
    <slot />
</div>

<style>
</style>
