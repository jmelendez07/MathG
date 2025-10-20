import { Combat } from '@/components/combat/combat';
import { KeyMap } from '@/components/types/key';
import { UI } from '@/components/ui/pixi';
import { EnemyUI } from '@/components/ui/pixi/enemy';
import { HeroUI } from '@/components/ui/pixi/hero';
import { Directions } from '@/enums/hero-directions';
import { ALLOWED_KEYS, getPolygonCentroid, HERO_FRAME_SIZE, isPointInPolygon, MAP_SCALE } from '@/lib/utils';
import { useTeam } from '@/Providers/TeamProvider';
import { SharedData } from '@/types';
import Card from '@/types/card';
import Enemy from '@/types/enemy';
import { Stage } from '@/types/planet';
import type { Page as InertiaPage } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { extend, useTick } from '@pixi/react';
import { Assets, Container, Sprite, Texture, Ticker } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ExperienceProps {
    stage: Stage;
    initEnemies: Enemy[];
    cards: Card[];
}

extend({ Sprite, Container, Text });

export const Experience = ({ stage, initEnemies, cards }: ExperienceProps) => {
    const { currentHero, teamHeroes, updateHeroHealth, changeCurrentHero, textures } = useTeam();
    const { auth } = usePage<SharedData>().props;
    const [stageTexture, setStageTexture] = useState<Texture | null>(null);
    const [keys, setKeys] = useState<KeyMap>({});
    const spriteRef = useRef<Sprite>(null);
    const cameraRef = useRef<Container>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [runTimeLeft, setRunTimeLeft] = useState(5);
    const [cooldownLeft, setCooldownLeft] = useState(0);
    const [direction, setDirection] = useState<Directions>(Directions.DOWN);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [nearbyEnemy, setNearbyEnemy] = useState<Enemy | null>(null);
    const [combatEnemy, setCombatEnemy] = useState<Enemy | null>(null);
    const [inCombat, setInCombat] = useState<boolean>(false);
    const [totalXpGained, setTotalXpGained] = useState(0);
    const [currentUserXp, setCurrentUserXp] = useState<number>(auth.user?.profile?.total_xp ?? 0);

    const polygonPoints: [number, number][] = stage.points
        .map((p) => [p.x, p.y] as [number, number])
        .filter((arr) => arr.length === 2 && arr.every(Number.isFinite));

    const centroid = getPolygonCentroid(polygonPoints);

    const generateRandomPosition = useCallback(
        (index: number) => ({
            x: 2500 + index * 200,
            y: 1000 + index * 1000,
        }),
        [],
    );

    const generateRandomCombatPosition = useCallback((index: number) => {
        const baseX = window.innerWidth * 0.5;
        const minY = window.innerHeight * (1 / 3);
        const maxY = window.innerHeight * (2 / 3);
        const baseY = minY + (maxY - minY) * 0.3;

        const spacing = 120;
        const enemiesPerRow = 3;

        const row = Math.floor(index / enemiesPerRow);
        const col = index % enemiesPerRow;

        const randomOffsetX = (Math.random() - 0.5) * 30;
        const randomOffsetY = (Math.random() - 0.5) * 40;

        const calculatedY = baseY + row * spacing + randomOffsetY;

        return {
            x: Math.max(150, Math.min(baseX + col * spacing + randomOffsetX, window.innerWidth - 150)),
            y: Math.max(minY, Math.min(calculatedY, maxY - 50)),
        };
    }, []);

    const keysLoop = useCallback(
        (delta: number) => {
            const sprite = spriteRef.current;
            const camera = cameraRef.current;
            if (!sprite || !camera) return;

            const controlPressed = keys[ALLOWED_KEYS[4]];
            const canRun = runTimeLeft > 0 && cooldownLeft <= 0;
            const isTryingToRun = controlPressed && canRun;

            const speed = isTryingToRun ? 10 : 5;

            if (isTryingToRun) {
                setIsRunning(true);
                setRunTimeLeft((prev) => Math.max(0, prev - delta / 60));
            } else {
                if (isRunning) {
                    setIsRunning(false);
                    if (runTimeLeft <= 0) {
                        setCooldownLeft(5);
                    }
                }
            }

            if (cooldownLeft > 0 && !isTryingToRun) {
                setCooldownLeft((prev) => {
                    if (prev > 0) {
                        const next = Math.max(0, prev - delta / 60);
                        if (next === 0) {
                            setRunTimeLeft(5);
                        }
                        return next;
                    }
                    return prev;
                });
            }

            let newX = sprite.x;
            let newY = sprite.y;
            let newDirection: Directions | null = null;

            if (keys[ALLOWED_KEYS[0]]) {
                // W
                newY -= speed;
                newDirection = Directions.UP;
            }

            if (keys[ALLOWED_KEYS[1]]) {
                // A
                newX -= speed;
                newDirection = Directions.LEFT;
            }

            if (keys[ALLOWED_KEYS[2]]) {
                // S
                newY += speed;
                newDirection = Directions.DOWN;
            }

            if (keys[ALLOWED_KEYS[3]]) {
                // D
                newX += speed;
                newDirection = Directions.RIGHT;
            }

            if (newDirection) {
                setDirection(newDirection);
            }

            const spriteLeftX = (newX - sprite.width / 2) / MAP_SCALE;
            const spriteRightX = (newX + sprite.width / 2) / MAP_SCALE;
            const spriteTopY = (newY - sprite.height / 2) / MAP_SCALE;
            const spriteBottomY = (newY + sprite.height / 2) / MAP_SCALE;

            const allInside =
                isPointInPolygon(spriteLeftX, newY / MAP_SCALE, polygonPoints) &&
                isPointInPolygon(spriteRightX, newY / MAP_SCALE, polygonPoints) &&
                isPointInPolygon(newX / MAP_SCALE, spriteTopY, polygonPoints) &&
                isPointInPolygon(newX / MAP_SCALE, spriteBottomY, polygonPoints);

            const heroSize = HERO_FRAME_SIZE * 2;
            const enemySize = 64 * 2;
            const collisionRadius = (heroSize + enemySize) / 4;
            const interactionRadius = collisionRadius * 1.5;

            let closestEnemy: Enemy | null = null;
            let minDistance = interactionRadius;

            enemies.forEach((enemy) => {
                if (!enemy.map_position) return;

                const dx = newX - enemy.map_position.x;
                const dy = newY - enemy.map_position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            });

            setNearbyEnemy(closestEnemy);

            const collidesWithEnemy = enemies.some((enemy) => {
                if (!enemy.map_position) return false;

                const dx = newX - enemy.map_position.x;
                const dy = newY - enemy.map_position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                return distance < collisionRadius;
            });

            if (allInside && !collidesWithEnemy) {
                sprite.x = newX;
                sprite.y = newY;
            }

            camera.x = window.innerWidth / 2 - sprite.x;
            camera.y = window.innerHeight / 2 - sprite.y;
        },
        [keys, polygonPoints, isRunning, runTimeLeft, cooldownLeft, enemies],
    );

    const updateUserProfileLevel = async (newTotalXp: number) => {
        try {
            const newTotalUserXp = (currentUserXp ?? 0) + newTotalXp;
            setCurrentUserXp(newTotalUserXp);

            await router.post(
                '/profile/update-xp',
                { total_xp: newTotalXp },
                {
                    onSuccess: (page: InertiaPage) => {
                        const updatedUser = page.props.auth.user;
                        if (updatedUser?.profile) {
                            setCurrentUserXp(updatedUser.profile.total_xp);
                        }
                    },
                    onError: () => {
                        setCurrentUserXp(currentUserXp);
                    },
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        } catch (error) {
            console.error('Error updating user profile level:', error);
            setCurrentUserXp(currentUserXp);
        }
    };

    const finish = (value: boolean, xpFromCombat: number) => {
        if (value && combatEnemy) {
            setEnemies((enemies) => enemies.filter((enemy) => combatEnemy.id === enemy.id));
            setCombatEnemy(null);
        }

        const newTotalXp = totalXpGained + xpFromCombat;
        setTotalXpGained(newTotalXp);
        updateUserProfileLevel(newTotalXp);
        setInCombat(false);
    };

    const lose = () => {
        teamHeroes.forEach((hero) => {
            const newHealth = Math.floor(hero.health * 0.5);
            updateHeroHealth(hero.id, newHealth);
        });

        setCombatEnemy(null);
        setInCombat(false);
    };

    const onSetSelectedEnemies = (e: Enemy[]) => {
        if (e.length === 0) return;

        setCombatEnemy(e[0]);
    };

    useEffect(() => {
        Assets.load(stage.image_url).then((result) => {
            setStageTexture(result);
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (inCombat) {
                handleBlur();
                return;
            }

            // Añadir el manejo de teclas numéricas para cambiar héroe
            if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(event.code)) {
                const heroIndex = parseInt(event.key) - 1;
                if (heroIndex >= 0 && heroIndex < teamHeroes.length) {
                    changeCurrentHero(heroIndex);
                }
                return;
            }

            if (event.code === ALLOWED_KEYS[4]) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (event.code === 'KeyF' && nearbyEnemy) {
                setInCombat(true);
                setCombatEnemy(nearbyEnemy);
                setNearbyEnemy(null);
            }

            if (ALLOWED_KEYS.includes(event.code)) {
                setKeys((prevKeys) => ({ ...prevKeys, [event.code]: true }));
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (inCombat) {
                handleBlur();
                return;
            }

            if (ALLOWED_KEYS.includes(event.code)) {
                setKeys((prevKeys) => ({ ...prevKeys, [event.code]: false }));
            }
        };

        const handleBlur = () => {
            setKeys({});
        };

        if (initEnemies.length > 0) {
            setEnemies(
                initEnemies.map((enemy, index) => ({
                    ...enemy,
                    map_position: generateRandomPosition(index),
                    combat_position: generateRandomCombatPosition(index),
                })),
            );
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [nearbyEnemy, inCombat]);

    useTick((ticker: Ticker) => keysLoop(ticker.deltaTime));

    return inCombat && combatEnemy ? (
        <Combat
            team={teamHeroes}
            teamTextures={textures}
            cards={cards}
            enemies={[combatEnemy]}
            currentStage={stage}
            currentHero={currentHero}
            onSetSelectedEnemies={onSetSelectedEnemies}
            finish={finish}
            lose={lose}
        />
    ) : (
        <>
            <UI stage={stage} />
            <pixiContainer ref={cameraRef} sortableChildren={true}>
                <HeroUI
                   
                    spriteRef={spriteRef}
                    isMoving={Object.values(keys).some((v) => v)}
                    isRunning={isRunning}
                    direction={direction}
                    x={centroid.x}
                    y={centroid.y}
                />
                {enemies.map((enemy) => (
                    <EnemyUI key={enemy.id} enemy={enemy} showInteraction={nearbyEnemy?.id === enemy.id} />
                ))}
                {stageTexture && <pixiSprite texture={stageTexture} x={0} y={0} zIndex={0} scale={MAP_SCALE} />}
                <pixiGraphics
                    draw={(g) => {
                        g.clear();
                        g.setStrokeStyle({
                            width: 2,
                            color: 0xa855f7,
                            alpha: 1,
                        });
                        g.poly(polygonPoints.flat(), true);
                        g.fill({ color: 0xa855f7, alpha: 0.15 });
                    }}
                    scale={MAP_SCALE}
                    zIndex={2}
                />
            </pixiContainer>
        </>
    );
};
