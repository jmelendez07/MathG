import { Graphics } from '@pixi/react';
import { useEffect, useRef, useState } from 'react';
import { useTick } from '@pixi/react';
import IEnemy from '@/types/enemy';
import Hero from '@/types/hero';

interface Fireball {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    progress: number;
    radius: number;
    enemyIndex: number;
    isExploding: boolean;
    explosionProgress: number;
}

interface ExplosionParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: number;
    alpha: number;
    life: number;
}

interface SkillEnemyProps {
    enemies: IEnemy[];
    heroes: Hero[];
    screenSize: { width: number; height: number };
    scale: number;
    isActive: boolean;
    trigger?: number; // cambio incremental para reiniciar animación
    onAnimationComplete: () => void;
}

export const SkillEnemy = ({ enemies, heroes, screenSize, scale, isActive, trigger, onAnimationComplete }: SkillEnemyProps) => {
    const [fireballs, setFireballs] = useState<Fireball[]>([]);
    const [explosionParticles, setExplosionParticles] = useState<ExplosionParticle[]>([]);
    const animationFrame = useRef(0);
    const hasCompleted = useRef(false);

    useEffect(() => {
        // Solo crear bolas de fuego cuando isActive es true
        if (!isActive) return;

        // Resetear el flag de completado
        hasCompleted.current = false;

        // Crear bolas de fuego para cada enemigo
        const newFireballs: Fireball[] = enemies
            .filter(enemy => enemy.health > 0)
            .map((enemy, index) => {
                // Filtrar solo héroes vivos
                const aliveHeroes = heroes.filter(hero => hero.current_health > 0);
                if (aliveHeroes.length === 0) return null;

                const randomHeroIndex = Math.floor(Math.random() * aliveHeroes.length);
                const targetHeroIndexInTeam = heroes.findIndex(h => h.id === aliveHeroes[randomHeroIndex].id);
                
                const baseX = screenSize.width * 0.2;
                const baseY = screenSize.height * 0.4;
                const spacing = 120 * scale;

                // Posición del héroe objetivo
                const targetX = baseX - 50 * scale;
                const targetY = baseY + targetHeroIndexInTeam * spacing + 100 * scale;

                return {
                    id: `fireball-${enemy.id}-${Date.now()}-${Math.random()}-${index}`,
                    x: targetX, // Misma X que el héroe
                    y: -100 * scale, // Comenzar desde arriba de la pantalla
                    targetX: targetX,
                    targetY: targetY,
                    progress: 0,
                    radius: 60 * scale, // Tres veces más grande (20 * 3)
                    enemyIndex: index,
                    isExploding: false,
                    explosionProgress: 0,
                };
            })
            .filter((fb): fb is Fireball => fb !== null);

        setFireballs(newFireballs);
        setExplosionParticles([]);
    }, [isActive, trigger]);

    // Detectar finalización cuando todo terminó (arrays vacíos) y aún estaba activo
    useEffect(() => {
        if (!isActive) return;
        if (!hasCompleted.current && fireballs.length === 0 && explosionParticles.length === 0) {
            hasCompleted.current = true;
            onAnimationComplete();
        }
    }, [fireballs, explosionParticles, isActive, onAnimationComplete]);

    useTick((ticker) => {
        if (fireballs.length === 0 && explosionParticles.length === 0) return;

        animationFrame.current += ticker.deltaTime;

        // Actualizar partículas de explosión
        setExplosionParticles((prevParticles) => {
            return prevParticles
                .map((particle) => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    vy: particle.vy + 0.3, // Gravedad
                    alpha: particle.alpha - 0.02,
                    life: particle.life + 1,
                }))
                .filter((particle) => particle.alpha > 0 && particle.life < 60);
        });

        setFireballs((prevFireballs) => {
            const updatedFireballs = prevFireballs.map((fireball) => {
                // Si ya está explotando, incrementar el progreso de explosión
                if (fireball.isExploding) {
                    return {
                        ...fireball,
                        explosionProgress: Math.min(fireball.explosionProgress + ticker.deltaTime * 0.1, 1),
                    };
                }

                // Si ya llegó al destino, comenzar explosión
                if (fireball.progress >= 1) {
                    // Crear partículas de explosión
                    const particleCount = 30;
                    const newParticles: ExplosionParticle[] = [];
                    
                    for (let i = 0; i < particleCount; i++) {
                        const angle = (Math.PI * 2 * i) / particleCount;
                        const speed = 2 + Math.random() * 4;
                        const size = fireball.radius * (0.1 + Math.random() * 0.15);
                        
                        newParticles.push({
                            x: fireball.targetX,
                            y: fireball.targetY,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed - Math.random() * 2,
                            size: size,
                            color: Math.random() > 0.5 ? 0xff4400 : 0xffaa00,
                            alpha: 1,
                            life: 0,
                        });
                    }
                    
                    setExplosionParticles((prev) => [...prev, ...newParticles]);

                    return {
                        ...fireball,
                        isExploding: true,
                        explosionProgress: 0,
                    };
                }

                // Progreso normal
                return {
                    ...fireball,
                    progress: Math.min(fireball.progress + ticker.deltaTime * 0.03, 1),
                };
            });

            // Verificar si todas las explosiones terminaron
            const allExploded = updatedFireballs.every((fb) => fb.isExploding && fb.explosionProgress >= 1);
            if (allExploded && updatedFireballs.length > 0 && explosionParticles.length === 0 && !hasCompleted.current) {
                hasCompleted.current = true;
                setTimeout(() => {
                    setFireballs([]);
                    setExplosionParticles([]);
                    onAnimationComplete();
                }, 300);
            }

            // Filtrar las bolas que terminaron de explotar
            return updatedFireballs.filter((fb) => !fb.isExploding || fb.explosionProgress < 1);
        });
    });

    const drawFireball = (g: any, fireball: Fireball) => {
        g.clear();

        // Si está explotando, dibujar efecto de explosión
        if (fireball.isExploding) {
            const explosionRadius = fireball.radius * (1 + fireball.explosionProgress * 2);
            const alpha = 1 - fireball.explosionProgress;

            // Onda de choque
            g.circle(fireball.targetX, fireball.targetY, explosionRadius);
            g.fill({ color: 0xffff00, alpha: alpha * 0.6 });

            g.circle(fireball.targetX, fireball.targetY, explosionRadius * 0.7);
            g.fill({ color: 0xff8800, alpha: alpha * 0.8 });

            g.circle(fireball.targetX, fireball.targetY, explosionRadius * 0.4);
            g.fill({ color: 0xff0000, alpha: alpha });

            return;
        }

        // Calcular posición actual con interpolación suave
        const easeProgress = fireball.progress < 0.5 
            ? 4 * fireball.progress * fireball.progress * fireball.progress 
            : 1 - Math.pow(-2 * fireball.progress + 2, 3) / 2; // Ease in-out cubic
        const currentX = fireball.x + (fireball.targetX - fireball.x) * easeProgress;
        const currentY = fireball.y + (fireball.targetY - fireball.y) * easeProgress;

        // Efecto de estela (dibujado primero para estar detrás)
        const trailLength = 5;
        for (let i = 1; i <= trailLength; i++) {
            const trailProgress = Math.max(0, easeProgress - i * 0.05);
            const trailX = fireball.x + (fireball.targetX - fireball.x) * trailProgress;
            const trailY = fireball.y + (fireball.targetY - fireball.y) * trailProgress;
            const trailAlpha = 0.4 * (1 - i / trailLength);
            const trailSize = fireball.radius * 0.8 * (1 - i / trailLength);

            g.circle(trailX, trailY, trailSize);
            g.fill({ color: 0xff4400, alpha: trailAlpha });
        }

        // Partículas aleatorias (efecto de chispas)
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const angle = (animationFrame.current * 0.15 + i * (Math.PI * 2 / particleCount));
            const distance = Math.sin(animationFrame.current * 0.1 + i) * fireball.radius * 0.6;
            const particleX = currentX + Math.cos(angle) * distance;
            const particleY = currentY + Math.sin(angle) * distance;

            g.circle(particleX, particleY, fireball.radius * 0.15);
            g.fill({ color: 0xffaa00, alpha: 0.7 });
        }

        // Capa roja exterior (más grande)
        g.circle(currentX, currentY, fireball.radius);
        g.fill({ color: 0xff0000, alpha: 0.6 });

        // Capa naranja media
        g.circle(currentX, currentY, fireball.radius * 0.7);
        g.fill({ color: 0xff8800, alpha: 0.8 });

        // Núcleo amarillo brillante
        g.circle(currentX, currentY, fireball.radius * 0.4);
        g.fill({ color: 0xffff00, alpha: 1 });

        // Brillo central muy intenso
        g.circle(currentX, currentY, fireball.radius * 0.2);
        g.fill({ color: 0xffffff, alpha: 0.9 });
    };

    return (
        <>
            {fireballs.map((fireball) => (
                <pixiGraphics key={fireball.id} draw={(g) => drawFireball(g, fireball)} />
            ))}
            {explosionParticles.map((particle, index) => (
                <pixiGraphics
                    key={`particle-${index}`}
                    draw={(g) => {
                        g.clear();
                        g.circle(particle.x, particle.y, particle.size);
                        g.fill({ color: particle.color, alpha: particle.alpha });
                    }}
                />
            ))}
        </>
    );
};
