import { useScreen } from '@/Providers/ScreenProvider';
import { useTeam } from '@/Providers/TeamProvider';
import { Assets, Container, Texture, TextStyle } from 'pixi.js';
import { useEffect, useRef, useState, useMemo } from 'react';

export const HeroSelectionUI = () => {
    const { teamHeroes, currentHero } = useTeam();
    const { screenSize, scale } = useScreen();
    const [heroAvatars, setHeroAvatars] = useState<Texture[]>([]);
    const [roleIcons, setRoleIcons] = useState<Texture[]>([]);
    const containerRef = useRef<Container>(null);

    const itemHeight = 100 * scale;
    const gap = 10 * scale;
    const totalItemHeight = itemHeight + gap;
    const borderRadius = 50 * scale;
    const borderWidth = 3 * scale;
    const healthBarWidth = 80 * scale;
    const healthBarHeight = 8 * scale;
    const healthBarRadius = 4 * scale;

    const textStyle = useMemo(() => new TextStyle({
        fill: 0xffffff,
        fontSize: 28 * scale,
        fontFamily: 'Jersey 10'
    }), [scale]);

    useEffect(() => {
        const loadAvatars = async () => {
            const avatars = await Promise.all(teamHeroes.map((hero) => Assets.load(hero.avatar_url)));
            setHeroAvatars(avatars);
        };

        const loadRolesIcons = async () => {
            const roleIcons = await Promise.all(teamHeroes.map((hero) => Assets.load(hero.hero_role.icon_url)));
            setRoleIcons(roleIcons);
        };

        loadAvatars();
        loadRolesIcons();
    }, [teamHeroes]);

    const getHealthColor = (percentage: number) => {
        if (percentage > 0.6) return 0x4caf50;
        if (percentage > 0.35) return 0xffc107;
        return 0xf44336;
    };

    const getHealthHighlight = (percentage: number) => {
        if (percentage > 0.6) return 0x66bb6a;
        if (percentage > 0.35) return 0xffd54f;
        return 0xff7043;
    };

    return (
        <pixiContainer zIndex={1000} x={(screenSize.width / 7) * 6} y={screenSize.height / 8}>
            {heroAvatars.map((avatar, index) => {
                const yPosition = index * totalItemHeight;
                const hero = teamHeroes[index];
                const healthPercentage = hero.health / hero.health;

                return (
                    <pixiContainer ref={containerRef} key={index} y={yPosition}>
                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                g.roundRect(0, 0, screenSize.width / 7 + 50 * scale, itemHeight, borderRadius);
                                g.fill({ color: 0x000000, alpha: currentHero.id === hero.id ? 0.6 : 0.3 });
                            }}
                        />

                        <pixiText 
                            text={(index + 1) + '.'} 
                            x={20 * scale} 
                            y={itemHeight / 2 - 12 * scale} 
                            style={textStyle} 
                            resolution={2} 
                        />
                        <pixiText 
                            text={hero.name} 
                            x={40 * scale} 
                            y={itemHeight / 2 - 12 * scale} 
                            style={textStyle} 
                            resolution={2} 
                        />

                        {currentHero.id === hero.id && (
                            <pixiGraphics
                                draw={(g) => {
                                    g.clear();
                                    g.roundRect(0, 0, screenSize.width / 7 + 50 * scale, itemHeight, borderRadius);
                                    g.stroke({ color: 0x9333ea, width: borderWidth });
                                }}
                            />
                        )}

                        <pixiSprite 
                            texture={avatar} 
                            x={150 * scale} 
                            y={15 * scale} 
                            width={64 * scale} 
                            height={64 * scale} 
                        />
                        <pixiSprite 
                            texture={roleIcons[index]} 
                            x={135 * scale} 
                            y={20 * scale} 
                            width={16 * scale} 
                            height={16 * scale} 
                        />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                g.roundRect(
                                    150 * scale + 32 * scale - healthBarWidth / 2, 
                                    79 * scale + 8 * scale, 
                                    healthBarWidth, 
                                    healthBarHeight, 
                                    healthBarRadius
                                );
                                g.fill({ color: 0x1a1a1a });
                            }}
                        />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                const barWidth = (healthBarWidth - 4 * scale) * healthPercentage;
                                if (barWidth > 0) {
                                    g.roundRect(
                                        150 * scale + 32 * scale - healthBarWidth / 2 + 2 * scale, 
                                        79 * scale + 8 * scale + 2 * scale, 
                                        barWidth, 
                                        healthBarHeight - 4 * scale, 
                                        healthBarRadius - 1 * scale
                                    );
                                    g.fill({ color: getHealthColor(healthPercentage) });
                                }
                            }}
                        />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                const barWidth = (healthBarWidth - 4 * scale) * healthPercentage;
                                if (barWidth > 0) {
                                    g.roundRect(
                                        150 * scale + 32 * scale - healthBarWidth / 2 + 2 * scale, 
                                        79 * scale + 8 * scale + 2 * scale, 
                                        barWidth, 
                                        2 * scale, 
                                        healthBarRadius - 1 * scale
                                    );
                                    g.fill({ color: getHealthHighlight(healthPercentage), alpha: 0.6 });
                                }
                            }}
                        />
                    </pixiContainer>
                );
            })}
        </pixiContainer>
    );
};
