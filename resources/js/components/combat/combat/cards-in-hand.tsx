import ICard from '@/types/card';
import { Card } from '../card/card';
import { useScreen } from '@/Providers/ScreenProvider';

interface ICardsInHandProps {
    cards: ICard[];
    setIsCardHeldDown: (isHeldDown: boolean) => void;
    setCardPosition: (position: { x: number; y: number }) => void;
    isTargetAssigned: boolean;
    setIsAttacking: (isAttacking: boolean) => void;
    setSelectedCard: (card: ICard | null) => void;
    setCurrentHeroInCombatId?: (id: string | null) => void;
    isDisabled: boolean;
}

export default function CardsInHand({
    cards,
    setIsCardHeldDown,
    setCardPosition,
    isTargetAssigned,
    setIsAttacking,
    setSelectedCard,
    setCurrentHeroInCombatId,
    isDisabled,
}: ICardsInHandProps) {

    const { scale, screenSize } = useScreen();
    // Calcular espaciado y posición basado en el tamaño de pantalla
    const getCardLayout = () => {
        const baseSpacing = 180 * scale;
        const baseYOffset = 320 * scale;
        const baseElevation = 40 * scale;

        // Ajustar espaciado basado en la pantalla y número de cartas
        const maxCardsWidth = screenSize.width * 0.8; // 80% del ancho de pantalla
        const availableSpacing = maxCardsWidth / cards.length;
        const cardSpacing = Math.min(baseSpacing, availableSpacing);

        return {
            spacing: cardSpacing,
            yOffset: baseYOffset,
            elevation: baseElevation,
        };
    };

    const layout = getCardLayout();

    return (
        <>
            {cards.map((card, index) => {
                const totalWidth = cards.length * layout.spacing - 20;
                const startX = (screenSize.width - totalWidth) / 2;
                const baseYPosition = screenSize.height - layout.yOffset;
                const centerIndex = (cards.length - 1) / 2;
                const rotationAngle = (index - centerIndex) * 0.15;
                const isFirstCard = index === 0;
                const isLastCard = index === cards.length - 1;
                const isExtremeCard = isFirstCard || isLastCard;
                const elevationAmount = isExtremeCard ? 0 : -layout.elevation;

                const cardPosition = {
                    x: startX + index * layout.spacing,
                    y: baseYPosition + elevationAmount,
                };

                return (
                    <Card
                        key={card.id + '-' + cards.length}
                        card={card}
                        onHeldDownChange={isDisabled ? () => {} : setIsCardHeldDown}
                        onCardPositionChange={isDisabled ? () => {} : setCardPosition}
                        isTargetAssigned={isTargetAssigned}
                        onAttack={isDisabled ? () => {} : setIsAttacking}
                        initialPosition={cardPosition}
                        initialRotation={rotationAngle}
                        onSelectedCard={isDisabled ? () => {} : setSelectedCard}
                        onCurrentHeroInCombatId={setCurrentHeroInCombatId}
                        isDisabled={isDisabled}
                    />
                );
            })}
        </>
    );
}
