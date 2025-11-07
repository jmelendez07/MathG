import { calculateCanvasSize } from "@/components/helpers/common";
import { Application, extend, useTick } from "@pixi/react";
import { Assets, Graphics, Sprite, TextStyle, Texture, Text, Container } from "pixi.js";
import { useEffect, useRef, useState } from "react";

extend({ Sprite, Graphics, Text, Container });

const textStyle = new TextStyle({
    fontFamily: 'Jersey 10, Arial, sans-serif',
    fontSize: 80,
    fontWeight: '100',
    fill: '#efefef',
    align: 'center'
});

interface LoadingProps {
    galaxyImage?: string;
    rocketImage?: string;
    planetImage?: string;
    handleStarted: (value: boolean) => void;
    isLoaded: boolean;
    visible: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
}

interface LoadingTextProps {
    canvasWidth: number;
    canvasHeight: number;
    isLoaded: boolean;
}

function RocketSprite({ texture, canvasWidth, canvasHeight, isStarted }: { texture: Texture; canvasWidth: number; canvasHeight: number; isStarted: boolean }) {
    const spriteRef = useRef<Sprite>(null);
    const particlesGraphicsRef = useRef<Graphics>(null);
    const time = useRef(-Math.PI);
    const previousY = useRef(canvasHeight / 2);
    const previousX = useRef(0);
    const particles = useRef<Particle[]>([]);
    const scaleProgress = useRef(0);
    const [isScaling, setIsScaling] = useState(false);

    useEffect(() => {
        if (isStarted) {
            setIsScaling(true);
        }
    }, [isStarted]);

    useTick((ticker) => {
        if (spriteRef.current) {
            const rocketWidth = spriteRef.current.width;
            const rocketHeight = spriteRef.current.height;

            // Animación de escala cuando isStarted
            if (isScaling) {
                scaleProgress.current += ticker.deltaTime * 0.02;
                
                if (scaleProgress.current >= 1) {
                    scaleProgress.current = 1;
                }

                const easeProgress = 1 - Math.pow(1 - scaleProgress.current, 3);
                const startScale = 1.1; // Actualizado de 1.5 a 1.1
                const endScale = 0.3; // Reducido más para que sea más pequeño
                const currentScale = startScale + (endScale - startScale) * easeProgress;
                spriteRef.current.scale.set(currentScale, currentScale);
            }

            // Movimiento normal
            time.current += ticker.deltaTime * 0.02;
            const maxX = canvasWidth - rocketWidth / 2;
            const minX = rocketWidth / 2;
            const travelDistance = maxX - minX;
            
            const normalizedPosition = (Math.sin(time.current * 0.5) + 1) / 2;
            spriteRef.current.x = minX + (normalizedPosition * travelDistance);
            
            const newY = (canvasHeight / 2) + Math.sin(time.current * 2) * 150;
            spriteRef.current.y = newY;
            
            const velocityY = newY - previousY.current;
            const velocityX = spriteRef.current.x - previousX.current;
            const baseRotation = Math.PI / 2;
            const rotationOffset = velocityY * 0.02;
            spriteRef.current.rotation = baseRotation + rotationOffset;
            
            previousY.current = newY;
            previousX.current = spriteRef.current.x;

            const rocketX = spriteRef.current.x;
            const rocketY = spriteRef.current.y;
            const rotation = spriteRef.current.rotation;
            
            const localOffsetX = 0;
            const localOffsetY = rocketHeight / 2.5;
            
            const thrustOffsetX = localOffsetX * Math.cos(rotation) - localOffsetY * Math.sin(rotation);
            const thrustOffsetY = localOffsetX * Math.sin(rotation) + localOffsetY * Math.cos(rotation);
            
            const particleCount = isScaling ? Math.floor(40 * (1 - scaleProgress.current)) : 40;
            
            for (let i = 0; i < particleCount; i++) {
                const horizontalSpread = (Math.random() - 0.5) * rocketHeight * 0.2;
                const verticalSpread = (Math.random() - 0.5) * 10;
                const spreadX = horizontalSpread * Math.cos(rotation) - verticalSpread * Math.sin(rotation);
                const spreadY = horizontalSpread * Math.sin(rotation) + verticalSpread * Math.cos(rotation);
                
                particles.current.push({
                    x: rocketX + thrustOffsetX + spreadX,
                    y: rocketY + thrustOffsetY + spreadY,
                    vx: -Math.abs(velocityX) * 2 - (2 + Math.random() * 3) + (Math.random() - 0.5) * 2,
                    vy: -velocityY * 2 + (Math.random() - 0.5) * 4,
                    life: 1,
                    maxLife: 15 + Math.random() * 15,
                    size: 5 + Math.random() * 7
                });
            }

            if (particlesGraphicsRef.current) {
                particlesGraphicsRef.current.clear();
                
                particles.current = particles.current.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life += 1;
                    particle.vx *= 0.92;
                    particle.vy *= 0.92;
                    
                    const alpha = 1 - (particle.life / particle.maxLife);
                    
                    if (particle.life < particle.maxLife) {
                        const lifeRatio = particle.life / particle.maxLife;
                        let color;
                        if (lifeRatio < 0.3) {
                            color = 0xFFFF00;
                        } else if (lifeRatio < 0.6) {
                            color = 0xFF6600;
                        } else {
                            color = 0xFF0000;
                        }
                        
                        particlesGraphicsRef.current!.beginFill(color, alpha * 0.9);
                        particlesGraphicsRef.current!.drawCircle(particle.x, particle.y, particle.size * alpha);
                        particlesGraphicsRef.current!.endFill();
                        return true;
                    }
                    return false;
                });
            }
        }
    });

    return (
        <>
            <pixiGraphics ref={particlesGraphicsRef} draw={() => {}} />
            <pixiSprite
                ref={spriteRef}
                texture={texture}
                x={0}
                y={canvasHeight / 2}
                anchor={0.5}
                rotation={Math.PI / 2}
                scale={{ x: 1.1, y: 1.1 }}
            />
        </>
    );
}

function LoadingText({ canvasWidth, isLoaded }: LoadingTextProps) {
    const textRef = useRef<any>(null);
    const time = useRef(0);

    useTick((ticker) => {
        if (!isLoaded) {
            time.current += ticker.deltaTime * 0.05;
            const dotCount = Math.floor(time.current) % 4;
            
            if (textRef.current) {
                textRef.current.text = "Cargando" + ".".repeat(dotCount);
            }
        } else {
            if (textRef.current) {
                textRef.current.text = "Presiona la pantalla para continuar";
            }
        }
    });

    return (
        <pixiText 
            ref={textRef}
            text={isLoaded ? "Presiona la pantalla para continuar" : "Cargando"}
            x={canvasWidth / 2}
            y={50}
            style={textStyle}
            anchor={0.5}
            resolution={3}
        />
    );
}

function PlanetSprite({ texture, canvasWidth, canvasHeight, isStarted }: { texture: Texture; canvasWidth: number; canvasHeight: number; isStarted: boolean }) {
    const spriteRef = useRef<Sprite>(null);
    const [planetHeight, setPlanetHeight] = useState(0);
    const animationProgress = useRef(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const zoomProgress = useRef(0);
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        if (spriteRef.current) {
            setPlanetHeight(spriteRef.current.height);
        }
    }, [texture]);

    useEffect(() => {
        if (isStarted && !isAnimating) {
            setIsZooming(true);
        }
    }, [isStarted, isAnimating]);

    useTick((ticker) => {
        if (spriteRef.current && planetHeight === 0) {
            setPlanetHeight(spriteRef.current.height);
        }

        if (isZooming && spriteRef.current) {
            // Animación de zoom y centrado
            zoomProgress.current += ticker.deltaTime * 0.015;
            
            if (zoomProgress.current >= 1) {
                zoomProgress.current = 1;
            }

            const easeProgress = 1 - Math.pow(1 - zoomProgress.current, 2);
            
            // Mover al centro
            const startY = canvasHeight + (planetHeight / 8) - 20;
            const endY = canvasHeight / 2;
            spriteRef.current.y = startY + (endY - startY) * easeProgress;
            
            // Escalar hasta llenar la pantalla
            const startScale = 2.5;
            const endScale = Math.max(canvasWidth, canvasHeight) / (texture.width / 2);
            spriteRef.current.scale.set(
                startScale + (endScale - startScale) * easeProgress,
                startScale + (endScale - startScale) * easeProgress
            );

        } else if (isAnimating && spriteRef.current && planetHeight > 0) {
            // Animación inicial de entrada
            animationProgress.current += ticker.deltaTime * 0.02;
            
            if (animationProgress.current >= 1) {
                animationProgress.current = 1;
                setIsAnimating(false);
            }

            const easeProgress = 1 - Math.pow(1 - animationProgress.current, 3);
            
            const startY = canvasHeight + planetHeight;
            const endY = canvasHeight + (planetHeight / 8) - 20;
            
            spriteRef.current.y = startY + (endY - startY) * easeProgress;
        }
    });

    return (
        <pixiSprite
            ref={spriteRef}
            texture={texture}
            x={canvasWidth / 2}
            y={canvasHeight + planetHeight}
            anchor={0.5}
            scale={{ x: 2.5, y: 2.5 }}
        />
    );
}

function WhiteOverlay({ canvasWidth, canvasHeight, isStarted, onAnimationComplete }: { canvasWidth: number; canvasHeight: number; isStarted: boolean; onAnimationComplete: () => void }) {
    const overlayRef = useRef<Graphics>(null);
    const fadeProgress = useRef(0);
    const [isFading, setIsFading] = useState(false);
    const hasCompleted = useRef(false);

    useEffect(() => {
        if (isStarted) {
            // Esperar un poco antes de iniciar el fade
            setTimeout(() => setIsFading(true), 500);
        }
    }, [isStarted]);

    useTick((ticker) => {
        if (isFading && overlayRef.current) {
            fadeProgress.current += ticker.deltaTime * 0.01;
            
            if (fadeProgress.current >= 1) {
                fadeProgress.current = 1;
                
                // Llamar a handleStarted cuando la animación termina
                if (!hasCompleted.current) {
                    hasCompleted.current = true;
                    onAnimationComplete();
                }
            }

            const alpha = fadeProgress.current;
            
            overlayRef.current.clear();
            overlayRef.current.beginFill(0xFFFFFF, alpha);
            overlayRef.current.drawRect(0, 0, canvasWidth, canvasHeight);
            overlayRef.current.endFill();
        }
    });

    return <pixiGraphics ref={overlayRef} draw={() => {}} />;
}

export default function Loading({ 
    galaxyImage = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1758347815/bg-galaxy_dn3jmx.png',
    planetImage = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1758646374/planeta_1_liwvp0.png',
    rocketImage = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1761075199/cohete_uxwkg2.png',
    handleStarted,
    isLoaded,
    visible
}: LoadingProps) {
    const [isClient, setIsClient] = useState(false);
    const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
    const [bgTexture, setBgTexture] = useState<Texture | null>(null);
    const [rocketTexture, setRocketTexture] = useState<Texture | null>(null);
    const [planetTexture, setPlanetTexture] = useState<Texture | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [texturesLoaded, setTexturesLoaded] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const loadAssets = async () => {
            try {
                
                if (galaxyImage) {
                    Assets.add({ alias: 'galaxy_bg', src: galaxyImage });
                    const texture = await Assets.load<Texture>('galaxy_bg');
                    setBgTexture(texture);
                }

                if (rocketImage) {
                    Assets.add({ alias: 'rocket_img', src: rocketImage });
                    const texture = await Assets.load<Texture>('rocket_img');
                    setRocketTexture(texture);
                }

                if (planetImage) {
                    Assets.add({ alias: 'planet_img', src: planetImage });
                    const texture = await Assets.load<Texture>('planet_img');
                    setPlanetTexture(texture);
                }

                setTexturesLoaded(true);

            } catch (error) {
                console.error("Error loading assets:", error);
                setTexturesLoaded(true);
            }
        }

        loadAssets();

    }, []);

    const handleAnimationComplete = () => {
        handleStarted(true);
    };

    return ((isClient && texturesLoaded) && (
        <pixiContainer 
            eventMode="static"
            onPointerDown={() => isLoaded && setIsStarted(true)}
            onTap={() => isLoaded && setIsStarted(true)}
            hitArea={{
                contains: () => true
            } as any}
            cursor={isLoaded ? 'pointer' : 'default'}
            interactive={true}
            visible={visible}
        >
            {bgTexture && (
                <pixiSprite 
                    texture={bgTexture}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    alpha={0.4}
                />
            )}
            {planetTexture && (
                <PlanetSprite 
                    texture={planetTexture}
                    canvasWidth={canvasSize.width}
                    canvasHeight={canvasSize.height}
                    isStarted={isStarted}
                />
            )}
            {rocketTexture && (
                <RocketSprite 
                    texture={rocketTexture}
                    canvasWidth={canvasSize.width}
                    canvasHeight={canvasSize.height}
                    isStarted={isStarted}
                />
            )}
            <LoadingText 
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                isLoaded={isLoaded}
            />
            <WhiteOverlay 
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                isStarted={isStarted}
                onAnimationComplete={handleAnimationComplete}
            />
        </pixiContainer>
    ));
}