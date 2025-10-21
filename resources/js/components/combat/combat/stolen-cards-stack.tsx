import { useScreen } from '@/Providers/ScreenProvider';
import Card from '@/types/card';
import { useTick } from '@pixi/react';
import { useCallback, useState } from 'react';

interface IStolenCardsStackProps {
    onClick: (value: boolean) => void;
    cards: Card[];
}

export default function StolenCardsStack({ cards, onClick }: IStolenCardsStackProps) {
    const { scale, screenSize } = useScreen();

    // Calcular dimensiones responsivas
    const getResponsiveDimensions = () => {
        return {
            scale,
            stackSize: 50 * scale,
            stackLayers: 4,
            layerOffsetX: 4 * scale,
            layerOffsetY: -4 * scale,
            shadowOffset: 2 * scale,
            borderRadius: 4 * scale,
            innerBorderRadius: 2 * scale,
            borderWidth: 2 * scale,
            innerBorderWidth: 1 * scale,
            lineSpacing: 7 * scale,
            lineStartX: 10 * scale,
            lineEndX: 42 * scale,
            lineStartY: 18 * scale,
            containerX: screenSize.width * 0.12, // 12% del ancho
            containerY: screenSize.height * 0.82, // 85% del alto
            tooltipX: 160 * scale,
            tooltipY: 20 * scale,
            tooltipFontSize: 14 * scale,
            countX: 28 * scale,
            countY: 0 * scale,
            countFontSize: 24 * scale,
            floatMultiplier: 3 * scale,
        };
    };

    const dimensions = getResponsiveDimensions();
    const [isHovered, setIsHovered] = useState(false);
    const [floatAnimation, setFloatAnimation] = useState(0);

    const drawCardStack = useCallback(
        (g: any) => {
            g.clear();

            for (let i = 0; i < dimensions.stackLayers; i++) {
                const offsetX = i * dimensions.layerOffsetX;
                const offsetY = i * dimensions.layerOffsetY;

                g.roundRect(
                    dimensions.shadowOffset + offsetX,
                    dimensions.shadowOffset + offsetY,
                    dimensions.stackSize,
                    dimensions.stackSize,
                    dimensions.borderRadius,
                );
                g.fill({ color: 0x000000, alpha: 0.3 });

                g.roundRect(offsetX, offsetY, dimensions.stackSize, dimensions.stackSize, dimensions.borderRadius);
                g.fill({ color: 0x2a2a2a });
                g.stroke({ color: 0x1a1a1a, width: dimensions.borderWidth });

                g.moveTo(dimensions.lineStartX + offsetX, dimensions.lineStartY + offsetY);
                g.lineTo(dimensions.lineEndX + offsetX, dimensions.lineStartY + offsetY);
                g.stroke({ color: 0x555555, width: dimensions.innerBorderWidth, alpha: 0.8 });
            }
        },
        [cards.length, dimensions],
    );

    useTick(() => {
        setFloatAnimation((prev) => prev + 0.02);
    });

    const floatOffset = Math.sin(floatAnimation) * dimensions.floatMultiplier;

    return (
        <pixiContainer
            cursor="pointer"
            interactive={true}
            x={dimensions.containerX}
            y={dimensions.containerY + floatOffset}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onClick={() => onClick(true)}
        >
            <pixiGraphics draw={drawCardStack} />

            {isHovered && (
                <pixiText
                    text="Mostrar cartas robadas"
                    x={dimensions.tooltipX}
                    y={dimensions.tooltipY}
                    anchor={{ x: 1, y: 0.5 }}
                    style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: dimensions.tooltipFontSize,
                        fill: '#ffffff',
                        stroke: '#000000',
                        dropShadow: true,
                    }}
                />
            )}

            <pixiText
                text={`${cards.length}`}
                x={dimensions.countX + 11 * scale}
                y={dimensions.countY + 12 * scale}
                anchor={0.5}
                style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: dimensions.countFontSize,
                    fill: '#ffffff',
                    stroke: '#000000',
                    dropShadow: true,
                }}
            />
        </pixiContainer>
    );
}
