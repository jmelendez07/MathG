import IPlanet from "@/types/planet";
import { Texture } from "pixi.js";
import React, { useEffect, useState } from "react";
import { useTick } from "@pixi/react";
import { ColorMatrixFilter } from "pixi.js";
import { useScreen } from "@/Providers/ScreenProvider";

interface IPlanetProps {
    planet: IPlanet;
    x: number;
    y: number;
    planetTextures: { [key: string]: Texture };
    handleOnClick: (planet: IPlanet) => void;
    transitionStage?: "enter" | "exit";
    targetX?: number;
    targetY?: number;
    targetScale?: number;
    onTransitionEnd?: () => void;
    locked?: boolean;
}

export default function Planet({
    planet,
    x,
    y,
    planetTextures,
    handleOnClick,
    transitionStage,
    targetX,
    targetY,
    targetScale,
    locked = false,
    onTransitionEnd
}: IPlanetProps) {
    const [hovered, setHovered] = useState(false);
    const [pos, setPos] = useState({ x, y });
    const [scale, setScale] = useState(1);
    const { scale: scaleScreen } = useScreen();

    useEffect(() => {
        if (!transitionStage) {
            if (planetTextures[planet.id]) {
                const texture = planetTextures[planet.id];
                const baseScale = Math.max(200 / texture.width, 200 / texture.height);
                setScale(baseScale);
            } else {
                setScale(1);
            }
            setPos({ x, y });
        }
    }, [x, y, planet.id, transitionStage, planetTextures]);

    useTick(() => {
        if (!planetTextures[planet.id]) return;
        const texture = planetTextures[planet.id];
        const baseScale = Math.max(200 / texture.width, 200 / texture.height);

        let nextScale = scale;
        let nextX = pos.x;
        let nextY = pos.y;

        if (transitionStage === "enter" && targetX !== undefined && targetY !== undefined && targetScale !== undefined) {
            // Animar hacia el centro y escala grande
            nextScale += (targetScale - nextScale) * 0.15;
            nextX += (targetX - nextX) * 0.15;
            nextY += (targetY - nextY) * 0.15;

            // Detecta fin de animación
            if (
                Math.abs(nextScale - targetScale) < 0.01 &&
                Math.abs(nextX - targetX) < 1 &&
                Math.abs(nextY - targetY) < 1 &&
                onTransitionEnd
            ) {
                onTransitionEnd();
            }
        } else if (transitionStage === "exit" && targetX !== undefined && targetY !== undefined) {
            // Animar hacia posición y escala original
            nextScale += (baseScale - nextScale) * 0.15;
            nextX += (targetX - nextX) * 0.15;
            nextY += (targetY - nextY) * 0.15;

            // Detecta fin de animación
            if (
                Math.abs(nextScale - baseScale) < 0.01 &&
                Math.abs(nextX - targetX) < 1 &&
                Math.abs(nextY - targetY) < 1 &&
                onTransitionEnd
            ) {
                onTransitionEnd();
            }
        } else {
            const target = hovered ? baseScale * 1.2 : baseScale;
            nextScale += (target - nextScale) * 0.15;
            nextX = x;
            nextY = y;
        }

        setScale(nextScale);
        setPos({ x: nextX, y: nextY });
    });

    return (
        <pixiContainer
            x={pos.x}
            y={pos.y}
            interactive={!transitionStage && !locked}
            cursor={!transitionStage && !locked ? "pointer" : undefined}
            onClick={() => !transitionStage && !locked && handleOnClick(planet)}
            onTap={() => !transitionStage && !locked && handleOnClick(planet)}
            onMouseOver={() => !transitionStage && !locked && setHovered(true)}
            onMouseOut={() => !transitionStage && !locked && setHovered(false)}
        >
            {planetTextures[planet.id] && (() => {
                const texture = planetTextures[planet.id];
                const texWidth = texture.width * scale;
                const texHeight = texture.height * scale;

                const filters = locked
                    ? [(() => { 
                        const f = new ColorMatrixFilter(); 
                        f.greyscale(0.3, false); 
                        return f; 
                    })()]
                    : undefined;

                return (
                    <pixiSprite
                        texture={texture}
                        anchor={0.5}
                        width={texWidth * scaleScreen}
                        height={texHeight * scaleScreen}
                        scale={scaleScreen}
                        filters={filters}
                    />
                );
            })()}
        </pixiContainer>
    );
}