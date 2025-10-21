import { useScreen } from "@/Providers/ScreenProvider";
import { Stage } from "@/types/planet";
import { Assets, Texture, TextStyle } from "pixi.js";
import { useEffect, useState, useMemo } from "react";

interface StageUIProps {
    stage: Stage;
}

const stageAsset = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1759327239/etapa_qicev8.png';

export const StageUI = ({ stage }: StageUIProps) => {
    const [texture, setTexture] = useState<Texture | null>(null);
    const { screenSize, scale } = useScreen();

    const textStyle = useMemo(() => new TextStyle({
        fill: 0xffffff,
        fontSize: 40 * scale,
        fontFamily: 'Jersey 10'
    }), [scale]);

    useEffect(() => {
        Assets.load<Texture>(stageAsset).then((tex) => {
            setTexture(tex);
        });
    }, []);

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