import { useScreen } from '@/Providers/ScreenProvider';
import Card from '@/types/card';
import { useTick } from '@pixi/react';
import { useCallback, useState } from 'react';

interface IDiscardedCardsStackProps {
    onClick: (value: boolean) => void;
    cards: Card[];
}

export default function DiscardedCardsStack({ onClick, cards }: IDiscardedCardsStackProps) {

    const { scale, screenSize } = useScreen();

    // Calcular dimensiones responsivas
    const getResponsiveDimensions = () => {
        return {
            scale,
            stackSize: 50 * scale,
            stackLayers: 4,
            layerOffsetX: -4 * scale,
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
            containerX: screenSize.width - 145 * scale,
            containerY: screenSize.height - 210 * scale,
            tooltipX: 30 * scale,
            tooltipY: 63 * scale,
            tooltipFontSize: 14 * scale,
            countX: 55 * scale,
            countY: 50 * scale,
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

                // Sombra de la carta
                g.beginFill(0x000000, 0.3);
                g.drawRoundedRect(
                    dimensions.stackSize + dimensions.shadowOffset + offsetX,
                    dimensions.stackSize + dimensions.shadowOffset + offsetY,
                    dimensions.stackSize,
                    dimensions.stackSize,
                    dimensions.borderRadius,
                );
                g.endFill();

                // Fondo principal de la carta
                g.beginFill(0x2a2a2a);
                g.lineStyle(dimensions.borderWidth, 0x1a1a1a, 1);
                g.drawRoundedRect(
                    dimensions.stackSize + offsetX,
                    dimensions.stackSize + offsetY,
                    dimensions.stackSize,
                    dimensions.stackSize,
                    dimensions.borderRadius,
                );
                g.endFill();

                // Borde interno
                g.lineStyle(dimensions.innerBorderWidth, 0x404040, 1);
                g.drawRoundedRect(
                    dimensions.stackSize + dimensions.shadowOffset + offsetX,
                    dimensions.stackSize + dimensions.shadowOffset + offsetY,
                    dimensions.stackSize - dimensions.shadowOffset * 2,
                    dimensions.stackSize - dimensions.shadowOffset * 2,
                    dimensions.innerBorderRadius,
                );

                // Líneas de texto simuladas
                g.lineStyle(dimensions.innerBorderWidth, 0x555555, 0.8);

                // Primera línea
                g.moveTo(dimensions.stackSize + dimensions.lineStartX + offsetX, dimensions.stackSize + dimensions.lineStartY + offsetY);
                g.lineTo(dimensions.stackSize + dimensions.lineEndX + offsetX, dimensions.stackSize + dimensions.lineStartY + offsetY);

                // Segunda línea
                g.moveTo(
                    dimensions.stackSize + dimensions.lineStartX + offsetX,
                    dimensions.stackSize + dimensions.lineStartY + dimensions.lineSpacing + offsetY,
                );
                g.lineTo(
                    dimensions.stackSize + dimensions.lineEndX + offsetX,
                    dimensions.stackSize + dimensions.lineStartY + dimensions.lineSpacing + offsetY,
                );

                // Tercera línea
                g.moveTo(
                    dimensions.stackSize + dimensions.lineStartX + offsetX,
                    dimensions.stackSize + dimensions.lineStartY + dimensions.lineSpacing * 2 + offsetY,
                );
                g.lineTo(
                    dimensions.stackSize + dimensions.lineEndX + offsetX,
                    dimensions.stackSize + dimensions.lineStartY + dimensions.lineSpacing * 2 + offsetY,
                );
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

            {/* Tooltip al hacer hover */}
            {isHovered && (
                <pixiText
                    text="Mostrar cartas descartadas"
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

            {/* Contador de cartas */}
            <pixiText
                text={`${cards.length}`}
                x={dimensions.countX}
                y={dimensions.countY}
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
