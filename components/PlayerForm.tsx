
import React, { useRef } from 'react';
import { IdCard, Camera, User, Activity, Check, Save, X, Phone, Contact } from 'lucide-react';
import { Player } from '../types';
import { VENEZUELA_DATA } from '../constants';
import { inputClass, labelClass, actionButtonBase } from '../constants/styles';
import { compressImage, attemptFullScreen } from '../utils/helpers';

interface PlayerFormProps {
    formData: Player;
    setFormData: React.Dispatch<React.SetStateAction<Player>>;
    isConsultMode: boolean;
    onSave: () => void;
    onCancel: () => void;
    onDNIChange: (val: string) => void;
    onPhoneChange: (val: string) => void;
    onBirthDateChange: (val: string) => void;
    hasUserInput: boolean;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({
    formData,
    setFormData,
    isConsultMode,
    onSave,
    onCancel,
    onDNIChange,
    onPhoneChange,
    onBirthDateChange,
    hasUserInput
}) => {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const playerFormRef = useRef<HTMLDivElement>(null);

    const handleEnterKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const form = playerFormRef.current;
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

    const togglePosition = (pos: string) => {
        if (isConsultMode) return;
        setFormData(prev => {
            const current = prev.positions || [];
            if (current.includes(pos)) {
                return { ...prev, positions: current.filter(p => p !== pos) };
            } else {
                return { ...prev, positions: [...current, pos] };
            }
        });
    };

    return (
        <div className="animate-fade-in flex flex-col h-full overflow-hidden" ref={playerFormRef}>
            <div className="bg-blue-950 py-2 rounded-2xl shadow-xl mb-3 border-b-4 border-red-600">
                <h3 className="text-center font-black uppercase text-white text-[18px] tracking-[0.3em] leading-tight">
                    {isConsultMode ? 'CONSULTA DE JUGADOR' : (formData.id ? 'EDITAR JUGADOR' : 'REGISTRO DE NUEVO JUGADOR')}
                </h3>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3 relative">
                <img
                    src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=200&auto=format&fit=crop"
                    className="absolute top-0 right-0 w-32 h-32 object-cover rounded-[32px] pointer-events-none z-0 shadow-2xl opacity-40 border-4 border-white"
                    alt="Beisbol Infantil"
                />
                <div className="border-[3px] border-blue-400 p-4 rounded-[32px] space-y-2 bg-blue-50/30 shadow-md relative z-10">
                    <div className="flex items-center gap-3 text-blue-900 border-b-2 border-blue-200 pb-1.5">
                        <IdCard size={20} />
                        <h4 className="font-black uppercase text-[10px] tracking-widest">Datos Personales</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-2 flex flex-col items-center gap-2">
                            <label className={labelClass}>Foto del Jugador</label>
                            <div className="relative">
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 bg-blue-900 text-yellow-400 px-2 py-0.5 rounded-full font-black text-[8px] shadow-xl border-2 border-yellow-400 whitespace-nowrap">
                                    {formData.code || 'SIN CÓDIGO'}
                                </div>
                                <div
                                    onClick={(e) => { e.stopPropagation(); if (!isConsultMode) { photoInputRef.current?.click(); } }}
                                    className={`w-24 h-32 bg-white rounded-2xl border-4 border-dashed border-blue-300 flex items-center justify-center overflow-hidden relative shadow-inner ${isConsultMode ? 'cursor-default' : 'cursor-pointer hover:border-blue-700 hover:scale-105 transition-all'}`}
                                >
                                    {formData.photo ? (
                                        <img src={formData.photo} className="w-full h-full object-cover" alt="Player Photo" />
                                    ) : (
                                        <div className="text-center p-2">
                                            <Camera size={32} className="mx-auto text-blue-300 mb-1" />
                                            <span className="text-[7px] font-black uppercase text-blue-300 tracking-tighter">SUBIR FOTO</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={photoInputRef}
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            const compressed = await compressImage(reader.result as string);
                                            setFormData(p => ({ ...p, photo: compressed }));
                                            firstNameRef.current?.focus();
                                            setTimeout(attemptFullScreen, 300);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                disabled={isConsultMode}
                            />
                        </div>
                        <div className="md:col-span-10 space-y-3">
                            <div className="flex flex-wrap items-end gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelClass}>Nombres</label>
                                    <input
                                        ref={firstNameRef}
                                        type="text"
                                        maxLength={30}
                                        className={`${inputClass} w-[260px] !p-2.5 !text-[11px]`}
                                        value={formData.firstName}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value.toUpperCase() }))}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelClass}>Apellidos</label>
                                    <input
                                        type="text"
                                        maxLength={30}
                                        className={`${inputClass} w-[260px] !p-2.5 !text-[11px]`}
                                        value={formData.lastName}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value.toUpperCase() }))}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2 items-start">
                                <div className="flex flex-col gap-1.5 w-[160px]">
                                    <label className={labelClass}>N° DE CEDULA</label>
                                    <input
                                        type="text"
                                        placeholder="V - 00.000.000"
                                        className={`${inputClass} !p-2.5 !text-[11px]`}
                                        value={formData.dni}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => onDNIChange(e.target.value)}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 w-[140px]">
                                    <label className={labelClass}>F. Nac.</label>
                                    <input
                                        type="date"
                                        className={`${inputClass} !p-2.5 !text-[11px]`}
                                        value={formData.birthDate || ''}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => onBirthDateChange(e.target.value)}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 w-[50px]">
                                    <label className={labelClass}>Edad</label>
                                    <div className="w-full p-2 bg-blue-900 text-white rounded-xl font-black text-center text-[18px] h-[40px] flex items-center justify-center shadow-inner border-b-4 border-blue-950">
                                        {formData.age || '-'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 w-[180px]">
                                    <label className={labelClass}>CATEGORIA</label>
                                    <div className="w-full p-1.5 bg-red-600 text-white rounded-xl font-black text-center text-[11px] h-[44px] flex items-center justify-center shadow-lg truncate px-3 uppercase leading-none border-b-4 border-red-800">
                                        {formData.category || '-'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 w-[140px]">
                                    <label className={labelClass}>GRUPO SANGUÍNEO</label>
                                    <select
                                        className={`${inputClass} !h-[42px] !text-[11px]`}
                                        value={formData.bloodType}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                                        disabled={isConsultMode}
                                    >
                                        {['O Rh +', 'O Rh -', 'A Rh +', 'A Rh -', 'B Rh +', 'B Rh -', 'AB Rh +', 'AB Rh -'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t-2 border-blue-200">
                        <div className="flex flex-wrap items-start gap-3">
                            <div className="flex flex-col gap-1.5 w-[150px]">
                                <label className={labelClass}>Estado Nac.</label>
                                <select
                                    className={`${inputClass} !p-2 !text-[10px]`}
                                    value={formData.birthState}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => setFormData(prev => ({ ...prev, birthState: e.target.value, birthCity: '' }))}
                                    disabled={isConsultMode}
                                >
                                    <option value="">SELECCIONE</option>
                                    {Object.keys(VENEZUELA_DATA).sort().map(estado => (
                                        <option key={estado} value={estado}>{estado}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5 w-[160px]">
                                <label className={labelClass}>Ciudad Nac.</label>
                                <select
                                    className={`${inputClass} !p-2 !text-[10px]`}
                                    value={formData.birthCity}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => setFormData(prev => ({ ...prev, birthCity: e.target.value }))}
                                    disabled={!formData.birthState || isConsultMode}
                                >
                                    <option value="">SELECCIONE</option>
                                    {formData.birthState && VENEZUELA_DATA[formData.birthState].sort().map(ciudad => (
                                        <option key={ciudad} value={ciudad}>{ciudad}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5 w-[100px]">
                                <label className={labelClass}>Estatus</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={`${inputClass} bg-slate-50 font-black !p-2 !text-[10px] ${formData.status === 'ACTIVO' ? 'text-green-600' : 'text-red-600'}`}
                                        value={formData.status}
                                        readOnly
                                    />
                                    <div className={`absolute right-2 top-3 w-2.5 h-2.5 rounded-full ${formData.status === 'ACTIVO' ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-[400px]">
                                <label className={labelClass}>CONDICIÓN MEDICA / ALERGIAS</label>
                                <input
                                    type="text"
                                    maxLength={60}
                                    className={`${inputClass} !p-2 !text-[10px]`}
                                    value={formData.medicalCondition}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => setFormData(p => ({ ...p, medicalCondition: e.target.value.toUpperCase() }))}
                                    readOnly={isConsultMode}
                                    placeholder="MENCIONE CUALQUIER RESTRICCIÓN MÉDICA..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start relative z-10">
                    <div className="flex flex-col gap-4">
                        <div className="border-[3px] border-emerald-400 p-4 rounded-[32px] bg-emerald-50/30 shadow-md flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-emerald-900 border-b-2 border-emerald-200 pb-1.5">
                                <Activity size={18} />
                                <h4 className="font-black uppercase text-[10px] tracking-widest">Datos Técnicos</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>Lado de Bateo</label>
                                    <div className="flex flex-col gap-1.5 ml-1">
                                        {['DERECHA', 'IZQUIERDA', 'AMBIDIESTRO'].map(opt => (
                                            <div key={opt} onClick={() => !isConsultMode && setFormData(p => ({ ...p, batting: opt }))} className="flex items-center gap-2.5 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.batting === opt ? 'border-emerald-600 bg-emerald-100 shadow-sm' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                                    {formData.batting === opt && <div className="w-2 h-2 rounded-full bg-emerald-600"></div>}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase transition-colors ${formData.batting === opt ? 'text-blue-900' : 'text-slate-500 group-hover:text-emerald-600'}`}>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>Brazo de Lanzar</label>
                                    <div className="flex flex-col gap-1.5 ml-1">
                                        {['DERECHA', 'IZQUIERDA'].map(opt => (
                                            <div key={opt} onClick={() => !isConsultMode && setFormData(p => ({ ...p, throwing: opt }))} className="flex items-center gap-2.5 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.throwing === opt ? 'border-emerald-600 bg-emerald-100 shadow-sm' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                                    {formData.throwing === opt && <div className="w-2 h-2 rounded-full bg-emerald-600"></div>}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase transition-colors ${formData.throwing === opt ? 'text-blue-900' : 'text-slate-500 group-hover:text-emerald-600'}`}>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>Posición (Múltiple)</label>
                                    <div className="flex flex-col gap-1.5 ml-1">
                                        {['RECECTOR', 'LANZADOR', 'INFILDER', 'OUTFILDER', 'TODAS'].map(pos => (
                                            <div key={pos} onClick={() => togglePosition(pos)} className="flex items-center gap-2.5 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-xl border-2 flex items-center justify-center transition-all ${formData.positions.includes(pos) ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                                    {formData.positions.includes(pos) && <Check size={14} className="text-blue-600" strokeWidth={4} />}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase transition-colors ${formData.positions.includes(pos) ? 'text-blue-900' : 'text-slate-500 group-hover:text-emerald-600'}`}>{pos}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-start gap-4 pb-2">
                            {!isConsultMode && (
                                <button
                                    onClick={onSave}
                                    disabled={!hasUserInput}
                                    className={`${actionButtonBase} bg-blue-900 text-white border-blue-950`}
                                >
                                    <Save size={20} /> GUARDAR JUGADOR
                                </button>
                            )}
                            <button
                                onClick={onCancel}
                                className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 hover:bg-slate-600`}
                            >
                                <X size={20} /> {isConsultMode ? 'CERRAR VISTA' : 'CANCELAR'}
                            </button>
                        </div>
                    </div>
                    <div className="border-[3px] border-red-400 p-4 rounded-[32px] space-y-3 bg-red-50/30 shadow-md h-full">
                        <div className="flex items-center gap-3 text-red-900 border-b-2 border-red-200 pb-1.5">
                            <Contact size={18} />
                            <h4 className="font-black uppercase text-[10px] tracking-widest">Datos de Contacto</h4>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                                    <label className={labelClass}>Nombre del Padre</label>
                                    <input
                                        type="text"
                                        className={`${inputClass} !p-2 !text-[11px]`}
                                        value={formData.fatherName}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => setFormData(p => ({ ...p, fatherName: e.target.value.toUpperCase() }))}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                                    <label className={labelClass}>Nombre de la Madre</label>
                                    <input
                                        type="text"
                                        className={`${inputClass} !p-2 !text-[11px]`}
                                        value={formData.motherName}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => setFormData(p => ({ ...p, motherName: e.target.value.toUpperCase() }))}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                                    <label className={labelClass}>Representante Legal</label>
                                    <input
                                        type="text"
                                        className={`${inputClass} !p-2 !text-[11px]`}
                                        value={formData.representante}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => setFormData(p => ({ ...p, representante: e.target.value.toUpperCase() }))}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 w-[160px]">
                                    <label className={labelClass}>Teléfono Contacto</label>
                                    <input
                                        type="tel"
                                        placeholder="0000-000.00.00"
                                        className={`${inputClass} !p-2 !text-[11px]`}
                                        value={formData.phone}
                                        onKeyDown={handleEnterKeyNavigation}
                                        onChange={(e) => onPhoneChange(e.target.value)}
                                        readOnly={isConsultMode}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className={labelClass}>Dirección de Residencia</label>
                                <textarea
                                    maxLength={100}
                                    className={`${inputClass} !h-[60px] !p-2 !text-[10px] resize-none`}
                                    value={formData.address}
                                    onKeyDown={handleEnterKeyNavigation}
                                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value.toUpperCase() }))}
                                    readOnly={isConsultMode}
                                    placeholder="INDIQUE CALLE, SECTOR Y PUNTO DE REFERENCIA..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
