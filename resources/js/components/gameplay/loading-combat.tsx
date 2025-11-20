import { calculateCanvasSize } from "@/components/helpers/common";
import { extend, useTick } from "@pixi/react";
import { Graphics, Sprite, Texture, Text, Container } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import Enemy from "@/types/enemy";
import Hero from "@/types/hero";
import useEnemyAnimation from "../enemy/useEnemyAnimation";
import { ANIMATION_SPEED } from "../constants/game-world";
import { useHeroAnimation } from "@/hooks/use-hero-animation";

extend({ Sprite, Graphics, Text, Container });

interface LoadingCombatProps {
    enemy: Enemy;
    enemyTexture: Texture;
    teamTextures: Texture[];
    visible?: boolean;
    team: Hero[];
}

interface CharacterSpriteProps {
    texture: Texture;
    canvasWidth: number;
    canvasHeight: number;
    isLeft: boolean;
    name: string;
    shouldReverse: boolean;
}

function CharacterSprite({ texture, canvasWidth, canvasHeight, isLeft, name, shouldReverse }: CharacterSpriteProps) {
    const spriteRef = useRef<Sprite>(null);
    const containerRef = useRef<Container>(null);
    const moveProgress = useRef(0);
    const reverseProgress = useRef(0);
    const bounceTime = useRef(0);
    const finalScale = 5;

    useTick((ticker) => {
        if (spriteRef.current && containerRef.current) {
            const textureWidth = texture.width * finalScale;
            const startX = isLeft ? -textureWidth : canvasWidth + textureWidth;
            const endX = isLeft ? canvasWidth * 0.25 : canvasWidth * 0.75;

            if (shouldReverse) {
                // Animación de salida (reversa)
                if (reverseProgress.current < 1) {
                    reverseProgress.current += ticker.deltaTime * 0.03;
                    
                    if (reverseProgress.current >= 1) {
                        reverseProgress.current = 1;
                    }

                    const easeProgress = 1 - Math.pow(1 - reverseProgress.current, 3);
                    const currentX = endX + (startX - endX) * easeProgress;
                    containerRef.current.x = currentX;
                }
            } else {
                // Animación de entrada (movimiento desde fuera de la pantalla)
                if (moveProgress.current < 1) {
                    moveProgress.current += ticker.deltaTime * 0.02;
                    
                    if (moveProgress.current >= 1) {
                        moveProgress.current = 1;
                    }

                    const easeProgress = 1 - Math.pow(1 - moveProgress.current, 3);
                    const currentX = startX + (endX - startX) * easeProgress;
                    containerRef.current.x = currentX;
                } else {
                    // Mantener la posición final
                    containerRef.current.x = endX;
                }

                // Animación de rebote sutil (solo después de llegar)
                if (moveProgress.current >= 1) {
                    bounceTime.current += ticker.deltaTime * 0.05;
                    const bounceOffset = Math.sin(bounceTime.current) * 5;
                    containerRef.current.y = (canvasHeight / 2 + bounceOffset) - 100;
                }
            }
        }
    });

    return (
        <pixiContainer ref={containerRef} x={isLeft ? -texture.width * finalScale : canvasWidth + texture.width * finalScale} y={(canvasHeight / 2) - 100}>
            <pixiSprite
                ref={spriteRef}
                texture={texture}
                anchor={0.5}
                scale={{ x: finalScale, y: finalScale }}
            />
            <pixiText
                text={name}
                x={0}
                y={180}
                style={{
                    fontFamily: 'Jersey 10, Arial, sans-serif',
                    fontSize: 48,
                    fontWeight: 'bold',
                    fill: '#ffffff',
                    stroke: { color: '#000000', width: 4 },
                    align: 'center',
                    dropShadow: {
                        color: '#000000',
                        blur: 4,
                        distance: 2,
                    },
                }}
                anchor={0.5}
                resolution={2}
            />
        </pixiContainer>
    );
}

function VSText({ canvasWidth, canvasHeight, shouldReverse }: { canvasWidth: number; canvasHeight: number; shouldReverse: boolean }) {
    const textRef = useRef<Text>(null);
    const time = useRef(0);
    const scaleProgress = useRef(0);
    const fadeOutProgress = useRef(0);

    useTick((ticker) => {
        if (textRef.current) {
            if (shouldReverse) {
                // Fade out (reversa)
                if (fadeOutProgress.current < 1) {
                    fadeOutProgress.current += ticker.deltaTime * 0.05;
                    
                    if (fadeOutProgress.current >= 1) {
                        fadeOutProgress.current = 1;
                    }

                    const scale = 1 - fadeOutProgress.current;
                    textRef.current.scale.set(scale, scale);
                    textRef.current.alpha = 1 - fadeOutProgress.current;
                }
            } else {
                // Animación de entrada
                if (scaleProgress.current < 1) {
                    scaleProgress.current += ticker.deltaTime * 0.05;
                    
                    if (scaleProgress.current >= 1) {
                        scaleProgress.current = 1;
                    }

                    const easeProgress = 1 - Math.pow(1 - scaleProgress.current, 3);
                    const startScale = 0;
                    const endScale = 1;
                    const currentScale = startScale + (endScale - startScale) * easeProgress;
                    textRef.current.scale.set(currentScale, currentScale);
                }

                // Pulsación
                time.current += ticker.deltaTime * 0.08;
                const pulse = 1 + Math.sin(time.current) * 0.1;
                if (scaleProgress.current >= 1) {
                    textRef.current.scale.set(pulse, pulse);
                }
            }
        }
    });

    return (
        <pixiText 
            ref={textRef}
            text="VS"
            x={canvasWidth / 2}
            y={canvasHeight / 2 - 100}
            style={{
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 300,
                fontWeight: 'bold',
                fill: '#ffffff',
                stroke: { color: '#ff0000', width: 8 },
                align: 'center',
                dropShadow: {
                    color: '#000000',
                    blur: 10,
                    distance: 5,
                },
            }}
            anchor={0.5}
            resolution={3}
            scale={{ x: 0, y: 0 }}
        />
    );
}

function LoadingText({ canvasWidth, canvasHeight, shouldReverse }: { canvasWidth: number; canvasHeight: number; shouldReverse: boolean }) {
    const textRef = useRef<Text>(null);
    const time = useRef(0);
    const fadeOutProgress = useRef(0);

    useTick((ticker) => {
        if (textRef.current) {
            if (shouldReverse) {
                // Fade out (reversa)
                if (fadeOutProgress.current < 1) {
                    fadeOutProgress.current += ticker.deltaTime * 0.05;
                    
                    if (fadeOutProgress.current >= 1) {
                        fadeOutProgress.current = 1;
                    }

                    textRef.current.alpha = 1 - fadeOutProgress.current;
                }
            } else {
                // Animación normal de puntos
                time.current += ticker.deltaTime * 0.05;
                const dotCount = Math.floor(time.current) % 4;
                textRef.current.text = "Cargando" + ".".repeat(dotCount);
            }
        }
    });

    return (
        <pixiText 
            ref={textRef}
            text="Cargando"
            x={canvasWidth / 2}
            y={canvasHeight / 2 + 100}
            style={{
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 40,
                fontWeight: '100',
                fill: '#ffffff',
                align: 'center'
            }}
            anchor={0.5}
            resolution={2}
        />
    );
}

function BackgroundOverlay({ canvasWidth, canvasHeight, shouldReverse }: { canvasWidth: number; canvasHeight: number; shouldReverse: boolean }) {
    const overlayRef = useRef<Graphics>(null);
    const fadeProgress = useRef(0);
    const fadeOutProgress = useRef(0);

    useTick((ticker) => {
        if (overlayRef.current) {
            let alpha = 0;

            if (shouldReverse) {
                // Fade out (reversa)
                if (fadeOutProgress.current < 1) {
                    fadeOutProgress.current += ticker.deltaTime * 0.04;
                    
                    if (fadeOutProgress.current >= 1) {
                        fadeOutProgress.current = 1;
                    }

                    alpha = (1 - fadeOutProgress.current) * 0.95;
                }
            } else {
                // Fade in
                if (fadeProgress.current < 1) {
                    fadeProgress.current += ticker.deltaTime * 0.03;
                    
                    if (fadeProgress.current >= 1) {
                        fadeProgress.current = 1;
                    }

                    alpha = fadeProgress.current * 0.95;
                } else {
                    alpha = 0.95;
                }
            }
            
            overlayRef.current.clear();
            overlayRef.current.rect(0, 0, canvasWidth, canvasHeight);
            overlayRef.current.fill({ color: 0x000000, alpha });
        }
    });

    return <pixiGraphics ref={overlayRef} draw={() => {}} />;
}

export default function LoadingCombat({ enemy, team, enemyTexture, teamTextures, visible = true }: LoadingCombatProps) {
    const [canvasSize] = useState(calculateCanvasSize());
    const [shouldReverse, setShouldReverse] = useState(false);
    const [internalVisible, setInternalVisible] = useState(true);
    const prevVisible = useRef(visible);

    const { sprite: enemySprite, updateSprite: updateEnemySprite } = useEnemyAnimation({
        texture: enemyTexture,
        frameWidth: 64,
        frameHeight: 64,
        totalFrames: 2,
        animationSpeed: 0.1
    });

    const hero0Animation = useHeroAnimation({
        texture: teamTextures[0],
        frameWidth: 64,
        frameHeight: 64,
        totalTilesFrames: team[0].hero_animations.find((anim) => anim.action === 'fighting')?.totalTilesFrames || 2,
        animationSpeed: ANIMATION_SPEED,
        heroAnimation: team[0].hero_animations.find((anim) => anim.action === 'fighting') || team[0]?.hero_animations[0],
    });

    useEffect(() => {
        if (prevVisible.current === true && visible === false) {
            setShouldReverse(true);
            setTimeout(() => {
                setInternalVisible(false);
            }, 1000);
        } else if (visible === true) {
            setInternalVisible(true);
            setShouldReverse(false);
        }
        prevVisible.current = visible;
    }, [visible]);

    useTick((ticker) => {
        updateEnemySprite('combatIdle', 'left');
        hero0Animation.updateSprite('DOWN', true, true, false, false);
    });

    return (
        <pixiContainer
            zIndex={10000}
            visible={internalVisible}
        >
            {/* Fondo negro con fade in/out */}
            <BackgroundOverlay 
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                shouldReverse={shouldReverse}
            />

            {/* Héroe a la izquierda */}
            {hero0Animation.sprite && (
                <CharacterSprite
                    texture={hero0Animation.sprite.texture}
                    canvasWidth={canvasSize.width}
                    canvasHeight={canvasSize.height}
                    isLeft={true}
                    name={team[0]?.name}
                    shouldReverse={shouldReverse}
                />
            )}

            {/* Enemigo a la derecha */}
            {enemySprite && (
                <CharacterSprite
                    texture={enemySprite.texture}
                    canvasWidth={canvasSize.width}
                    canvasHeight={canvasSize.height}
                    isLeft={false}
                    name={enemy.name}
                    shouldReverse={shouldReverse}
                />
            )}

            {/* Texto VS en el centro */}
            <VSText 
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                shouldReverse={shouldReverse}
            />

            {/* Texto Cargando */}
            <LoadingText 
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                shouldReverse={shouldReverse}
            />
        </pixiContainer>
    );
}