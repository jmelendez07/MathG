import useIconMissionAnimation from "@/hooks/animations/useIconMissionAnimation";
import { useScreen } from "@/providers/screen-provider";
import { Stage } from "@/types/planet";
import { useTick } from "@pixi/react";
import { Assets, Texture, TextStyle } from "pixi.js"
import { useEffect, useState, useMemo } from "react"

const missionsAsset = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1759276935/logo_misiones_lnllk0.png'

interface MissionsUIProps {
    stage: Stage;
}

export const MissionsUI = ({ stage }: MissionsUIProps) => {
    const [missionsTexture, setMissionsTexture] = useState<Texture>(Texture.WHITE);
    const [xPosition, setXPosition] = useState(0);
    const { scale } = useScreen();

    const { sprite, updateSprite, handleHoverStart, handleHoverEnd, hovered } = useIconMissionAnimation({
        texture: missionsTexture,
        frameWidth: 254,
        frameHeight: 183,
        totalFrames: 7,
        animationSpeed: 1
    });

    const titleStyle = useMemo(() => new TextStyle({
        fontSize: 50 * scale,
        fill: 'white',
        fontFamily: 'Jersey 10',
        stroke: '#000000'
    }), [scale]);

    const missionStyle = useMemo(() => new TextStyle({
        fontSize: 25 * scale,
        fill: 'white',
        fontFamily: 'Jersey 10',
        stroke: '#000000'
    }), [scale]);

    useEffect(() => {
        Assets.load<Texture>(missionsAsset).then((texture) => {
            setMissionsTexture(texture);
        });

        return () => {
            if (missionsTexture) {
                missionsTexture.destroy(true);
            }
        };
    }, []);

    useTick((ticker) => {
        updateSprite();

        const maxOffset = -35 * scale;
        if (hovered && xPosition > maxOffset) {
            setXPosition(prev => Math.max(prev - ticker.deltaTime * 8 * scale, maxOffset));
        } else if (!hovered && xPosition < 0) {
            setXPosition(prev => Math.min(prev + ticker.deltaTime * 8 * scale, 0));
        }
    });

    return (
        <pixiContainer zIndex={1}>
            {sprite && (
                <pixiSprite 
                    texture={sprite.texture} 
                    x={(45 + xPosition) * scale} 
                    y={160 * scale} 
                    width={130 * scale} 
                    height={64 * scale}
                    interactive={true}
                    onPointerOver={handleHoverStart}
                    onPointerOut={handleHoverEnd}
                />
            )}

            {hovered && (
                <>
                    <pixiText
                        text="Misiones"
                        x={20 * scale}
                        y={230 * scale}
                        style={titleStyle}
                        resolution={2}
                    />

                    {stage.missions.map((mission, index) => (
                        <pixiText
                            key={index}
                            text={`${mission.description} (0/${mission.number_actions})`}
                            x={20 * scale}
                            y={(280 + (index * 40)) * scale}
                            style={missionStyle}
                            resolution={2}
                        />
                    ))}
                </>
            )}
        </pixiContainer>
    )
}