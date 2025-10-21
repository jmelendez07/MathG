import { extend, useTick } from '@pixi/react';
import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import Hero from '@/types/hero';
import { useScreen } from '@/Providers/ScreenProvider';

extend({ Container, Sprite, Graphics, Text });

interface HeroStatsProps {
    currentHp: number;
    maxHp: number;
    currentHero: Hero | null;
    energyTexture: Texture | null;
    maxEnergy: number;
    currentEnergy: number;
}

const HeroStats = ({ currentHp, maxHp, currentHero, energyTexture, maxEnergy, currentEnergy }: HeroStatsProps) => {

    const { scale, screenSize } = useScreen();

    // Calcular dimensiones responsivas
    const getResponsiveDimensions = () => {

        return {
            scale,
            heroSize: 128 * scale,
            heroHoverSize: 140 * scale,
            energySize: 80 * scale,
            barWidth: 400 * scale,
            barHeight: 60 * scale,
            innerBarHeight: 50 * scale,
            innerBarWidth: 390 * scale,
            actualBarWidth: 384 * scale,
            borderRadius: 12 * scale,
            innerBorderRadius: 10 * scale,
            fontSize: 20 * scale,
            energyFontSize: 24 * scale,
            strokeWidth: 2 * scale,
            yOffset: 80 * scale,
            heroYOffset: 140 * scale,
            energyYOffset: 100 * scale,
        };
    };

    const dimensions = getResponsiveDimensions();
    
    // ✅ Posición por defecto en la esquina inferior izquierda
    const defaultPosition = {
        x: 20 * dimensions.scale,
        y: screenSize.height - dimensions.yOffset,
    };

    const [animatedHp, setAnimatedHp] = useState(currentHp);
    const [floatAnimation, setFloatAnimation] = useState(0);
    const [colorTransition, setColorTransition] = useState(0);
    const [isHeroHovered, setIsHeroHovered] = useState(false);
    const [currentHeroAvatar, setCurrentHeroAvatar] = useState<Texture>(Texture.EMPTY);
    const healthPercentage = animatedHp / maxHp;


    useEffect(() => {
        const loadCurrentHeroAvatar = async () => {
            Assets.load<Texture>(currentHero?.avatar_url || '').then((texture) => {
                setCurrentHeroAvatar(texture);
            });
        };
        loadCurrentHeroAvatar();
    }, []);

    useTick(() => {
        setFloatAnimation((prev) => prev + 0.02);

        const lerpSpeed = 0.05;
        const hpDiff = currentHp - animatedHp;

        if (Math.abs(hpDiff) > 0.1) {
            setAnimatedHp((prev) => prev + hpDiff * lerpSpeed);
        } else if (hpDiff !== 0) {
            setAnimatedHp(currentHp);
        }

        setColorTransition((prev) => (prev + 0.01) % 1);
    });

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

    const floatOffset = Math.sin(floatAnimation) * 3 * dimensions.scale;

    const xPos =  defaultPosition.x;
    const yPos =  defaultPosition.y;

    return (
        <pixiContainer x={xPos} y={yPos + floatOffset}>
            {currentHeroAvatar && (
                <>
                    <pixiSprite
                        texture={currentHeroAvatar}
                        x={20 * dimensions.scale}
                        y={-dimensions.heroYOffset}
                        width={isHeroHovered ? dimensions.heroHoverSize : dimensions.heroSize}
                        height={isHeroHovered ? dimensions.heroHoverSize : dimensions.heroSize}
                        anchor={0}
                        interactive={true}
                        onPointerOver={() => setIsHeroHovered(true)}
                        onPointerOut={() => setIsHeroHovered(false)}
                    />
                    {isHeroHovered && (
                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                g.lineStyle(0);
                                g.fill({ color: 0xffff99, alpha: 0.35 });
                                g.drawRect(0, -120 * dimensions.scale, dimensions.heroHoverSize, dimensions.heroHoverSize);
                            }}
                        />
                    )}
                </>
            )}
            {energyTexture && (
                <>
                    <pixiSprite
                        texture={energyTexture}
                        x={272 * dimensions.scale}
                        y={-dimensions.energyYOffset}
                        width={dimensions.energySize}
                        height={dimensions.energySize}
                        anchor={0}
                    />
                    <pixiText
                        text={`${Math.round(currentEnergy)}/${maxEnergy}`}
                        anchor={0.5}
                        x={360 * dimensions.scale}
                        y={-60 * dimensions.scale}
                        style={{
                            fontFamily: 'Arial',
                            fontSize: dimensions.energyFontSize,
                            fill: 0xffffff,
                            fontWeight: 'bold',
                            stroke: { color: 0x000000, width: dimensions.strokeWidth },
                        }}
                    />
                </>
            )}
            {/* Sombra de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    g.roundRect(5 * dimensions.scale, 5 * dimensions.scale, dimensions.barWidth, dimensions.barHeight, dimensions.borderRadius);
                    g.fill({ color: 0x000000, alpha: 0.3 });
                    g.roundRect(0, 0, dimensions.barWidth, dimensions.barHeight, dimensions.borderRadius);
                    g.fill({ color: 0x2c2c2c });
                    g.stroke({ color: 0x444444, width: dimensions.strokeWidth });
                }}
            />
            {/* Fondo interno de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    g.roundRect(
                        5 * dimensions.scale,
                        5 * dimensions.scale,
                        dimensions.innerBarWidth,
                        dimensions.innerBarHeight,
                        dimensions.borderRadius,
                    );
                    g.fill({ color: 0x1a1a1a });
                }}
            />
            {/* Barra de vida principal */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const barWidth = dimensions.actualBarWidth * (animatedHp / maxHp);
                    if (barWidth > 0) {
                        g.roundRect(8 * dimensions.scale, 8 * dimensions.scale, barWidth, 44 * dimensions.scale, dimensions.innerBorderRadius);
                        g.fill({ color: getHealthColor() });
                        g.roundRect(8 * dimensions.scale, 8 * dimensions.scale, barWidth, 44 * dimensions.scale, dimensions.innerBorderRadius);
                        g.stroke({ color: getHealthHighlight(), width: 1 * dimensions.scale, alpha: 0.3 });
                    }
                }}
            />
            {/* Animación de daño/curación */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const currentBarWidth = dimensions.actualBarWidth * (animatedHp / maxHp);
                    const targetBarWidth = dimensions.actualBarWidth * (currentHp / maxHp);
                    if (Math.abs(currentBarWidth - targetBarWidth) > 1) {
                        if (currentHp < animatedHp) {
                            const lossWidth = currentBarWidth - targetBarWidth;
                            g.roundRect(
                                8 * dimensions.scale + targetBarWidth,
                                8 * dimensions.scale,
                                lossWidth,
                                44 * dimensions.scale,
                                dimensions.innerBorderRadius,
                            );
                            g.fill({ color: 0xff4444, alpha: 0.4 });
                        } else if (currentHp > animatedHp) {
                            const gainWidth = targetBarWidth - currentBarWidth;
                            g.roundRect(
                                8 * dimensions.scale + currentBarWidth,
                                8 * dimensions.scale,
                                gainWidth,
                                44 * dimensions.scale,
                                dimensions.innerBorderRadius,
                            );
                            g.fill({ color: 0x4caf50, alpha: 0.4 });
                        }
                    }
                }}
            />
            {/* Brillo superior de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const barWidth = dimensions.actualBarWidth * (animatedHp / maxHp);
                    if (barWidth > 0) {
                        g.roundRect(8 * dimensions.scale, 8 * dimensions.scale, barWidth, 12 * dimensions.scale, dimensions.innerBorderRadius);
                        g.fill({ color: getHealthHighlight(), alpha: 0.6 });
                        const pulseAlpha = (Math.sin(colorTransition * Math.PI * 2) + 1) * 0.5;
                        g.roundRect(8 * dimensions.scale, 10 * dimensions.scale, barWidth, 8 * dimensions.scale, 8 * dimensions.scale);
                        g.fill({ color: 0xffffff, alpha: pulseAlpha * 0.2 });
                    }
                }}
            />
            {/* Divisiones de la barra */}
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    const segments = 4;
                    for (let i = 1; i < segments; i++) {
                        const x = 5 * dimensions.scale + dimensions.innerBarWidth * (i / segments);
                        g.moveTo(x, 5 * dimensions.scale);
                        g.lineTo(x, 55 * dimensions.scale);
                        g.stroke({ color: 0x000000, width: 1 * dimensions.scale, alpha: 0.3 });
                    }
                }}
            />
            {/* Texto de HP */}
            <pixiText
                text={`${Math.round(animatedHp)}/${maxHp}`}
                anchor={0.5}
                x={dimensions.barWidth / 2}
                y={30 * dimensions.scale}
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
                        const barWidth = dimensions.actualBarWidth * (animatedHp / maxHp);
                        g.roundRect(8 * dimensions.scale, 10 * dimensions.scale, barWidth, 4 * dimensions.scale, 4 * dimensions.scale);
                        g.fill({ color: 0xffffff, alpha: 0.4 });
                    }}
                />
            )}
        </pixiContainer>
    );
};

export default HeroStats;
