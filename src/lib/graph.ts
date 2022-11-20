import type { Graph, Node } from "./interface";

export function depthGraph(graph: Graph) {
    const nodes = graph.nodes;
    const edges = graph.edges;
    const stack: Array<Node> = [];

    // find and push nodes without inputs to queue
    for (const node_name in nodes) {
        const node = nodes[node_name];
        if (node.inputs.length === 0) stack.push(node);
    }

    while (stack.length > 0) {
        const node = stack.pop();
        updateInputs(graph, node);
        node.update();
        node.ready = true;

        // find all edges for each output
        node.outputs.forEach((_output, io) => {
            const currEdgeStart = { node_name: node.name, io };
            const output_edges = edges.filter(edge => edge.start.node_name === currEdgeStart.node_name && edge.start.io === currEdgeStart.io);

            output_edges.forEach(edge => {
                const next_node = nodes[edge.end.node_name];
                // check if node is already in queue
                const node_exists = stack.findIndex(stack_node => stack_node.name === next_node.name);

                // push next node if its not already updated
                if (node_exists < 0 && !next_node.ready) stack.push(next_node);
            });
        });
    }

    // reset all nodes to ready
    for (const node_name in nodes) {
        const node = nodes[node_name];
        node.ready = false;
    }
}

export function updateInputs(graph: Graph, node: Node) {
    const nodes = graph.nodes;
    const edges = graph.edges;
    node.inputs.forEach((_input, io) => {
        const currEdgeEnd = { node_name: node.name, io };
        const input_edges = edges.filter(edge => edge.end.node_name === currEdgeEnd.node_name && edge.end.io === currEdgeEnd.io);

        let input_state = false;

        input_edges.forEach(edge => {
            // update input
            const output_state = nodes[edge.start.node_name].outputs[edge.start.io];
            if (!input_state) {  // this ORs all edges
                node.inputs[io] = output_state;
                input_state = output_state;
            }
        });
    });
}