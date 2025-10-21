import { Rectangle, Sprite, Texture } from "pixi.js";
import { useRef, useState } from "react";

interface UseIconMissionAnimationProps {
    texture: Texture;
    frameWidth: number;
    frameHeight: number;
    totalFrames: number;
    animationSpeed: number;
}

export default function useIconMissionAnimation ({ texture, frameWidth, frameHeight, totalFrames, animationSpeed }: UseIconMissionAnimationProps) {
    const [sprite, setSprite] = useState<Sprite | null>(null);
    const [hovered, setHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
    const frameRef = useRef(0);
    const elapsedTimeRef = useRef(0);

    const createSprite = (row: number, column: number) => {
        const frame = new Rectangle(column * frameWidth, row * frameHeight, frameWidth, frameHeight);
        const frameTexture = new Texture({
            source: texture.source,
            frame: frame
        });

        const newSprite = new Sprite(frameTexture);
        newSprite.width = frameWidth;
        newSprite.height = frameHeight;

        return newSprite;
    }

    const updateSprite = () => {
        if (!isAnimating) {
            const newSprite = createSprite(0, frameRef.current);
            setSprite(newSprite);
            return;
        }

        elapsedTimeRef.current += animationSpeed;
        if (elapsedTimeRef.current >= 1) {
            elapsedTimeRef.current = 0;

            if (direction === 'forward') {
                if (frameRef.current < totalFrames - 1) {
                    frameRef.current += 1;
                } else {
                    setIsAnimating(false);
                }
            } else {
                if (frameRef.current > 0) {
                    frameRef.current -= 1;
                } else {
                    setIsAnimating(false);
                }
            }
        }

        const newSprite = createSprite(0, frameRef.current);
        setSprite(newSprite);
    }

    const handleHoverStart = () => {
        setHovered(true);
        setDirection('forward');
        setIsAnimating(true);
    }

    const handleHoverEnd = () => {
        setHovered(false);
        setDirection('reverse');
        setIsAnimating(true);
    }

    return { sprite, updateSprite, handleHoverStart, handleHoverEnd, hovered };
}