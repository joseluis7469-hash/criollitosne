
import React from 'react';
import { ChevronLeft, PlusCircle, UserCog, ChevronDown, PlusCircle as PlusCircleIcon, Eye, Edit3, Trash2, Calendar as CalendarIcon, RotateCcw, Activity, FileUp, FileText, Users, BarChart3, ListOrdered, Trophy, Hash } from 'lucide-react';
import { actionButtonBase } from '../constants/styles';
import { DirectivaMember } from '../types';

interface DivisaFilterProps {
    selectedLeague: string | null;
    leagueDirectivas: Record<string, any>;
    onBack: () => void;
    onRegisterDivisa: () => void;
    navFocus: { main: number; sub: number };
    setNavFocus: (focus: { main: number; sub: number }) => void;
    onViewDirectiva: () => void;
    onEditDirectiva: () => void;
    onDeleteDirectiva: () => void;
    hasDivisas: boolean;
}

export const DivisaFilter: React.FC<DivisaFilterProps> = ({
    selectedLeague,
    leagueDirectivas,
    onBack,
    onRegisterDivisa,
    navFocus,
    setNavFocus,
    onViewDirectiva,
    onEditDirectiva,
    onDeleteDirectiva,
    hasDivisas
}) => {
    const [showDirectivaPreview, setShowDirectivaPreview] = React.useState(false);

    return (
        <div className="animate-fade-in w-full mx-auto max-w-[1400px] flex-grow flex flex-col relative z-[100]">
            <div className="flex items-center justify-between mb-3 px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2.5 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-all hover:scale-110 active:scale-90 border-b-4 border-slate-200 active:border-b-0"
                    >
                        <ChevronLeft size={20} className="text-blue-900" />
                    </button>
                    <div
                        className="flex flex-col relative group cursor-help"
                        onMouseEnter={() => setShowDirectivaPreview(true)}
                        onMouseLeave={() => setShowDirectivaPreview(false)}
                    >
                        <h2 className="text-xl font-black text-white drop-shadow-lg uppercase translation leading-none">{selectedLeague}</h2>
                        <h3 className="text-[11px] font-black text-yellow-400 uppercase tracking-widest mt-0.5">Gestión de Liga</h3>

                        {showDirectivaPreview && selectedLeague && leagueDirectivas[selectedLeague] && (
                            <div className="absolute top-12 left-0 z-[100] bg-blue-950/95 backdrop-blur-md border-2 border-yellow-400 p-4 rounded-2xl shadow-2xl animate-in zoom-in duration-200 min-w-[240px]">
                                <div className="flex items-center gap-2 border-b border-yellow-400/30 pb-2 mb-2">
                                    <UserCog size={16} className="text-yellow-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Junta Directiva</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { cargo: "Presidente", data: leagueDirectivas[selectedLeague].presidente },
                                        { cargo: "Vicepresidente", data: leagueDirectivas[selectedLeague].vicepresidente },
                                        { cargo: "Sec. General", data: leagueDirectivas[selectedLeague].secGeneral },
                                        { cargo: "Sec. Finanzas", data: leagueDirectivas[selectedLeague].secFinanzas },
                                        { cargo: "1er. Delegado", data: leagueDirectivas[selectedLeague].delegado1 },
                                        { cargo: "2do. Delegado", data: leagueDirectivas[selectedLeague].delegado2 },
                                        { cargo: "3er. Delegado", data: leagueDirectivas[selectedLeague].delegado3 }
                                    ].filter(m => m.data && m.data.firstName && m.data.firstName.trim() !== "").map((m, idx) => (
                                        <div key={idx} className="flex flex-col leading-tight border-l-2 border-yellow-400/40 pl-2">
                                            <span className="text-[8px] font-black text-yellow-400 uppercase tracking-tighter">{m.cargo}</span>
                                            <span className="text-[9px] font-bold text-white uppercase truncate">{m.data.firstName} {m.data.lastName}</span>
                                        </div>
                                    ))}
                                    {(!leagueDirectivas[selectedLeague] || (Object.values(leagueDirectivas[selectedLeague]) as DirectivaMember[]).every(m => !m.firstName || m.firstName.trim() === "")) && (
                                        <div className="text-[8px] text-yellow-400/50 font-black uppercase italic text-center py-2">Sin directiva registrada</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {hasDivisas && (
                    <button
                        onClick={onRegisterDivisa}
                        className={`${actionButtonBase} bg-blue-900 text-white border-blue-950`}
                    >
                        <PlusCircle size={20} /> Registrar Divisa
                    </button>
                )}
            </div>

            {hasDivisas && (
                <nav className="flex justify-center mb-6 shrink-0 relative z-[90]" onMouseLeave={() => setNavFocus({ main: -1, sub: -1 })}>
                    <div className="bg-blue-900/60 backdrop-blur-xl border border-white/20 rounded-[22px] px-2 py-1.5 flex items-center gap-1 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
                        {/* DIVISAS */}
                        <div className="relative group" onMouseEnter={() => setNavFocus({ main: 0, sub: -1 })}>
                            <button className={`flex items-center gap-2 px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all rounded-xl ${navFocus.main === 0 ? 'text-yellow-400 bg-white/10 scale-105' : 'text-white hover:text-yellow-400 hover:bg-white/5'}`}>
                                <Users size={14} className="text-yellow-400" />
                                <span>Divisas</span>
                                <ChevronDown size={10} className="opacity-50" />
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-52 bg-blue-950/95 backdrop-blur-lg border border-white/10 rounded-2xl py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-200 ${navFocus.main === 0 ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <button
                                    onMouseEnter={() => setNavFocus({ main: 0, sub: 0 })}
                                    onClick={onRegisterDivisa}
                                    className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 0 && navFocus.sub === 0 ? 'bg-yellow-400 text-blue-950 shadow-lg translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <PlusCircleIcon size={14} /> Registrar Nueva Divisa
                                </button>
                                <div className="h-px bg-white/10 my-1.5 mx-4"></div>
                                <button
                                    onMouseEnter={() => setNavFocus({ main: 0, sub: 1 })}
                                    onClick={onViewDirectiva}
                                    className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 0 && navFocus.sub === 1 ? 'bg-blue-600 text-white shadow-lg translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <Eye size={14} /> Ver Directiva
                                </button>
                                <button
                                    onMouseEnter={() => setNavFocus({ main: 0, sub: 2 })}
                                    onClick={onEditDirectiva}
                                    className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 0 && navFocus.sub === 2 ? 'bg-emerald-600 text-white shadow-lg translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <Edit3 size={14} /> Editar Directiva
                                </button>
                                <button
                                    onMouseEnter={() => setNavFocus({ main: 0, sub: 3 })}
                                    onClick={onDeleteDirectiva}
                                    className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 ${navFocus.main === 0 && navFocus.sub === 3 ? 'bg-red-600 text-white shadow-lg translate-x-1' : 'text-red-400 hover:bg-red-600/10'}`}>
                                    <Trash2 size={14} /> Eliminar Directiva
                                </button>
                            </div>
                        </div>

                        {/* CALENDARIO */}
                        <div className="relative group" onMouseEnter={() => setNavFocus({ main: 1, sub: -1 })}>
                            <button className={`flex items-center gap-2 px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all rounded-xl ${navFocus.main === 1 ? 'text-yellow-400 bg-white/10 scale-105' : 'text-white hover:text-yellow-400 hover:bg-white/5'}`}>
                                <CalendarIcon size={14} className="text-yellow-400" />
                                <span>Calendario</span>
                                <ChevronDown size={10} className="opacity-50" />
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-52 bg-blue-950/95 backdrop-blur-lg border border-white/10 rounded-2xl py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-200 ${navFocus.main === 1 ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <button onMouseEnter={() => setNavFocus({ main: 1, sub: 0 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 1 && navFocus.sub === 0 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <PlusCircleIcon size={14} /> Programar
                                </button>
                                <button onMouseEnter={() => setNavFocus({ main: 1, sub: 1 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 1 && navFocus.sub === 1 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <RotateCcw size={14} /> Cambiar
                                </button>
                                <button onMouseEnter={() => setNavFocus({ main: 1, sub: 2 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 ${navFocus.main === 1 && navFocus.sub === 2 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <CalendarIcon size={14} /> Reprogramar
                                </button>
                            </div>
                        </div>

                        {/* JUEGOS */}
                        <div className="relative group" onMouseEnter={() => setNavFocus({ main: 2, sub: -1 })}>
                            <button className={`flex items-center gap-2 px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all rounded-xl ${navFocus.main === 2 ? 'text-yellow-400 bg-white/10 scale-105' : 'text-white hover:text-yellow-400 hover:bg-white/5'}`}>
                                <Activity size={14} className="text-yellow-400" />
                                <span>Juegos</span>
                                <ChevronDown size={10} className="opacity-50" />
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-52 bg-blue-950/95 backdrop-blur-lg border border-white/10 rounded-2xl py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-200 ${navFocus.main === 2 ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <button onMouseEnter={() => setNavFocus({ main: 2, sub: 0 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 2 && navFocus.sub === 0 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <FileUp size={14} /> Cargar
                                </button>
                                <button onMouseEnter={() => setNavFocus({ main: 2, sub: 1 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 mb-1 ${navFocus.main === 2 && navFocus.sub === 1 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <FileText size={14} /> Box Score
                                </button>
                                <button onMouseEnter={() => setNavFocus({ main: 2, sub: 2 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 ${navFocus.main === 2 && navFocus.sub === 2 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <Users size={14} /> Participacion
                                </button>
                            </div>
                        </div>

                        {/* POSICIONES */}
                        <div className="relative group" onMouseEnter={() => setNavFocus({ main: 3, sub: -1 })}>
                            <button className={`flex items-center gap-2 px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all rounded-xl ${navFocus.main === 3 ? 'text-yellow-400 bg-white/10 scale-105' : 'text-white hover:text-yellow-400 hover:bg-white/5'}`}>
                                <BarChart3 size={14} className="text-yellow-400" />
                                <span>Posiciones</span>
                                <ChevronDown size={10} className="opacity-50" />
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-52 bg-blue-950/95 backdrop-blur-lg border border-white/10 rounded-2xl py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-200 ${navFocus.main === 3 ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <button onMouseEnter={() => setNavFocus({ main: 3, sub: 0 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 ${navFocus.main === 3 && navFocus.sub === 0 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <ListOrdered size={14} /> Categorias
                                </button>
                            </div>
                        </div>

                        {/* LÍDERES */}
                        <div className="relative group" onMouseEnter={() => setNavFocus({ main: 4, sub: -1 })}>
                            <button className={`flex items-center gap-2 px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all rounded-xl ${navFocus.main === 4 ? 'text-yellow-400 bg-white/10 scale-105' : 'text-white hover:text-yellow-400 hover:bg-white/5'}`}>
                                <Trophy size={14} className="text-yellow-400" />
                                <span>Líderes</span>
                                <ChevronDown size={10} className="opacity-50" />
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-52 bg-blue-950/95 backdrop-blur-lg border border-white/10 rounded-2xl py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-200 ${navFocus.main === 4 ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <button onMouseEnter={() => setNavFocus({ main: 4, sub: 0 })} className={`w-[90%] mx-auto px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center gap-3 ${navFocus.main === 4 && navFocus.sub === 0 ? 'bg-yellow-400 text-blue-950 translate-x-1' : 'text-white hover:bg-white/10'}`}>
                                    <Hash size={14} /> Departamentos
                                </button>
                            </div>
                        </div>

                        <div className="w-px h-6 bg-white/20 mx-2"></div>

                        {/* RETORNAR */}
                        <button
                            onMouseEnter={() => setNavFocus({ main: 5, sub: -1 })}
                            onClick={onBack}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl border-b-[5px] active:translate-y-1 active:border-b-0 ${navFocus.main === 5 ? 'bg-red-600 text-white border-red-800 scale-105' : 'bg-red-600/20 text-red-500 border-red-500/30'}`}
                        >
                            <RotateCcw size={14} />
                            <span>Retornar</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};
