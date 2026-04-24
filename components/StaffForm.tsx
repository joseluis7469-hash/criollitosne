
import React from 'react';
import { Briefcase, Camera, Save, X, IdCard, Phone, PlusCircle } from 'lucide-react';
import { StaffMember } from '../types';
import { inputClass, labelClass, actionButtonBase } from '../constants/styles';
import { compressImage, attemptFullScreen } from '../utils/helpers';

interface StaffFormProps {
    formData: StaffMember;
    setFormData: React.Dispatch<React.SetStateAction<StaffMember>>;
    selectedDivisa: string | null;
    onSave: () => void;
    onCancel: () => void;
    hasInput: boolean;
    onDNIFormat: (val: string) => string;
    onPhoneFormat: (val: string) => string;
}

export const StaffForm: React.FC<StaffFormProps> = ({
    formData,
    setFormData,
    selectedDivisa,
    onSave,
    onCancel,
    hasInput,
    onDNIFormat,
    onPhoneFormat
}) => {
    const staffPhotoEditorRef = React.useRef<HTMLInputElement>(null);
    const staffFormRef = React.useRef<HTMLDivElement>(null);

    const handleEnterKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const form = staffFormRef.current;
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
        <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-200 animate-in fade-in duration-300 max-w-fit mx-auto" ref={staffFormRef}>
            <div className="bg-blue-950 p-4 flex justify-between items-center border-b-4 border-red-600 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 p-2 rounded-xl shadow-lg border-b-4 border-yellow-600">
                        <Briefcase size={22} className="text-blue-950" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-white font-black uppercase text-[14px] tracking-wider leading-none">Registro de Personal Técnico</h3>
                        <span className="text-blue-300 font-bold uppercase text-[9px] tracking-widest mt-1 opacity-80 italic">{selectedDivisa}</span>
                    </div>
                </div>
                <button onClick={onCancel} className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-all border-b-4 border-red-800 active:translate-y-1 active:border-b-0">
                    <X size={20} />
                </button>
            </div>
            <div className="flex-grow p-8 overflow-y-auto custom-scrollbar space-y-8">
                <div className="space-y-5">
                    <div className="flex items-center gap-3 border-b-2 border-blue-900/10 pb-2">
                        <IdCard size={18} className="text-blue-900" />
                        <span className="text-[12px] font-black text-blue-900 uppercase tracking-widest">Identidad del Miembro</span>
                    </div>
                    <div className="flex gap-8 items-start">
                        <div className="shrink-0 flex flex-col items-center gap-2">
                            <div
                                onClick={(e) => { e.stopPropagation(); staffPhotoEditorRef.current?.click(); }}
                                className="w-28 h-36 bg-white rounded-2xl border-4 border-dashed border-blue-200 flex items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all shadow-inner group relative overflow-hidden"
                            >
                                {formData.photo ? (
                                    <img src={formData.photo} className="w-full h-full object-cover" alt="Staff Preview" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60">
                                        <Camera size={32} className="text-blue-900" />
                                        <span className="text-[7px] font-black uppercase text-center tracking-tighter">SUBIR FOTO</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <PlusCircle size={24} className="text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={staffPhotoEditorRef}
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            const compressed = await compressImage(reader.result as string);
                                            setFormData(p => ({ ...p, photo: compressed }));
                                            setTimeout(attemptFullScreen, 300);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-grow flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <label className={labelClass}>Nombres</label>
                                <input
                                    type="text"
                                    style={{ width: '32ch' }}
                                    className={`${inputClass} !p-2 !text-[11px]`}
                                    value={formData.firstName}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value.toUpperCase() }))}
                                    placeholder="NOMBRES COMPLETOS"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className={labelClass}>Apellidos</label>
                                <input
                                    type="text"
                                    style={{ width: '32ch' }}
                                    className={`${inputClass} !p-2 !text-[11px]`}
                                    value={formData.lastName}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value.toUpperCase() }))}
                                    placeholder="APELLIDOS COMPLETOS"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-[200px] flex flex-col gap-1">
                            <label className={labelClass}>N° Cédula</label>
                            <input
                                type="text"
                                className={`${inputClass} !p-2 !text-[11px]`}
                                value={formData.dni}
                                onKeyDown={handleEnterKeyNavigation}
                                onChange={(e) => setFormData(p => ({ ...p, dni: onDNIFormat(e.target.value) }))}
                                placeholder="V-00.000.000"
                            />
                        </div>
                        <div className="w-[220px] flex flex-col gap-1">
                            <label className={labelClass}>Cargo / Función</label>
                            <select
                                className={`${inputClass} !h-[40px] !text-[11px] font-black`}
                                value={formData.role}
                                onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                            >
                                <option value="MÁNAGER">MÁNAGER</option>
                                <option value="TÉCNICO">TÉCNICO</option>
                                <option value="DELEGADO">DELEGADO</option>
                                <option value="ASISTENTE">ASISTENTE</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="space-y-5">
                    <div className="flex items-center gap-3 border-b-2 border-emerald-900/10 pb-2">
                        <Phone size={18} className="text-emerald-700" />
                        <span className="text-[12px] font-black text-emerald-700 uppercase tracking-widest">Contacto y Localización</span>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-[200px] flex flex-col gap-1">
                            <label className={labelClass}>Teléfono</label>
                            <input
                                type="text"
                                className={`${inputClass} !p-2 !text-[11px]`}
                                value={formData.phone}
                                onKeyDown={handleEnterKeyNavigation}
                                onChange={(e) => setFormData(p => ({ ...p, phone: onPhoneFormat(e.target.value) }))}
                                placeholder="04XX-000.00.00"
                            />
                        </div>
                        <div className="w-[200px] flex flex-col gap-1">
                            <label className={labelClass}>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className={`${inputClass} !p-2 !text-[11px]`}
                                value={formData.birthDate || ''}
                                onKeyDown={handleEnterKeyNavigation}
                                onChange={(e) => setFormData(p => ({ ...p, birthDate: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="max-w-lg flex flex-col gap-1">
                        <label className={labelClass}>Dirección de Habitación</label>
                        <textarea
                            className={`${inputClass} !h-[80px] !text-[11px] resize-none pt-2`}
                            value={formData.address}
                            onKeyDown={handleEnterKeyNavigation}
                            onChange={(e) => setFormData(p => ({ ...p, address: e.target.value.toUpperCase() }))}
                            placeholder="DIRECCIÓN DETALLADA DE VIVIENDA..."
                        />
                    </div>
                </div>
            </div>
            <div className="p-8 bg-white border-t-2 border-slate-100 flex justify-center gap-6 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button
                    onClick={onSave}
                    disabled={!hasInput}
                    className={`${actionButtonBase} bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500`}
                >
                    <Save size={20} className="text-white/80" /> GUARDAR
                </button>
                <button
                    onClick={onCancel}
                    className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 hover:bg-slate-600`}
                >
                    <X size={20} className="text-white/80" /> CANCELAR
                </button>
            </div>
        </div>
    );
};
