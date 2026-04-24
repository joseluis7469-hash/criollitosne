
import React from 'react';
import { Briefcase, PlusCircle, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { StaffWithMeta } from '../types';
import { actionButtonBase } from '../constants/styles';

interface StaffManagementProps {
    filteredStaff: StaffWithMeta[];
    selectedStaffIds: string[];
    setSelectedStaffIds: (ids: string[]) => void;
    onAddStaff: () => void;
    onEditStaff: () => void;
    onDeleteStaff: () => void;
    onBack: () => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
    filteredStaff,
    selectedStaffIds,
    setSelectedStaffIds,
    onAddStaff,
    onEditStaff,
    onDeleteStaff,
    onBack
}) => {
    return (
        <div className="animate-fade-in flex flex-col w-full h-full overflow-hidden max-w-[700px] mx-auto">
            <div className="bg-blue-950 py-3 rounded-2xl shadow-xl mb-3 border-b-4 border-red-600 shrink-0">
                <h3 className="text-center font-black uppercase text-white text-[18px] tracking-[0.3em] leading-tight">PERSONAL TÉCNICO REGISTRADO</h3>
            </div>
            <div className="relative border-4 border-blue-900 rounded-[32px] bg-white shadow-2xl overflow-hidden flex flex-col flex-grow shrink min-h-[100px]">
                <div className="overflow-y-auto custom-scrollbar h-full">
                    <table className="w-full text-left border-separate border-spacing-0 table-fixed">
                        <thead className="sticky top-0 z-[60]">
                            <tr>
                                <th className="px-4 py-4 bg-blue-50 text-[11px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-left w-[170px] tracking-widest">N° CÉDULA</th>
                                <th className="px-4 py-4 bg-blue-50 text-[11px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-left w-[250px] tracking-widest">NOMBRES Y APELLIDOS</th>
                                <th className="px-4 py-4 bg-blue-50 text-[11px] font-black uppercase text-blue-900 border-b-4 border-blue-900 text-center w-[180px] tracking-widest">CARGO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {filteredStaff.length > 0 ? filteredStaff.map(s => (
                                <tr
                                    key={s.id}
                                    onClick={() => setSelectedStaffIds([s.id])}
                                    className={`transition-all duration-200 cursor-pointer h-[52px] relative ${selectedStaffIds.includes(s.id) ? 'bg-blue-100 animate-row-selected' : 'hover:bg-blue-50'}`}
                                >
                                    <td className="px-4 py-0 text-[11px] font-black text-blue-900 text-left leading-none">{s.dni || 'N/A'}</td>
                                    <td className="px-4 py-0 text-[11px] font-bold uppercase truncate text-left leading-none">{s.firstName} {s.lastName}</td>
                                    <td className="px-4 py-0 text-[11px] font-black text-red-600 text-center uppercase truncate leading-none">{s.role}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="py-20 text-center">
                                        <Briefcase size={48} className="text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-black uppercase text-[10px] italic tracking-widest">No hay técnicos asignados</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4 shrink-0 pb-2 mt-auto">
                <button onClick={onAddStaff} className={`${actionButtonBase} bg-blue-900 text-white border-blue-950`}><PlusCircle size={18} /> AGREGAR</button>
                <button onClick={onEditStaff} className={`${actionButtonBase} bg-emerald-600 text-white border-emerald-800`}><Edit3 size={18} /> EDITAR</button>
                <button onClick={onDeleteStaff} className={`${actionButtonBase} bg-rose-600 text-white border-rose-800`}><Trash2 size={18} /> ELIMINAR</button>
                <button onClick={onBack} className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 hover:bg-slate-600`}><ArrowLeft size={20} /> VOLVER</button>
            </div>
        </div>
    );
};
