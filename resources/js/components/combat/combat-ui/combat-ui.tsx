import { useScreen } from '@/providers/screen-provider';
import Hero from '@/types/hero';
import { Stage } from '@/types/planet';
import { Texture } from 'pixi.js';

interface CombatUIProps {
    bannerTexture: Texture;
    avatarBannerTextures: Texture[];
    teamHeroes: Hero[];
    currentTurn?: number;
    currentStage: Stage;
}

export const CombatUI = ({ bannerTexture, avatarBannerTextures, teamHeroes, currentTurn, currentStage }: CombatUIProps) => {
    const { scale, screenSize } = useScreen();

    return (
        <pixiContainer>
            {bannerTexture && (
                <pixiSprite 
                    texture={bannerTexture} 
                    x={5} 
                    y={5} 
                    width={screenSize.width - 10} 
                    height={screenSize.height / 13} 
                />
            )}
            <pixiText
                text={`Turno N°${currentTurn}`}
                x={30}
                y={5 + screenSize.height / 13 / 2}
                anchor={{ x: 0, y: 0.5 }}
                style={{ fill: 'white', fontSize: 30 * scale, fontFamily: 'Jersey 10' }}
            />

            {avatarBannerTextures.map((texture, index) => {
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
