import { Experience } from '@/components/gameplay/experience';
import Loading from '@/components/gameplay/loading';
import { useScreen } from '@/providers/screen-provider';
import { TeamProvider } from '@/providers/team-provider';
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
    nextStage?: IStage | null;
    heroes: Hero[];
    enemies: Enemy[];
    cards: Card[];
}

export default function TestStage({ stage, nextStage, heroes, enemies, cards }: TestStageProps) {
    const [isClient, setIsClient] = useState<boolean>(false);
    const { screenSize } = useScreen();
    const [texturesLoaded, setTexturesLoaded] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        isClient && (
            <Application antialias={true} autoDensity={true} width={screenSize.width} background={0x000000} height={screenSize.height} resizeTo={window}>
                <TeamProvider initialHeroes={heroes}>
                    <Loading handleStarted={(value: boolean) => setIsStarted(value)} isLoaded={texturesLoaded} visible={!isStarted} />
                    <Experience stage={stage} nextStage={nextStage} initEnemies={enemies} cards={cards} handleTexturesLoaded={(value: boolean) => setTexturesLoaded(value)} visible={isStarted} />
                </TeamProvider>
            </Application>
        )
    );
}
