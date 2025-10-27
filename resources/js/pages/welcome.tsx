import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Crown, 
    Sparkles, 
    Shield, 
    Sword, 
    Calculator, 
    Trophy, 
    Star, 
    Zap,
    Users,
    Target,
    ChevronDown,
    ChevronUp,
    Play,
    ArrowRight,
    Gamepad2,
    Medal,
    Swords,
    ShieldPlus,
    Menu,
    X,
    LogIn
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import PublicLayout from '@/layouts/public-layout';
import Typewriter from '@/components/typewriter';
import { useDraggable } from '@/hooks/use-draggable';
import { Roles } from '@/enums/roles';
import Chatbot from '@/components/chat-bot';

export default function Welcome() {
    const { auth, name } = usePage<SharedData>().props;
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [showTypewriter, setShowTypewriter] = useState(true);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const swordDrag = useDraggable({
        initialPosition: { 
            x: typeof window !== 'undefined' ? window.innerWidth - 160 : 300, 
            y: 160 
        },
    });

    const zapDrag = useDraggable({
        initialPosition: { 
            x: 120,
            y: 140
        },
    });

    useEffect(() => {
        setIsVisible(true);
        
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();

        const handleMouseMove = (e: MouseEvent) => {
            if (!isTouchDevice) {
                setMousePosition({ x: e.clientX, y: e.clientY });
            }
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setShowScrollToTop(currentScrollY > window.innerHeight * 0.5);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isTouchDevice]);

    const features = [
        {
            icon: Calculator,
            title: "Matemáticas Épicas",
            description: "Resuelve problemas matemáticos en aventuras pixelart únicas",
            color: "from-purple-500 to-indigo-600"
        },
        {
            icon: Trophy,
            title: "Logros Legendarios",
            description: "Desbloquea logros y conviértete en el maestro matemático",
            color: "from-indigo-500 to-purple-600"
        },
        {
            icon: Gamepad2,
            title: "Gameplay Adictivo",
            description: "Mecánicas de juego que hacen las matemáticas divertidas",
            color: "from-purple-600 to-pink-600"
        },
        {
            icon: Users,
            title: "Multijugador",
            description: "Compite con otros héroes en desafíos matemáticos",
            color: "from-indigo-600 to-purple-500"
        }
    ];

    const stats = [
        { icon: Users, label: "Héroes Registrados", value: "10,000+" },
        { icon: Calculator, label: "Problemas Resueltos", value: "1M+" },
        { icon: Trophy, label: "Logros Desbloqueados", value: "50,000+" },
        { icon: Star, label: "Puntuación Promedio", value: "4.9/5" }
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToNextSection = () => {
        const nextSection = document.querySelector('#features-section');
        if (nextSection) {
            nextSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
        <PublicLayout>
            <Head title={`${name} - Aventuras Matemáticas Épicas`}>
                <meta
                    name="description"
                    content={`Únete a ${name} y vive aventuras épicas mientras resuelves problemas matemáticos en un mundo pixelart único`}
                />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
                {!isTouchDevice && (
                    <div
                        className="pointer-events-none fixed z-50 h-4 w-4 rounded-full bg-purple-400 mix-blend-difference transition-transform duration-100"
                        style={{
                            left: mousePosition.x - 8,
                            top: mousePosition.y - 8,
                            transform: `scale(${mousePosition.x > 0 ? 1.2 : 1})`,
                        }}
                    />
                )}

                <div className="absolute inset-0 overflow-hidden">
                    <div
                        ref={zapDrag.dragRef}
                        className={`absolute z-30 cursor-grab text-purple-300/20 transition-all duration-300 active:cursor-grabbing ${
                            zapDrag.isDragging ? 'scale-110 text-purple-300/40' : 'hover:scale-105 hover:text-purple-300/30'
                        }`}
                        style={{
                            left: zapDrag.position.x - 64,
                            top: zapDrag.position.y - 64,
                            transform: `rotate(${zapDrag.isDragging ? scrollY * 0.05 : scrollY * 0.05}deg)`,
                            transition: zapDrag.isDragging ? 'none' : 'transform 1000ms',
                        }}
                        onMouseDown={zapDrag.handleMouseDown}
                        onTouchStart={zapDrag.handleTouchStart}
                    >
                        <Zap className={`h-32 w-32 transition-all ${zapDrag.isDragging ? 'animate-none duration-300' : 'animate-pulse'}`} />

                        {!zapDrag.isDragging && (
                            <div className="absolute -inset-2 rounded-lg border-2 border-dashed border-purple-300/20 opacity-0 transition-opacity duration-300 hover:opacity-100">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-1 text-xs whitespace-nowrap text-purple-300">
                                    Arrastra el rayo ⚡
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        ref={swordDrag.dragRef}
                        className={`absolute z-30 cursor-grab text-indigo-400/20 transition-all duration-300 active:cursor-grabbing ${
                            swordDrag.isDragging ? 'scale-110 text-indigo-400/40' : 'hover:scale-105 hover:text-indigo-400/30'
                        }`}
                        style={{
                            left: swordDrag.position.x - 56,
                            top: swordDrag.position.y - 56,
                            transform: `rotate(${swordDrag.isDragging ? 45 + scrollY * 0.03 : 45 - scrollY * 0.03}deg)`,
                            transition: swordDrag.isDragging ? 'none' : 'transform 1000ms',
                        }}
                        onMouseDown={swordDrag.handleMouseDown}
                        onTouchStart={swordDrag.handleTouchStart}
                    >
                        <Sword className={`h-28 w-28 transition-all ${swordDrag.isDragging ? 'animate-none duration-300' : 'animate-bounce'}`} />

                        {!swordDrag.isDragging && (
                            <div className="absolute -inset-2 rounded-lg border-2 border-dashed border-indigo-400/20 opacity-0 transition-opacity duration-300 hover:opacity-100">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-1 text-xs whitespace-nowrap text-indigo-300">
                                    Arrastra la espada 🗡️
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="absolute bottom-40 left-10 text-purple-300/20 transition-transform duration-1000"
                        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                    >
                        <Shield className="h-36 w-36 animate-pulse delay-1000" />
                    </div>
                    <div
                        className="absolute right-32 bottom-20 text-indigo-400/20 transition-transform duration-1000"
                        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
                    >
                        <Calculator className="h-24 w-24 animate-spin" />
                    </div>

                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute animate-pulse`}
                            style={{
                                top: `${20 + i * 5}%`,
                                left: `${10 + i * 7}%`,
                                animationDelay: `${i * 0.5}s`,
                                transform: `translateY(${scrollY * (0.02 + i * 0.01)}px)`,
                            }}
                        >
                            <Sparkles className={`w-${3 + (i % 3)} h-${3 + (i % 3)} text-purple-${300 + (i % 3) * 100} opacity-60`} />
                        </div>
                    ))}

                    <div className="absolute top-0 left-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 animate-pulse rounded-full bg-indigo-500/20 blur-3xl delay-1000" />
                    <div className="absolute top-1/2 left-1/2 h-64 w-64 animate-pulse rounded-full bg-pink-500/10 blur-2xl delay-500" />
                </div>

                <header className="relative z-20 p-6">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between">
                        <div
                            className={`flex items-center space-x-3 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                        >
                            <Crown className="size-6 md:h-10 md:w-10 animate-pulse text-purple-300" />
                            <h1 className="font-jersey text-3xl leading-6 lg:text-4xl text-white">{name}</h1>
                        </div>

                        <div
                            className={`hidden md:flex items-center space-x-4 transition-all delay-200 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                        >
                            {auth.user ? (
                                <Link
                                    href={
                                        auth.user.roles.some((r) => r.name === Roles.Admin)
                                            ? route('dashboard')
                                            : auth.user.roles.some((r) => r.name === Roles.Teacher)
                                              ? route('rooms.index')
                                              : auth.user.roles.some((r) => r.name === Roles.Student)
                                                ? route('gameplay.index')
                                                : '#'
                                    }
                                >
                                    <Button className="transform cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-purple-500/25">
                                        { auth.user.roles.some(r => r.name === Roles.Student) 
                                            ? (<Play className="mr-0.5 h-4 w-4" />) 
                                            : (<Shield className="mr-0.5 h-4 w-4" />)
                                        }
                                        {auth.user.roles.some(r => r.name === Roles.Student) ? 'Seguir Jugando' : 'Panel'}
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button
                                            variant="ghost"
                                            className="font-jersey text-xl cursor-pointer tracking-wider rounded-xl px-4 py-2 text-purple-200 transition-all duration-300 hover:bg-purple-600/20 hover:text-white"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="font-jersey text-xl tracking-wider transform cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-purple-500/25">
                                            <Crown className="mr-2 h-4 w-4" />
                                            Únete Ahora
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="md:hidden">
                            <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <DrawerTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-purple-300 hover:bg-purple-600/20 hover:text-white"
                                    >
                                        <Menu className="size-7" />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border-purple-500/30">
                                    <div className="px-4 pb-8">
                                        <div className="flex flex-col space-y-4">
                                            {auth.user ? (
                                                <Link
                                                    href={
                                                        auth.user.roles.some((r) => r.name === Roles.Admin)
                                                            ? route('dashboard')
                                                            : auth.user.roles.some((r) => r.name === Roles.Teacher)
                                                              ? route('rooms.index')
                                                              : auth.user.roles.some((r) => r.name === Roles.Student)
                                                                ? route('gameplay.index')
                                                                : '#'
                                                    }
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <Button className="w-full justify-start rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-jersey text-lg text-white hover:from-purple-700 hover:to-indigo-700">
                                                        { auth.user.roles.some(r => r.name === Roles.Student) 
                                                            ? (<Play className="mr-2 h-5 w-5" />) 
                                                            : (<Shield className="mr-2 h-5 w-5" />)
                                                        }
                                                        {auth.user.roles.some(r => r.name === Roles.Student) ? 'Seguir Jugando' : 'Ir al Panel'}
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link href={route('login')} onClick={() => setIsMenuOpen(false)}>
                                                        <div className="mt-6 rounded-lg bg-white/10 border-2 border-purple-400 px-4 py-2 backdrop-blur-sm">
                                                            <div className="flex items-center justify-center space-x-2 text-purple-200">
                                                                <LogIn className="size-4" />
                                                                <span className="font-jersey text-xl font-extralight tracking-wider">Iniciar Sesión</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <Link href={route('register')} onClick={() => setIsMenuOpen(false)}>
                                                        <div className="rounded-lg from-purple-600 to-indigo-600 border-2 hover:from-purple-700 hover:to-indigo-700 border-purple-400 px-4 py-2 backdrop-blur-sm">
                                                            <div className="flex items-center justify-center space-x-2 text-purple-200">
                                                                <Crown className="size-4" />
                                                                <span className="font-jersey text-xl font-extralight tracking-wider">Únete Ahora</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </nav>
                </header>

                <main className="relative z-10">
                    <section className="relative flex min-h-screen items-center justify-center px-6">
                        <div className="mx-auto max-w-6xl text-center">
                            <div
                                className={`mb-8 transition-all delay-300 duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                            >
                                <div className="mb-2 md:mb-6 flex items-center justify-center">
                                    <Swords className="mr-4 h-16 w-16 animate-pulse text-purple-300" />
                                    <h1 className="font-jersey text-7xl md:text-8xl lg:text-[10rem]">
                                        <span className="animate-pulse bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                                            {name}
                                        </span>
                                    </h1>
                                    <ShieldPlus className="ml-4 h-16 w-16 animate-pulse text-indigo-300" />
                                </div>

                                <h2 className="mb-4 font-jersey text-4xl font-extralight text-white md:text-8xl">
                                    Aventuras{' '}
                                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Matemáticas</span>{' '}
                                    Épicas
                                </h2>

                                <div className="mx-auto mb-8 flex min-h-[120px] max-w-3xl items-center justify-center text-xl leading-relaxed text-purple-200 md:text-2xl">
                                    {showTypewriter && (
                                        <Typewriter
                                            text="Sumérgete en un mundo pixelart único donde las matemáticas se convierten en aventuras épicas. Resuelve problemas, desbloquea poderes y conviértete en el héroe matemático definitivo."
                                            speed={50}
                                            className="text-xl leading-relaxed text-purple-200 md:text-2xl"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div
                                className={`mb-16 flex flex-col items-center justify-center gap-6 transition-all delay-500 duration-1500 sm:flex-row ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                            >
                                {!auth.user && (
                                    <Link href={route('register')}>
                                        <Button className="group transform cursor-pointer tracking-wider font-extralight rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 !px-6 py-4 font-jersey text-xl text-white transition-all duration-300 hover:scale-110 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-purple-500/50 md:text-2xl">
                                            Comenzar Aventura
                                            <ArrowRight className="ml-1 h-6 w-6 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                )}

                                <Button
                                    variant="outline"
                                    className="md:text-1xl transform cursor-pointer rounded-2xl border-2 border-purple-400 bg-white/10 px-8 py-4 font-jersey text-lg text-purple-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-white"
                                >
                                    <Target className="mr-3 h-6 w-6" />
                                    Ver Demo
                                </Button>
                            </div>

                            {/* Indicador de scroll */}
                            <div
                                className={`animate-bounce cursor-pointer transition-all delay-700 duration-1500 hover:scale-110 hover:text-purple-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                                onClick={scrollToNextSection}
                            >
                                <ChevronDown className="mx-auto h-8 w-8 text-purple-300 hover:animate-pulse" />
                                <p className="mt-2 font-jersey text-lg text-purple-300 md:text-2xl leading-4 tracking-wider">Descubre más</p>
                            </div>
                        </div>
                    </section>

                    {/* ✅ Features Section con ID para el scroll */}
                    <section id="features-section" className="bg-black/20 px-6 py-20 backdrop-blur-sm">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-16 text-center">
                                <h3 className="mb-6 font-jersey text-6xl text-white md:text-7xl">
                                    ¿Por qué elegir{' '}
                                    <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{name}</span>?
                                </h3>
                                <p className="mx-auto max-w-3xl text-xl text-purple-200">
                                    Descubre las características que hacen de {name} la experiencia definitiva para aprender matemáticas
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group transform rounded-2xl border border-purple-300/30 bg-white/10 p-6 backdrop-blur-lg transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-purple-500/25"
                                        style={{
                                            animationDelay: `${index * 0.2}s`,
                                        }}
                                    >
                                        <div
                                            className={`h-16 w-16 bg-gradient-to-br ${feature.color} mb-6 flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:animate-pulse`}
                                        >
                                            <feature.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h4 className="font-jersey md:text-2xl mb-3 text-xl text-white transition-colors group-hover:text-purple-200">
                                            {feature.title}
                                        </h4>
                                        <p className="text-purple-200 transition-colors group-hover:text-purple-100">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="px-6 py-20">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-16 text-center">
                                <h3 className="font-jersey mb-6 text-4xl md:text-7xl text-white">
                                    Números que{' '}
                                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Impresionan</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="group text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 group-hover:animate-bounce">
                                            <stat.icon className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="font-jersey mb-2 text-3xl  text-white transition-colors group-hover:text-purple-300 md:text-4xl">
                                            {stat.value}
                                        </div>
                                        <div className="font-medium text-purple-300">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 px-6 py-20 backdrop-blur-sm">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-8">
                                <Medal className="mx-auto mb-6 h-24 w-24 animate-pulse text-purple-300" />
                                <h3 className="font-jersey mb-6 text-4xl md:text-6xl text-white">
                                    ¿Listo para la{' '}
                                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Aventura</span>?
                                </h3>
                                <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-200">
                                    Únete a miles de héroes que ya están viviendo aventuras matemáticas épicas. Tu leyenda comienza aquí.
                                </p>
                            </div>

                            {!auth.user && (
                                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                                    <Link href={route('register')}>
                                        <Button className="font-jersey group transform rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-10 py-4 text-xl text-white transition-all duration-300 hover:scale-110 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-purple-500/50">
                                            <Crown className="mr-3 h-6 w-6 group-hover:animate-spin" />
                                            Crear mi Leyenda
                                            <Sparkles className="ml-3 h-6 w-6 group-hover:animate-pulse" />
                                        </Button>
                                    </Link>

                                    <Link href={route('login')}>
                                        <Button
                                            variant="outline"
                                            className="font-jersey transform rounded-2xl border-2 border-purple-400 bg-white/10 px-8 py-4 text-lg text-purple-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-white"
                                        >
                                            <Shield className="mr-3 h-6 w-6" />
                                            Ya soy un Héroe
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="relative z-10 bg-black/40 px-6 py-12 backdrop-blur-sm">
                    <div className="mx-auto max-w-6xl text-center">
                        <div className="mb-6 flex items-center justify-center">
                            <Crown className="mr-3 h-8 w-8 animate-pulse text-purple-300" />
                            <h4 className="text-2xl font-jersey md:text-4xl text-white">{name}</h4>
                            <Crown className="ml-3 h-8 w-8 animate-pulse text-purple-300" />
                        </div>
                        <p className="mb-4 text-purple-300">Transformando las matemáticas en aventuras épicas desde 2024</p>
                        <div className="flex items-center justify-center space-x-4 text-purple-400">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <span className="text-sm">Hecho con ❤️ para futuros héroes matemáticos</span>
                            <Sparkles className="h-5 w-5 animate-pulse" />
                        </div>
                    </div>
                </footer>

                <div className="fixed right-6 bottom-23 z-50">
                    <button
                        onClick={scrollToTop}
                        className={`relative transform cursor-pointer overflow-hidden rounded-full border-2 border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl ${showScrollToTop ? 'size-14' : 'size-0 !border-0 !p-0'} `}
                        aria-label="Subir hacia arriba"
                    >
                        <ChevronUp className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 transition-all duration-300" />
                    </button>
                </div>

                <Chatbot />
            </div>
        </PublicLayout>
    );
}
