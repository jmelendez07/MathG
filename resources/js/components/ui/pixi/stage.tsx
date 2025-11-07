import { useScreen } from "@/providers/screen-provider";
import { Stage } from "@/types/planet";
import { Assets, Texture, TextStyle } from "pixi.js";
import { useEffect, useState, useMemo } from "react";

interface StageUIProps {
    stage: Stage;
    texture: Texture;
}

export const StageUI = ({ stage, texture }: StageUIProps) => {
    const { screenSize, scale } = useScreen();

    const textStyle = useMemo(() => new TextStyle({
        fill: 0xffffff,
        fontSize: 40 * scale,
        fontFamily: 'Jersey 10'
    }), [scale]);

    return (
        <>
            <pixiText
                text={`Etapa ${stage.number}: ${stage.name}`}
                x={screenSize.width - 370 * scale}
                y={26 * scale}
                zIndex={1}
                style={textStyle}
                resolution={3}
            />
            { texture && (
                <pixiSprite 
                    texture={texture} 
                    x={screenSize.width - 160 * scale} 
                    y={15 * scale}
                    zIndex={1}
                    width={64 * scale} 
                    height={64 * scale} 
                />
            ) }
        </>
    );
}