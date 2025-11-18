import useBgCombatAnimation from '@/hooks/animations/useBgCombatAnimation';
import { useScreen } from '@/providers/screen-provider';
import { useTeam } from '@/providers/team-provider';
import ICard from '@/types/card';
import IEnemy from '@/types/enemy';
import Hero from '@/types/hero';
import { Stage } from '@/types/planet';
import { extend, useTick } from '@pixi/react';
import { Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHeroAnimation } from '../../hooks/use-hero-animation';
import { ANIMATION_SPEED } from '../constants/game-world';
import { CombatUI } from './combat-ui/combat-ui';
import CardsInHand from './combat/cards-in-hand';
import DiscardedCardsModal from './combat/discarded-cards-modal';
import DiscardedCardsStack from './combat/discarded-cards-stack';
import NextTurnButton from './combat/next-turn-button';
import StolenCardsModal from './combat/stolen-cards-modal';
import StolenCardsStack from './combat/stolen-cards-stack';
import { Enemy } from './enemy/enemy';
import { Exercise } from './exercise/exercise';
import HeroStats from './hero-stats';

extend({ Sprite, Container, Graphics });

interface ICombatProps {
    team: Hero[];
    teamTextures: Texture[];
    enemies: IEnemy[];
    cards: ICard[];
    currentStage: Stage;
    currentHero: Hero;
    onSetSelectedEnemies: (enemies: IEnemy[]) => void;
    finish: (isFinished: boolean, xpGained: number) => void;
    lose: () => void;
}

interface ICombatEnemiesProps {
    enemies: IEnemy[];
}

const MAX_CARDS_IN_HAND = 4;

const assetEnergy = '/assets/energy.png';
const spriteBgCombat = 'https://res.cloudinary.com/dvibz13t8/image/upload/v1763503040/campo_hnuxk8_k2yehr.png';

export const Combat = ({ team, teamTextures, enemies, cards, currentHero, currentStage, onSetSelectedEnemies, finish, lose }: ICombatProps) => {
    const [teamEnergy, setTeamEnergy] = useState(4);
    const [turn, setTurn] = useState(0);
    const [maxHeroEnergy] = useState(4);
    const [combatTexture, setCombatTexture] = useState<Texture | null>(null);
    const [isCardHeldDown, setIsCardHeldDown] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
    const [selectedEnemy, setSelectedEnemy] = useState<IEnemy | null>(null);
    const [selectedCardPosition, setSelectedCardPosition] = useState({ x: 0, y: 0 });
    const [isTargetAssigned, setIsTargetAssigned] = useState(false);
    const [isAttacking, setIsAttacking] = useState(false);
    const [energyTexture, setEnergyTexture] = useState<Texture | null>(null);
    const [stolenCards, setStolenCards] = useState<ICard[]>(cards.slice(MAX_CARDS_IN_HAND, cards.length));
    const [cardsInHand, setCardsInHand] = useState<ICard[]>(cards.slice(0, MAX_CARDS_IN_HAND));
    const [discardedCards, setDiscardedCards] = useState<ICard[]>([]);
    const [showDiscardedCardsModal, setShowDiscardedCardsModal] = useState(false);
    const [showStolenCardsModal, setShowStolenCardsModal] = useState(false);
    const [isAttackingAnimation, setIsAttackingAnimation] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [attackingHeroIndex, setAttackingHeroIndex] = useState<number | null>(null);
    const { teamHeroes, updateHeroHealth } = useTeam();
    const { scale, screenSize } = useScreen();
    const combatEndedRef = useRef(false); // ✅ Prevenir múltiples llamadas

    // Usar teamHeroes del context en lugar de team prop
    const activeTeam = teamHeroes.length > 0 ? teamHeroes : team;

    const [currentHeroInCombatId, setCurrentHeroInCombatId] = useState<string>(currentHero.id);

    // ✅ Obtener el héroe actual desde activeTeam (siempre actualizado desde el context)
    const currentHeroInCombat = activeTeam.find((h) => h.id === currentHeroInCombatId) || activeTeam[0];

    // Crear hooks de animación dinámicamente basados en el equipo activo
    const hero0Animation = useHeroAnimation({
        texture: teamTextures[0],
        frameWidth: 64,
        frameHeight: 64,
        totalTilesFrames: activeTeam[0]?.hero_animations.find((anim) => anim.action === 'fighting')?.totalTilesFrames || 2,
        animationSpeed: ANIMATION_SPEED,
        heroAnimation: activeTeam[0]?.hero_animations.find((anim) => anim.action === 'fighting') || activeTeam[0]?.hero_animations[0],
    });

    const hero1Animation = useHeroAnimation({
        texture: teamTextures[1] || teamTextures[0],
        frameWidth: 64,
        frameHeight: 64,
        totalTilesFrames: activeTeam[1]?.hero_animations.find((anim) => anim.action === 'fighting')?.totalTilesFrames || 2,
        animationSpeed: ANIMATION_SPEED,
        heroAnimation: activeTeam[1]?.hero_animations.find((anim) => anim.action === 'fighting') || activeTeam[1]?.hero_animations[0],
    });

    const hero2Animation = useHeroAnimation({
        texture: teamTextures[2] || teamTextures[0],
        frameWidth: 64,
        frameHeight: 64,
        totalTilesFrames: activeTeam[2]?.hero_animations.find((anim) => anim.action === 'fighting')?.totalTilesFrames || 2,
        animationSpeed: ANIMATION_SPEED,
        heroAnimation: activeTeam[2]?.hero_animations.find((anim) => anim.action === 'fighting') || activeTeam[2]?.hero_animations[0],
    });

    const hero3Animation = useHeroAnimation({
        texture: teamTextures[3] || teamTextures[0],
        frameWidth: 64,
        frameHeight: 64,
        totalTilesFrames: activeTeam[3]?.hero_animations.find((anim) => anim.action === 'fighting')?.totalTilesFrames || 2,
        animationSpeed: ANIMATION_SPEED,
        heroAnimation: activeTeam[3]?.hero_animations.find((anim) => anim.action === 'fighting') || activeTeam[3]?.hero_animations[0],
    });

    // Hook para animación de ataque
    const attackAnimation = useHeroAnimation({
        texture: attackingHeroIndex !== null ? teamTextures[attackingHeroIndex] : teamTextures[0],
        frameWidth: 128,
        frameHeight: 64,
        totalTilesFrames: activeTeam[attackingHeroIndex || 0]?.hero_animations.find((anim) => anim.action === 'attack')?.totalTilesFrames || 8,
        animationSpeed: ANIMATION_SPEED,
        heroAnimation:
            activeTeam[attackingHeroIndex || 0]?.hero_animations.find((anim) => anim.action === 'attack') ||
            activeTeam[attackingHeroIndex || 0]?.hero_animations[0],
    });

    // Array de animaciones para facilitar el acceso
    const heroAnimations = [hero0Animation, hero1Animation, hero2Animation, hero3Animation];

    const assignCardTarget = useCallback(
        ({ cardPosition, characterTarget }: { cardPosition: { x: number; y: number }; characterTarget: { x: number; y: number } }) => {
            return (
                cardPosition.x >= characterTarget.x &&
                cardPosition.x <= characterTarget.x + 128 &&
                cardPosition.y >= characterTarget.y &&
                cardPosition.y <= characterTarget.y + 128
            );
        },
        [],
    );

    const attack = () => {
        if (selectedCard && selectedEnemy && teamEnergy > 0) {
            setTeamEnergy((prevTeamEnergy) => prevTeamEnergy - selectedCard.energy_cost);

            if (selectedCard.hero_id && activeTeam.some((hero) => hero.id === selectedCard.hero_id)) {
                const attackingIndex = activeTeam.findIndex((hero) => hero.id === selectedCard.hero_id);
                if (attackingIndex !== -1) {
                    setAttackingHeroIndex(attackingIndex);
                    attackAnimation.resetAnimation();
                    setIsAttackingAnimation(true);
                }
            }
            attackAnimation.resetAnimation();
            setIsAttackingAnimation(true);

            onSetSelectedEnemies(
                enemies.map((enemy) => {
                    if (enemy.id === selectedEnemy.id) {
                        if (enemy.health - selectedCard.stats <= 0) {
                            setXpGained((prev) => prev + (enemy.type?.reward_xp || 0));
                            console.log('Total XP gained:', xpGained + (enemy.type?.reward_xp || 0));
                        }
                        return { ...enemy, health: enemy.health - selectedCard.stats };
                    } else {
                        return enemy;
                    }
                }),
            );
            setDiscardedCards((prev) => [...prev, selectedCard]);
            setCardsInHand((prev) => prev.filter((card) => card.id !== selectedCard.id));
            setSelectedCard(null);
            setIsAttacking(false);
            setIsTargetAssigned(false);
            setSelectedCardPosition({ x: 0, y: 0 });
        }
    };

    const nextTurn = () => {
        setTurn((prev) => prev + 1);
        setTeamEnergy(maxHeroEnergy);
        setStolenCards((prev) => [...prev, ...discardedCards]);
        setDiscardedCards([]);

        if (cardsInHand.length < MAX_CARDS_IN_HAND) {
            const cardsNeeded = MAX_CARDS_IN_HAND - cardsInHand.length;
            const newCards = stolenCards.slice(0, cardsNeeded);
            setCardsInHand((prev) => [...prev, ...newCards]);
            setStolenCards((prev) => prev.slice(newCards.length, prev.length));
        }

        // ✅ CORREGIDO: Daño a héroe aleatorio del equipo
        enemies.forEach((enemy) => {
            // Filtrar solo héroes vivos
            const aliveHeroes = activeTeam.filter((hero) => hero.current_health > 0);

            if (aliveHeroes.length > 0) {
                const randomHeroIndex = Math.floor(Math.random() * aliveHeroes.length);
                const heroToDamage = aliveHeroes[randomHeroIndex];
                const damage = enemy.basic_attack;
                const newHealth = Math.max(0, heroToDamage.current_health - damage);

                // Actualizar en el context
                updateHeroHealth(heroToDamage.id, newHealth);
            }
        });
    };

    useTick(() => {

        if (isAttackingAnimation && attackingHeroIndex !== null) {
            const keepPlaying = attackAnimation.updateAttackSprite('RIGHT', false, false, false, true);
            if (!keepPlaying) {
                attackAnimation.resetAnimation();
                setIsAttackingAnimation(false);
                setAttackingHeroIndex(null);
            }
        }

        // Actualizar animaciones de todos los héroes disponibles
        heroAnimations.forEach((animation, index) => {
            if (index < activeTeam.length && (!isAttackingAnimation || attackingHeroIndex !== index)) {
                animation.updateSprite('DOWN', true, true, false, false);
            }
        });

        if (isCardHeldDown) {
            enemies.forEach((enemy) => {
                if (enemy.combat_position && assignCardTarget({ cardPosition: selectedCardPosition, characterTarget: enemy.combat_position })) {
                    setIsTargetAssigned(true);
                    setSelectedEnemy(enemy);
                } else if (selectedEnemy?.id === enemy.id) {
                    setIsTargetAssigned(false);
                    setSelectedEnemy(null);
                }
            });
        }
    });

    useEffect(() => {
        let cancelled = false;

        console.log('Loading combat background texture from:', spriteBgCombat);
        Assets.load<Texture>(spriteBgCombat).then((tex) => {
            if (!cancelled) {
                console.log('✅ Combat texture loaded successfully!');
                console.log('Texture width:', tex.width);
                console.log('Texture height:', tex.height);
                console.log('Texture source valid:', tex.source ? 'YES' : 'NO');
                console.log('Texture:', tex);
                setCombatTexture(tex);
            }
        });

        Assets.load<Texture>(assetEnergy).then((text) => {
            setEnergyTexture(text);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        // Solo ejecutar una vez por combate
        if (combatEndedRef.current) return;
        if (!enemies || enemies.length === 0) return;

        const allHeroesDead = activeTeam.every((hero) => hero.current_health <= 0);
        const allEnemiesDead = enemies.every((enemy) => enemy.health <= 0);

        if (allEnemiesDead) {
            combatEndedRef.current = true; // ✅ Marcar como finalizado
            console.log('🎉 Victoria! XP ganado:', xpGained);
            finish(true, xpGained);
        } else if (allHeroesDead) {
            combatEndedRef.current = true; // ✅ Marcar como finalizado
            console.log('💀 Derrota!');
            lose();
        }
    }, [activeTeam, enemies, xpGained]);

    const changeCurrentHero = (heroId: string | null) => {
        if (heroId) {
            const hero = activeTeam.find((h) => h.id === heroId);
            if (hero) {
                setCurrentHeroInCombatId(hero.id);
                console.log(`Héroe actual en combate cambiado a: ${hero.name}`);
            }
        }
    };

    return (
        <pixiContainer>
            {combatTexture && combatTexture !== Texture.EMPTY && (
                <pixiSprite
                    texture={combatTexture} // ✅ Usar la textura completa directamente
                    width={screenSize.width}
                    height={screenSize.height}
                    x={0}
                    y={0}
                />
            )}

            {/* {bgCombatSprite && combatTexture && (
                <pixiSprite
                    texture={bgCombatSprite.texture}
                    width={screenSize.width} 
                    height={screenSize.height} 
                    x={0}
                    y={0}
                    anchor={0} 
                />
            )} */}

            <CombatUI teamHeroes={activeTeam} currentTurn={turn + 1} currentStage={currentStage} />

            {/* Renderizar héroes con animaciones */}
            {activeTeam.map((hero, index) => {
                if (index >= heroAnimations.length) return null;

                const heroSprite = isAttackingAnimation && attackingHeroIndex === index ? attackAnimation.sprite : heroAnimations[index]?.sprite;

                const baseX = screenSize.width * 0.2;
                const baseY = screenSize.height * 0.4;
                const spacing = 120 * scale;

                const isAttackSprite = isAttackingAnimation && attackingHeroIndex === index;
                const spriteWidth = isAttackSprite ? 384 * scale : 168 * scale;
                const normalWidth = 128 * scale;

                const adjustedX = isAttackSprite ? baseX - (spriteWidth - normalWidth) / 2 : baseX;

                return (
                    heroSprite && (
                        <pixiSprite
                            key={`hero-${hero.id}-${index}`}
                            texture={heroSprite.texture}
                            x={adjustedX - 100 * scale}
                            y={baseY + index * spacing + 50 * scale}
                            width={spriteWidth}
                            height={168 * scale}
                        />
                    )
                );
            })}

            <CombatEnemies enemies={enemies} />

            {isCardHeldDown &&
                enemies.map((enemy, index) => (
                    <pixiGraphics
                        key={`enemy-target-${enemy.id}-${index}`}
                        draw={(g) => {
                            g.clear();
                            g.rect(enemy.combat_position?.x || 0, enemy.combat_position?.y || 0, 128 * scale, 128 * scale);
                            g.stroke({ color: isTargetAssigned && selectedEnemy?.id === enemy.id ? 0x00ff00 : 0xff0000, width: 5 * scale });
                        }}
                    />
                ))}

            {/* ✅ La barra ahora se actualiza porque currentHeroInCombat viene de activeTeam actualizado */}
            <HeroStats
                key={`hero-stats-${currentHeroInCombat.id}`}
                currentHp={currentHeroInCombat.current_health}
                maxHp={currentHeroInCombat.health}
                currentHero={currentHeroInCombat}
                energyTexture={energyTexture}
                maxEnergy={maxHeroEnergy}
                currentEnergy={teamEnergy}
            />

            <CardsInHand
                cards={cardsInHand}
                setIsCardHeldDown={setIsCardHeldDown}
                setCardPosition={setSelectedCardPosition}
                isTargetAssigned={isTargetAssigned}
                setIsAttacking={setIsAttacking}
                setSelectedCard={setSelectedCard}
                isDisabled={teamEnergy <= 0}
                setCurrentHeroInCombatId={changeCurrentHero}
            />

            <StolenCardsStack onClick={(value) => setShowStolenCardsModal(value)} cards={stolenCards} />
            <NextTurnButton onClick={nextTurn} />
            <DiscardedCardsStack onClick={(value) => setShowDiscardedCardsModal(value)} cards={discardedCards} />

            {isAttacking && selectedCard && selectedEnemy && selectedCard.exercise && (
                <Exercise
                    enemy={selectedEnemy}
                    card={selectedCard}
                    exercise={selectedCard.exercise}
                    onClose={() => {
                        setIsAttacking(false);
                        setIsTargetAssigned(false);
                        setSelectedCardPosition({ x: 0, y: 0 });
                    }}
                    onIsAttacking={setIsAttacking}
                    attack={attack}
                />
            )}

            <DiscardedCardsModal cards={discardedCards} onClose={(value) => setShowDiscardedCardsModal(value)} isOpen={showDiscardedCardsModal} />
            <StolenCardsModal cards={stolenCards} onClose={(value) => setShowStolenCardsModal(value)} isOpen={showStolenCardsModal} />
        </pixiContainer>
    );
};

const CombatEnemies = ({ enemies }: ICombatEnemiesProps) => {
    return (
        <>
            {enemies.map((enemy) => (
                <Enemy key={enemy.id} enemy={enemy} />
            ))}
        </>
    );
};
