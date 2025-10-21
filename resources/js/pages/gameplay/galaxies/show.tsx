import Planet from '@/components/gameplay/galaxies/planet';
import Stage from '@/components/gameplay/planets/stage';
import { calculateCanvasSize } from '@/components/helpers/common';
import { useScreen } from '@/Providers/ScreenProvider';
import Galaxy from '@/types/galaxy';
import IPlanet, { Stage as IStage } from '@/types/planet';
import { Application, extend } from '@pixi/react';
import { Assets, Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

extend({ Container, Sprite, Text, Graphics });

interface IGalaxiesShowProps {
    galaxy: Galaxy;
    unlocked_planets: IPlanet[];
    unlocked_stages: IStage[];
}

const planetPositions = [
    { x: 0.1, y: 0.35, name: 'top-left' },
    { x: 0.35, y: 0.8, name: 'top-right' },
    { x: 0.6, y: 0.35, name: 'bottom-left' },
    { x: 0.85, y: 0.8, name: 'bottom-right' },
];

const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
];

export default function GalaxiesShow({ galaxy, unlocked_planets, unlocked_stages }: IGalaxiesShowProps) {
    const [isClient, setIsClient] = useState(false);
    const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
    const [bgTexture, setBgTexture] = useState<Texture | null>(null);
    const [planetTextures, setPlanetTextures] = useState<{ [key: string]: Texture }>({});
    const [selectedPlanet, setSelectedPlanet] = useState<IPlanet | null>(null);
    const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | undefined>(undefined);
    const [stageTextures, setStageTextures] = useState<{ [key: string]: Texture }>({});
    const [showStages, setShowStages] = useState(false);
    const [appReady, setAppReady] = useState(false);

    const { scale, screenSize } = useScreen();

    const titleStyle = useMemo(
        () =>
            new TextStyle({
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 40 * scale,
                fontWeight: '100',
                fill: '#efefef',
                align: 'center',
            }),
        [scale],
    );

    const galaxyNameStyle = useMemo(
        () =>
            new TextStyle({
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 100 * scale,
                fontWeight: '500',
                fill: '#4c1d95',
                align: 'center',
            }),
        [scale],
    );

    const planetNameStyle = useMemo(
        () =>
            new TextStyle({
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 120 * scale,
                fontWeight: '500',
                fill: '#4c1d95',
                align: 'center',
            }),
        [scale],
    );

    const planetDescriptionStyle = useMemo(
        () =>
            new TextStyle({
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 40 * scale,
                fontWeight: '100',
                fill: '#efefef',
                align: 'center',
            }),
        [scale],
    );

    const exitStyle = useMemo(
        () =>
            new TextStyle({
                fontFamily: 'Jersey 10, Arial, sans-serif',
                fontSize: 50 * scale,
                fontWeight: '400',
                fill: '#fff',
                align: 'center',
            }),
        [scale],
    );

    const updateCanvasSize = useCallback(() => {
        setCanvasSize(calculateCanvasSize());
    }, []);

    useEffect(() => {
        setIsClient(true);

        const timer = setTimeout(() => {
            setAppReady(true);
        }, 100);

        window.addEventListener('resize', updateCanvasSize);

        if (galaxy.image_url) {
            Assets.load<Texture>(galaxy.image_url).then((texture) => {
                setBgTexture(texture);
            });
        }

        galaxy.planets.forEach((planet) => {
            if (planet.image_url) {
                Assets.load<Texture>(planet.image_url).then((texture) => {
                    setPlanetTextures((prev) => ({
                        ...prev,
                        [planet.id]: texture,
                    }));
                });
            }
        });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [updateCanvasSize, galaxy]);

    useEffect(() => {
        if (selectedPlanet && selectedPlanet.stages) {
            selectedPlanet.stages.forEach((stage) => {
                if (stage.image_url && !stageTextures[stage.id]) {
                    Assets.load<Texture>(stage.image_url).then((texture) => {
                        setStageTextures((prev) => ({
                            ...prev,
                            [stage.id]: texture,
                        }));
                    });
                }
            });
        }
    }, [selectedPlanet, stageTextures]);

    const sortedPlanets = [...galaxy.planets].sort((a, b) => a.number - b.number);

    const handleTransitionEnd = useCallback(() => {
        if (transitionStage === 'enter') {
            setShowStages(true);
        }
        if (transitionStage === 'exit') {
            setShowStages(false);
            setSelectedPlanet(null);
            setTransitionStage(undefined);
        }
    }, [transitionStage]);

    const handlePlanetClick = useCallback((planet: IPlanet) => {
        setSelectedPlanet(planet);
        setTransitionStage('enter');
        setShowStages(false);
    }, []);

    const handleExit = useCallback(() => {
        setTransitionStage('exit');
        setShowStages(false);
    }, []);

    const drawDashedLine = useCallback(
        (g: Graphics, fromX: number, fromY: number, toX: number, toY: number) => {
            g.clear();

            const dashLength = 20 * scale;
            const gapLength = 12 * scale;

            const dx = toX - fromX;
            const dy = toY - fromY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            let progress = 0;
            while (progress < distance) {
                const startX = fromX + Math.cos(angle) * progress;
                const startY = fromY + Math.sin(angle) * progress;
                progress += dashLength;
                if (progress > distance) progress = distance;
                const endX = fromX + Math.cos(angle) * progress;
                const endY = fromY + Math.sin(angle) * progress;

                g.moveTo(startX, startY);
                g.lineTo(endX, endY);
                g.stroke({ width: 4 * scale, color: 0x8b5cf6, alpha: 1 });

                progress += gapLength;
            }
        },
        [scale],
    );

    const checkIntersection = useCallback((x1: number, y1: number, x2: number, y2: number, minDistance: number): boolean => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
    }, []);

    const generateStagePositions = useCallback(
        (stages: any[], targetX: number, targetY: number, radius: number) => {
            const stageSize = 80 * scale;
            const minDistance = (stageSize + 20) * scale;
            const maxAttempts = 100;
            const positions: Array<{ x: number; y: number; stage: any }> = [];

            stages.forEach((stage, idx) => {
                let validPosition = false;
                let attempts = 0;
                let x = 0;
                let y = 0;

                while (!validPosition && attempts < maxAttempts) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * radius * 0.8;
                    x = targetX + Math.cos(angle) * distance;
                    y = targetY + Math.sin(angle) * distance;

                    validPosition = true;
                    for (const existingPos of positions) {
                        if (checkIntersection(x, y, existingPos.x, existingPos.y, minDistance)) {
                            validPosition = false;
                            break;
                        }
                    }

                    attempts++;
                }

                if (!validPosition) {
                    const angleStep = (2 * Math.PI) / stages.length;
                    const fixedAngle = idx * angleStep;
                    const fixedDistance = radius * 0.6;
                    x = targetX + Math.cos(fixedAngle) * fixedDistance;
                    y = targetY + Math.sin(fixedAngle) * fixedDistance;
                }

                positions.push({ x, y, stage });
            });

            return positions;
        },
        [checkIntersection, scale],
    );

    const stageConnections = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
    ];

    return (
        <>
            {isClient && appReady && (
                <Application width={canvasSize.width} height={canvasSize.height} antialias={true} resizeTo={window} autoDensity={true}>
                    <pixiContainer>
                        {bgTexture && <pixiSprite texture={bgTexture} width={canvasSize.width} height={canvasSize.height} alpha={0.4} />}

                        {!selectedPlanet && (
                            <>
                                <pixiText
                                    text="Gameplay: Fases de cada temática"
                                    style={titleStyle}
                                    x={canvasSize.width / 2}
                                    y={50 * scale}
                                    anchor={0.5}
                                />

                                <pixiText text={galaxy.name} style={galaxyNameStyle} x={canvasSize.width / 2} y={110 * scale} anchor={0.5} />

                                {connections.map((connection, index) => {
                                    const fromPlanet = sortedPlanets[connection.from];
                                    const toPlanet = sortedPlanets[connection.to];
                                    if (!fromPlanet || !toPlanet) return null;
                                    const fromPos = planetPositions[connection.from];
                                    const toPos = planetPositions[connection.to];
                                    return (
                                        <pixiGraphics
                                            key={`connection-${index}`}
                                            draw={(g: Graphics) =>
                                                drawDashedLine(
                                                    g,
                                                    fromPos.x * canvasSize.width,
                                                    fromPos.y * canvasSize.height,
                                                    toPos.x * canvasSize.width,
                                                    toPos.y * canvasSize.height,
                                                )
                                            }
                                        />
                                    );
                                })}

                                {sortedPlanets.slice(0, 4).map((planet, index) => {
                                    const position = planetPositions[index];
                                    const x = position.x * canvasSize.width;
                                    const y = position.y * canvasSize.height;
                                    return (
                                        <Planet
                                            handleOnClick={handlePlanetClick}
                                            key={planet.id}
                                            planet={planet}
                                            x={x}
                                            y={y}
                                            planetTextures={planetTextures}
                                            locked={!unlocked_planets.some((up) => up.id === planet.id)}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {selectedPlanet &&
                            planetTextures[selectedPlanet.id] &&
                            (() => {
                                const texture = planetTextures[selectedPlanet.id];
                                const expandedScale = canvasSize.height / 1.5 / texture.height / scale;
                                const targetX = canvasSize.width / 2;
                                const targetY = canvasSize.height / 2;
                                const index = sortedPlanets.findIndex((p) => p.id === selectedPlanet.id);
                                const initialPos = planetPositions[index];
                                const initialX = initialPos.x * canvasSize.width;
                                const initialY = initialPos.y * canvasSize.height;

                                const radius = (texture.height * expandedScale) / 2 - 80 / scale;
                                const stagePositions = generateStagePositions(selectedPlanet.stages, targetX, targetY, radius);
                                const sortedStages = [...selectedPlanet.stages].sort((a, b) => a.number - b.number);

                                return (
                                    <>
                                        <Planet
                                            planet={selectedPlanet}
                                            x={transitionStage === 'exit' ? targetX : initialX}
                                            y={transitionStage === 'exit' ? targetY : initialY}
                                            planetTextures={planetTextures}
                                            handleOnClick={() => {}}
                                            transitionStage={transitionStage}
                                            targetX={transitionStage === 'exit' ? initialX : targetX}
                                            targetY={transitionStage === 'exit' ? initialY : targetY}
                                            targetScale={transitionStage === 'exit' ? 1 : expandedScale}
                                            onTransitionEnd={handleTransitionEnd}
                                        />
                                        {showStages && transitionStage !== 'exit' && (
                                            <>
                                                <pixiText
                                                    text={selectedPlanet.name}
                                                    style={planetNameStyle}
                                                    x={canvasSize.width / 2}
                                                    y={60 * scale}
                                                    anchor={0.5}
                                                />

                                                {stageConnections.map((connection, index) => {
                                                    if (connection.from >= stagePositions.length || connection.to >= stagePositions.length)
                                                        return null;

                                                    const fromStage = stagePositions[connection.from];
                                                    const toStage = stagePositions[connection.to];

                                                    if (!fromStage || !toStage) return null;

                                                    return (
                                                        <pixiGraphics
                                                            key={`stage-connection-${index}`}
                                                            draw={(g: Graphics) => drawDashedLine(g, fromStage.x, fromStage.y, toStage.x, toStage.y)}
                                                        />
                                                    );
                                                })}

                                                {stagePositions.map(({ x, y, stage }) => (
                                                    <Stage
                                                        locked={!unlocked_stages.some((us) => us.id === stage.id)}
                                                        key={stage.id}
                                                        stage={stage}
                                                        x={x}
                                                        y={y}
                                                        stageTextures={stageTextures}
                                                    />
                                                ))}

                                                <pixiText
                                                    text={selectedPlanet.description}
                                                    style={planetDescriptionStyle}
                                                    x={canvasSize.width / 2}
                                                    y={130 * scale}
                                                    anchor={0.5}
                                                />
                                                <pixiText
                                                    text="Salir"
                                                    style={exitStyle}
                                                    x={canvasSize.width - 50 * scale}
                                                    y={30 * scale}
                                                    anchor={0.5}
                                                    interactive={true}
                                                    cursor="pointer"
                                                    onClick={handleExit}
                                                    onTap={handleExit}
                                                />
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                    </pixiContainer>
                </Application>
            )}
        </>
    );
}
