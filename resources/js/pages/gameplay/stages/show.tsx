import { Experience } from '@/components/gameplay/experience';
import { useScreen } from '@/providers/screen-provider';
import { TeamProvider } from '@/providers/team-provider';
import Card from '@/types/card';
import Enemy from '@/types/enemy';
import Hero from '@/types/hero';
import { Stage as IStage } from '@/types/planet';
import { Application, extend } from '@pixi/react';
import { console } from 'inspector';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { useEffect, useState } from 'react';

extend({ Sprite, Container, Graphics, Text });

interface TestStageProps {
    stage: IStage;
    nextStage?: IStage | null;
    heroes: Hero[];
    enemies: Enemy[];
    cards: Card[];
}

export default function TestStage({ stage, nextStage, heroes, enemies, cards }: TestStageProps) {
    const [isClient, setIsClient] = useState<boolean>(false);
    const { screenSize } = useScreen();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        isClient && (
            <Application width={screenSize.width} height={screenSize.height} background={0x1099bb} resizeTo={window}>
                <TeamProvider initialHeroes={heroes}>
                    <Experience stage={stage} nextStage={nextStage} initEnemies={enemies} cards={cards} />
                </TeamProvider>
            </Application>
        )
    );
}
