import { ANIMATION_SPEED } from '@/components/constants/game-world';
import useEnemyAnimation from '@/components/enemy/useEnemyAnimation';
import { useScreen } from '@/providers/screen-provider';
import IEnemy from '@/types/enemy';
import { extend, useTick } from '@pixi/react';
import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';

extend({ Container, Sprite, Graphics, Text });

interface IEnemyProps {
    enemy: IEnemy;
}

export const Enemy = ({ enemy }: IEnemyProps) => {
    const assetSword = '/assets/sword.png';
    const [enemyTexture, setEnemyTexture] = useState<Texture | null>(null);
    const [maxHp, setMaxHp] = useState(enemy.health);
    const [isHovered, setIsHovered] = useState(false);
    const [swordTexture, setSwordTexture] = useState<Texture | null>(null);
    const [floatAnimation, setFloatAnimation] = useState(0);
    const { scale } = useScreen();

    const placeholderTexture = Texture.WHITE;
    const textureToUse = enemyTexture || placeholderTexture;

    const { sprite: enemySprite, updateSprite: updateEnemySprite } = useEnemyAnimation({
        texture: textureToUse,
        frameWidth: 64,
        frameHeight: 64,
        totalFrames: 2,
        animationSpeed: ANIMATION_SPEED,
    });

    useEffect(() => {
        Assets.load<Texture>(enemy.spritesheet).then((texture) => {
            setEnemyTexture(texture);
        });
        Assets.load<Texture>(assetSword).then((texture) => {
            setSwordTexture(texture);
        });
    }, [enemy.spritesheet]);

    useTick(() => {
        updateEnemySprite('combatIdle', 'left');
        setFloatAnimation((prev) => prev + 0.02);
    });

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const floatOffset = Math.sin(floatAnimation) * 3;
    
    console.log('Rendering Enemy:', enemy.name, 'at position', enemy.combat_position);

    return (
        <>
            {enemySprite && enemyTexture && (
                <>
                    <pixiSprite
                        interactive={true}
                        texture={enemySprite.texture}
                        x={(enemy.combat_position?.x || 0)}
                        y={(enemy.combat_position?.y || 0)}
                        width={168 * scale}
                        height={168 * scale}
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                    />

                    {swordTexture && (
                        <pixiSprite
                            texture={swordTexture}
                            x={(enemy.combat_position?.x || 0) + 90 * scale}
                            y={(enemy.combat_position?.y || 0) - 40 * scale + floatOffset}
                            width={60 * scale}
                            height={50 * scale}
                            zIndex={10}
                        />
                    )}

                    <pixiText
                        text={enemy.basic_attack}
                        anchor={0.5}
                        x={(enemy.combat_position?.x || 0) + 80 * scale}
                        y={(enemy.combat_position?.y || 0) - 15 * scale + floatOffset}
                        zIndex={10}
                        resolution={2}
                        style={{
                            fontFamily: 'Jersey 10',
                            fontSize: 34 * scale,
                            fill: 0xffffff,
                            fontWeight: 'bold',
                            stroke: { color: 0x000000, width: 2 * scale },
                        }}
                    />

                    {isHovered && (
                        <pixiText
                            text={enemy.name}
                            anchor={0.5}
                            x={(enemy.combat_position?.x || 0) + 84 * scale}
                            y={(enemy.combat_position?.y || 0) - 60 * scale + floatOffset}
                            style={{
                                fontFamily: 'Jersey 10',
                                fontSize: 30 * scale,
                                fill: 0xffffff,
                                fontWeight: 'bold',
                                stroke: { color: 0x000000, width: 2 * scale },
                            }}
                        />
                    )}

                    <pixiContainer
                        x={(enemy.combat_position?.x || 0) + 20 * scale}
                        y={(enemy.combat_position?.y || 0) + 180 * scale}
                        zIndex={5}
                        scale={scale}
                    >
                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                g.roundRect(0, 0, 150, 16, 3);
                                g.fill({ color: 0x1a1a1a });
                                g.stroke({ color: 0x000000, width: 1 });
                            }}
                        />

                        <pixiGraphics
                            draw={(g) => {
                                g.clear();
                                const healthPercentage = enemy.health / maxHp;
                                const barWidth = (150 - 4) * healthPercentage;
                                if (barWidth > 0) {
                                    g.roundRect(2, 2, barWidth, 12, 1);
                                    g.fill({ color: 0xff1744 });

                                    g.roundRect(2, 2, barWidth, 4, 1);
                                    g.fill({ color: 0xff5722, alpha: 0.5 });
                                }
                            }}
                        />

                        <pixiText
                            text={`${enemy.health}/${maxHp}`}
                            anchor={0.5}
                            x={75}
                            y={8}
                            style={{
                                fontFamily: 'Arial',
                                fontSize: 16,
                                fill: 0xffffff,
                                fontWeight: 'bold',
                                stroke: { color: 0x000000, width: 2 },
                            }}
                        />
                    </pixiContainer>
                </>
            )}
        </>
    );
};
