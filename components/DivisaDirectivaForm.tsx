
import React from 'react';
import { UserCheck, FileText, BarChart3, Contact, Save, Printer, X, UserCog, LayoutDashboard, ListOrdered, User, Shield, IdCard, Phone } from 'lucide-react';
import { Directiva, DirectivaMember } from '../types';
import { actionButtonBase } from '../constants/styles';
import { StaffCard } from './StaffCard';

interface DivisaDirectivaFormProps {
    selectedLeague: string | null;
    selectedDivisa: string | null;
    formData: Directiva;
    setFormData: React.Dispatch<React.SetStateAction<Directiva>>;
    isConsultMode: boolean;
    onSave: () => void;
    onCancel: () => void;
    onPrint: () => void;
    hasChanged: boolean;
    viewMode: 'card' | 'list';
    setViewMode: (mode: 'card' | 'list') => void;
}

export const DivisaDirectivaForm: React.FC<DivisaDirectivaFormProps> = ({
    selectedLeague,
    selectedDivisa,
    formData,
    setFormData,
    isConsultMode,
    onSave,
    onCancel,
    onPrint,
    hasChanged,
    viewMode,
    setViewMode
}) => {
    const formRef = React.useRef<HTMLDivElement>(null);

    const handleEnterKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const form = formRef.current;
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

    const updateMember = (field: keyof Directiva, subField: keyof DirectivaMember, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [subField]: value }
        }));
    };

    const membersList = [
        { title: "Presidente(a)", member: formData.presidente, field: 'presidente' as keyof Directiva, color: "border-blue-600" },
        { title: "Vicepresidente(a)", member: formData.vicepresidente, field: 'vicepresidente' as keyof Directiva, color: "border-blue-400" },
        { title: "Secretario(a) General", member: formData.secGeneral, field: 'secGeneral' as keyof Directiva, color: "border-emerald-500" },
        { title: "Secretario(a) Finanzas", member: formData.secFinanzas, field: 'secFinanzas' as keyof Directiva, color: "border-yellow-500" },
        { title: "1er. Delegado(a)", member: formData.delegado1, field: 'delegado1' as keyof Directiva, color: "border-red-500" },
        { title: "2do. Delegado(a)", member: formData.delegado2, field: 'delegado2' as keyof Directiva, color: "border-red-500" },
        { title: "3er. Delegado(a)", member: formData.delegado3, field: 'delegado3' as keyof Directiva, color: "border-red-500" }
    ];

    return (
        <div className="fixed inset-0 bg-slate-900 z-[600] flex flex-col">
            <div ref={formRef} className="bg-white w-full h-full overflow-hidden flex flex-col border-[10px] border-emerald-600 animate-in zoom-in duration-300">
                <div className="bg-blue-950 p-6 flex justify-between items-center border-b-[10px] border-red-600">
                    <div className="flex items-center gap-5">
                        <UserCog size={40} className="text-emerald-400" />
                        <div className="flex flex-col">
                            <h3 className="text-white font-black uppercase tracking-[0.3em] text-xl leading-none">Junta Directiva de Divisa</h3>
                            <p className="text-emerald-400 font-bold uppercase text-[12px] tracking-[0.2em] mt-1">{selectedDivisa} • {selectedLeague}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="text-white/70 hover:text-white hover:scale-110 transition-transform bg-white/10 p-2 rounded-2xl">
                        <X size={32} />
                    </button>
                </div>

                <div className="p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50">
                    <div className="flex justify-end mb-6 px-4">
                        <div className="bg-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'card' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                <LayoutDashboard size={14} /> Tarjetas
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                <ListOrdered size={14} /> Lista
                            </button>
                        </div>
                    </div>

                    <div className={isConsultMode && viewMode === 'card' ? "w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" : viewMode === 'list' ? "w-full max-w-5xl mx-auto flex flex-col gap-3" : "flex flex-wrap justify-center gap-6"}>
                        {isConsultMode || viewMode === 'list' ? (
                            membersList.map((item, idx) => (
                                viewMode === 'card' ? (
                                    <div key={idx} className={`flex items-stretch bg-white rounded-[32px] border-l-[12px] ${item.color} shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2 border-slate-100`}>
                                        <div className="w-28 bg-slate-50 flex flex-col items-center justify-center p-4 border-r border-slate-100 shrink-0">
                                            <div className="w-20 h-24 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden flex items-center justify-center shadow-inner mb-2 group-hover:scale-105 transition-transform duration-500">
                                                {item.member.photo ? (
                                                    <img src={item.member.photo} className="w-full h-full object-cover" alt={item.title} />
                                                ) : (
                                                    <User size={32} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="bg-blue-900/10 px-2 py-0.5 rounded-full">
                                                <span className="text-[7px] font-black text-blue-900 uppercase tracking-tighter">SNE-2025</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Shield size={12} className="text-blue-900 opacity-50" />
                                                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">{item.title}</span>
                                                </div>
                                                <h4 className="text-[18px] font-black text-slate-900 uppercase leading-tight mb-3 group-hover:text-blue-900 transition-colors">
                                                    {item.member.firstName || '---'} {item.member.lastName || ''}
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <IdCard size={10} className="text-emerald-600" />
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identificación</span>
                                                    </div>
                                                    <span className="text-[12px] font-black text-blue-900 uppercase">{item.member.dni || '---'}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone size={10} className="text-emerald-600" />
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contacto Directo</span>
                                                    </div>
                                                    <span className="text-[12px] font-black text-blue-900 uppercase">{item.member.phone || '---'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={idx} className={`flex items-center bg-white rounded-2xl border-l-[8px] ${item.color} shadow-md p-3 hover:translate-x-2 transition-transform duration-300 group border border-slate-100`}>
                                        <div className="w-14 h-16 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shrink-0 mr-4 shadow-inner">
                                            {item.member.photo ? (
                                                <img src={item.member.photo} className="w-full h-full object-cover" alt={item.title} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                                            <div className="md:col-span-3">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">{item.title}</span>
                                                <h4 className="text-[13px] font-black text-blue-900 uppercase truncate">
                                                    {item.member.firstName ? `${item.member.firstName} ${item.member.lastName}` : '---'}
                                                </h4>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Identificación</span>
                                                <span className="text-[11px] font-bold text-slate-700">{item.member.dni || '---'}</span>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Contacto Directo</span>
                                                <span className="text-[11px] font-bold text-slate-700">{item.member.phone || '---'}</span>
                                            </div>
                                            <div className="md:col-span-3 flex justify-end">
                                                <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                    <span className="text-[8px] font-black text-blue-400 tracking-widest uppercase italic">SNE-2025</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            membersList.map((item, idx) => (
                                <StaffCard key={idx} title={item.title} icon={idx < 2 ? UserCheck : idx === 2 ? FileText : idx === 3 ? BarChart3 : Contact} member={formData[item.field]} onChange={(f, v) => updateMember(item.field, f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={false} isDirectiva={true} />
                            ))
                        )}
                    </div>
                </div>
                <div className="p-8 bg-blue-900 flex flex-wrap justify-center gap-6">
                    {!isConsultMode && (
                        <button
                            disabled={!hasChanged || !formData.presidente.firstName.trim() || !formData.presidente.lastName.trim()}
                            onClick={onSave}
                            className={`${actionButtonBase} bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500`}
                        >
                            <Save size={22} /> GUARDAR DIRECTIVA
                        </button>
                    )}
                    <button onClick={onPrint} className={`${actionButtonBase} bg-slate-100 text-blue-950 border-slate-300 hover:bg-white`}>
                        <Printer size={22} /> IMPRIMIR ACTA
                    </button>
                    <button onClick={onCancel} className={`${actionButtonBase} bg-red-600 text-white border-red-800 hover:bg-red-500`}>
                        <X size={22} /> {isConsultMode ? 'CERRAR VISTA' : 'CANCELAR ACCIÓN'}
                    </button>
                </div>
            </div>
        </div>
    );
};
