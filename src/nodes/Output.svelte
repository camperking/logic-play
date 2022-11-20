<script lang="ts">
    import type { Node } from "../lib/interface";

    export let node: Node;

    node.inputs = [false];
    node.state = [];
    node.update = function () {};
</script>

<div>
    <div class="name">{node.type}</div>
    <slot />
</div>

<style>
</style>
