import { useScreen } from '@/providers/screen-provider';
import Exercise, { Option } from '@/types/exercise';
import { extend } from '@pixi/react';
import axios from 'axios';
import { Container, Point, Sprite, Text, Texture, Graphics } from 'pixi.js';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';

extend({ Container, Sprite, Text, Graphics });

interface TricksProps {
    texture: Texture;
    onClose?: () => void;
    exercise: Exercise;
    selectedOption?: Option | null;
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

export const Tricks = forwardRef<{ triggerClose: () => void }, TricksProps>(({ texture, onClose, exercise, selectedOption }, ref) => {
    const [IAresponse, setIAresponse] = useState<string>(`Cargando sugerencias...`);
    const [scrollY, setScrollY] = useState(0);
    const textContainerRef = useRef<Container>(null);
    const maskRef = useRef<Graphics>(null);
    const containerRef = useRef<Container>(null);
    const {scale, screenSize} = useScreen();
    const panelHeight = screenSize.width / 3 + 100;
    const isClosingRef = useRef(false);
    const targetLocalPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const offscreenLocalPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    const stopRAF = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
    };

    const computePositions = () => {
        const c = containerRef.current;
        if (!c || !c.parent) return;

        const globalTarget = new Point(0, screenSize.height / 3);
        const localTarget = c.parent.toLocal(globalTarget);

        const globalOffscreen = new Point(0, screenSize.height + panelHeight);
        const localOffscreen = c.parent.toLocal(globalOffscreen);

        targetLocalPos.current = { x: localTarget.x, y: localTarget.y };
        offscreenLocalPos.current = { x: localOffscreen.x, y: localOffscreen.y };
    };

    const setContainerPos = (x: number, y: number) => {
        const c = containerRef.current;
        if (!c) return;
        c.position.set(x, y);
    };

    const animateY = (fromY: number, toY: number, duration = 320, done?: () => void) => {
        stopRAF();
        const c = containerRef.current;
        if (!c) return;
        const start = performance.now();
        const x = c.x;

        const tick = () => {
            const t = Math.min((performance.now() - start) / duration, 1);
            const e = easeOutCubic(t);
            const y = fromY + (toY - fromY) * e;
            setContainerPos(x, y);
            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                stopRAF();
                done?.();
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    };

    useLayoutEffect(() => {
        computePositions();

        const off = offscreenLocalPos.current;
        const tgt = targetLocalPos.current;
        setContainerPos(off.x, off.y);
        animateY(off.y, tgt.y);

        // Configurar la máscara
        if (textContainerRef.current && maskRef.current) {
            textContainerRef.current.mask = maskRef.current;
        }

        const onResize = () => {
            computePositions();
            const pos = isClosingRef.current ? offscreenLocalPos.current : targetLocalPos.current;
            setContainerPos(pos.x, pos.y);
        };

        window.addEventListener('resize', onResize);
        return () => {
            stopRAF();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const handleClose = () => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;

        const c = containerRef.current;
        if (!c) {
            onClose?.();
            return;
        }

        const fromY = c.y;
        const toY = offscreenLocalPos.current.y;

        animateY(fromY, toY, 260, () => {
            onClose?.();
        });
    };

    const handleMessage = async () => {
        const messageToSend = "Para la siguiente pregunta el usuario necesita ayuda, solo puede escribirte una vez, por lo que response directamente su pregunta:" +
        (selectedOption 
            ? "Necesito resolver este problema de la manera correcta: " + exercise.operation + ". He intentado la siguiente opcion: " + selectedOption.result + ", pero es incorrecta. ¿Puedes ayudarme a entender por qué y cómo solucionarlo?"
            : "Necesito que me guies para resolver este problema: " + exercise.operation + ". ¿Puedes ayudarme a entender cómo solucionarlo?, pero no me des la respuesta directamente."
        );

        const response = await axios.post('/chatbot/message', {
            message: messageToSend,
        });

        setIAresponse(response.data.data);
    }

    useEffect(() => {
        handleMessage();
    }, [exercise.operation, selectedOption]);

    useImperativeHandle(ref, () => ({
        triggerClose: handleClose,
    }));

    const maxScrollHeight = panelHeight - 180; // Altura visible del texto
    const [contentHeight, setContentHeight] = useState(0);

    const handleWheel = (event: any) => {
        const delta = event.deltaY;
        const maxScroll = Math.max(0, contentHeight - maxScrollHeight);
        setScrollY(prev => Math.max(0, Math.min(prev + delta * 0.5, maxScroll)));
    };

    return (
        <pixiContainer ref={containerRef} zIndex={3} interactive={true}>
            <pixiText
                text="↓"
                cursor="pointer"
                interactive={true}
                onClick={handleClose}
                onTap={handleClose}
                x={screenSize.width / 2}
                y={screenSize.height / 3 - 90}
                zIndex={2}
                style={{
                    fontSize: 32 * scale,
                    fill: 0xffffff,
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                }}
            />

            <pixiText
                text={selectedOption ? `La opcion "${selectedOption.result}" es incorrecta:` : '¿Como solucionarlo?'}
                x={25 * scale}
                y={screenSize.height / 3 - 60}
                zIndex={2}
                style={{
                    fontSize: 24 * scale,
                    fill: 0xffffff,
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                }}
            />

            <pixiText
                text={IAresponse}
                x={25 * scale}
                y={screenSize.height / 3 - 30}
                zIndex={2}
                style={{
                    fontSize: 18 * scale,
                    fill: 0xffffff,
                    fontFamily: 'Arial',
                    wordWrap: true,
                    wordWrapWidth: screenSize.width - 50 * scale,
                }}
            />


            {texture && 
                <pixiSprite 
                    texture={texture} 
                    x={0} 
                    y={screenSize.height / 3 - 100} 
                    width={screenSize.width} 
                    height={panelHeight}
                    zIndex={1}
                />
            }
        </pixiContainer>
    );
});
