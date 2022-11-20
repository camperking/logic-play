<script lang="ts">
    import type { Node } from "../lib/interface";

    export let node: Node;

    node.outputs = [false];
    node.state = [];
    node.update = function () {};
</script>

<div class="node">
    <div>{node.type}</div>
    <slot />
    <button on:click={() => (node.outputs[0] = !node.outputs[0])}>change</button
    >
</div>

<style>
    .node {
        text-align: center;
    }
</style>
