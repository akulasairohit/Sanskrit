"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface SemanticGraphViewProps {
    data?: {
        nodes: any[];
        edges: any[];
    };
}

// Default mock data if none provided (for prototyping)
const defaultNodes: Node[] = [
    {
        id: 'action_gacchati',
        position: { x: 250, y: 150 },
        data: { label: 'Action: Gacchati (Goes)' },
        style: { background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' }
    },
    {
        id: 'entity_ramah',
        position: { x: 50, y: 50 },
        data: { label: 'Agent: Rāmaḥ' },
        style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' }
    },
    {
        id: 'entity_vanam',
        position: { x: 450, y: 50 },
        data: { label: 'Object: Vanam' },
        style: { background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' }
    },
];

const defaultEdges: Edge[] = [
    {
        id: 'e1-2',
        source: 'action_gacchati',
        target: 'entity_ramah',
        label: 'Kartā (Agent)',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#3b82f6' }
    },
    {
        id: 'e1-3',
        source: 'action_gacchati',
        target: 'entity_vanam',
        label: 'Karma (Object)',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981' }
    },
];

export function SemanticGraphView({ data }: SemanticGraphViewProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges || []);

    // Update state when data prop changes
    React.useEffect(() => {
        if (data) {
            setNodes(data.nodes);
            setEdges(data.edges);
        }
    }, [data, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="w-full h-[400px] border border-border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/20">
                <h3 className="text-sm font-medium text-foreground">Semantic Graph (Kāraka)</h3>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
                minZoom={0.5}
                maxZoom={2}
                panOnScroll={true}
                zoomOnScroll={true}
                preventScrolling={false}
            >
                <Controls className="bg-background border-border fill-foreground" />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
}
