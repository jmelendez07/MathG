import Hero from '@/types/hero';
import { extend } from '@pixi/react';
import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';

extend({ Container, Sprite, Graphics, Text });

interface StatsUIProps {
    currentHero: Hero;
}

export const StatsUI = ({ currentHero }: StatsUIProps) => {
    const [iconHeroRole, setIconHeroRole] = useState<Texture>();

    const maxHp = currentHero.health; // Define un HP máximo fijo o desde las props
    const currentHp = currentHero.health; // HP actual del héroe
    const healthPercentage = currentHp / maxHp;

    useEffect(() => {
        Assets.load<Texture>(currentHero.hero_role.icon_url).then((texture) => {
            setIconHeroRole(texture);
        });
    }, [currentHero]);

    // Calcular dimensiones responsivas
    const screenScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const scale = Math.max(0.6, Math.min(1.0, screenScale));

    const dimensions = {
        iconSize: 64 * scale,
        barWidth: 300 * scale,
        barHeight: 50 * scale,
        innerBarHeight: 40 * scale,
        innerBarWidth: 290 * scale,
        actualBarWidth: 284 * scale,
        borderRadius: 10 * scale,
        innerBorderRadius: 8 * scale,
        fontSize: 18 * scale,
        strokeWidth: 2 * scale,
        spacing: 10 * scale,
    };

    const getHealthColor = () => {
        if (healthPercentage > 0.6) return 0x4caf50;
        if (healthPercentage > 0.35) return 0xffc107;
        return 0xf44336;
    };

    const getHealthHighlight = () => {
        if (healthPercentage > 0.6) return 0x66bb6a;
        if (healthPercentage > 0.35) return 0xffd54f;
        return 0xff7043;
    };

    // Posición del contenedor: mitad del eje X, último cuadrante (9/10) del eje Y
    const containerX = window.innerWidth / 2;
    const containerY = (window.innerHeight / 10) * 9 + 50;

    // Calcular el ancho total del contenido para centrarlo
    const totalContentWidth = dimensions.iconSize + dimensions.spacing + dimensions.barWidth;
    const contentOffsetX = -totalContentWidth / 2;

    return (
        <pixiContainer x={containerX} y={containerY}>
            {/* Icono del rol del héroe */}
            {iconHeroRole && (
                <pixiSprite
                    texture={iconHeroRole}
                    x={contentOffsetX}
                    y={-dimensions.iconSize / 2}
                    width={dimensions.iconSize}
                    height={dimensions.iconSize}
                />
            )}

            {/* Sombra de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    g.roundRect(
                        contentOffsetX + dimensions.iconSize + dimensions.spacing + 3 * scale,
                        -dimensions.barHeight / 2 + 3 * scale,
                        dimensions.barWidth,
                        dimensions.barHeight,
                        dimensions.borderRadius,
                    );
                    g.fill({ color: 0x000000, alpha: 0.3 });

                    // Borde exterior
                    g.roundRect(
                        contentOffsetX + dimensions.iconSize + dimensions.spacing,
                        -dimensions.barHeight / 2,
                        dimensions.barWidth,
                        dimensions.barHeight,
                        dimensions.borderRadius,
                    );
                    g.fill({ color: 0x2c2c2c });
                    g.stroke({ color: 0x444444, width: dimensions.strokeWidth });
                }}
            />

            {/* Fondo interno de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    g.roundRect(
                        contentOffsetX + dimensions.iconSize + dimensions.spacing + 5 * scale,
                        -dimensions.barHeight / 2 + 5 * scale,
                        dimensions.innerBarWidth,
                        dimensions.innerBarHeight,
                        dimensions.innerBorderRadius,
                    );
                    g.fill({ color: 0x1a1a1a });
                }}
            />

            {/* Barra de vida principal */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const barWidth = dimensions.actualBarWidth * healthPercentage;
                    if (barWidth > 0) {
                        g.roundRect(
                            contentOffsetX + dimensions.iconSize + dimensions.spacing + 8 * scale,
                            -dimensions.barHeight / 2 + 8 * scale,
                            barWidth,
                            34 * scale,
                            dimensions.innerBorderRadius,
                        );
                        g.fill({ color: getHealthColor() });

                        // Borde brillante
                        g.roundRect(
                            contentOffsetX + dimensions.iconSize + dimensions.spacing + 8 * scale,
                            -dimensions.barHeight / 2 + 8 * scale,
                            barWidth,
                            34 * scale,
                            dimensions.innerBorderRadius,
                        );
                        g.stroke({ color: getHealthHighlight(), width: 1 * scale, alpha: 0.3 });
                    }
                }}
            />

            {/* Brillo superior de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const barWidth = dimensions.actualBarWidth * healthPercentage;
                    if (barWidth > 0) {
                        g.roundRect(
                            contentOffsetX + dimensions.iconSize + dimensions.spacing + 8 * scale,
                            -dimensions.barHeight / 2 + 8 * scale,
                            barWidth,
                            10 * scale,
                            dimensions.innerBorderRadius,
                        );
                        g.fill({ color: getHealthHighlight(), alpha: 0.6 });
                    }
                }}
            />

            {/* Divisiones de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const segments = 4;
                    for (let i = 1; i < segments; i++) {
                        const x = contentOffsetX + dimensions.iconSize + dimensions.spacing + 5 * scale + dimensions.innerBarWidth * (i / segments);
                        g.moveTo(x, -dimensions.barHeight / 2 + 5 * scale);
                        g.lineTo(x, -dimensions.barHeight / 2 + 45 * scale);
                        g.stroke({ color: 0x000000, width: 1 * scale, alpha: 0.3 });
                    }
                }}
            />

            {/* Texto de HP */}
            <pixiText
                text={`${Math.round(currentHp)}/${maxHp}`}
                anchor={0.5}
                x={contentOffsetX + dimensions.iconSize + dimensions.spacing + dimensions.barWidth / 2}
                y={0}
                style={{
                    fontFamily: 'Arial',
                    fontSize: dimensions.fontSize,
                    fill: 0xffffff,
                    fontWeight: 'bold',
                    stroke: { color: 0x000000, width: dimensions.strokeWidth },
                }}
            />

            {/* Efecto adicional cuando la vida está alta */}
            {healthPercentage > 0.8 && (
                <pixiGraphics
                    draw={(g) => {
                        g.clear();
                        const barWidth = dimensions.actualBarWidth * healthPercentage;
                        g.roundRect(
                            contentOffsetX + dimensions.iconSize + dimensions.spacing + 8 * scale,
                            -dimensions.barHeight / 2 + 10 * scale,
                            barWidth,
                            3 * scale,
                            3 * scale,
                        );
                        g.fill({ color: 0xffffff, alpha: 0.4 });
                    }}
                />
            )}
        </pixiContainer>
    );
};
