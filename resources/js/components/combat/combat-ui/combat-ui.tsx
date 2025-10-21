import { useScreen } from '@/providers/screen-provider';
import Hero from '@/types/hero';
import { Stage } from '@/types/planet';
import { Assets, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';

interface CombatUIProps {
    teamHeroes: Hero[];
    currentTurn?: number;
    currentStage: Stage;
}

const uiAsset = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1759335050/navbar_ibsskq.png';

export const CombatUI = ({ teamHeroes, currentTurn, currentStage }: CombatUIProps) => {
    const [uiTexture, setUiTexture] = useState<Texture | null>(null);
    const [avatarTextures, setAvatarTextures] = useState<Texture[]>([]);
    const { scale, screenSize } = useScreen();

    useEffect(() => {
        const loadUiTexture = async () => {
            Assets.load<Texture>(uiAsset).then((tex) => {
                setUiTexture(tex);
            });
        };

        const loadAvatarTextures = async () => {
            const textures = await Promise.all(teamHeroes.map((hero) => Assets.load<Texture>(hero.avatar_url)));
            setAvatarTextures(textures);
        };

        loadUiTexture();
        loadAvatarTextures();

        return () => {
            uiTexture?.destroy();
        };
    }, [uiTexture]);

    return (
        <pixiContainer>
            {uiTexture && <pixiSprite texture={uiTexture} x={5 } y={5} width={screenSize.width - 10} height={screenSize.height / 13} />}
            <pixiText
                text={`Turno N°${currentTurn}`}
                x={30}
                y={5 + screenSize.height / 13 / 2}
                anchor={{ x: 0, y: 0.5 }}
                style={{ fill: 'white', fontSize: 30 * scale, fontFamily: 'Jersey 10' }}
            />

            {avatarTextures.map((texture, index) => {
                const gap = 110 * scale;
                const avatarSize = 40 * scale;
                const xPosition = screenSize.width / 3 - (avatarSize + gap) * (teamHeroes.length - index) + gap;
                const yPosition = 5 + (screenSize.height / 13 - avatarSize) / 2;
                const hero = teamHeroes[index];
                
                return (
                    <pixiContainer key={`hero-ui-${hero.id}-${index}`}>
                        <pixiText
                            text={`${hero.current_health}/${hero.health}`}
                            x={xPosition - 35 * scale}
                            y={5 + screenSize.height / 13 / 2}
                            anchor={{ x: 0.5, y: 0.5 }}
                            style={{ fill: 'white', fontSize: 24 * scale, fontFamily: 'Jersey 10' }}
                        />
                        <pixiSprite 
                            texture={texture} 
                            x={xPosition} 
                            y={yPosition} 
                            width={avatarSize} 
                            height={avatarSize} 
                        />
                    </pixiContainer>
                );
            })}

            <pixiText 
                text={`Etapa N°${currentStage.number}: ${currentStage.name}`}
                x={screenSize.width - 30}
                y={5 + screenSize.height / 13 / 2}
                anchor={{ x: 1, y: 0.5 }}
                style={{ fill: 'white', fontSize: 30 * scale, fontFamily: 'Jersey 10' }}
            />
        </pixiContainer>
    );
};
