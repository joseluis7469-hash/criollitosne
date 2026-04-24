
import React, { useRef } from 'react';
import { Save, X, User, IdCard, Calendar as CalendarIcon, UserCog, Users, Shield } from 'lucide-react';
import { Roster, Player } from '../types';
import { CATEGORIES } from '../constants';
import { inputClass, actionButtonBase } from '../constants/styles';
import { StaffCard } from './StaffCard';

interface RosterFormProps {
    formData: Roster;
    setFormData: React.Dispatch<React.SetStateAction<Roster>>;
    isConsultMode: boolean;
    selectedDivisa: string | null;
    selectedLeague: string | null;
    divisaImages: Record<string, string>;
    players: Player[];
    onSave: () => void;
    onCancel: () => void;
    onCategoryChange: (val: string) => void;
    hasInput: boolean;
}

export const RosterForm: React.FC<RosterFormProps> = ({
    formData,
    setFormData,
    isConsultMode,
    selectedDivisa,
    selectedLeague,
    divisaImages,
    players,
    onSave,
    onCancel,
    onCategoryChange,
    hasInput
}) => {
    const rosterFormRef = useRef<HTMLDivElement>(null);

    const handleEnterKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const form = rosterFormRef.current;
            if (form) {
                const focusableElements = Array.from(form.querySelectorAll('input:not([type="file"]), select, textarea, button:not([disabled])')) as HTMLElement[];
                const index = focusableElements.indexOf(e.target as HTMLElement);
                if (index > -1 && index < focusableElements.length - 1) {
                    e.preventDefault();
                    focusableElements[index + 1].focus();
                }
            }
        }
    };

    return (
        <div className="animate-fade-in flex flex-col h-full overflow-hidden">
            <div className="flex-grow overflow-y-auto custom-scrollbar bg-slate-200/50 p-6 rounded-xl border-2 border-slate-300 shadow-inner">
                <div ref={rosterFormRef} className="min-w-[1200px] bg-slate-100 p-10 shadow-2xl rounded-sm border-[4px] border-double border-slate-300 relative mx-auto overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-900"></div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-red-600"></div>
                    <div className="flex justify-between items-center border-b-2 border-blue-900 pb-5 mb-8">
                        <div className="flex items-center gap-6">
                            {selectedDivisa && divisaImages[selectedDivisa] && (
                                <img src={divisaImages[selectedDivisa]} className="w-20 h-20 object-contain drop-shadow-md" alt="" />
                            )}
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight leading-none">{selectedDivisa}</h2>
                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.2em]">{selectedLeague}</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <h1 className="text-4xl font-black text-red-600 italic tracking-tighter leading-none mb-1">ROSTER OFICIAL</h1>
                            <div className="bg-blue-900 text-white px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg mb-2">TEMPORADA 2025 - 2026</div>
                            <div className="flex flex-col gap-1 w-[300px]">
                                <select
                                    className={`${inputClass} bg-white text-blue-950 !h-9 !text-[11px] w-full border-2 border-blue-900 shadow-md`}
                                    value={formData.category}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                    disabled={isConsultMode}
                                >
                                    <option value="">-- SELECCIONE CATEGORÍA --</option>
                                    {CATEGORIES.map(c => <option key={c.name} value={c.name.toUpperCase()}>{c.name.toUpperCase()}</option>)}
                                </select>
                                {formData.letter && <div className="text-[11px] font-black text-blue-950 uppercase tracking-widest mt-1">LETRA DESIGNADA: {formData.letter}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-10">
                        {Array.from({ length: 20 }).map((_, i) => {
                            const pId = formData.playerIds[i];
                            const player = pId ? players.find(p => p.id === pId) : null;
                            return (
                                <div key={i} className={`relative border-2 rounded-2xl p-3 h-[120px] flex gap-3.5 transition-all duration-300 ${player ? 'bg-white border-blue-900 shadow-xl' : 'bg-white/50 border-dashed border-slate-300 grayscale opacity-80'}`}>
                                    <div className="absolute -top-2 -left-2 bg-blue-900 text-white w-7 h-7 rounded-xl flex items-center justify-center font-black text-[12px] z-10 shadow-lg border-2 border-white">{i + 1}</div>
                                    <div className="w-16 h-full bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 border border-slate-300 shadow-inner relative">
                                        {player?.photo ? <img src={player.photo} className="w-full h-full object-cover" alt="Player" /> : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
                                                <User size={28} />
                                                <span className="text-[6px] font-black uppercase">Vacío</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center flex-1 min-w-0">
                                        {player ? (
                                            <>
                                                <div className="bg-red-600 text-white px-1.5 py-0.5 rounded-lg font-black text-[8px] shadow-sm uppercase w-fit mb-1">{player.code}</div>
                                                <div className="text-[11px] font-black text-blue-950 uppercase truncate leading-none mb-1">{player.firstName}</div>
                                                <div className="text-[11px] font-black text-blue-950 uppercase truncate leading-none mb-1">{player.lastName}</div>
                                                <div className="flex flex-col gap-1 text-[7px] font-bold text-slate-500 uppercase bg-blue-50/50 p-1 rounded-lg border border-blue-100">
                                                    <div className="flex items-center gap-1.5"><IdCard size={8} className="text-blue-900" /> {player.dni}</div>
                                                    <div className="flex items-center gap-1.5"><CalendarIcon size={8} className="text-blue-900" /> {player.birthDate}</div>
                                                </div>
                                            </>
                                        ) : (
                                            !isConsultMode && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Asignar Jugador</span>
                                                    <select
                                                        className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg p-1 text-[8px] font-black uppercase outline-none focus:border-blue-500"
                                                        onKeyDown={handleEnterKeyNavigation}
                                                        onChange={(e) => {
                                                            const id = parseInt(e.target.value);
                                                            const newPlayerIds = [...formData.playerIds];
                                                            newPlayerIds[i] = id;
                                                            setFormData(p => ({ ...p, playerIds: newPlayerIds }));
                                                        }}
                                                        value={pId || ""}
                                                    >
                                                        <option value="">-- SELECCIONE --</option>
                                                        {players.filter(p => p.team === selectedDivisa && p.league === selectedLeague && p.category === formData.category).map(p => (
                                                            <option key={p.id} value={p.id}>{p.lastName}, {p.firstName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                        )}
                                        {player && !isConsultMode && (
                                            <button
                                                onClick={() => {
                                                    const newPlayerIds = [...formData.playerIds];
                                                    newPlayerIds[i] = null as any;
                                                    setFormData(p => ({ ...p, playerIds: newPlayerIds }));
                                                }}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-1 rounded-xl shadow-sm transition-all hover:scale-110 active:scale-90"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-4 gap-6 pt-10 border-t-4 border-slate-200 border-double">
                        <StaffCard title="Mánager" icon={UserCog} member={formData.manager} onChange={(f, v) => setFormData(p => ({ ...p, manager: { ...p.manager, f: v } })) as any} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={false} />
                        <StaffCard title="Técnico N° 1" icon={Users} member={formData.technicians[0]} onChange={(f, v) => setFormData(p => { const techs = [...p.technicians]; techs[0] = { ...techs[0], f: v }; return { ...p, technicians: techs }; }) as any} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={false} />
                        <StaffCard title="Técnico N° 2" icon={Users} member={formData.technicians[1]} onChange={(f, v) => setFormData(p => { const techs = [...p.technicians]; techs[1] = { ...techs[1], f: v }; return { ...p, technicians: techs }; }) as any} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={false} />
                        <StaffCard title="Delegado" icon={Shield} member={formData.delegate} onChange={(f, v) => setFormData(p => ({ ...p, delegate: { ...p.delegate, f: v } })) as any} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={false} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-6 pt-6 shrink-0 pb-2">
                <button onClick={onSave} disabled={!hasInput} className={`${actionButtonBase} bg-blue-900 text-white border-blue-950`}>
                    <Save size={20} /> GUARDAR ROSTER
                </button>
                <button onClick={onCancel} className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 hover:bg-slate-600`}>
                    <X size={20} /> {isConsultMode ? 'CERRAR VISTA' : 'CANCELAR'}
                </button>
            </div>
        </div>
    );
};
