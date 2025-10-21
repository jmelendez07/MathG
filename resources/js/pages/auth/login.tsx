import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Crown, Sparkles, Shield, Sword, Eye, EyeOff, Swords, ShieldPlus, LogIn } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public-layout';
import { SharedData } from '@/types';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { name } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();

        const handleMouseMove = (e: MouseEvent) => {
            if (isTouchDevice) return;
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isTouchDevice]);

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
                <Head title="Iniciar Sesión" />
                
                {!isTouchDevice && (
                    <div 
                        className="fixed w-4 h-4 bg-purple-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
                        style={{
                            left: mousePosition.x - 8,
                            top: mousePosition.y - 8,
                            transform: `scale(${mousePosition.x > 0 ? 1.2 : 1})`
                        }}
                    />
                )}

                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 text-purple-300/20">
                        <Crown className="w-32 h-32 animate-pulse" />
                    </div>
                    <div className="absolute top-20 right-20 text-purple-400/20">
                        <Sword className="w-24 h-24 rotate-45 animate-bounce" />
                    </div>
                    <div className="absolute bottom-20 left-20 text-purple-300/20">
                        <Shield className="w-28 h-28 animate-pulse delay-1000" />
                    </div>
                    <div className="absolute bottom-10 right-10 text-purple-400/20">
                        <Sparkles className="w-20 h-20 animate-spin" />
                    </div>
                    <div className="absolute top-1/4 left-1/3">
                        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <div className="absolute top-1/3 right-1/4">
                        <Sparkles className="w-3 h-3 text-purple-300 animate-pulse delay-500" />
                    </div>
                    <div className="absolute bottom-1/3 left-1/4">
                        <Sparkles className="w-5 h-5 text-purple-500 animate-pulse delay-1000" />
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen p-3 md:p-6">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <Link href={route('home')} className="flex items-center justify-center mb-0">
                                <Swords className="w-12 h-12 text-purple-300 mr-3 animate-pulse" />
                                <h1 className="text-6xl font-jersey lg:text-8xl text-white">{name}</h1>
                                <ShieldPlus className="w-12 h-12 text-purple-300 ml-3 animate-pulse" />
                            </Link>
                            <h2 className="text-2xl font-jersey md:text-3xl text-purple-200 mb-2">Bienvenido, Héroe</h2>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-purple-300/30 rounded-2xl py-8 px-4 md:p-8 shadow-2xl">
                            <form className="space-y-6" onSubmit={submit}>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-jersey text-xl leading-4 tracking-wider text-purple-100">
                                        Correo Electrónico
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                            className="font-jersey text-lg md:text-xl leading-4 tracking-wider font-extralight bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl h-12"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="font-jersey text-xl leading-4 tracking-wider text-purple-100">
                                            Contraseña
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink 
                                                href={route('password.request')} 
                                                className="font-jersey leading-4 tracking-wider text-sm text-purple-300 hover:text-purple-200 transition-colors"
                                                tabIndex={5}
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Contraseña"
                                            className="font-jersey text-lg md:text-xl leading-4 tracking-wider font-extralight bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl h-12 pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-200 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                        className="border-purple-300/50 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                    />
                                    <Label htmlFor="remember" className="text-purple-100 leading-4 cursor-pointer font-jersey text-base md:text-lg tracking-wider">
                                        Recuérdame
                                    </Label>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-jersey text-xl tracking-wider md:text-2xl py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer h-12" 
                                    tabIndex={4} 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                            <span>Accediendo...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <LogIn className="w-5 h-5" />
                                            <span>Iniciar Aventura</span>
                                        </div>
                                    )}
                                </Button>

                                <div className="text-center flex flex-col items-center">
                                    <span className="text-purple-300 font-jersey tracking-widest leading-4">¿No tienes una cuenta? </span>
                                    <TextLink 
                                        href={route('register')} 
                                        className="text-purple-100 hover:text-white tracking-widest leading-4 text-lg transition-colors font-jersey"
                                        tabIndex={5}
                                    >
                                        Únete a la aventura aquí
                                    </TextLink>
                                </div>
                            </form>

                            {status && (
                                <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                                    <div className="text-center text-sm font-medium text-green-300">{status}</div>
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-purple-300 font-[100] tracking-wider font-jersey text-lg">
                                Prepárate para una experiencia épica
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
        </PublicLayout>
    );
}
