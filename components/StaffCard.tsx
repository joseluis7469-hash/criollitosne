
import React, { useRef } from 'react';
import { Camera, PlusCircle, IdCard, MapPin } from 'lucide-react';
import { StaffMember } from '../types';
import { compressImage, attemptFullScreen, handleDNIFormat, handlePhoneFormat } from '../utils/helpers';

interface StaffCardProps {
    title: string;
    icon: any;
    member: StaffMember;
    onChange: (field: keyof StaffMember, value: string) => void;
    isReadOnly?: boolean;
    onKeyDown?: React.KeyboardEventHandler;
    isDirectiva?: boolean;
    isFullForm?: boolean;
    role?: string;
    onRoleChange?: (v: string) => void;
    showRole?: boolean;
}

const inputClass = "p-1.5 bg-blue-200 border-2 border-blue-500 rounded-lg outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-300 font-bold uppercase text-[9px] transition-all shadow-sm w-full focus:bg-white";
const labelClass = "text-[8px] font-black uppercase text-slate-500 ml-1";

export const StaffCard = ({
    title,
    icon: Icon,
    member,
    onChange,
    isReadOnly = false,
    onKeyDown,
    isFullForm = false,
    role,
    onRoleChange,
    showRole = false
}: StaffCardProps) => {
    const staffPhotoInputRef = useRef<HTMLInputElement>(null);

    const renderInput = (label: string, value: string, field: keyof StaffMember, handler: (v: string) => void, maxLength?: number, type: string = "text", width: string = "w-full") => (
        <div className={`flex flex-col gap-0.5 ${width}`}>
            <label className={labelClass}>{label}</label>
            <input
                type={type}
                maxLength={maxLength}
                className={`${inputClass} transition-all`}
                value={value || ''}
                onKeyDown={onKeyDown}
                onChange={(e) => handler(e.target.value)}
                readOnly={isReadOnly}
                placeholder={label}
            />
        </div>
    );

    return (
        <div className={`relative bg-white border-2 border-blue-900 rounded-[24px] shadow-2xl overflow-hidden flex flex-col transition-all hover:shadow-blue-900/10 ${isFullForm ? 'w-full' : 'max-w-[280px] mx-auto'}`}>
            {/* Cabecera de Credencial */}
            <div className="bg-blue-950 p-2.5 flex items-center justify-between border-b-4 border-red-600">
                <div className="flex items-center gap-2">
                    <Icon size={14} className="text-yellow-400" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">{title}</span>
                </div>
                <div className="bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                    <span className="text-[7px] font-black text-blue-200 uppercase tracking-widest">SNE-2025</span>
                </div>
            </div>

            <div className={`p-4 flex flex-col gap-4 ${isFullForm ? 'bg-slate-50' : ''}`}>
                {/* Bloque Identidad con Foto a la Izquierda */}
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-3">
                    <div className="flex items-center gap-1 border-b border-blue-200 pb-1 mb-1">
                        <IdCard size={10} className="text-blue-900" />
                        <span className="text-[8px] font-black text-blue-900 uppercase">Datos de Identidad</span>
                    </div>

                    <div className="flex gap-4 items-start">
                        {/* Area de Foto Perfil */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <div
                                onClick={(e) => { e.stopPropagation(); if (!isReadOnly) { staffPhotoInputRef.current?.click(); } }}
                                className={`group relative w-20 h-28 bg-slate-100 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden transition-all shadow-inner ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:border-blue-600 hover:bg-white hover:scale-105'}`}
                            >
                                {member.photo ? (
                                    <img src={member.photo} className="w-full h-full object-cover" alt="Staff Member" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-80 transition-opacity">
                                        <Camera size={20} className="text-blue-900" />
                                        <span className="text-[6px] font-black uppercase text-blue-900 text-center px-1">SUBIR FOTO</span>
                                    </div>
                                )}
                                {!isReadOnly && (
                                    <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <PlusCircle size={18} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={staffPhotoInputRef} hidden accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                        const compressed = await compressImage(reader.result as string);
                                        onChange('photo', compressed);
                                        setTimeout(attemptFullScreen, 300);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }} />
                        </div>

                        {/* Campos de Nombre y Apellido */}
                        <div className="flex-grow flex flex-col gap-2.5">
                            {renderInput("Nombres", member.firstName, "firstName", (v) => onChange('firstName', v.toUpperCase()), 30)}
                            {renderInput("Apellidos", member.lastName, "lastName", (v) => onChange('lastName', v.toUpperCase()), 30)}
                        </div>
                    </div>

                    {/* Fila inferior: Cédula y Cargo */}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            {renderInput("N° Cédula", member.dni, "dni", (v) => onChange('dni', handleDNIFormat(v)), 14)}
                        </div>
                        {showRole && (
                            <div className="flex-[1.5] flex flex-col gap-0.5">
                                <label className={labelClass}>Cargo / Función</label>
                                <select
                                    className={`${inputClass} !h-[30px] !text-[10px]`}
                                    value={role}
                                    onChange={(e) => onRoleChange?.(e.target.value)}
                                    disabled={isReadOnly}
                                >
                                    <option value="MÁNAGER">MÁNAGER</option>
                                    <option value="TÉCNICO">TÉCNICO</option>
                                    <option value="DELEGADO">DELEGADO</option>
                                    <option value="ASISTENTE">ASISTENTE</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bloque Información Extendida */}
                {isFullForm && (
                    <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 space-y-2">
                        <div className="flex items-center gap-1 border-b border-emerald-200 pb-1 mb-2">
                            <MapPin size={10} className="text-emerald-900" />
                            <span className="text-[8px] font-black text-emerald-900 uppercase">Contacto y Ubicación</span>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                {renderInput("Fecha Nac.", member.birthDate || '', "birthDate", (v) => onChange('birthDate', v), 14, "date")}
                            </div>
                            <div className="flex-1">
                                {renderInput("Teléfono", member.phone || '', "phone", (v) => onChange('phone', handlePhoneFormat(v)), 15)}
                            </div>
                        </div>
                        {renderInput("Dirección de Habitación", member.address || '', "address", (v) => onChange('address', v.toUpperCase()))}
                    </div>
                )}
            </div>

            {/* Decoración Inferior */}
            <div className="h-2 bg-gradient-to-r from-blue-900 via-red-600 to-blue-900"></div>
        </div>
    );
};
