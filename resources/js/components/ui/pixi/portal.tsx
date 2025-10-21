import { Stage } from '@/types/planet';
import { router } from '@inertiajs/react';
import { extend } from '@pixi/react';
import { Graphics, Text, TextStyle } from 'pixi.js';

extend({ Graphics, Text });

interface PortalUIProps {
    canvasSize: { width: number; height: number };
    isVisible: boolean;
    title?: string;
    subtitle?: string;
    nextStage: Stage | null;
}

const titleStyle = new TextStyle({
    fontFamily: 'Jersey 10, Arial, sans-serif',
    fontSize: 60,
    fontWeight: '400',
    fill: '#ffffff',
    align: 'center',
});

const subtitleStyle = new TextStyle({
    fontFamily: 'Jersey 10, Arial, sans-serif',
    fontSize: 30,
    fontWeight: '400',
    fill: '#ffffff',
    align: 'center',
});

const menuStyle = new TextStyle({
    fontFamily: 'Jersey 10, Arial, sans-serif',
    fontSize: 30,
    fontWeight: '400',
    fill: '#ffffff',
    align: 'center',
});

export const PortalUI = ({
    canvasSize,
    isVisible,
    title = '¡Portal Activado!',
    subtitle = 'Preparándote para el siguiente nivel...',
    nextStage
}: PortalUIProps) => {

    if (!isVisible) return null;

    const handleReturnToMenu = () => {
        router.visit(route('gameplay.index'));
    }

    const handleNextRoute = () => {
        if (nextStage) {
            router.visit(route('gameplay.stage', { stageId: nextStage.id }));
        } else {
            router.visit(route('gameplay.index'));
        }
    }

    return (
        <pixiContainer>
            <pixiGraphics
                draw={(g) => {
                    g.clear();
                    g.beginFill(0x000000, 0.7);
                    g.drawRect(0, 0, canvasSize.width, canvasSize.height);
                    g.endFill();
                }}
            />

            <pixiContainer x={canvasSize.width / 2} y={canvasSize.height / 2}>
                <pixiGraphics
                    draw={(g) => {
                        g.clear();
                        g.beginFill(0x2d1b69, 0.95);
                        g.stroke({ width: 3, color: 0x8b5cf6, alpha: 1 });
                        g.roundRect(-250, -175, 500, 300, 20);
                        g.fill();
                        g.stroke();
                    }}
                />

                <pixiText text={title} style={titleStyle} anchor={0.5} x={0} y={-125} resolution={2} />
                <pixiText text={subtitle} style={subtitleStyle} anchor={0.5} x={0} y={-70} resolution={2} />

                <pixiGraphics
                    y={-20}
                    draw={(g) => {
                        g.clear();
                        g.beginFill(0x8b5cf6, 0.6);
                        g.roundRect(-100, -8, 200, 16, 8);
                        g.fill();

                        g.beginFill(0xffffff, 0.8);
                        g.roundRect(-95, -3, 190, 6, 3);
                        g.fill();
                    }}
                />

                <pixiContainer
                    y={60}
                    interactive
                    cursor="pointer"
                    onPointerDown={handleReturnToMenu}
                >
                    <pixiGraphics
                        draw={(g) => {
                            g.clear();
                            g.beginFill(0x8b5cf6, 0.3);
                            g.drawRoundedRect(-230, -25, 220, 50, 10);
                            g.endFill();
                        }}
                    />
                    <pixiText
                        text="Volver al menú"
                        style={menuStyle}
                        anchor={0.5}
                        x={-120}
                        y={0}
                        resolution={2}
                    />
                </pixiContainer>
                <pixiContainer
                    y={60}
                    interactive
                    cursor="pointer"
                    onPointerDown={handleNextRoute}
                >
                    <pixiGraphics
                        draw={(g) => {
                            g.clear();
                            g.beginFill(0x8b5cf6, 0.3);
                            g.drawRoundedRect(0, -25, 220, 50, 10);
                            g.endFill();
                        }}
                    />
                    <pixiText
                        text="Siguiente nivel"
                        style={menuStyle}
                        anchor={0.5}
                        x={110}
                        y={0}
                        resolution={2}
                    />
                </pixiContainer>
            </pixiContainer>
        </pixiContainer>
    );
};
