import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import Log from "@/types/log";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Activity, 
    Clock, 
    Monitor, 
    TrendingUp,
    ChevronRight,
    Search,
    Filter,
    Logs,
    Link2,
    ExternalLink,
    Key,
    DoorOpen,
    Ban,
    NotebookPen,
    Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEcho } from "@laravel/echo-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Control',
        href: route('dashboard'),
    },
    {
        title: 'Monitoreo',
        href: route('logs.index'),
    },
];

interface ILogsIndexProps {
    logs: Log[];
    logsCount: number;
}

interface GroupedLogs {
    [userId: string]: {
        user: Log['user'];
        logs: Log[];
    };
}

interface EchoLogEvent {
    log: Log;
}

export default function LogsIndex({ logs: initialLogs, logsCount }: ILogsIndexProps) {
    const [logs, setLogs] = useState<Log[]>(initialLogs);
    const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    useEcho(
        "log.stream",
        ".user.activity.streamed",
        (e: EchoLogEvent) => {
            if (!e.log || !e.log.user) return;
            e.log.is_broadcasted = true;
            setLogs((prevLogs) => [e.log, ...prevLogs]);
        },
    );

    const groupedLogs: GroupedLogs = logs.reduce((acc, log) => {
        const userId = log.user_id || 'guest';
        if (!acc[userId]) {
            acc[userId] = {
                user: log.user,
                logs: []
            };
        }
        acc[userId].logs.push(log);

        return acc;
    }, {} as GroupedLogs);

    const toggleUser = (userId: string) => {
        const newExpanded = new Set(expandedUsers);
        
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        } 

        if (logs.some(log => log.user_id === userId && log.is_broadcasted)) {
            setLogs((prevLogs) => 
                prevLogs.map(log => 
                    log.user_id === userId ? { ...log, is_broadcasted: false } : log
                )
            );
        }

        setExpandedUsers(newExpanded);
    };

    const getActionColor = (log: Log) => {
        if (log.metadata.url === route('login')) {
            return 'text-green-600 bg-green-50 border-green-200';
        }

        if (log.metadata.url === route('logout')) {
            return 'text-orange-600 bg-orange-50 border-orange-200';
        }

        if (log.status_code && log.status_code >= 400) {
            return 'text-red-600 bg-red-50 border-red-200';
        }

        return 'text-purple-600 bg-purple-50 border-purple-200';
    };

    const getActionIcon = (log: Log) => {
        if (log.metadata.url === route('login')) {
            return <Key className="size-4.5" />;
        }

        if (log.metadata.url === route('logout')) {
            return <DoorOpen className="size-4.5" />;
        }

        if (log.status_code && log.status_code >= 400) {
            return <Ban className="size-4.5" />;
        }

        return <NotebookPen className="size-4.5" />;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatExecutionTime = (time: number | null) => {
        if (!time) return 'N/A';
        if (time < 1000) return `${time.toFixed(0)}ms`;
        return `${(time / 1000).toFixed(2)}s`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoreo" />

            <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-white to-purple-100">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mr-4">
                                <Logs className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Monitoreo de Actividad</h1>
                                <p className="mt-1 text-sm text-gray-600">Registro de acciones y eventos de usuarios. ({logsCount} registros)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por acción, ruta o IP..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-80 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                                />
                            </div>
                            <Button className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                                <Filter className="w-4 h-4" />
                                Filtros
                            </Button>
                        </div>
                    </div>

                    {logs.length > 0 ? (
                        <div className="rounded-2xl">
                            {Object.entries(groupedLogs).map(([userId, { user, logs: userLogs }], index) => {
                                const isExpanded = expandedUsers.has(userId);
                                const lastLog = userLogs[0];
                                const isFirst = index === 0;
                                const isLast = index === Object.entries(groupedLogs).length - 1;
                                const previousUserId = index > 0 ? Object.keys(groupedLogs)[index - 1] : null;
                                const isPreviousExpanded = previousUserId ? expandedUsers.has(previousUserId) : false;

                                return (
                                    <motion.div 
                                        key={userId}
                                        animate={{ 
                                            marginBottom: isExpanded ? '1rem' : '0rem',
                                            borderBottomLeftRadius: isLast || isExpanded ? '1rem' : '0rem', // rounded-b-2xl = 1rem
                                            borderBottomRightRadius: isLast || isExpanded ? '1rem' : '0rem',
                                            borderTopLeftRadius: isFirst ? '1rem' : isPreviousExpanded ? '1rem' : '0rem',
                                            borderTopRightRadius: isFirst ? '1rem' : isPreviousExpanded ? '1rem' : '0rem',
                                        }}
                                        transition={{ 
                                            duration: 0.3, 
                                            ease: "easeInOut" 
                                        }}
                                        className={`
                                            bg-white border border-purple-100 shadow-sm overflow-hidden 
                                            ${isPreviousExpanded && !isFirst ? 'border-t' : isFirst ? '' : 'border-t-0'}
                                        `}
                                    >
                                        <button
                                            onClick={() => toggleUser(userId)}
                                            className="w-full px-6 py-4 flex items-center gap-2 hover:bg-purple-50/50 transition-colors duration-200"
                                        >
                                            <div className="flex mr-2 items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </motion.div>
                                            </div>

                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold shadow-md">
                                                {user?.name?.charAt(0).toUpperCase() || 'G'}
                                            </div>

                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        {user?.name || 'Usuario Invitado'}
                                                    </h3>
                                                    <span className="px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                                                        {userLogs.length === 1 ? 'última actividad' : `últimas ${userLogs.length} actividades`}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {user?.email || 'Sin email'}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                {userLogs.some(log => log.is_broadcasted) && (
                                                    <div className="flex items-center gap-1 bg-blue-400 text-white px-2 py-0.5 rounded-full">
                                                        <Zap className="w-4 h-4" />
                                                        <span>Nuevo</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4" />
                                                    <span>{lastLog.action}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(lastLog.created_at)}</span>
                                                </div>
                                                <Link
                                                    href={route('logs.user', userId)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1 px-3 py-1.5 font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors duration-200"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Ver todos
                                                </Link>
                                            </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ 
                                                        height: "auto", 
                                                        opacity: 1,
                                                        transition: {
                                                            height: {
                                                                duration: 0.4,
                                                                ease: "easeInOut"
                                                            },
                                                            opacity: {
                                                                duration: 0.3,
                                                                delay: 0.1
                                                            }
                                                        }
                                                    }}
                                                    exit={{ 
                                                        height: 0, 
                                                        opacity: 0,
                                                        transition: {
                                                            height: {
                                                                duration: 0.3,
                                                                ease: "easeInOut"
                                                            },
                                                            opacity: {
                                                                duration: 0.2
                                                            }
                                                        }
                                                    }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div className="bg-gradient-to-b from-gray-50 to-white">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead className="bg-gray-100/80 backdrop-blur-sm">
                                                                    <tr>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Acción
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Ruta
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            IP
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Estado
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Tiempo
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Fecha
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {userLogs.map((log) => (
                                                                        <tr 
                                                                            key={log.id} 
                                                                            className="hover:bg-purple-50/30 transition-colors duration-200"
                                                                        >
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-lg">
                                                                                        {getActionIcon(log)}
                                                                                    </span>
                                                                                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getActionColor(log)}`}>
                                                                                        {log.action}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                                    <Link2 className="w-4 h-4 text-gray-400" />
                                                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                                        {log.metadata.url || 'N/A'}
                                                                                    </code>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                    <Monitor className="w-4 h-4 text-gray-400" />
                                                                                    <span className="font-mono text-xs">
                                                                                        {log.ip_address || 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                {log.status_code && (
                                                                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                                                                        log.status_code < 300 
                                                                                            ? 'text-green-700 bg-green-100' 
                                                                                            : log.status_code < 400
                                                                                            ? 'text-blue-700 bg-blue-100'
                                                                                            : 'text-red-700 bg-red-100'
                                                                                    }`}>
                                                                                        {log.status_code}
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                                                                    <span className="font-mono text-xs">
                                                                                        {formatExecutionTime(log.execution_time)}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {formatDate(log.created_at)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-1">
                                No hay registros de actividad
                            </h3>
                            <p className="text-base text-gray-500">
                                Los registros de actividad aparecerán aquí cuando los usuarios realicen acciones.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}