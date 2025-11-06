import { useScreen } from '@/providers/screen-provider';
import { Option } from '@/types/exercise';
import { Container, FederatedPointerEvent } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IAnswerProps {
    // text: string;
    // isCorrect: boolean;
    option: Option;
    x: number;
    y: number;
    width: number;
    height: number;
    containerX: number;
    containerY: number;
    onDragStart?: (ref: Container | null) => void;
    onDragEnd?: (ref: Container | null, option: Option) => void;
    onDragMove?: (event: FederatedPointerEvent) => void;
    onIsDraggingChange?: (isDragging: boolean) => void;
    onAnswerPositionChange?: (position: { x: number; y: number }) => void;
    onChoosingAnswer?: (answer: { result: string; is_correct: boolean }) => void;
}

export const Answer = ({
    // text,
    // isCorrect,
    option,
    x,
    y,
    width,
    height,
    containerX,
    containerY,
    onIsDraggingChange,
    onAnswerPositionChange,
    onDragStart,
    onDragEnd,
}: IAnswerProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [answerPosition, setAnswerPosition] = useState({ x, y });
    const [isClicked, setIsClicked] = useState(false);
    const originalPosition = useRef({ x, y });
    const dragOffset = useRef({ x: 0, y: 0 });
    const wasDragged = useRef(false); // Ref para rastrear si hubo movimiento
    const answerContainerRef = useRef<Container>(null);
    const {scale} = useScreen();

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            wasDragged.current = true; // Marcamos que un movimiento ocurrió
            setAnswerPosition({
                x: event.clientX - containerX - dragOffset.current.x,
                y: event.clientY - containerY - dragOffset.current.y,
            });
        },
        [containerX, containerY],
    );

    const handlePointerUp = useCallback(() => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);

        if (wasDragged.current) {
            // Lógica para cuando se suelta después de arrastrar
            console.log('Drag ended for:', option.result);
            onDragEnd?.(answerContainerRef.current, option);
        } else {
            // Lógica para un click (sin arrastre)
            console.log('Clicked:', option.result);
            setIsClicked((prev) => !prev);
        }

        setIsDragging(false);
        setAnswerPosition({ x: originalPosition.current.x, y: originalPosition.current.y });
    }, [handlePointerMove, onDragEnd, option]); // ← Cambiar dependencias

    const handlePointerDown = (event: FederatedPointerEvent) => {
        // Prevenir comportamiento de drag-and-drop nativo del navegador
        event.preventDefault();
        wasDragged.current = false; // Reseteamos el estado de arrastre al iniciar
        onDragStart?.(answerContainerRef.current); // Notificamos que el arrastre ha comenzado

        // Guardamos la diferencia entre el punto de click y la esquina del componente
        dragOffset.current = {
            x: event.global.x - answerPosition.x - containerX,
            y: event.global.y - answerPosition.y - containerY,
        };

        setIsDragging(true);

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    useEffect(() => {
        onIsDraggingChange?.(isDragging);
        if (!isDragging) {
            setAnswerPosition({ x: originalPosition.current.x, y: originalPosition.current.y });
        }
    }, [isDragging, onIsDraggingChange]);

    useEffect(() => {
        if (isDragging) {
            onAnswerPositionChange?.(answerPosition);
        }
    }, [isDragging, answerPosition, onAnswerPositionChange]);

    return (
        <pixiContainer ref={answerContainerRef} x={answerPosition.x} y={answerPosition.y} eventMode="static" onPointerDown={handlePointerDown}>
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    g.roundRect(0, 0, width - 10, height);
                    g.fill({ color: 0x000000, alpha: 0.01 });
                    g.stroke({ color: isClicked ? 0x070ba6 : 0x5e5353, width: 2 });
                }}
                x={0}
                y={0}
                alpha={isDragging ? 0.5 : 1}
            />
            <pixiText
                interactive={false}
                text={option.result}
                x={(width - 10) / 2}
                y={height / 2}
                anchor={0.5}
                style={{
                    fontSize: 20 * scale,
                    fill: 0xffffff,
                    fontFamily: 'Arial',
                }}
            />
        </pixiContainer>
    );
};
