import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, Activity, BarChart3, TrendingUp, Rocket, Download, FileImage, FileDown } from 'lucide-react';
import { usePoll } from '@inertiajs/react';
import { Difficulty } from '@/types/exercise';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBarChart, RadialBar, Legend, PolarAngleAxis } from 'recharts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useChartExport from '@/hooks/use-chart-export';

interface SessionData {
    date: string;
    count: number;
}

interface IProfilesPerPlanetProps {
    id: string;
    name: string;
    profiles_count: number;
}

interface IDashboardProps {
    users: number;
    sessions: number;
    difficulties: Difficulty[];
    averageProgress: number;
    sessionsLastMonth: SessionData[];
    profilesPerPlanet: IProfilesPerPlanetProps[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Control',
        href: route('dashboard'),
    },
];

export default function Dashboard({ users, sessions, difficulties, averageProgress, sessionsLastMonth, profilesPerPlanet }: IDashboardProps) {
    const { exportAsImage, exportDashboardCompleteImage } = useChartExport();

    const planetColors = ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#3b0764'];

    const totalProfiles = profilesPerPlanet.reduce((sum, planet) => sum + planet.profiles_count, 0);
    
    const planetProgress = profilesPerPlanet.map((planet, index) => ({
        name: planet.name,
        students: planet.profiles_count,
        fill: planetColors[index % planetColors.length],
        percentage: totalProfiles > 0 ? Math.round((planet.profiles_count / totalProfiles) * 100) : 0
    }));

    const handleExportDashboard = () => {
        exportDashboardCompleteImage('dashboard-content', 'dashboard-completo');
    };

    usePoll(10000);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <style>{`
                .recharts-surface:focus {
                    outline: none !important;
                }
                .recharts-wrapper:focus {
                    outline: none !important;
                }
            `}</style>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end">
                    <Button 
                        variant="default" 
                        className="cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700"
                        onClick={handleExportDashboard}
                    >
                        <FileImage className="h-4 w-4" />
                        Exportar Dashboard
                    </Button>
                </div>

                <div id="dashboard-content" className="flex flex-col gap-4">
                    {/* KPIs */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        <Link href={route('users.index')}>
                            <Card className="border-purple-200 dark:border-purple-900 h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Usuarios
                                    </CardTitle>
                                    <Users className="size-5 text-purple-600 dark:text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                                        {users.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Usuarios registrados
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href={route('users.index')}>
                            <Card className="border-purple-200 dark:border-purple-900 h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Sesiones
                                    </CardTitle>
                                    <Activity className="size-5 text-purple-600 dark:text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                                        {sessions.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Sesiones activas
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href={route('exercises.index')}>
                            <Card className="border-purple-200 dark:border-purple-900 h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                                    <CardTitle className="text-sm font-medium">
                                        Ejercicios por Dificultad
                                    </CardTitle>
                                    <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        { difficulties.map(difficulty => {
                                            return (
                                                <div key={difficulty.id} className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">{difficulty.name}</span>
                                                    <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">{difficulty.exercises.length}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Card className="border-purple-200 dark:border-purple-900">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Progreso Promedio
                                </CardTitle>
                                <TrendingUp className="size-5 text-purple-600 dark:text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                                    {averageProgress}%
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    De estudiantes
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-purple-200 dark:border-purple-900 pb-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">
                                            Sesiones de los Últimos 30 Días
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Actividad diaria de sesiones
                                        </p>
                                    </div>
                                    <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8">
                                        <Download className="h-4 w-4" onClick={() => exportAsImage('sessions-chart', 'sesiones-ultimos-30-dias')} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent id="sessions-chart">
                                {sessionsLastMonth && sessionsLastMonth.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <AreaChart data={sessionsLastMonth}>
                                            <defs>
                                                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="rgb(168 85 247)" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="rgb(168 85 247)" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                            <XAxis 
                                                dataKey="date" 
                                                className="text-xs"
                                                tick={{ fill: 'currentColor', fontSize: 11 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={50}
                                            />
                                            <YAxis
                                                className="text-xs"
                                                tick={{ fill: 'currentColor', fontSize: 11 }}
                                                width={20}
                                                axisLine={false}
                                                tickLine={false}
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'hsl(var(--background))',
                                                    border: '1px solid rgb(168 85 247)',
                                                    borderRadius: '0.5rem',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                                labelStyle={{ 
                                                    color: 'hsl(var(--foreground))',
                                                    fontWeight: 600 
                                                }}
                                                itemStyle={{
                                                    color: 'rgb(168 85 247)'
                                                }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="rgb(168 85 247)"
                                                strokeWidth={2}
                                                fill="url(#colorSessions)"
                                                name="Sesiones"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                                        <p>No hay datos de sesiones disponibles</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 dark:border-purple-900 pb-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">
                                            Distribución por Planeta
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Estudiantes activos en cada nivel
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Rocket className="size-8 text-purple-600 dark:text-purple-400" />
                                        <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8" onClick={() => exportAsImage('planet-chart', 'distribucion-por-planeta')}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent id="planet-chart">
                                {planetProgress && planetProgress.length > 0 ? (
                                    <>
                                        <div className="hidden md:block">
                                            <ResponsiveContainer width="100%" height={350}>
                                                <RadialBarChart 
                                                    cx="50%" 
                                                    cy="50%" 
                                                    innerRadius="10%" 
                                                    outerRadius="90%" 
                                                    data={planetProgress}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <PolarAngleAxis 
                                                        type="number" 
                                                        domain={[0, 100]} 
                                                        angleAxisId={0}
                                                        tick={false}
                                                    />
                                                    <RadialBar
                                                        background
                                                        dataKey="percentage"
                                                        cornerRadius={10}
                                                        label={{ 
                                                            position: 'insideStart', 
                                                            fill: '#fff',
                                                            fontSize: 14,
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                    <Legend 
                                                        iconSize={10}
                                                        layout="vertical"
                                                        verticalAlign="middle"
                                                        align="right"
                                                        formatter={(value, entry: any) => {
                                                            const data = entry.payload;
                                                            return (
                                                                <span className="text-sm">
                                                                    <span className="font-semibold">{data.name}</span>
                                                                    <br />
                                                                    <span className="text-muted-foreground">{data.students} estudiantes</span>
                                                                </span>
                                                            );
                                                        }}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: 'hsl(var(--background))',
                                                            border: '1px solid rgb(168 85 247)',
                                                            borderRadius: '0.5rem',
                                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                        }}
                                                        formatter={(value: any, name: any, props: any) => {
                                                            return [
                                                                `${props.payload.students} estudiantes (${value}%)`,
                                                                props.payload.name
                                                            ];
                                                        }}
                                                    />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        
                                        <div className="block md:hidden">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <RadialBarChart 
                                                    cx="50%" 
                                                    cy="45%" 
                                                    innerRadius="15%" 
                                                    outerRadius="80%" 
                                                    data={planetProgress}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <PolarAngleAxis 
                                                        type="number" 
                                                        domain={[0, 100]} 
                                                        angleAxisId={0}
                                                        tick={false}
                                                    />
                                                    <RadialBar
                                                        background
                                                        dataKey="percentage"
                                                        cornerRadius={10}
                                                        label={{ 
                                                            position: 'insideStart', 
                                                            fill: '#fff',
                                                            fontSize: 12,
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: 'hsl(var(--background))',
                                                            border: '1px solid rgb(168 85 247)',
                                                            borderRadius: '0.5rem',
                                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                        }}
                                                        formatter={(value: any, name: any, props: any) => {
                                                            return [
                                                                `${props.payload.students} estudiantes (${value}%)`,
                                                                props.payload.name
                                                            ];
                                                        }}
                                                    />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                            
                                            <div className="mt-4 space-y-2">
                                                {planetProgress.map((planet, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div 
                                                                className="w-3 h-3 rounded-full" 
                                                                style={{ backgroundColor: planet.fill }}
                                                            />
                                                            <span className="text-sm font-semibold">{planet.name}</span>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {planet.students} estudiantes ({planet.percentage}%)
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                                        <p>No hay datos de planetas disponibles</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="border-purple-200 dark:border-purple-900 pb-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Reporte Power BI
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Análisis detallado de datos
                        </p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative w-full" style={{ paddingTop: '56.25%'}}>
                            <iframe
                                title="Power BI Report"
                                src="https://app.powerbi.com/view?r=eyJrIjoiOTlmYWE5OGYtYWFmYi00NTI2LWE0NWQtOGVhMDZhMTU0YzhjIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"
                                className="absolute top-0 left-0 w-full h-full border-0 rounded-b-lg"
                                {...({ allowFullScreen: true } as React.IframeHTMLAttributes<HTMLIFrameElement>)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-40 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
