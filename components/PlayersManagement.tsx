
import React from 'react';
import { Search, Users, PlusCircle, Edit3, FileSearch, Printer, Trash2 } from 'lucide-react';
import { Player } from '../types';
import { actionButtonBase } from '../constants/styles';

interface PlayersManagementProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredPlayers: Player[];
    selectedPlayerIds: number[];
    setSelectedPlayerIds: (ids: number[]) => void;
    onAddPlayer: () => void;
    onEditPlayer: () => void;
    onConsultPlayer: () => void;
    onPrint: () => void;
    onDeletePlayer: () => void;
}

export const PlayersManagement: React.FC<PlayersManagementProps> = ({
    searchQuery,
    setSearchQuery,
    filteredPlayers,
    selectedPlayerIds,
    setSelectedPlayerIds,
    onAddPlayer,
    onEditPlayer,
    onConsultPlayer,
    onPrint,
    onDeletePlayer
}) => {
    return (
        <div className="animate-fade-in flex flex-col w-full h-full overflow-hidden">
            <div className="flex justify-start mb-2 shrink-0 px-1">
                <div className="flex items-center bg-white rounded-xl border-[3px] border-blue-900 px-4 py-2.5 gap-3 w-full max-w-[320px] shadow-lg">
                    <Search size={18} className="text-blue-900" />
                    <input
                        type="text"
                        className="bg-transparent outline-none font-black uppercase text-[11px] flex-1 text-blue-900 placeholder:text-blue-300 placeholder:font-bold"
                        placeholder="NOMBRE, CÉDULA O CÓDIGO..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="relative border-4 border-blue-900 rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col flex-grow shrink min-h-[100px]">
                <div className="overflow-y-auto custom-scrollbar h-full">
                    <table className="w-full text-left border-separate border-spacing-0 table-fixed">
                        <thead className="sticky top-0 z-[60]">
                            <tr>
                                <th className="px-3 py-3 bg-blue-50 text-[10px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-center w-[110px] tracking-widest">CÓDIGO</th>
                                <th className="px-3 py-3 bg-blue-50 text-[10px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-left w-[200px] tracking-widest">NOMBRES</th>
                                <th className="px-3 py-3 bg-blue-50 text-[10px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-left w-[200px] tracking-widest">APELLIDOS</th>
                                <th className="px-3 py-3 bg-blue-50 text-[10px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-center w-[170px] tracking-widest">CATEGORÍA</th>
                                <th className="px-3 py-3 bg-blue-50 text-[10px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-center w-[90px] tracking-widest">ESTATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {filteredPlayers.length > 0 ? filteredPlayers.map(p => (
                                <tr
                                    key={p.id}
                                    onClick={() => setSelectedPlayerIds([p.id])}
                                    className={`transition-all duration-200 cursor-pointer h-[48px] relative ${selectedPlayerIds.includes(p.id) ? 'bg-blue-100 animate-row-selected' : 'hover:bg-blue-50'}`}
                                >
                                    <td className="px-3 py-0 text-[11px] font-black text-blue-900 text-center leading-none italic">{p.code}</td>
                                    <td className="px-3 py-0 text-[11px] font-bold uppercase truncate text-left leading-none">{p.firstName}</td>
                                    <td className="px-3 py-0 text-[11px] font-bold uppercase truncate text-left leading-none">{p.lastName}</td>
                                    <td className="px-3 py-0 text-[11px] font-black text-red-600 text-center uppercase truncate leading-none">{p.category}</td>
                                    <td className="px-3 py-0 text-[11px] font-black text-center leading-none">
                                        <div className={`w-4 h-4 rounded-full mx-auto border-2 border-white shadow-md ${p.status === 'ACTIVO' ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Users size={48} className="text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-black uppercase text-[10px] italic tracking-[0.2em]">No hay jugadores en esta divisa</p>
                                        <button
                                            onClick={onAddPlayer}
                                            className={`${actionButtonBase} bg-blue-900 text-white border-blue-950 mt-6 scale-110 mx-auto`}
                                        >
                                            <PlusCircle size={20} /> AGREGAR PRIMERO
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-3 shrink-0 pb-2 mt-auto">
                <button onClick={onAddPlayer} className={`${actionButtonBase} bg-blue-900 text-white border-blue-950`}><PlusCircle size={18} /> AGREGAR</button>
                <button onClick={onEditPlayer} className={`${actionButtonBase} bg-emerald-600 text-white border-emerald-800`}><Edit3 size={18} /> EDITAR</button>
                <button onClick={onConsultPlayer} className={`${actionButtonBase} bg-amber-600 text-white border-amber-800`}><FileSearch size={18} /> CONSULTAR</button>
                <button onClick={onPrint} className={`${actionButtonBase} bg-slate-800 text-white border-slate-950`}><Printer size={18} /> IMPRIMIR</button>
                <button onClick={onDeletePlayer} className={`${actionButtonBase} bg-rose-600 text-white border-rose-800`}><Trash2 size={18} /> ELIMINAR</button>
            </div>
        </div>
    );
};
