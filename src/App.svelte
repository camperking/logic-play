<script lang="ts">
    // import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
    // import { documentDir } from "@tauri-apps/api/path";
    // import { open } from "@tauri-apps/api/dialog";
    // import { save } from "@tauri-apps/api/dialog";

    import Controls from "./Controls.svelte";
    import Editor from "./editor/Editor.svelte";
    import type { Node, Edge, Graph } from "./lib/interface";
    import { depthGraph } from "./lib/graph";

    let editor_scale: number;

    let nodes: { [index: string]: Node } = {};
    let edges: Array<Edge> = [];

    let place_node: (e: CustomEvent<string>) => void;

    let sim_active = false;
    let sim_speed = 2; // two times a second
    let simulator: NodeJS.Timer;

    function startStopSim() {
        sim_active = !sim_active;

        if (sim_active) {
            simulator = setInterval(
                () => depthGraph({ nodes, edges }),
                1000 / sim_speed
            );
        } else {
            clearInterval(simulator);
        }
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
    <Editor bind:place_node bind:editor_scale bind:nodes bind:edges />
</main>

<style>
    .container {
        background-color: #252526;
    }
</style>
