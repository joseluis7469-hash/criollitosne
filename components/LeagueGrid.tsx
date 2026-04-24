
import React from 'react';
import { Shield, PlusCircle, Edit3, Trash2, UserCog, Users2 } from 'lucide-react';
import { LeagueDivisas } from '../types';

interface LeagueGridProps {
    leaguesList: string[];
    leagueImages: Record<string, string>;
    leagueDivisas: LeagueDivisas;
    hoveredLeague: string | null;
    setHoveredLeague: (league: string | null) => void;
    onSelectLeague: (league: string) => void;
    onRegisterLeague: () => void;
    onEditLeague: (league: string) => void;
    onDeleteLeague: (league: string) => void;
    onManageDirectiva: (league: string) => void;
}

export const LeagueGrid: React.FC<LeagueGridProps> = ({
    leaguesList,
    leagueImages,
    leagueDivisas,
    hoveredLeague,
    setHoveredLeague,
    onSelectLeague,
    onRegisterLeague,
    onEditLeague,
    onDeleteLeague,
    onManageDirectiva
}) => {
    return (
        <div className="animate-fade-in overflow-y-auto custom-scrollbar flex-grow">
            <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="text-white font-black uppercase tracking-[0.4em] text-2xl md:text-3xl drop-shadow-lg">Directorio de Ligas Afiliadas</h2>
                <button
                    onClick={onRegisterLeague}
                    className="bg-blue-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl border-b-[6px] border-blue-950 hover:bg-blue-800 active:translate-y-1 active:border-b-0 transition-all"
                >
                    <PlusCircle size={20} /> Registrar Liga
                </button>
            </div>

            {leaguesList.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6 pb-10">
                    {leaguesList.map((league) => (
                        <div
                            key={league}
                            onMouseEnter={() => setHoveredLeague(league)}
                            onMouseLeave={() => setHoveredLeague(null)}
                            className="relative group bg-transparent rounded-[24px] shadow-2xl transition-all duration-300 transform w-auto min-w-[160px] max-w-[200px] hover:scale-105"
                        >
                            {hoveredLeague === league && (
                                <div className="absolute -top-12 -left-4 z-50 bg-blue-900/90 backdrop-blur-md border-2 border-yellow-400 p-2 rounded-xl shadow-2xl animate-in zoom-in duration-200 pointer-events-none min-w-[140px]">
                                    <div className="flex items-center gap-2 border-b border-yellow-400/30 pb-1 mb-1">
                                        <Users2 size={12} className="text-yellow-400" />
                                        <span className="text-[8px] font-black text-white uppercase">Divisas ({leagueDivisas[league]?.length || 0})</span>
                                    </div>
                                    <div className="max-h-[100px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                        {leagueDivisas[league] && leagueDivisas[league].length > 0 ? (
                                            leagueDivisas[league].map(d => (
                                                <div key={d} className="text-[7px] text-blue-100 font-bold uppercase truncate">• {d}</div>
                                            ))
                                        ) : (
                                            <div className="text-[7px] text-yellow-400/50 font-bold uppercase italic text-center">Sin Divisas</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onManageDirectiva(league); }}
                                    title="Gestionar Directiva"
                                    className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-500 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                                >
                                    <UserCog size={12} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEditLeague(league); }}
                                    className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-500 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                                >
                                    <Edit3 size={12} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteLeague(league); }}
                                    className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-500 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>

                            <div
                                onClick={() => onSelectLeague(league)}
                                className="cursor-pointer bg-slate-100/10 backdrop-blur-sm flex items-center justify-center relative rounded-t-[24px] overflow-hidden aspect-square"
                            >
                                {leagueImages[league] ? (
                                    <img src={leagueImages[league]} className="w-full h-full object-contain p-2" alt="League Logo" />
                                ) : (
                                    <Shield size={44} className="text-white/30" />
                                )}
                            </div>

                            <div className="p-2 bg-blue-900/10 rounded-b-[24px] relative flex items-center justify-center transition-colors">
                                <h3 className="text-[9px] font-black uppercase text-white text-center truncate flex-1 px-4 tracking-wider">{league}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-black/20 backdrop-blur-md rounded-[40px] border-4 border-dashed border-white/20 mx-4">
                    <Shield size={80} className="text-white/20 mb-6" />
                    <h3 className="text-white font-black uppercase text-2xl tracking-widest mb-2">No hay ligas registradas</h3>
                    <p className="text-blue-200 font-bold uppercase text-[12px] mb-10 tracking-widest">Inicie el sistema registrando su primera liga afiliada</p>
                    <button
                        onClick={onRegisterLeague}
                        className="bg-yellow-400 text-blue-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl border-b-[8px] border-yellow-600 active:translate-y-1 active:border-b-0 transition-all flex items-center gap-4 hover:scale-105"
                    >
                        <PlusCircle size={24} /> Registrar Liga Ahora
                    </button>
                </div>
            )}
        </div>
    );
};
