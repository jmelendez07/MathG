import { extend, useTick } from '@pixi/react'
import { Container, Sprite, Texture, Assets } from 'pixi.js'
import { useEffect, useState } from 'react'
import useEnemyAnimation from './useEnemyAnimation';
import IEnemy from '@/types/enemy';

extend({ Container, Sprite })

interface IEnemyProps {
	enemy: IEnemy;
	x: number;
	y: number;
}

export default function Enemy({ enemy, x, y }: IEnemyProps) {
	const [texture, setTexture] = useState<Texture>(Texture.WHITE);

	const { sprite, updateSprite } = useEnemyAnimation({
		texture,
		frameWidth: 64,
		frameHeight: 64,
		totalFrames: 2,
		animationSpeed: 0.1
	});

	useTick((ticker) => {
		updateSprite('idle', 'down');
	});

	useEffect(() => {
		Assets.load<Texture>(enemy.spritesheet)
			.then((text) => {
				setTexture(text);
				console.log('Texture loaded:', text);
			});
	}, []);

	return (
		<pixiContainer x={x} y={y}>
			{sprite && (
				<pixiSprite 
					texture={sprite.texture}
					scale={0.6}
					anchor={0.5} 
				/>
			)}
		</pixiContainer>
	)
}
