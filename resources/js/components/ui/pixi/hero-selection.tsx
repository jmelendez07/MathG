import { useTeam } from '@/providers/team-provider';
import { Assets, Container, Texture } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';

const itemHeight = 100;
const gap = 10;
const totalItemHeight = itemHeight + gap;
const borderRadius = 50;
const borderWidth = 3;
const healthBarWidth = 80;
const healthBarHeight = 8;
const healthBarRadius = 4;

export const HeroSelectionUI = () => {
    const { teamHeroes, currentHero } = useTeam();
    const [heroAvatars, setHeroAvatars] = useState<Texture[]>([]);
    const [roleIcons, setRoleIcons] = useState<Texture[]>([]);
    const containerRef = useRef<Container>(null);

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
        <pixiContainer zIndex={1000} x={(window.innerWidth / 7) * 6} y={window.innerHeight / 8}>
            {heroAvatars.map((avatar, index) => {
                const yPosition = index * totalItemHeight;
                const hero = teamHeroes[index];
                const healthPercentage = hero.health / hero.health;

                return (
                    <pixiContainer ref={containerRef} key={index} y={yPosition}>
                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                g.roundRect(0, 0, window.innerWidth / 7 + 50, itemHeight, borderRadius);
                                g.fill({ color: 0x000000, alpha: currentHero.id === hero.id ? 0.6 : 0.3 });
                            }}
                        />

                        <pixiText text={(index + 1) + '.'} x={20} y={itemHeight / 2 - 12} style={{ fill: 0xffffff, fontSize: 28, fontFamily: 'Jersey 10' }} resolution={2} />
                        <pixiText text={hero.name} x={40} y={itemHeight / 2 - 12} style={{ fill: 0xffffff, fontSize: 28, fontFamily: 'Jersey 10' }} resolution={2} />

                        {currentHero.id === hero.id && (
                            <pixiGraphics
                                draw={(g) => {
                                    g.clear();
                                    g.roundRect(0, 0, window.innerWidth / 7 + 50, itemHeight, borderRadius);
                                    g.stroke({ color: 0x9333ea, width: borderWidth });
                                }}
                            />
                        )}

                        <pixiSprite texture={avatar} x={150} y={15} width={64} height={64} />
                        <pixiSprite texture={roleIcons[index]} x={135} y={20} width={16} height={16} />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                g.roundRect(150 + 32 - healthBarWidth / 2, 79 + 8, healthBarWidth, healthBarHeight, healthBarRadius);
                                g.fill({ color: 0x1a1a1a });
                            }}
                        />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                const barWidth = (healthBarWidth - 4) * healthPercentage;
                                if (barWidth > 0) {
                                    g.roundRect(150 + 32 - healthBarWidth / 2 + 2, 79 + 8 + 2, barWidth, healthBarHeight - 4, healthBarRadius - 1);
                                    g.fill({ color: getHealthColor(healthPercentage) });
                                }
                            }}
                        />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                const barWidth = (healthBarWidth - 4) * healthPercentage;
                                if (barWidth > 0) {
                                    g.roundRect(150 + 32 - healthBarWidth / 2 + 2, 79 + 8 + 2, barWidth, 2, healthBarRadius - 1);
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
