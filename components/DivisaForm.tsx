
import React from 'react';
import { X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { actionButtonBase } from '../constants/styles';

interface DivisaFormProps {
    tempDivisaImage: string;
    tempDivisaName: string;
    setTempDivisaName: (name: string) => void;
    onClose: () => void;
    onImageClick: () => void;
    onConfirm: () => void;
    divisaImgInputRef: React.RefObject<HTMLInputElement>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    labelClass: string;
}

export const DivisaForm: React.FC<DivisaFormProps> = ({
    tempDivisaImage,
    tempDivisaName,
    setTempDivisaName,
    onClose,
    onImageClick,
    onConfirm,
    divisaImgInputRef,
    onImageChange,
    labelClass
}) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[300] flex items-center justify-center p-6">
            <div className="bg-white rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-6 duration-300 border-4 border-blue-900">
                <div className="bg-blue-950 p-8 flex justify-between items-center border-b-[10px] border-red-600">
                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm">Registro de Nueva Divisa</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white hover:scale-110 transition-all">
                        <X size={28} />
                    </button>
                </div>
                <div className="p-10 flex flex-col gap-8">
                    <div onClick={onImageClick} className="w-36 h-36 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-300 flex items-center justify-center cursor-pointer mx-auto overflow-hidden hover:border-emerald-500 hover:bg-white transition-all shadow-inner group">
                        {tempDivisaImage ? <img src={tempDivisaImage} className="w-full h-full object-contain p-4" alt="Divisa" /> : <ImageIcon size={48} className="text-slate-300 group-hover:scale-110 transition-transform" />}
                    </div>
                    <input type="file" ref={divisaImgInputRef} hidden accept="image/*" onChange={onImageChange} />
                    <div className="space-y-2">
                        <label className={labelClass}>NOMBRE OFICIAL DE LA LIGA</label>
                        <input type="text" placeholder="EJ: EQUIPO CAMPEÓN" className="w-full p-5 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none font-black uppercase text-[13px] tracking-widest focus:bg-white focus:border-blue-900 shadow-sm" value={tempDivisaName} onChange={(e) => setTempDivisaName(e.target.value.toUpperCase())} />
                    </div>
                    <button disabled={!tempDivisaName.trim()} onClick={onConfirm}
                        className={`${actionButtonBase} w-full bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500 !h-14 !text-[12px]`}>
                        <CheckCircle2 size={22} /> CONTINUAR AL REGISTRO
                    </button>
                </div>
            </div>
        </div>
    );
};
