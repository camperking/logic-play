<script lang="ts">
    import type { Node } from "../lib/interface";

    export let node: Node;

    node.inputs = [false, false];
    node.outputs = [true];
    node.state = [];
    node.update = function () {
        node.outputs[0] = !node.inputs[0] || !node.inputs[1] ? true : false;
    };
</script>

<div>
    <div class="name">{node.type}</div>
    <slot />
</div>

<style>
</style>
