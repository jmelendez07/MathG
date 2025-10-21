import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ScreenContextType {
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    scale: number;
    screenSize: { width: number; height: number };
    baseSize: { width: number; height: number };
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

interface ScreenProviderProps {
    children: ReactNode;
    baseWidth?: number;
    baseHeight?: number;
}

export function ScreenProvider({ children, baseWidth, baseHeight }: ScreenProviderProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const baseSize = { width: baseWidth || 1920, height: baseHeight || 1080 };

    // Calcula la escala basada en el tamaño de la pantalla
    const scale = (screenSize.width * 100 / 1920) / 100;

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } catch (err) {
                console.error('Error al intentar fullscreen:', err);
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <ScreenContext.Provider
            value={{
                isFullscreen,
                toggleFullscreen,
                scale,
                screenSize,
                baseSize,
            }}
        >
            {children}
        </ScreenContext.Provider>
    );
}

export function useScreen() {
    const context = useContext(ScreenContext);

    if (!context) {
        throw new Error('useScreen debe usarse dentro de ScreenProvider');
    }
    return context;
}
