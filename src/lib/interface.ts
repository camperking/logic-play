export interface Node {
    inputs: Array<boolean>;
    outputs: Array<boolean>;
    update: () => void;
    ready: boolean;
    state?: any;
    position: { x: number, y: number };
    type: string;
    component?: any;
    name: string;
}

export type Target = {
    node_name: string;
    io: number;
    position?: { x: number, y: number }
};

export interface Edge {
    start: Target;
    end: Target;
}

export interface Graph {
    nodes: { [index: string]: Node; };
    edges: Array<Edge>;
}

