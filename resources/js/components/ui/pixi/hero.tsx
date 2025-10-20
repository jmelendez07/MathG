import { Actions } from "@/enums/hero-actions";
import { Directions } from "@/enums/hero-directions";
import { getRow, HERO_FRAME_SIZE, HERO_MOVING_SPEED, HERO_MOVING_SPEED_RUNNING } from "@/lib/utils";
import { useTeam } from "@/Providers/TeamProvider";
import { useTick } from "@pixi/react";
import { Rectangle, Sprite, Texture } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroUIProps {
    x: number;
    y: number;
    isMoving: boolean;
    isRunning: boolean;
    direction: Directions;
    spriteRef: React.RefObject<Sprite | null>;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    alpha: number;
    offsetX: number;
    offsetY: number;
}

export const HeroUI = ({ x, y, direction, isMoving, isRunning, spriteRef }: HeroUIProps) => {
    const { currentHero } = useTeam();
    const [sprite, setSprite] = useState<Sprite | null>(null);
    const elapsedTimeRef = useRef(0);
    const frameRef = useRef(1);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdRef = useRef(0);
    const previousHeroIdRef = useRef(currentHero.id);

    // Reset animación cuando cambia el héroe
    useEffect(() => {
        if (previousHeroIdRef.current !== currentHero.id) {
            frameRef.current = 0;
            elapsedTimeRef.current = 0;
            setParticles([]);
            previousHeroIdRef.current = currentHero.id;
            
            // Forzar actualización inicial del sprite sin cambiar posición
            if (currentHero.texture) {
                const frame = new Rectangle(0, getRow(direction) * HERO_FRAME_SIZE, HERO_FRAME_SIZE, HERO_FRAME_SIZE);
                const texture = new Texture({
                    source: currentHero.texture.source,
                    frame: frame,
                });
                const newSprite = new Sprite(texture);
                newSprite.width = HERO_FRAME_SIZE;
                newSprite.height = HERO_FRAME_SIZE;
                setSprite(newSprite);
            }
        }
    }, [currentHero.id, currentHero.texture, direction]);

    const updateSprite = useCallback(() => {
        if (!currentHero.texture) return;

        const row = getRow(direction);
        const tiles = currentHero.hero_animations.find(anim => anim.action === Actions.WALK)?.totalTilesFrames || 2;
        let column = 0;

        if (isMoving) {
            elapsedTimeRef.current += isRunning ? HERO_MOVING_SPEED_RUNNING : HERO_MOVING_SPEED;
            if (elapsedTimeRef.current >= 1) {
                elapsedTimeRef.current = 0;
                frameRef.current = (frameRef.current + 1) % tiles;
                
                const currentSprite = spriteRef.current;
                const currentX = currentSprite ? currentSprite.x : x;
                const currentY = currentSprite ? currentSprite.y : y;
                
                const newParticles: Particle[] = [];
                for (let i = 0; i < 5; i++) {
                    newParticles.push({
                        id: particleIdRef.current++,
                        x: currentX,
                        y: currentY + 30,
                        alpha: 1,
                        offsetX: (Math.random() - 0.5) * 40,
                        offsetY: (Math.random() - 0.5) * 20
                    });
                }
                setParticles(prev => [...prev, ...newParticles]);
            }

            column = frameRef.current;
        } else {
            // Cuando no se mueve, mostrar el frame 0 (idle)
            column = 0;
        }

        setParticles(prev => 
            prev
                .map(p => ({
                    ...p,
                    y: p.y - 2,
                    alpha: p.alpha - 0.03
                }))
                .filter(p => p.alpha > 0)
        );

        const frame = new Rectangle(column * HERO_FRAME_SIZE, row * HERO_FRAME_SIZE, HERO_FRAME_SIZE, HERO_FRAME_SIZE);
        const texture = new Texture({
            source: currentHero.texture.source,
            frame: frame,
        });
        const newSprite = new Sprite(texture);
        newSprite.width = HERO_FRAME_SIZE;
        newSprite.height = HERO_FRAME_SIZE;

        setSprite(newSprite);
    }, [currentHero, direction, isMoving, isRunning, spriteRef, x, y]);

    useTick(updateSprite);

    // No renderizar nada hasta que tengamos un sprite válido
    if (!sprite || !currentHero.texture) {
        return null;
    }

    return (
        <>
            {particles.map(particle => (
                <pixiGraphics
                    key={particle.id}
                    x={particle.x + particle.offsetX}
                    y={particle.y + particle.offsetY}
                    alpha={particle.alpha}
                    zIndex={0}
                    draw={g => {
                        g.clear();
                        g.circle(0, 0, 3);
                        g.fill({ color: 0x8B4513 });
                    }}
                />
            ))}
            <pixiSprite 
                ref={spriteRef}
                anchor={0.5}
                scale={2}
                y={y}
                x={x}
                texture={sprite.texture}
                zIndex={spriteRef.current?.y || 1}
            />
        </>
    );
}