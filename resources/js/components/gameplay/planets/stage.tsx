import { Stage as IStage } from "@/types/planet";
import { router } from "@inertiajs/react";
import { Graphics, Texture } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { ColorMatrixFilter } from "pixi.js";
import { useScreen } from "@/Providers/ScreenProvider";

interface IStageProps {
    stage: IStage;
    x: number;
    y: number;
    stageTextures: { [key: string]: Texture };
    locked?: boolean;
}

export default function Stage({ stage, x, y, stageTextures, locked = false }: IStageProps) {
    const maskRef = useRef<Graphics>(null);
    const spriteRef = useRef<any>(null);
    const { scale } = useScreen();

    useEffect(() => {
        if (spriteRef.current && maskRef.current) {
            spriteRef.current.mask = maskRef.current;
        }
    }, [stageTextures[stage.id]]);

    const handleClick = useCallback(() => {
        router.visit(route('gameplay.stage', { stageId: stage.id }));
    }, [stage.id]);

    const filters = locked
        ? [(() => { 
            const f = new ColorMatrixFilter(); 
            f.greyscale(0.3, false); 
            return f; 
        })()]
        : undefined;

    return (
        <pixiContainer 
            x={x} 
            y={y}
            interactive={!locked} 
            onClick={() => !locked && handleClick()}
            onTap={() => !locked && handleClick()} 
            cursor={!locked ? 'pointer' : undefined}
        >
            {!locked && (
                <pixiGraphics
                    draw={g => {
                        g.clear();
                        g.beginFill(0x8b5cf6);
                        g.drawCircle(0, 0, 55 * scale);
                        g.endFill();
                    }}
                />
            )}
            <pixiGraphics
                ref={maskRef}
                draw={g => {
                    g.clear();
                    g.beginFill(0x8b5cf6);
                    g.drawCircle(0, 0, 50 * scale);
                    g.endFill();
                }}
            />
            {stageTextures[stage.id] && (
                <pixiSprite
                    ref={spriteRef}
                    texture={stageTextures[stage.id]}
                    anchor={0.5}
                    width={100 * scale}
                    height={100 * scale}
                    x={0}
                    y={0}
                    filters={filters}
                />
            )}
        </pixiContainer>
    );
}