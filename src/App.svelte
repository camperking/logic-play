<script lang="ts">
    // import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
    // import { documentDir } from "@tauri-apps/api/path";
    // import { open } from "@tauri-apps/api/dialog";
    // import { save } from "@tauri-apps/api/dialog";

    import Controls from "./Controls.svelte";
    import Editor from "./editor/Editor.svelte";
    import type { Node, Edge, Graph } from "./lib/interface";
    import { depthGraph } from "./lib/graph";
    import { fade, scale } from "svelte/transition";

    let editor_scale: number;

    let nodes: { [index: string]: Node } = {};
    let edges: Array<Edge> = [];

    let place_node: (e: CustomEvent<string>) => void;

    let show_help = false;

    let sim_active = false;
    let sim_speed = 2; // two times a second
    let simulator: NodeJS.Timer;

    function startStopSim() {
        sim_active = !sim_active;
        startSim();
        stopSim();
    }

    function startSim() {
        if (sim_active) {
            simulator = setInterval(
                () => depthGraph({ nodes, edges }),
                1000 / sim_speed
            );
        }
    }

    function stopSim() {
        if (!sim_active) clearInterval(simulator);
    }

    async function save_doc() {
        // const docDirPath = await documentDir();

        // const filePath = await save({
        //     filters: [
        //         {
        //             name: "logic-play files",
        //             extensions: ["lpx", "lp"],
        //         },
        //     ],
        //     defaultPath: docDirPath,
        // });

        // const serialized = JSON.stringify({ nodes, edges });

        // await writeTextFile(filePath, serialized);
    }

    async function open_doc() {
        // const docDirPath = await documentDir();

        // const selected = await open({
        //     multiple: false,
        //     filters: [
        //         {
        //             name: "logic-play files",
        //             extensions: ["lpx", "lp"],
        //         },
        //     ],
        //     defaultPath: docDirPath,
        // });

        // if (typeof selected === "string") {
        //     const serialized = await readTextFile(selected);
        //     const loaded_graph = JSON.parse(serialized);

        //     nodes = loaded_graph.nodes;
        //     edges = loaded_graph.edges;
        // }
    }
</script>

<main class="container">
    <Controls
        on:place_node={place_node}
        on:startStopSim={startStopSim}
        on:save={save_doc}
        on:open={open_doc}
        bind:sim_active
    />
    <Editor bind:place_node bind:editor_scale bind:nodes bind:edges on:stopSim={stopSim} on:startSim={startSim} />
    <div class="help">
        {#if show_help}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="help-text" in:scale on:click={() => show_help = !show_help}>
            <h3>How to start</h3>
            <p>The simulation needs at least one node with inputs. You always have to place an IO>>Input node and connect it for the simulation to work. Place a node by choosing one from the controls and clicking into the editor. After placing, nodes can be dragged around and deleted. Connect nodes by clicking on an output and then on an input. Deleting nodes works the same way, by clicking on an output and then on an input. Use mousewheel for zooming and middle mouse button for dragging the editor.</p>
            <div>
                <div><img src="play.svg" alt=""> simulation is running</div>
                <div><img src="pause.svg" alt=""> simulation stopped</div>
            </div>
            <p><a href="https://github.com/camperking/logic-play"><img src="github.svg" alt=""></a></p>
        </div>
        {:else}
            <button on:click={() => show_help = !show_help} in:fade><div>?</div></button>
        {/if}
    </div>
</main>

<style>
    .container {
        background-color: #252526;
    }

    .help {
        position: absolute;
        right: 2rem;
        bottom: 2rem;
        color: #cccccc;
        z-index: 99;
    }
    
    .help button {
        font-size: 3rem;
        padding: 0;
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
    }

    .help button div {
        margin-top: 0.6rem;
    }

    .help-text {
        width: 30vw;
        padding: 1rem;
        background-color: #252526;
    }

    .help-text img {
        width: 2rem;
        margin-bottom: -0.6rem;
    }
</style>
