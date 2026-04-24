
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Player, Roster, LeagueDivisas, View, StaffMember, Directiva, StaffWithMeta } from '../types';

import { LEAGUES as INITIAL_LEAGUES } from '../constants';

import { subscribeToPlayers } from '../services/playerService';
import { subscribeToLeagues } from '../services/leagueService';

interface AppContextType {
    currentView: View;
    setCurrentView: (view: View) => void;
    selectedLeague: string | null;
    setSelectedLeague: (league: string | null) => void;
    selectedDivisa: string | null;
    setSelectedDivisa: (divisa: string | null) => void;
    players: Player[];
    rosters: Roster[];
    staff: StaffWithMeta[];
    leaguesList: string[];
    leagueImages: Record<string, string>;
    leagueDivisas: LeagueDivisas;
    leagueDirectivas: Record<string, Directiva>;
    divisaImages: Record<string, string>;

    isFullScreen: boolean;
    setIsFullScreen: (v: boolean) => void;
    isInitialLoading: boolean;

    firebaseError: string | null;
    // ... more states can be added as needed
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<View>('menu');
    const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
    const [selectedDivisa, setSelectedDivisa] = useState<string | null>(null);

    const [players, setPlayers] = useState<Player[]>([]);
    const [rosters, setRosters] = useState<Roster[]>([]);
    const [staff, setStaff] = useState<StaffWithMeta[]>([]);
    const [leaguesList, setLeaguesList] = useState<string[]>(INITIAL_LEAGUES);
    const [leagueImages, setLeagueImages] = useState<Record<string, string>>({});
    const [leagueDivisas, setLeagueDivisas] = useState<LeagueDivisas>({});
    const [leagueDirectivas, setLeagueDirectivas] = useState<Record<string, Directiva>>({});
    const [divisaImages, setDivisaImages] = useState<Record<string, string>>({});


    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [firebaseError, setFirebaseError] = useState<string | null>(null);

    useEffect(() => {
        // Initializing subscriptions
        const unsubPlayers = subscribeToPlayers(setPlayers, (err) => setFirebaseError(err.message));

        // For simplicity in this step, I'm combining some logic. 
        // In a real scenario, you'd have more granular control.
        const unsubLeagues = subscribeToLeagues((data) => {
            setLeaguesList(data.names);
            setLeagueDivisas(data.divisasMap);
            setLeagueImages(data.imageMap);
            setLeagueDirectivas(data.directivasMap);
            setDivisaImages(data.divImagesMap);
            setIsInitialLoading(false);
        }, (err) => setFirebaseError(err.message));

        return () => {
            unsubPlayers();
            unsubLeagues();
        };
    }, []);

    const value = {
        currentView,
        setCurrentView,
        selectedLeague,
        setSelectedLeague,
        selectedDivisa,
        setSelectedDivisa,
        players,
        rosters,
        staff,
        leaguesList,
        leagueImages,
        leagueDivisas,
        leagueDirectivas,

        divisaImages,
        isFullScreen,
        setIsFullScreen,
        isInitialLoading,
        firebaseError
    };


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
