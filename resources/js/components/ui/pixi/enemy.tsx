import useEnemyAnimation from "@/components/enemy/useEnemyAnimation";
import { useScreen } from "@/providers/screen-provider";
import Enemy from "@/types/enemy";
import { useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { useRef, useState } from "react";

interface EnemyUIProps {
    enemy: Enemy;
    texture: Texture;
    showInteraction?: boolean;
}

export const EnemyUI = ({ enemy, texture, showInteraction }: EnemyUIProps) => {
    const pulseRef = useRef(0);
    const [pulseScale, setPulseScale] = useState(1);
    const { scale } = useScreen();

    const { sprite, updateSprite } = useEnemyAnimation({
        texture,
        frameWidth: 64,
        frameHeight: 64,
        totalFrames: 2,
        animationSpeed: 0.1
    });

    useTick((ticker) => {
        updateSprite('idle', 'down');
        
        if (showInteraction) {
            pulseRef.current += ticker.deltaTime * 0.1;
            setPulseScale(1 + Math.sin(pulseRef.current) * 0.1);
        }
    });

    return (sprite && (
        <>
            <pixiSprite 
                texture={sprite.texture}
                anchor={0.5}
                scale={2 * scale}
                y={enemy.map_position?.y || 0}
                x={enemy.map_position?.x || 0}
                zIndex={enemy.map_position?.y}
            />
            {showInteraction && (
                <>
                    <pixiGraphics
                        x={(enemy.map_position?.x || 0)}
                        y={(enemy.map_position?.y || 0) - 100 * scale }
                        scale={pulseScale * scale}
                        zIndex={9999}
                        draw={g => {
                            g.clear();
                            g.circle(0, 0, 25);
                            g.fill({ color: 0x2d1b69, alpha: 0.7 });
                            g.circle(0, 0, 25);
                            g.stroke({ width: 2, color: 0x8b5cf6, alpha: 1 });
                        }}
                    />
                    <pixiText
                        text="F"
                        anchor={0.5}
                        x={(enemy.map_position?.x || 0)}
                        y={(enemy.map_position?.y || 0) - 100 * scale}
                        scale={pulseScale * scale}
                        zIndex={10000}
                        style={{
                            fontFamily: 'Arial',
                            fontSize: 32 * scale,
                            fontWeight: 'bold',
                            fill: 0xFFFFFF,
                            align: 'center'
                        }}
                    />
                </>
            )}
        </>
    ));
}