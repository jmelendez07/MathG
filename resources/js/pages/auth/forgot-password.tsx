// Components
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Crown, Sparkles, Shield, Sword, Mail, Swords, ShieldPlus, Send } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public-layout';
import { SharedData } from '@/types';

export default function ForgotPassword({ status }: { status?: string }) {
    const { name } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 relative overflow-hidden">
                <Head title="¿Has olvidado tu contraseña?" />
                
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
                    <div className="absolute top-10 left-10 text-indigo-300/20">
                        <Shield className="w-32 h-32 animate-pulse" />
                    </div>
                    <div className="absolute top-20 right-20 text-purple-400/20">
                        <Sword className="w-24 h-24 rotate-45 animate-bounce" />
                    </div>
                    <div className="absolute bottom-20 left-20 text-indigo-300/20">
                        <Crown className="w-28 h-28 animate-pulse delay-1000" />
                    </div>
                    <div className="absolute bottom-10 right-10 text-purple-400/20">
                        <Sparkles className="w-20 h-20 animate-spin" />
                    </div>
                    <div className="absolute top-1/4 left-1/3">
                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="absolute top-1/3 right-1/4">
                        <Sparkles className="w-3 h-3 text-purple-300 animate-pulse delay-500" />
                    </div>
                    <div className="absolute bottom-1/3 left-1/4">
                        <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse delay-1000" />
                    </div>
                    <div className="absolute bottom-1/4 right-1/3">
                        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse delay-700" />
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen p-3 md:p-6">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <Link href={route('home')} className="flex items-center justify-center">
                                <Swords className="w-12 h-12 text-indigo-300 mr-3 animate-pulse" />
                                <h1 className="text-6xl font-jersey lg:text-8xl text-white">{name}</h1>
                                <ShieldPlus className="w-12 h-12 text-purple-300 ml-3 animate-pulse" />
                            </Link>
                            <h2 className="text-xl px-2 font-jersey md:text-3xl text-purple-200 mb-2 tracking-wider">Recupera tu Cuenta</h2>
                            <p className="text-purple-300 font-jersey text-sm md:text-base tracking-wide">
                                Ingresa tu correo y te enviaremos un enlace mágico
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-indigo-300/30 rounded-2xl py-8 px-4 md:p-8 shadow-2xl">
                            {status && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl animate-pulse">
                                    <div className="text-center font-medium text-green-300 font-jersey text-lg tracking-wider">
                                        {status}
                                    </div>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={submit}>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-jersey text-xl leading-4 tracking-wider text-purple-100">
                                        Correo Electrónico
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                            className="font-jersey text-lg md:text-xl leading-4 tracking-wider font-extralight bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl h-12 pr-12"
                                            disabled={processing}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <InputError className="text-red-400 !leading-4 font-jersey text-lg" message={errors.email} />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-jersey text-xl tracking-wider md:text-2xl py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer h-12" 
                                    tabIndex={2} 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                            <span>Enviando enlace...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Send className="w-5 h-5" />
                                            <span>Enviar Enlace Mágico</span>
                                        </div>
                                    )}
                                </Button>

                                <div className="text-center flex flex-col items-center pt-2">
                                    <span className="text-purple-300 font-jersey tracking-widest leading-4">¿Recordaste tu contraseña?</span>
                                    <TextLink 
                                        href={route('login')} 
                                        className="text-purple-100 hover:text-white tracking-widest leading-4 text-lg transition-colors font-jersey"
                                        tabIndex={3}
                                    >
                                        Regresa al inicio de sesión
                                    </TextLink>
                                </div>
                            </form>
                        </div>

                        <div className="text-center mt-8">
                            <div className="flex items-center justify-center space-x-2">
                                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                                <p className="text-purple-300 font-[100] tracking-wider font-jersey text-lg">
                                    Tu aventura te espera
                                </p>
                                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse delay-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
        </PublicLayout>
    );
}
