
import React from 'react';
import { PlusCircle, Shield } from 'lucide-react';
import { LeagueCard } from './LeagueCard';

interface LeagueListProps {
    leagues: string[];
    leagueImages: Record<string, string>;
    onSelectLeague: (league: string) => void;
    onEditDirectiva: (league: string) => void;
    onEditLeague: (league: string) => void;
    onDeleteLeague: (league: string) => void;
    onAddLeague: () => void;
}

export const LeagueList = ({
    leagues,
    leagueImages,
    onSelectLeague,
    onEditDirectiva,
    onEditLeague,
    onDeleteLeague,
    onAddLeague
}: LeagueListProps) => {
    return (
        <div className="animate-fade-in w-full mx-auto max-w-[1400px]">
            <div className="flex items-center justify-between mb-8 px-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-white drop-shadow-lg uppercase tracking-wider">Ligas Afiliadas</h2>
                    <div className="h-2 w-48 bg-yellow-400 rounded-full shadow-lg"></div>
                </div>
                <button
                    onClick={onAddLeague}
                    className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-2xl border-b-[6px] border-blue-950 active:translate-y-1 active:border-b-0 transition-all flex items-center gap-3 hover:bg-blue-800"
                >
                    <PlusCircle size={22} /> Registrar Liga
                </button>
            </div>

            {leagues.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 pb-12">
                    {leagues.map((league) => (
                        <LeagueCard
                            key={league}
                            league={league}
                            imageUrl={leagueImages[league]}
                            onSelect={onSelectLeague}
                            onEditDirectiva={onEditDirectiva}
                            onEditLeague={onEditLeague}
                            onDelete={onDeleteLeague}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-black/20 backdrop-blur-md rounded-[40px] border-4 border-dashed border-white/20 mx-4">
                    <Shield size={80} className="text-white/20 mb-6" />
                    <h3 className="text-white font-black uppercase text-2xl tracking-widest mb-2">No hay ligas registradas</h3>
                    <p className="text-blue-200 font-bold uppercase text-[12px] mb-10 tracking-widest">Inicie el sistema registrando su primera liga afiliada</p>
                    <button
                        onClick={onAddLeague}
                        className="bg-yellow-400 text-blue-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl border-b-[8px] border-yellow-600 active:translate-y-1 active:border-b-0 transition-all flex items-center gap-4 hover:scale-105"
                    >
                        <PlusCircle size={24} /> Registrar Liga Ahora
                    </button>
                </div>
            )}
        </div>
    );
};
