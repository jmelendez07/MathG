import { useScreen } from '@/providers/screen-provider';
import ICard from '@/types/card';
import { extend, useTick } from '@pixi/react';
import { Assets, ColorMatrixFilter, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { useEffect, useMemo, useRef, useState } from 'react';

extend({ Container, Sprite, Graphics });

interface ICardProps {
    card: ICard;
    onSelectedCard: (card: ICard | null) => void;
    onHeldDownChange: (isHeldDown: boolean) => void;
    onCardPositionChange: (cardPosition: { x: number; y: number }) => void;
    onCurrentHeroInCombatId?: (id: string) => void;
    isTargetAssigned?: boolean;
    onAttack?: (isAttacking: boolean) => void;
    initialPosition?: { x: number; y: number };
    initialRotation?: number;
    isDisabled?: boolean;
    texture: Texture;
}

export const Card = ({
    card,
    onSelectedCard,
    onHeldDownChange,
    onCardPositionChange,
    onCurrentHeroInCombatId,
    isTargetAssigned,
    onAttack,
    initialPosition,
    initialRotation,
    isDisabled = false,
    texture
}: ICardProps) => {
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const defaultPosition = initialPosition || { x: 500, y: 600 };
    const [cardPosition, setCardPosition] = useState(defaultPosition);
    const [targetCardPosition, setTargetCardPosition] = useState(defaultPosition);
    const [cardRotation, setCardRotation] = useState(initialRotation || 0);
    const [targetCardRotation, setTargetCardRotation] = useState(initialRotation || 0);
    const [currentHoverOffset, setCurrentHoverOffset] = useState(0);
    const [currentAlpha, setCurrentAlpha] = useState(0.8);
    const [currentTint, setCurrentTint] = useState(0x808080);
    const targetAlpha = isDisabled ? 0.6 : isHovered || isPointerDown ? 1.0 : 0.8;
    const targetTint = isDisabled ? 0xffffff : isHovered || isPointerDown ? 0xffffff : 0x808080;
    const sizeOperationRef = useRef<Text | null>(null);
    const [sizeOperationList, setSizeOperationList] = useState<number[]>([]);
    const [operationText, setOperationText] = useState(card.exercise.operation);

    const { scale } = useScreen();

    // Calcular tamaño de carta basado en la pantalla
    const getCardDimensions = () => {
        const baseWidth = 200 * scale;
        const baseHeight = 300 * scale;

        return {
            width: baseWidth,
            height: baseHeight,
            scale: scale,
        };
    };

    const cardDimensions = getCardDimensions();

    const targetHoverOffset = isHovered && !isPointerDown && !isDisabled ? -20 * cardDimensions.scale : 0;

    const grayscaleFilter = useMemo(() => {
        const filter = new ColorMatrixFilter();
        filter.desaturate();
        return filter;
    }, []);

    const currentCardPosition = {
        x: cardPosition.x,
        y: cardPosition.y + currentHoverOffset,
    };

    useTick(() => {
        const lerpSpeed = 0.15;

        if (!isPointerDown) {
            const posDiffX = targetCardPosition.x - cardPosition.x;
            const posDiffY = targetCardPosition.y - cardPosition.y;
            if (Math.abs(posDiffX) > 0.5 || Math.abs(posDiffY) > 0.5) {
                setCardPosition((prev) => ({
                    x: prev.x + posDiffX * lerpSpeed,
                    y: prev.y + posDiffY * lerpSpeed,
                }));
            } else if (posDiffX !== 0 || posDiffY !== 0) {
                setCardPosition(targetCardPosition);
            }

            const rotDiff = targetCardRotation - cardRotation;
            if (Math.abs(rotDiff) > 0.01) {
                setCardRotation((prev) => prev + rotDiff * lerpSpeed);
            } else if (rotDiff !== 0) {
                setCardRotation(targetCardRotation);
            }
        }

        const offsetDiff = targetHoverOffset - currentHoverOffset;
        if (Math.abs(offsetDiff) > 0.1) {
            setCurrentHoverOffset((prev) => prev + offsetDiff * lerpSpeed);
        } else if (offsetDiff !== 0) {
            setCurrentHoverOffset(targetHoverOffset);
        }

        const alphaDiff = targetAlpha - currentAlpha;
        if (Math.abs(alphaDiff) > 0.01) {
            setCurrentAlpha((prev) => prev + alphaDiff * lerpSpeed);
        } else if (alphaDiff !== 0) {
            setCurrentAlpha(targetAlpha);
        }

        const currentR = (currentTint >> 16) & 0xff;
        const currentG = (currentTint >> 8) & 0xff;
        const currentB = currentTint & 0xff;

        const targetR = (targetTint >> 16) & 0xff;
        const targetG = (targetTint >> 8) & 0xff;
        const targetB = targetTint & 0xff;

        const newR = Math.round(currentR + (targetR - currentR) * lerpSpeed);
        const newG = Math.round(currentG + (targetG - currentG) * lerpSpeed);
        const newB = Math.round(currentB + (targetB - currentB) * lerpSpeed);

        const newTint = (newR << 16) | (newG << 8) | newB;

        if (newTint !== currentTint) {
            setCurrentTint(newTint);
        }
    });

    const handlePointerDown = () => {
        if (isDisabled) return;
        setIsPointerDown(true);
        setCardRotation(0);
        onHeldDownChange(true);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handlePointerMove = (event: PointerEvent) => {
        const globalPos = {
            x: event.clientX - cardDimensions.width / 2,
            y: event.clientY - cardDimensions.height / 2,
        };
        setCardPosition(globalPos);
        onCardPositionChange({ x: event.clientX, y: event.clientY });
    };

    const handlePointerUp = () => {
        setIsPointerDown(false);
        onHeldDownChange(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        setTargetCardRotation(initialRotation || 0);
        setTargetCardPosition(initialPosition || { x: 500, y: 600 });
    };

    const handlePointerOver = () => {
        if (!isPointerDown && !isDisabled) {
            setIsHovered(true);
            onCurrentHeroInCombatId?.(card.hero_id);
        }
    };

    const handlePointerOut = () => {
        if (!isDisabled) setIsHovered(false);
    };

    useEffect(() => {
        setTimeout(() => {
            const width = sizeOperationRef.current?.getBounds().width || 0;
            setSizeOperationList((prev) => [...prev, width]);
        }, 0);
    }, [card.exercise.operation]);

    useEffect(() => {
        if (!isPointerDown && isTargetAssigned) {
            onAttack?.(true);
            onSelectedCard(card);
        }
    }, [isPointerDown]);

    useEffect(() => {
        sizeOperationList.map((size, index) => {
            if (size > 90 * cardDimensions.scale) {
                const text = card.exercise.operation;
                // Buscar "f(x) = " o "F´(x) = " y agregar salto de línea
                const formattedText = text.replace(/(f['´]?\s*\([^)]+\)\s*=\s*)/i, '$1\n');
                setOperationText(formattedText);
            }
        });
    }, [sizeOperationList, card.exercise.operation, cardDimensions.scale]);

    useEffect(() => {
        setOperationText(card.exercise.operation);
    }, [card.exercise.operation]);

    // Calcular posiciones de texto relativas al tamaño de la carta
    const centerX = currentCardPosition.x + cardDimensions.width / 2;
    const centerY = currentCardPosition.y + cardDimensions.height / 2;

    return (
        <pixiContainer interactive={!isDisabled} onPointerDown={handlePointerDown} cursor={isDisabled ? 'default' : 'pointer'} zIndex={9}>
            {texture && (
                <pixiSprite
                    width={cardDimensions.width}
                    anchor={0.5}
                    height={cardDimensions.height}
                    tint={currentTint}
                    interactive={!isDisabled}
                    alpha={isPointerDown && isTargetAssigned ? 0.2 : currentAlpha}
                    texture={texture}
                    rotation={cardRotation}
                    x={centerX}
                    y={centerY}
                    onPointerOut={handlePointerOut}
                    onPointerOver={handlePointerOver}
                    filters={isDisabled ? [grayscaleFilter] : []}
                />
            )}

            {/* Costo de energía - esquina superior izquierda */}
            <pixiContainer x={centerX} y={centerY} rotation={cardRotation}>
                <pixiText
                    ref={sizeOperationRef}
                    text={card.energy_cost}
                    x={-cardDimensions.width * 0.37} // Proporcional al ancho
                    y={-cardDimensions.height * 0.43} // Proporcional al alto
                    anchor={0.5}
                    zIndex={1}
                    style={{
                        fontSize: 18 * cardDimensions.scale,
                        fill: 0xffffff,
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                    }}
                />
            </pixiContainer>

            {/* Operación - centro de la carta */}
            <pixiContainer x={centerX} y={centerY} rotation={cardRotation}>
                <pixiText
                    ref={sizeOperationRef}
                    text={operationText}
                    x={0} // Proporcional al ancho
                    y={cardDimensions.height * 0.2} // Proporcional al alto
                    anchor={{ x: 0.5, y: 0.5 }}
                    zIndex={1}
                    style={{
                        fontSize: 20 * cardDimensions.scale,
                        fill: 0xffffff,
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        align: 'center',
                        wordWrap: true,
                        wordWrapWidth: cardDimensions.width * 0.8,
                    }}
                />
            </pixiContainer>

            {/* Stats - esquina inferior derecha */}
            <pixiContainer x={centerX} y={centerY} rotation={cardRotation}>
                <pixiText
                    text={card.stats}
                    x={cardDimensions.width * 0.25 - 20 * scale} // Proporcional al ancho
                    y={cardDimensions.height * 0.42} // Proporcional al alto
                    anchor={0.5}
                    zIndex={1}
                    style={{
                        fontSize: 20 * cardDimensions.scale,
                        fill: 0xffffff,
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                    }}
                />
            </pixiContainer>
        </pixiContainer>
    );
};
