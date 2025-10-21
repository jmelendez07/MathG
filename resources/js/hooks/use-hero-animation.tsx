import { HeroAnimation } from '@/types/HeroAnimations';
import { Rectangle, Sprite, Texture } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { TILE_SIZE } from '../components/constants/game-world';
import { Direction } from '../components/types/common';

interface IHeroAnimationProps {
    texture: Texture;
    frameWidth: number;
    frameHeight: number;
    totalTilesFrames: number;
    animationSpeed: number;
    heroAnimation: HeroAnimation;
}

export const useHeroAnimation = ({ texture, frameWidth, frameHeight, totalTilesFrames, animationSpeed, heroAnimation }: IHeroAnimationProps) => {
    const [sprite, setSprite] = useState<Sprite | null>(null);
    const frameRef = useRef(1);
    const elapsedTimeRef = useRef(0);

    const resetAnimation = () => {
        frameRef.current = 1;
        elapsedTimeRef.current = 0;
    };

    useEffect(() => {
        resetAnimation();
        setSprite(null);
    }, [texture, heroAnimation]);

    const getRowByDirection = (direction: Direction | null, isFighting: boolean, isStat: boolean, isAttacking: boolean) => {
        if (isFighting) {
            return heroAnimation.row;
        } else if (isStat) {
            return 44;
        }

        if (isAttacking) {
            return heroAnimation.row;
        }

        switch (direction) {
            case 'UP':
                return 8;
            case 'DOWN':
                return 10;
            case 'LEFT':
                return 9;
            case 'RIGHT':
                return 11;
            default:
                return 10;
        }
    };

    const createSprite = (row: number, column: number) => {
        const frame = new Rectangle(column * frameWidth, row * frameHeight, frameWidth, frameHeight);
        const frameTexture = new Texture({
            source: texture.source,
            frame: frame,
        });
        const newSprite = new Sprite(frameTexture);
        newSprite.width = TILE_SIZE;
        newSprite.height = TILE_SIZE;

        return newSprite;
    };

    const updateSprite = (direction: Direction | null, isMoving: boolean, isFighting: boolean, isStat?: boolean, isAttacking?: boolean) => {
        const row = getRowByDirection(direction, isFighting, isStat ?? false, isAttacking ?? false);
        let column = 0;

        if (isMoving) {
            elapsedTimeRef.current += animationSpeed;
            if (isAttacking) {
                if (elapsedTimeRef.current >= 1) {
                    elapsedTimeRef.current = 0;
                    frameRef.current = (frameRef.current + 3) % totalTilesFrames;
                }
                column = frameRef.current;
            } else {
                if (elapsedTimeRef.current >= 1) {
                    elapsedTimeRef.current = 0;
                    frameRef.current = (frameRef.current + 1) % totalTilesFrames;
                }
                column = frameRef.current;
            }
        }

        const newSprite = createSprite(row, column);
        setSprite(newSprite);
    };

    const createAttackSprite = (row: number, columnIndex: number, attackFrameWidth: number) => {
        const frameX = columnIndex * attackFrameWidth;
        const frame = new Rectangle(frameX, row * frameHeight, attackFrameWidth, frameHeight);

        const frameTexture = new Texture({
            source: texture.source,
            frame: frame,
        });
        const newSprite = new Sprite(frameTexture);
        newSprite.width = TILE_SIZE * 2;
        newSprite.height = TILE_SIZE;

        return newSprite;
    };

    const updateAttackSprite = (
        direction: Direction | null,
        isMoving: boolean,
        isFighting: boolean,
        isStat?: boolean,
        isAttacking?: boolean,
    ): boolean => {
        const row = getRowByDirection(direction, isFighting, isStat ?? false, isAttacking ?? false);

        const textureWidth = texture.source.width;
        const attackColumns = heroAnimation.totalAnimationsFrames;
        const attackFrameWidth = textureWidth / attackColumns;

        elapsedTimeRef.current += animationSpeed;
        if (elapsedTimeRef.current >= 1) {
            elapsedTimeRef.current = 0;

            const step = 3;
            const next = frameRef.current + step;

            const maxColumnIndex = attackColumns - 1;
            const nextColumnIndex = Math.floor(next / step);

            if (next >= totalTilesFrames || nextColumnIndex > maxColumnIndex) {
                return false;
            }

            frameRef.current = next;
        }

        const columnIndex = Math.min(Math.floor(frameRef.current / 3), attackColumns - 1);
        const newSprite = createAttackSprite(row, columnIndex, attackFrameWidth);
        setSprite(newSprite);
        return true;
    };

    return { sprite, updateSprite, updateAttackSprite, resetAnimation };
};
