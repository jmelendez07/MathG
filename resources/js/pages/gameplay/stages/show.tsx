import { Experience } from '@/components/gameplay/experience';
import { useScreen } from '@/Providers/ScreenProvider';
import { TeamProvider } from '@/Providers/TeamProvider';
import Card from '@/types/card';
import Enemy from '@/types/enemy';
import Hero from '@/types/hero';
import { Stage as IStage } from '@/types/planet';
import { Application, extend } from '@pixi/react';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { useEffect, useState } from 'react';

extend({ Sprite, Container, Graphics, Text });

interface TestStageProps {
    stage: IStage;
    heroes: Hero[];
    enemies: Enemy[];
    cards: Card[];
}

export default function TestStage({ stage, heroes, enemies, cards }: TestStageProps) {
    const [isClient, setIsClient] = useState<boolean>(false);
    const { screenSize } = useScreen();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        isClient && (
            <Application width={screenSize.width} height={screenSize.height} background={0x1099bb} resizeTo={window}>
                <TeamProvider initialHeroes={heroes}>
                    <Experience stage={stage} initEnemies={enemies} cards={cards} />
                </TeamProvider>
            </Application>
        )
    );
}
