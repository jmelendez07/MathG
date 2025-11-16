import { useScreen } from "@/providers/screen-provider";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Graphics, TextStyle, Texture } from "pixi.js";
import { useCallback, useMemo } from "react";

interface ProfileUIProps {
    avatarFrameTexture: Texture;
    avatarProfileTexture: Texture;
}

export const ProfileUI = ({ avatarFrameTexture, avatarProfileTexture }: ProfileUIProps) => {
    const { auth } = usePage<SharedData>().props;
    const { scale } = useScreen();

    const levelStyle = useMemo(() => new TextStyle({
        fontFamily: 'Jersey 10',
        fontSize: 50 * scale,
        fontWeight: '400',
        fill: '#ffffff',
        align: 'left',
        stroke: '#000000',
    }), [scale]);

    const xpTextStyle = useMemo(() => new TextStyle({
        fontFamily: 'Jersey 10',
        fontSize: 26 * scale,
        fontWeight: '400',
        fill: '#ffffff',
        align: 'center',
        stroke: { color: '#000000', width: 1 * scale },
    }), [scale]);

    // useEffect(() => {
    //     if (auth.user?.profile) {
    //         const avatarFrameUrl = auth.user.profile.avatar_frame_url;
    //         const avatarUrl = auth.user.profile.avatar_url;

    //         if (avatarFrameUrl) {
    //             Assets.load<Texture>(avatarFrameUrl).then((tex) => {
    //                 setAvatarFrameTexture(tex);
    //             });
    //         }

    //         if (avatarUrl) {
    //             Assets.load<Texture>(avatarUrl).then((tex) => {
    //                 setAvatarProfileTexture(tex);
    //             });
    //         }
    //     }
    // }, [auth.user?.profile]);

    const calculateXpPercentage = () => {
        if (!auth.user?.profile) return 0;

        const totalXp = auth.user.profile.total_xp;
        const nextLevelXp = auth.user.profile.level.next_level_xp ?? 1;

        return Math.min((totalXp / nextLevelXp) * 100, 100);
    };

    const xpPercentage = calculateXpPercentage();

    const barWidth = 240 * scale;
    const barHeight = 30 * scale;
    const innerBarWidth = 236 * scale;
    const innerBarHeight = 26 * scale;
    const actualBarWidth = 236 * scale;
    const borderRadius = 6 * scale;
    const innerBorderRadius = 4 * scale;

    const drawXpBar = useCallback((g: Graphics) => {
        g.clear();
        
        const x = 145 * scale;
        const y = 80 * scale;
        
        g.roundRect(x + 2 * scale, y + 2 * scale, barWidth, barHeight, borderRadius);
        g.fill({ color: 0x000000, alpha: 0.3 });
        g.roundRect(x, y, barWidth, barHeight, borderRadius);
        g.fill({ color: 0x2c2c2c });
        g.stroke({ color: 0x444444, width: 1 * scale });
        
    }, [scale, barWidth, barHeight, borderRadius]);

    const drawInnerBackground = useCallback((g: Graphics) => {
        g.clear();
        const x = 147 * scale;
        const y = 83 * scale;
        
        g.roundRect(x, y, innerBarWidth, innerBarHeight, innerBorderRadius);
        g.fill({ color: 0x1a1a1a });
    }, [scale, innerBarWidth, innerBarHeight, innerBorderRadius]);

    const drawProgress = useCallback((g: Graphics) => {
        g.clear();
        const x = 147 * scale;
        const y = 85 * scale;
        const barWidthFilled = actualBarWidth * (xpPercentage / 100);
        
        if (barWidthFilled > 0) {
            g.roundRect(x, y, barWidthFilled, 14 * scale, innerBorderRadius);
            g.fill({ color: 0x9333ea });
        }
    }, [xpPercentage, scale, actualBarWidth, innerBorderRadius]);

    const drawHighlight = useCallback((g: Graphics) => {
        g.clear();
        const x = 147 * scale;
        const y = 85 * scale;
        const barWidthFilled = actualBarWidth * (xpPercentage / 100);
        
        if (barWidthFilled > 0) {
            g.roundRect(x, y, barWidthFilled, 5 * scale, innerBorderRadius);
            g.fill({ color: 0xb668ff, alpha: 0.6 });
        }
    }, [xpPercentage, scale, actualBarWidth, innerBorderRadius]);

    const drawSegments = useCallback((g: Graphics) => {
        g.clear();
        const segments = 4;
        const x = 147 * scale;
        const y = 83 * scale;
        
        for (let i = 1; i < segments; i++) {
            const segmentX = x + innerBarWidth * (i / segments);
            g.moveTo(segmentX, y);
            g.lineTo(segmentX, y + innerBarHeight);
            g.stroke({ color: 0x000000, width: 1 * scale, alpha: 0.3 });
        }
    }, [scale, innerBarWidth, innerBarHeight]);

    const drawGlow = useCallback((g: Graphics) => {
        g.clear();
        if (xpPercentage > 80) {
            const x = 164 * scale;
            const y = 87 * scale;
            const barWidthFilled = actualBarWidth * (xpPercentage / 100);
            
            g.roundRect(x, y, barWidthFilled, 2 * scale, 2 * scale);
            g.fill({ color: 0xffffff, alpha: 0.4 });
        }
    }, [xpPercentage, scale, actualBarWidth]);

    return (
        <pixiContainer zIndex={1}>
            {avatarFrameTexture && (
                <pixiSprite 
                    texture={avatarFrameTexture} 
                    x={10 * scale} 
                    y={20 * scale} 
                    width={128 * scale} 
                    height={128 * scale} 
                    zIndex={2}
                />
            )}

            {avatarProfileTexture && (
                <pixiSprite
                    x={29 * scale}
                    y={39 * scale}
                    texture={avatarProfileTexture}
                    width={90 * scale}
                    height={90 * scale}
                    zIndex={1}
                />
            )}

            <pixiText 
                text={auth.user?.name + " (Nivel " + (auth.user?.profile?.level.order ?? 1) + ")"} 
                style={levelStyle} 
                x={145 * scale} 
                y={30 * scale}
                resolution={1}
            />

            <pixiGraphics draw={drawXpBar} zIndex={102} />
            <pixiGraphics draw={drawInnerBackground} zIndex={102} />
            <pixiGraphics draw={drawProgress} zIndex={102} />
            <pixiGraphics draw={drawHighlight} zIndex={102} />
            <pixiGraphics draw={drawSegments} zIndex={102} />
            <pixiGraphics draw={drawGlow} zIndex={103} />

            <pixiText 
                text={`${auth.user?.profile?.total_xp} / ${auth.user?.profile?.level.next_level_xp} XP`} 
                style={xpTextStyle} 
                x={196 * scale} 
                y={94 * scale} 
                anchor={0.5}
                zIndex={104}
                resolution={2}
            />
        </pixiContainer>
    );
};