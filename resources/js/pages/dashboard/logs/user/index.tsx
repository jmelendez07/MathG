import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    BackgroundVariant,
    MarkerType,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { Activity } from "lucide-react";
import '@xyflow/react/dist/style.css';
import LogNode, { getLogActionColor } from "@/components/dashboard/logs/flow/node";


interface IUserLogsIndexProps {
    user: User;
}

function FlowContent({ user, nodes }: { 
    user: User;
    nodes: Node[];
}) {
    const { fitView } = useReactFlow();

    // ✅ Enfocar solo los últimos 3 nodos
    useEffect(() => {
        if (nodes.length > 0) {
            const lastThreeNodes = nodes.slice(-3);
            const lastThreeIds = lastThreeNodes.map(node => node.id);

            setTimeout(() => {
                fitView({
                    nodes: lastThreeIds.map(id => ({ id })), // ✅ Esto está correcto
                    duration: 800,
                    padding: 0.3,
                    minZoom: 0.8,
                    maxZoom: 1.2,
                });
            }, 100);
        }
    }, [fitView]); // ✅ Cambio: Solo ejecutar una vez al montar

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

export default function UserLogsIndex({ user }: IUserLogsIndexProps) {
    
    const [breadcrumbs] = useState<BreadcrumbItem[]>([
        {
            title: 'Panel de Control',
            href: route('dashboard'),
        },
        {
            title: 'Monitoreo',
            href: route('logs.index'),
        },
        {
            title: user.name,
            href: route('logs.user', user.id)
        }
    ]);

    const { initialNodes, initialEdges } = useMemo(() => {
        if (!user.logs || user.logs.length === 0) return { initialNodes: [], initialEdges: [] };

        const sortedLogs = [...user.logs].reverse();

        const nodes: Node[] = sortedLogs.map((log, index) => {
            const colors = getLogActionColor(log);
            
            const seed = parseInt(log.id.replace(/\D/g, '').slice(-4) || '0');
            const randomX = ((seed % 30) - 15);
            const randomY = ((seed % 200) - 100) * 2;
            const baseY = 300 + (index % 2 === 0 ? -80 : 80);

            return {
                id: log.id,
                type: 'default',
                position: { 
                    x: index * 400 + randomX,
                    y: baseY + randomY
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    label: <LogNode log={log} />
                },
                style: {
                    background: colors.bg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: 0,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    width: 'auto',
                    minWidth: '250px',
                    maxWidth: '350px',
                },
            };
        });

        const edges: Edge[] = sortedLogs.length < 2 ? [] : sortedLogs.slice(0, -1).map((log, index) => ({
            id: `e${log.id}-${sortedLogs[index + 1].id}`,
            source: log.id,
            target: sortedLogs[index + 1].id,
            type: 'bezier',
            animated: true,
            style: { 
                stroke: '#a855f7', 
                strokeWidth: 2 
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#a855f7',
            },
        }));

        return { initialNodes: nodes, initialEdges: edges };
    }, [user.logs]);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Actividades de ${user.name}`} />
            
            <style>{`
                .react-flow__handle {
                    width: 12px !important;
                    height: 12px !important;
                    background: #a855f7 !important;
                    border: 2px solid white !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
                }
                
                .react-flow__handle-left {
                    left: -6px !important;
                }
                
                .react-flow__handle-right {
                    right: -6px !important;
                }
                
                .react-flow__node:first-of-type .react-flow__handle-left {
                    display: none !important;
                }
                
                .react-flow__node:last-of-type .react-flow__handle-right {
                    display: none !important;
                }
            `}</style>
            
            <div className="h-full flex flex-col">
                <div className="flex-1 relative bg-white overflow-hidden">
                    <div className="absolute left-0 top-0 m-4 flex items-center gap-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-xl shadow-lg">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Actividades de {user.name}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {user.email} • {user.logs?.length || 0} {user.logs?.length === 1 ? 'actividad' : 'actividades'}
                            </p>
                        </div>
                    </div>
                    {user.logs && user.logs.length > 0 ? (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodesDraggable={true}
                            nodesConnectable={false}
                            elementsSelectable={true}
                            fitView={false}
                            attributionPosition="bottom-left"
                        >
                            <FlowContent 
                                user={user} 
                                nodes={nodes}
                            />
                        </ReactFlow>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay actividades registradas
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Este usuario aún no ha realizado ninguna acción.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}