
import React from 'react';
import { FileBadge, AlertCircle, PlusCircle, Edit3, FileSearch, Printer, Trash2 } from 'lucide-react';
import { Roster } from '../types';
import { actionButtonBase } from '../constants/styles';

interface RosterManagementProps {
    currentDivisaRosters: Roster[];
    selectedRosterId: number | null;
    setSelectedRosterId: (id: number | null) => void;
    onCreateRoster: () => void;
    onEditRoster: () => void;
    onConsultRoster: () => void;
    onPrint: () => void;
    onDeleteRoster: () => void;
    onBack: () => void;
}

export const RosterManagement: React.FC<RosterManagementProps> = ({
    currentDivisaRosters,
    selectedRosterId,
    setSelectedRosterId,
    onCreateRoster,
    onEditRoster,
    onConsultRoster,
    onPrint,
    onDeleteRoster,
    onBack
}) => {
    return (
        <div className="animate-fade-in flex flex-col w-full h-full overflow-hidden">
            <div className="bg-blue-950 py-3 px-6 rounded-2xl shadow-xl border-b-4 border-red-600 mb-3 shrink-0">
                <h3 className="text-center font-black uppercase text-white text-[22px] tracking-[0.2em] italic leading-tight">ROSTERS DE EQUIPO</h3>
            </div>
            <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200 shadow-inner overflow-y-auto custom-scrollbar flex flex-grow items-center justify-center py-8">
                {currentDivisaRosters.length > 0 ? (
                    <div className="relative border-4 border-blue-900 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-auto w-full max-w-xl transition-all duration-300">
                        <div className="overflow-hidden">
                            <table className="w-full text-left border-separate border-spacing-0 table-fixed">
                                <thead className="sticky top-0 z-[60]">
                                    <tr>
                                        <th className="px-5 py-4 bg-blue-50 text-[11px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-center tracking-widest">CATEGORÍA</th>
                                        <th className="px-5 py-4 bg-blue-50 text-[11px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-center tracking-widest">INSCRITOS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-100">
                                    {currentDivisaRosters.map(r => (
                                        <tr
                                            key={r.id}
                                            onClick={() => setSelectedRosterId(r.id)}
                                            className={`transition-all duration-200 cursor-pointer ${selectedRosterId === r.id ? 'bg-blue-100 animate-row-selected' : 'hover:bg-blue-50'}`}
                                        >
                                            <td className="px-5 py-4 text-[12px] font-black text-red-600 text-center uppercase tracking-tighter">
                                                {r.category}{r.letter ? ` - NIVEL ${r.letter}` : ''}
                                            </td>
                                            <td className="px-5 py-4 text-[12px] font-black text-blue-900 text-center">
                                                {(r.playerIds || []).filter(x => x !== null).length} / 20
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 bg-white/50 rounded-[40px] border-4 border-dashed border-slate-300 w-full max-w-xl">
                        <AlertCircle size={64} className="text-slate-300 mb-6 animate-pulse" />
                        <h4 className="text-slate-600 font-black uppercase text-xl tracking-widest mb-10 text-center">No existen rosters creados</h4>
                        <div className="flex gap-6">
                            <button
                                onClick={onCreateRoster}
                                className={`${actionButtonBase} bg-blue-900 text-white border-blue-950 scale-110`}
                            >
                                <PlusCircle size={20} /> CREAR AHORA
                            </button>
                            <button
                                onClick={onBack}
                                className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 hover:bg-slate-600 scale-110`}
                            >
                                REGRESAR
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4 shrink-0 pb-2">
                <button onClick={onCreateRoster} className={`${actionButtonBase} bg-blue-900 text-white border-blue-950`}><PlusCircle size={18} /> CREAR ROSTER</button>
                <button
                    onClick={onEditRoster}
                    disabled={currentDivisaRosters.length === 0}
                    className={`${actionButtonBase} bg-emerald-600 text-white border-emerald-800`}
                >
                    <Edit3 size={18} /> EDITAR ROSTER
                </button>
                <button
                    onClick={onConsultRoster}
                    disabled={currentDivisaRosters.length === 0}
                    className={`${actionButtonBase} bg-amber-600 text-white border-amber-800`}
                >
                    <FileSearch size={18} /> CONSULTAR</button>
                <button
                    onClick={onPrint}
                    disabled={currentDivisaRosters.length === 0}
                    className={`${actionButtonBase} bg-slate-800 text-white border-slate-950`}
                >
                    <Printer size={18} /> IMPRIMIR
                </button>
                <button
                    onClick={onDeleteRoster}
                    disabled={currentDivisaRosters.length === 0}
                    className={`${actionButtonBase} bg-rose-600 text-white border-rose-800`}
                >
                    <Trash2 size={18} /> ELIMINAR
                </button>
            </div>
        </div>
    );
};
