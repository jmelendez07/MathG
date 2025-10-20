import { User } from "@/types";
import { useEffect } from "react";
import {
    MiniMap,
    Controls,
    Background,
    Node,
    BackgroundVariant,
    useReactFlow,
} from '@xyflow/react';
import { getLogActionColor } from "./node";

interface FLowContentProps {
    user: User;
    nodes: Node[];
}

export default function FlowContent({ user, nodes }: FLowContentProps) {
    const { fitView } = useReactFlow();

    useEffect(() => {
        if (nodes.length > 0) {
            const lastThreeNodes = nodes.slice(-3);
            const lastThreeIds = lastThreeNodes.map(node => node.id);

            setTimeout(() => {
                fitView({
                    nodes: lastThreeIds.map(id => ({ id })),
                    duration: 800,
                    padding: 0.3,
                    minZoom: 0.8,
                    maxZoom: 1.2,
                });
            }, 100);
        }
    }, [fitView]);

    return (
        <>
            <Controls />
            <MiniMap 
                nodeColor={(node) => {
                    const log = (user.logs || []).find(l => l.id === node.id);
                    if (!log) return '#c084fc';
                    const colors = getLogActionColor(log);
                    return colors.border;
                }}
                maskColor="rgba(168, 85, 247, 0.1)"
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </>
    );
}