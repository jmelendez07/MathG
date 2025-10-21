import { useScreen } from '@/providers/screen-provider';
import { useTick } from '@pixi/react';
import { useState } from 'react';

interface INextTurnButtonProps {
    onClick?: () => void;
}

export default function NextTurnButton({ onClick }: INextTurnButtonProps) {
    const { scale, screenSize } = useScreen();

    // Calcular dimensiones responsivas
    const getResponsiveDimensions = () => {
        return {
            scale,
            buttonWidth: 200 * scale,
            buttonHeight: 60 * scale,
            borderRadius: 12 * scale,
            borderWidth: 2 * scale,
            fontSize: 20 * scale,
            strokeWidth: 1 * scale,
            marginX: 240 * scale,
            marginY: 100 * scale,
            shadowOffset: 5 * scale,
            hoverYOffset: 3 * scale,
        };
    };

    const dimensions = getResponsiveDimensions();
    const [isHovered, setIsHovered] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);

    useTick(() => {
        const target = isHovered ? 1 : 0;
        const speed = 0.1;
        setAnimationProgress((prev) => {
            const diff = target - prev;
            if (Math.abs(diff) < 0.01) return target;
            return prev + diff * speed;
        });
    });

    const interpolateColor = (color1: number, color2: number, progress: number) => {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;

        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);

        return (r << 16) | (g << 8) | b;
    };

    const backgroundColor = interpolateColor(0x2c2c2c, 0xffd700, animationProgress);
    const borderColor = interpolateColor(0x444444, 0xdaa520, animationProgress);
    const strokeColor = interpolateColor(0x000000, 0xdaa520, animationProgress);

    const yOffset = animationProgress * dimensions.hoverYOffset;
    const shadowAlpha = (1 - animationProgress) * 0.3;

    return (
        <pixiContainer
            x={screenSize.width - dimensions.marginX}
            y={screenSize.height - dimensions.marginY + yOffset}
            interactive={true}
            zIndex={10}
            eventMode="static"
            cursor="pointer"
            onClick={onClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            <pixiGraphics
                draw={(g) => {
                    g.clear();

                    // Sombra del botón
                    if (shadowAlpha > 0.01) {
                        g.roundRect(
                            dimensions.shadowOffset,
                            dimensions.shadowOffset,
                            dimensions.buttonWidth,
                            dimensions.buttonHeight,
                            dimensions.borderRadius,
                        );
                        g.fill({ color: 0x000000, alpha: shadowAlpha });
                    }

                    // Fondo del botón
                    g.roundRect(0, 0, dimensions.buttonWidth, dimensions.buttonHeight, dimensions.borderRadius);
                    g.fill({ color: backgroundColor });
                    g.stroke({ color: borderColor, width: dimensions.borderWidth });
                }}
            />
            <pixiText
                text="Terminar Turno"
                anchor={0.5}
                x={dimensions.buttonWidth / 2}
                y={dimensions.buttonHeight / 2}
                style={{
                    fontFamily: 'Arial',
                    fontSize: dimensions.fontSize,
                    fill: 0xffffff,
                    fontWeight: '600',
                    stroke: { color: strokeColor, width: dimensions.strokeWidth },
                }}
            />
        </pixiContainer>
    );
}
