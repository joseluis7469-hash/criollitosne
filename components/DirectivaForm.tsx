
import React from 'react';
import { UserCheck, FileText, BarChart3, Contact, Save, Printer, X, UserCog } from 'lucide-react';
import { Directiva, DirectivaMember } from '../types';
import { actionButtonBase } from '../constants/styles';
import { StaffCard } from './StaffCard';

interface DirectivaFormProps {
    selectedLeague: string | null;
    formData: Directiva;
    setFormData: React.Dispatch<React.SetStateAction<Directiva>>;
    isConsultMode: boolean;
    isDirectivaUpdate: boolean;
    onSave: () => void;
    onCancel: () => void;
    onPrint: () => void;
    hasChanged: boolean;
}

export const DirectivaForm: React.FC<DirectivaFormProps> = ({
    selectedLeague,
    formData,
    setFormData,
    isConsultMode,
    isDirectivaUpdate,
    onSave,
    onCancel,
    onPrint,
    hasChanged
}) => {
    const directivaFormRef = React.useRef<HTMLDivElement>(null);

    const handleEnterKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const form = directivaFormRef.current;
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

    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[600] flex items-center justify-center p-4 overflow-y-auto">
            <div ref={directivaFormRef} className="bg-white rounded-[50px] shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-7xl my-auto overflow-hidden border-[6px] border-blue-900 animate-in zoom-in duration-300">
                <div className="bg-blue-950 p-6 flex justify-between items-center border-b-[10px] border-red-600">
                    <div className="flex items-center gap-5">
                        <UserCog size={40} className="text-yellow-400" />
                        <div className="flex flex-col">
                            <h3 className="text-white font-black uppercase tracking-[0.3em] text-xl leading-none">Configuración de Junta Directiva</h3>
                            <p className="text-yellow-400 font-bold uppercase text-[12px] tracking-[0.4em] mt-1">{selectedLeague}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="text-white/70 hover:text-white hover:scale-110 transition-transform bg-white/10 p-2 rounded-2xl">
                        <X size={32} />
                    </button>
                </div>
                <div className="p-10 overflow-y-auto max-h-[75vh] custom-scrollbar bg-slate-50">
                    <div className="flex flex-wrap justify-center gap-6">
                        <StaffCard title="Presidente(a)" icon={UserCheck} member={formData.presidente} onChange={(f, v) => updateMember('presidente', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                        <StaffCard title="Vicepresidente(a)" icon={UserCheck} member={formData.vicepresidente} onChange={(f, v) => updateMember('vicepresidente', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                        <StaffCard title="Secretario(a) General" icon={FileText} member={formData.secGeneral} onChange={(f, v) => updateMember('secGeneral', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                        <StaffCard title="Secretario(a) Finanzas" icon={BarChart3} member={formData.secFinanzas} onChange={(f, v) => updateMember('secFinanzas', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                        <StaffCard title="1er. Delegado(a)" icon={Contact} member={formData.delegado1} onChange={(f, v) => updateMember('delegado1', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                        <StaffCard title="2do. Delegado(a)" icon={Contact} member={formData.delegado2} onChange={(f, v) => updateMember('delegado2', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                        <StaffCard title="3er. Delegado(a)" icon={Contact} member={formData.delegado3} onChange={(f, v) => updateMember('delegado3', f, v)} onKeyDown={handleEnterKeyNavigation} isReadOnly={isConsultMode} isDirectiva={true} />
                    </div>
                </div>
                <div className="p-8 bg-blue-900 flex flex-wrap justify-center gap-6">
                    {!isConsultMode && (
                        <button
                            disabled={!hasChanged || !formData.presidente.firstName.trim() || !formData.presidente.lastName.trim()}
                            onClick={onSave}
                            className={`${actionButtonBase} bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500`}
                        >
                            <Save size={22} /> {isDirectivaUpdate ? 'ACTUALIZAR DATOS' : 'GUARDAR DIRECTIVA'}
                        </button>
                    )}
                    <button onClick={onPrint} className={`${actionButtonBase} bg-slate-100 text-blue-950 border-slate-300 hover:bg-white`}>
                        <Printer size={22} /> IMPRIMIR ACTA
                    </button>
                    <button onClick={onCancel} className={`${actionButtonBase} bg-red-600 text-white border-red-800 hover:bg-red-500`}>
                        <X size={22} /> {isConsultMode ? 'CERRAR VISTA' : 'CANCELAR'}
                    </button>
                </div>
            </div>
        </div>
    );
};
