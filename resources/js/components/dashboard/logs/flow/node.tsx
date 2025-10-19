import { Activity, Ban, Clock, DoorOpen, Key, Monitor, NotebookPen, TrendingUp } from "lucide-react";
import Log from "@/types/log";

interface LogNodeProps {
    log: Log;
}

export default function LogNode({ log }: LogNodeProps) {
    const getActionColor = (log: Log) => {
        if (log.metadata.url === route('login')) {
            return { bg: '#dcfce7', border: '#86efac', text: '#166534' };
        }

        if (log.metadata.url === route('logout')) {
            return { bg: '#fed7aa', border: '#fdba74', text: '#9a3412' };
        }

        if (log.action.includes('Error') || log.action.includes('error') || (log.status_code && log.status_code >= 400)) {
            return { bg: '#fecaca', border: '#f87171', text: '#991b1b' };
        }

        return { bg: '#e9d5ff', border: '#c084fc', text: '#6b21a8' };
    };

    const colors = getActionColor(log);
    
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="px-4 py-3 w-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg flex-shrink-0" style={{ color: colors.text }}>
                    {
                        log.metadata.url === route('login') ? (<Key className="size-4.5" />) : 
                        log.metadata.url === route('logout') ? (<DoorOpen className="size-4.5" />) : 
                        log.action.includes('error') ? <Ban className="size-4.5" /> 
                        : <NotebookPen className="size-4.5" />
                    }
                </span>
                <span className="font-semibold text-sm break-words" style={{ color: colors.text }}>
                    {log.action}
                </span>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="break-words">{formatDate(log.created_at)}</span>
                </div>
                
                {log.ip_address && (
                    <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3 flex-shrink-0" />
                        <code className="bg-gray-100 px-1 rounded break-all">{log.ip_address}</code>
                    </div>
                )}
                
                {log.execution_time && (
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 flex-shrink-0" />
                        <span>
                            {log.execution_time < 1000 
                                ? `${log.execution_time.toFixed(0)}ms` 
                                : `${(log.execution_time / 1000).toFixed(2)}s`}
                        </span>
                    </div>
                )}
                
                {log.status_code && (
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 flex-shrink-0" />
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                            log.status_code < 300 
                                ? 'text-green-700 bg-green-100' 
                                : log.status_code < 400
                                ? 'text-blue-700 bg-blue-100'
                                : 'text-red-700 bg-red-100'
                        }`}>
                            {log.status_code}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function getLogActionColor(log: Log) {
    if (log.metadata.url === route('login')) {
        return { bg: '#dcfce7', border: '#86efac', text: '#166534' };
    }

    if (log.metadata.url === route('logout')) {
        return { bg: '#fed7aa', border: '#fdba74', text: '#9a3412' };
    }

    if (log.action.includes('Error') || log.action.includes('error') || (log.status_code && log.status_code >= 400)) {
        return { bg: '#fecaca', border: '#f87171', text: '#991b1b' };
    }

    return { bg: '#e9d5ff', border: '#c084fc', text: '#6b21a8' };
}