<script lang="ts">
    import { draggable } from "@neodrag/svelte";

    import { createEventDispatcher } from "svelte";

    export let sim_active = false;

    let current_tab = "gates";

    const dispatch = createEventDispatcher();

    async function add_node(node: String) {
        dispatch("place_node", node);
    }
</script>

<div class="controls" use:draggable={{ bounds: "body" }}>
    <div class="segment">
        <div class="icons">
            <button on:click={() => document.location.reload()}
                ><img src="file.svg" alt="New" /></button
            >
            <button on:click={() => dispatch("open")}
                ><img src="folder.svg" alt="Open" /></button
            >
            <button on:click={() => dispatch("save")}
                ><img src="save.svg" alt="Save" /></button
            >
            <button on:click={() => dispatch("startStopSim")}
                ><img
                    src={sim_active ? "play.svg" : "pause.svg"}
                    alt="Start Stop"
                /></button
            >
        </div>
    </div>
    <div class="segment">
        <div class="tab-control">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                on:click={() => (current_tab = "io")}
                style:border-bottom={current_tab === "io"
                    ? "1px solid #dcdcaa"
                    : ""}
            >
                IO
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                on:click={() => (current_tab = "gates")}
                style:border-bottom={current_tab === "gates"
                    ? "1px solid #dcdcaa"
                    : ""}
            >
                Gates
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                on:click={() => (current_tab = "integrated")}
                style:border-bottom={current_tab === "integrated"
                    ? "1px solid #dcdcaa"
                    : ""}
            >
                Integrated
            </div>
        </div>
        <div class="tab-content">
            {#if current_tab === "io"}
                <button on:click={() => add_node("Input")}>Input</button>
                <button on:click={() => add_node("Output")}>Output</button>
            {:else if current_tab === "gates"}
                <button on:click={() => add_node("And")}>And</button>
                <button on:click={() => add_node("Not")}>Not</button>
                <button on:click={() => add_node("Or")}>Or</button>
                <button on:click={() => add_node("Xor")}>Xor</button>
                <button on:click={() => add_node("Nor")}>Nor</button>
            {:else if current_tab === "integrated"}
                <button on:click={() => add_node("Sr")}>Sr</button>
                <button on:click={() => add_node("Rs")}>Rs</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .controls {
        width: 20rem;
        position: absolute;
        border: 1px solid black;
        z-index: 100;
        top: 0.5rem;
        left: 0.5rem;
        background-color: #252526;
        color: #dcdcaa;
        padding: 1rem 1rem 1rem 1rem;
    }

    .segment {
        margin-bottom: 1rem;
    }

    .icons button {
        line-height: 0;
    }

    button img {
        width: 32px;
        height: 32px;
    }

    .tab-control {
        display: flex;
        margin-left: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .tab-control div {
        margin-right: 1rem;
        cursor: pointer;
        font-size: large;
    }

    .tab-content button {
        margin: 0.2rem 0.1rem 0.2rem 0.1rem;
    }
</style>
