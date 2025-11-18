import { Rectangle, Sprite, Texture } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';

interface BgCombatAnimationProps {
    texture: Texture;
    frameWidth: number;
    frameHeight: number;
    totalFrames: number;
    animationSpeed: number;
}

export default function useBgCombatAnimation(props: BgCombatAnimationProps) {
    const [sprite, setSprite] = useState<null | Sprite>(null);
    const frameRef = useRef(0);
    const elapsedTimeRef = useRef(0);

    const createSprite = (column: number) => {
        const frame = new Rectangle(column * props.frameWidth, 0, props.frameWidth, props.frameHeight);
        const frameTexture = new Texture({
            source: props.texture.source,
            frame: frame,
        });

        const newSprite = new Sprite(frameTexture);
        newSprite.width = props.frameWidth;
        newSprite.height = props.frameHeight;

        return newSprite;
    };

    // ✅ Crear el sprite inicial cuando la textura esté disponible
    useEffect(() => {
        if (props.texture && props.texture.source) {
            const initialSprite = createSprite(0);
            setSprite(initialSprite);
        }
    }, [props.texture, props.frameWidth, props.frameHeight]);

    const updateSprite = () => {
        if (!sprite || !props.texture || !props.texture.source) return;

        // ✅ Controlar la velocidad de animación (valores más altos = más lento)
        elapsedTimeRef.current += 0.016; // Aproximadamente 1/60 para 60 FPS

        if (elapsedTimeRef.current >= props.animationSpeed) {
            elapsedTimeRef.current = 0;
            frameRef.current = (frameRef.current + 1) % props.totalFrames;

            // ✅ Actualizar solo la textura del sprite existente
            const frame = new Rectangle(frameRef.current * props.frameWidth, 0, props.frameWidth, props.frameHeight);

            sprite.texture = new Texture({
                source: props.texture.source,
                frame: frame,
            });
        }
    };

    return { sprite, updateSprite };
}
