import Hero from '@/types/hero';
import { Assets, Texture } from 'pixi.js';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface TeamContextType {
    teamHeroes: Hero[];
    currentHero: Hero;
    setTeamHeroes: (heroes: Hero[]) => void;
    updateHeroHealth: (heroId: string, newHealth: number) => void;
    resetTeamHealth: () => void;
    changeCurrentHero: (teamIndex: number) => void;
    isTeamFull: boolean;
    textures: Texture[];
    texturesLoaded: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);
const MAX_TEAM_SIZE = 4;
const STORAGE_KEY = 'gamepa_team_state';

const ensureCurrentHealth = (hero: Hero): Hero => {
    return {
        ...hero,
        current_health: hero.current_health !== undefined ? hero.current_health : hero.health,
    };
};

export const TeamProvider = ({ children, initialHeroes }: { children: ReactNode; initialHeroes: Hero[] }) => {
    const [teamHeroes, setTeamHeroesState] = useState<Hero[]>(() => {
        const savedTeam = localStorage.getItem(STORAGE_KEY);

        if (savedTeam) {
            const parsedTeam = JSON.parse(savedTeam);
            if (parsedTeam.length > 0) {
                return parsedTeam.map(ensureCurrentHealth);
            }
        }

        return initialHeroes.map(ensureCurrentHealth);
    });
    const [textures, setTextures] = useState<Texture[]>([]);
    const texturesRef = useRef<Texture[]>([]); // Añadir ref para texturas
    const [texturesLoaded, setTexturesLoaded] = useState(false);
    const texturesLoadedRef = useRef(false);
    const [currentHero, setCurrentHero] = useState<Hero>(() => {
        const heroes = (() => {
            const savedTeam = localStorage.getItem(STORAGE_KEY);
            if (savedTeam) {
                const parsedTeam = JSON.parse(savedTeam);
                if (parsedTeam.length > 0) {
                    return parsedTeam.map(ensureCurrentHealth);
                }
            }
            return initialHeroes.map(ensureCurrentHealth);
        })();
        return heroes[0];
    });

    // Cargar texturas UNA SOLA VEZ al montar el componente
    useEffect(() => {
        if (texturesLoadedRef.current || teamHeroes.length === 0) return;

        const loadTextures = async () => {
            try {

                const texturePromises = teamHeroes.map((hero) => Assets.load<Texture>(hero.spritesheet));
                const loadedTextures = await Promise.all(texturePromises);

                console.log('✅ Textures loaded successfully:', loadedTextures);

                setTextures(loadedTextures);
                texturesRef.current = loadedTextures; // Guardar en ref también
                setTexturesLoaded(true);
                texturesLoadedRef.current = true;

                // Actualizar currentHero con su textura
                const currentHeroIndex = teamHeroes.findIndex((h) => h.id === currentHero.id);
                if (currentHeroIndex !== -1 && loadedTextures[currentHeroIndex]) {
                    setCurrentHero((prev) => ({
                        ...prev,
                        texture: loadedTextures[currentHeroIndex],
                    }));
                }
            } catch (error) {
                console.error('❌ Error loading textures:', error);
                setTexturesLoaded(false);
            }
        };

        loadTextures();
    }, []); // Array vacío = solo se ejecuta una vez

    // Guardar en localStorage cuando cambian los héroes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(teamHeroes));
    }, [teamHeroes]);

    // Sincronizar initialHeroes si es necesario
    useEffect(() => {
        setTeamHeroesState((prev) => {
            if (prev.length === 0 && initialHeroes.length > 0) {
                return initialHeroes.map(ensureCurrentHealth);
            }
            return prev;
        });
    }, [initialHeroes]);

    const setTeamHeroes = (heroes: Hero[]) => {
        const heroesWithHealth = heroes.map(ensureCurrentHealth);
        setTeamHeroesState(heroesWithHealth.slice(0, MAX_TEAM_SIZE));
    };

    const updateHeroHealth = (heroId: string, newHealth: number) => {
        setTeamHeroesState((prev) =>
            prev.map((hero) => (hero.id === heroId ? { ...hero, current_health: Math.max(0, Math.min(newHealth, hero.health)) } : hero)),
        );
    };

    const resetTeamHealth = () => {
        setTeamHeroesState((prev) =>
            prev.map((hero) => ({
                ...hero,
                current_health: hero.health,
            })),
        );
    };

    const changeCurrentHero = (teamIndex: number) => {
        const hero = teamHeroes[teamIndex];

        if (!hero) {
            console.warn('❌ Hero not found at index:', teamIndex);
            return;
        }

        if (!texturesRef.current[teamIndex]) {
            console.warn('❌ Texture not available for hero at index:', teamIndex, 'Available:', texturesRef.current.length);
            return;
        }
        
        setCurrentHero({
            ...hero,
            texture: texturesRef.current[teamIndex],
        });
    };

    const isTeamFull = teamHeroes.length >= MAX_TEAM_SIZE;

    return (
        <TeamContext.Provider
            value={{
                teamHeroes,
                currentHero,
                setTeamHeroes,
                updateHeroHealth,
                resetTeamHealth,
                changeCurrentHero,
                isTeamFull,
                textures,
                texturesLoaded,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam debe ser usado dentro de TeamProvider');
    }
    return context;
};
