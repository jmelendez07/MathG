import { useScreen } from '@/providers/screen-provider';
import ICard from '@/types/card';
import IEnemy from '@/types/enemy';
import IExercise, { Option } from '@/types/exercise';
import { extend } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Assets, Container, Graphics, Point, Sprite, Text, Texture } from 'pixi.js';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Answer } from './answer';
import { Tricks } from './tricks';

extend({ Container, Sprite, Text, Graphics, Point });

interface IExerciseProps {
    enemy: IEnemy;
    card: ICard;
    exercise: IExercise;
    onClose?: () => void;
    attack: () => void;
    onIsAttacking: (isAttacking: boolean) => void;
}

const assetSword = '/assets/sword.png';
const assetTrick = '/assets/ui/tricks-ui.png';

export const Exercise = ({ enemy, card, exercise, onClose, onIsAttacking, attack }: IExerciseProps) => {
    const bgAsset = '/assets/ui/exercise-ui.png';
    const answersAsset = '/assets/ui/answers-ui.png';
    const [swordTexture, setSwordTexture] = useState<Texture | null>(null);
    const [bgTexture, setBgTexture] = useState<Texture | null>(null);
    const [answersTexture, setAnswersTexture] = useState<Texture | null>(null);
    const [trickTexture, setTrickTexture] = useState<Texture>(Texture.EMPTY);
    const [isAnswerIsDragging, setIsAnswerIsDragging] = useState(false);
    const [isOverTarget, setIsOverTarget] = useState(false);
    const [isShowingTricks, setIsShowingTricks] = useState(false);
    const [isCancellingAnswer, setIsCancellingAnswer] = useState(false);
    const [answerSelectedPosition, setAnswerSelectedPosition] = useState<{ x: number; y: number } | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [playerAnswers, setPlayerAnswers] = useState<{ result: string; is_correct: boolean }[]>([]);
    const [selectedWrongOption, setSelectedWrongOption] = useState<Option | null>(null);
    const [maxOptionWidth, setMaxOptionWidth] = useState<number>(0);

    const textMeasurementsRef = useRef<Map<number, number>>(new Map());

    const handleTextMeasured = useCallback((measurement: { id: number; width: number }) => {
        textMeasurementsRef.current.set(measurement.id, measurement.width);

        // Calcular el máximo width
        const max = Math.max(...Array.from(textMeasurementsRef.current.values()));
        setMaxOptionWidth(max);
    }, []);

    const { scale, screenSize } = useScreen();

    const width = screenSize.width * 0.5;
    const height = screenSize.height * 0.8;
    const containerX = screenSize.width / 2 - width / 2;
    const containerY = screenSize.height / 2 - height / 2;

    // Calcular el ancho del contenedor de respuestas basándose en las opciones
    const calculateAnswersWidth = () => {
        if (maxOptionWidth > 0 && exercise?.steps?.[currentStep]?.options) {
            const numOptions = exercise.steps[currentStep].options.length;
            const internalPadding = scale; // Debe coincidir con answer.tsx
            const boxWidth = maxOptionWidth + internalPadding;
            const spacing = 10 * scale; // Espacio entre cajas
            const containerPadding = 20 * scale; // Padding del contenedor

            // Ancho total: padding inicial + (N cajas * ancho) + ((N-1) espacios) + padding final
            const totalWidth = containerPadding * 2 + numOptions * boxWidth + (numOptions - 1) * spacing;

            return totalWidth;
        }
        return screenSize.width * 0.45; // Valor por defecto
    };

    const answersWidth = calculateAnswersWidth();
    const centerXRelativeToContainer = (width - answersWidth) / 2;
    const exerciseContainerX = screenSize.width / 2 - (screenSize.width * 0.5) / 2;
    const exerciseContainerY = screenSize.height / 2 - (screenSize.height * 0.8) / 2;

    const answerTargetRef = useRef<Graphics>(null);
    const answersGraphicsRef = useRef<Graphics>(null);
    const draggingAnswerRef = useRef<Container | null>(null);
    const exerciseContainerRef = useRef<Container>(null);
    const tricksRef = useRef<{ triggerClose: () => void } | null>(null);

    // Cálculo para visibilidad de flechas
    const topBoundary = 80;
    const bottomBoundary = 430;
    const answerItemHeight = height / 10;
    const singleStepHeight = answerItemHeight + 10;
    const totalStepsHeight = playerAnswers.length * singleStepHeight;
    const visibleHeight = bottomBoundary - topBoundary;
    const hasOverflow = totalStepsHeight > visibleHeight;
    const minScroll = hasOverflow ? bottomBoundary - (answerItemHeight + 21 + totalStepsHeight) : 0;

    const canScrollUp = hasOverflow && scrollOffset < 0;
    const canScrollDown = hasOverflow && scrollOffset > minScroll;

    const handleAnswerDragStart = (answerContainer: Container | null) => {
        draggingAnswerRef.current = answerContainer;
    };
    // Guardar el stat base de la carta para resetearlo después del ejercicio
    const [cardBaseStat] = useState<number | null>(card ? card.stats : null);

    const handleAnswerDragEnd = useCallback(
        (answerContainer: Container | null, selectedOption: Option) => {
            if (answerContainer && answerTargetRef.current && answersGraphicsRef.current) {
                const answerBounds = answerContainer.getBounds();

                // Comprobar si se soltó en el área de cancelación (respuestas)
                const answersBounds = answersGraphicsRef.current.getBounds();
                const isOverAnswersArea =
                    answerBounds.x < answersBounds.x + answersBounds.width &&
                    answerBounds.x + answerBounds.width > answersBounds.x &&
                    answerBounds.y < answersBounds.y + answersBounds.height &&
                    answerBounds.y + answerBounds.height > answersBounds.y;

                if (isOverAnswersArea) {
                    console.log('Answer cancelled.');
                } else {
                    const targetBounds = answerTargetRef.current.getBounds();
                    const isOverTargetArea =
                        answerBounds.x < targetBounds.x + targetBounds.width &&
                        answerBounds.x + answerBounds.width > targetBounds.x &&
                        answerBounds.y < targetBounds.y + targetBounds.height &&
                        answerBounds.y + answerBounds.height > targetBounds.y;

                    if (isOverTargetArea) {
                        console.log('Answer dropped in the exercise area!');
                        console.log('Selected answer:', selectedOption);
                        setPlayerAnswers((prev) => [...prev, { result: selectedOption.result, is_correct: selectedOption.is_correct }]);

                        if (selectedOption.is_correct) {
                            const nextStep = currentStep + 1;
                            setCurrentStep(nextStep);

                            if (nextStep === exercise!.steps!.length) {
                                attack();
                                onIsAttacking(false);
                                //resetear el stat de la carta
                                if (card && cardBaseStat) {
                                    card.stats = cardBaseStat;
                                    console.log('Card attack stat reset to base:', card.stats);
                                }
                            }
                        } else {
                            console.log('Wrong answer, try again.');
                            setSelectedWrongOption(selectedOption);
                            setIsShowingTricks(true);
                            const newDamage = updateAttackStat(card);
                            if (newDamage) {
                                console.log('New damage after wrong answer:', newDamage);
                                card!.stats = newDamage; // Actualiza el stat de la carta
                            }
                        }
                    } else {
                        console.log('Answer dropped outside target area.');
                    }
                }
            } else {
                console.log('Answer dropped outside target area.');
            }

            draggingAnswerRef.current = null;
            setIsOverTarget(false);
            setIsCancellingAnswer(false);
        },
        [currentStep, exercise, onIsAttacking, card, cardBaseStat], // ← Dependencias actualizadas
    );

    const updateAttackStat = (card: ICard | null) => {
        if (card) {
            const updatedCard = { ...card, stats: card.stats - card.stats * 0.1 }; // Reduce en 10% el stat de ataque
            console.log('Card attack stat decreased:', updatedCard);
            const newDamage = updatedCard.stats;
            return Math.floor(newDamage);
        }
    };

    const handleWheelOnExerciseArea = useCallback(
        (e: PIXI.FederatedWheelEvent) => {
            e.stopPropagation();
            const delta = e.deltaY * 0.5;

            setScrollOffset((prevOffset) => {
                const newOffset = prevOffset - delta;

                const topBoundary = 80 * scale;
                const bottomBoundary = 430 * scale;
                const visibleHeight = bottomBoundary - topBoundary;

                const answerHeight = height / 10;
                const singleStepHeight = answerHeight + 10;
                const totalStepsHeight = playerAnswers.length * singleStepHeight;

                const maxScroll = 0;
                if (newOffset > maxScroll) return maxScroll;

                if (totalStepsHeight > visibleHeight) {
                    const minScroll = bottomBoundary - (answerHeight + 21 + playerAnswers.length * singleStepHeight);
                    if (newOffset < minScroll) return minScroll;
                } else {
                    return maxScroll;
                }

                return newOffset;
            });
        },
        [playerAnswers.length, height],
    );

    const scrollByArrow = useCallback(
        (direction: 'up' | 'down') => {
            setScrollOffset((prev) => {
                const topBoundary = 80;
                const bottomBoundary = 430;

                const answerHeight = height / 10;
                const singleStepHeight = answerHeight + 10;
                const totalStepsHeight = playerAnswers.length * singleStepHeight;
                const visibleHeight = bottomBoundary - topBoundary;

                const maxScroll = 0;
                const minScroll = totalStepsHeight > visibleHeight ? bottomBoundary - (answerHeight + 21 + totalStepsHeight) : 0;

                const delta = direction === 'up' ? singleStepHeight : -singleStepHeight;
                let next = prev + delta;

                if (next > maxScroll) next = maxScroll;
                if (next < minScroll) next = minScroll;

                return next;
            });
        },
        [height, playerAnswers.length],
    );

    useEffect(() => {
        if (isAnswerIsDragging && draggingAnswerRef.current && answersGraphicsRef.current && answerTargetRef.current) {
            const answerBounds = draggingAnswerRef.current.getBounds();

            // 1. Comprobar colisión con el área de respuestas (pequeña)
            const answersBounds = answersGraphicsRef.current.getBounds();
            const isOverAnswersArea =
                answerBounds.x < answersBounds.x + answersBounds.width &&
                answerBounds.x + answerBounds.width > answersBounds.x &&
                answerBounds.y < answersBounds.y + answersBounds.height &&
                answerBounds.y + answerBounds.height > answersBounds.y;

            if (isOverAnswersArea) {
                // Si está sobre el área de respuestas, activa su borde y desactiva el del objetivo grande.
                setIsCancellingAnswer(true);
                setIsOverTarget(false);
                console.log('Over answers area, cancelling answer...');
            } else {
                // 2. Si no está sobre el área de respuestas, comprobar colisión con el área objetivo (grande)
                const targetBounds = answerTargetRef.current.getBounds();
                const isOverTargetArea =
                    answerBounds.x < targetBounds.x + targetBounds.width &&
                    answerBounds.x + answerBounds.width > targetBounds.x &&
                    answerBounds.y < targetBounds.y + targetBounds.height &&
                    answerBounds.y + answerBounds.height > targetBounds.y;

                // Activa el borde del objetivo grande y desactiva el del área de respuestas.
                setIsOverTarget(isOverTargetArea);
                setIsCancellingAnswer(false);
                console.log(isOverTargetArea ? 'Over target area!' : 'Not over target area.');
            }
        } else {
            // Si no se está arrastrando, resetear ambos estados
            setIsOverTarget(false);
            setIsCancellingAnswer(false);
        }
    }, [isAnswerIsDragging, answerSelectedPosition]); // Se ejecuta en cada movimiento

    useEffect(() => {
        if (playerAnswers.length > 0) {
            const topBoundary = 80;
            const bottomBoundary = 430; // ← unificado con el wheel y el render
            const answerHeight = height / 10;
            const singleStepHeight = answerHeight + 10;

            const visibleHeight = bottomBoundary - topBoundary;
            const totalStepsHeight = playerAnswers.length * singleStepHeight;

            if (totalStepsHeight > visibleHeight) {
                // Offset exacto para alinear el último elemento al borde inferior visible
                const newScrollOffset = bottomBoundary - (answerHeight + 21 + playerAnswers.length * singleStepHeight);

                setScrollOffset(Math.min(0, newScrollOffset)); // clamp por arriba
            }
        }
    }, [playerAnswers.length, height]); // Se ejecuta cada vez que se añade una respuesta

    useEffect(() => {
        let cancelled = false;

        Assets.load<Texture>(bgAsset)
            .then((tex) => {
                if (!cancelled) {
                    setBgTexture(tex);
                }
            })
            .catch((err) => {
                console.error('Failed to load background texture:', err);
            });

        Assets.load<Texture>(answersAsset)
            .then((tex) => {
                if (!cancelled) {
                    setAnswersTexture(tex);
                }
            })
            .catch((err) => {
                console.error('Failed to load answers texture:', err);
            });

        Assets.load<Texture>(assetTrick)
            .then((tex) => {
                if (!cancelled) {
                    setTrickTexture(tex);
                }
            })
            .catch((err) => {
                console.error('Failed to load tricks texture:', err);
            });

        return () => {
            cancelled = true;
            bgTexture?.destroy();
            answersTexture?.destroy();
        };
    }, [bgAsset, assetTrick]);

    useEffect(() => {
        Assets.load<Texture>(assetSword).then((texture) => {
            setSwordTexture(texture);
        });

        return () => {
            swordTexture?.destroy();
        };
    }, []);

    const handleTricksToggle = () => {
        if (isShowingTricks) {
            // Si está mostrando trucos, activar la animación de cierre
            tricksRef.current?.triggerClose();
        } else {
            // Si no está mostrando trucos, mostrarlos
            setIsShowingTricks(true);
        }
    };

    return (
        <>
        <pixiContainer
            ref={exerciseContainerRef}
            x={exerciseContainerX}
            y={exerciseContainerY}
            onWheel={handleWheelOnExerciseArea}
            interactive={true}
            sortableChildren={true}
            zIndex={10}
        >
            {bgTexture && <pixiSprite texture={bgTexture} width={width} height={height} />}

            <pixiText
                text="✕"
                x={width - 50 * scale}
                y={50 * scale}
                anchor={0.5}
                zIndex={10}
                interactive={true}
                cursor="pointer"
                onClick={onClose}
                onTap={onClose}
                style={{
                    fontSize: 32 * scale,
                    fill: 0xffffff,
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                }}
            />

            <pixiContainer zIndex={10} x={(width / 5) * 4} y={35.5 * scale}>
                <pixiText
                    text={'?'}
                    x={0}
                    y={0}
                    cursor="pointer"
                    interactive={true}
                    onClick={handleTricksToggle}
                    onTap={handleTricksToggle}
                    zIndex={10}
                    style={{
                        fontSize: 28 * scale,
                        fill: 0xffffff,
                        fontFamily: 'Arial',
                    }}
                />
                <pixiText
                    text={card?.stats}
                    x={30 * scale}
                    y={0}
                    style={{
                        fontSize: 28 * scale,
                        fill: 0xffffff,
                        fontFamily: 'Arial',
                    }}
                />
                {swordTexture && <pixiSprite texture={swordTexture} x={60 * scale} y={0} width={45 * scale} height={30 * scale} />}
            </pixiContainer>

            <pixiText
                text={exercise?.operation || ''}
                x={50 * scale}
                y={50 * scale}
                anchor={{ x: 0, y: 0.5 }}
                zIndex={1}
                style={{
                    fontSize: 24 * scale,
                    fill: 0xffffff,
                    fontFamily: 'Arial',
                }}
            />

            {canScrollUp && (
                <pixiText
                    text="↑"
                    x={width / 2}
                    y={50}
                    anchor={0.5}
                    zIndex={1}
                    interactive={true}
                    cursor="pointer"
                    onClick={() => scrollByArrow('up')}
                    style={{ fontSize: 24, fill: 0xffffff, fontFamily: 'Arial' }}
                />
            )}

            {canScrollDown && (
                <pixiText
                    text="↓"
                    x={width / 2}
                    y={height / 2}
                    anchor={0.5}
                    zIndex={1}
                    interactive={true}
                    cursor="pointer"
                    onClick={() => scrollByArrow('down')}
                    style={{ fontSize: 24, fill: 0xffffff, fontFamily: 'Arial' }}
                />
            )}

            {playerAnswers.map((step, index) => {
                const answerHeight = height / 10;
                const singleStepHeight = answerHeight + 10;

                const answerY = 21 + (index + 1) * singleStepHeight + scrollOffset;
                const topBoundary = 80 * scale;
                const bottomBoundary = 430 * scale;

                const isVisible = answerY >= topBoundary && answerY + answerHeight <= bottomBoundary;

                if (!isVisible) return null;

                return (
                    <pixiContainer key={index} zIndex={0}>
                        <Fragment key={index}>
                            <pixiGraphics
                                draw={(g) => {
                                    g.clear();
                                    g.roundRect(26 * scale, answerY, width - 55 * scale, answerHeight, 8 * scale); // ✅ Añadido borderRadius escalado
                                    g.fill({ color: 0x000000, alpha: 0.01 });
                                    g.stroke({ color: step.is_correct ? 0x00ff00 : 0xff0000, width: 2 * scale });
                                }}
                            />
                            <pixiText
                                text={step.result}
                                x={50 * scale}
                                y={answerY + answerHeight / 2}
                                anchor={{ x: 0, y: 0.5 }}
                                zIndex={1}
                                style={{ fontSize: 24 * scale, fill: 0xffffff, fontFamily: 'Arial' }}
                            />
                        </Fragment>
                    </pixiContainer>
                );
            })}
            {answersTexture && (
                <pixiContainer x={centerXRelativeToContainer} y={screenSize.height * 0.65} width={answersWidth} height={screenSize.height * 0.2} zIndex={1}>
                    <pixiSprite texture={answersTexture} width={answersWidth} height={screenSize.height * 0.2} />
                    {exercise &&
                        exercise.steps &&
                        (() => {
                            const containerPadding = 20 * scale;
                            const availableHeight = screenSize.height * 0.2 - containerPadding * 2;

                            const internalPadding = scale; // Debe coincidir con answer.tsx
                            const boxWidth = maxOptionWidth > 0 ? maxOptionWidth + internalPadding : 100 * scale;
                            const spacing = 10 * scale; // Espacio entre cajas

                            return exercise.steps[currentStep].options.map((opt, index) => {
                                const xPosition = containerPadding + index * (boxWidth + spacing);
                                const yPosition = containerPadding;
                                const answerHeight = availableHeight;

                                return (
                                    <Answer
                                        key={opt.id}
                                        option={opt}
                                        x={xPosition}
                                        y={yPosition}
                                        width={boxWidth}
                                        height={answerHeight}
                                        containerX={containerX}
                                        containerY={containerY}
                                        maxWidth={maxOptionWidth}
                                        onIsDraggingChange={setIsAnswerIsDragging}
                                        onAnswerPositionChange={setAnswerSelectedPosition}
                                        onDragStart={handleAnswerDragStart}
                                        onDragEnd={handleAnswerDragEnd}
                                        onTextMeasured={handleTextMeasured}
                                    />
                                );
                            });
                        })()}
                    {isAnswerIsDragging && (
                        <pixiGraphics
                            ref={answersGraphicsRef}
                            draw={(g) => {
                                g.clear();
                                g.rect(0, 0, answersWidth, screenSize.height * 0.2);
                                g.stroke({ color: isCancellingAnswer ? 0x00ff00 : 0x0000ff, width: 5 });
                            }}
                        />
                    )}
                </pixiContainer>
            )}
            {isAnswerIsDragging && (
                <pixiGraphics
                    ref={answerTargetRef}
                    draw={(g) => {
                        g.clear();
                        g.rect(0, 0, width, height);
                        g.stroke({ color: isOverTarget ? 0x00ff00 : 0x0000ff, width: 5 });
                    }}
                />
            )}
        </pixiContainer>
        {isShowingTricks && (
                <Tricks
                    ref={tricksRef}
                    texture={trickTexture}
                    onClose={() => setIsShowingTricks(false)}
                    exercise={exercise}
                    selectedOption={selectedWrongOption}
                />
            )}
        </>
    );
};
