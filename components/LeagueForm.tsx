
import React from 'react';
import { X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { actionButtonBase } from '../constants/styles';

interface LeagueFormProps {
    tempLeagueImage: string;
    tempLeagueName: string;
    setTempLeagueName: (name: string) => void;
    onClose: () => void;
    onImageClick: () => void;
    onConfirm: () => void;
    leagueImgInputRef: React.RefObject<HTMLInputElement>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    labelClass: string;
}

export const LeagueForm: React.FC<LeagueFormProps> = ({
    tempLeagueImage,
    tempLeagueName,
    setTempLeagueName,
    onClose,
    onImageClick,
    onConfirm,
    leagueImgInputRef,
    onImageChange,
    labelClass
}) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[300] flex items-center justify-center p-6">
            <div className="bg-white rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border-4 border-blue-900">
                <div className="bg-blue-950 p-8 flex justify-between items-center border-b-[10px] border-red-600">
                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm">Registro de Nueva Liga</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-all hover:rotate-90">
                        <X size={28} />
                    </button>
                </div>
                <div className="p-10 flex flex-col gap-8">
                    <div onClick={onImageClick} className="w-40 h-40 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-300 flex items-center justify-center cursor-pointer mx-auto overflow-hidden hover:border-blue-500 hover:bg-white transition-all shadow-inner group">
                        {tempLeagueImage ? <img src={tempLeagueImage} className="w-full h-full object-contain p-4" alt="League" /> : <ImageIcon size={48} className="text-slate-300 group-hover:scale-110 transition-transform" />}
                    </div>
                    <input type="file" ref={leagueImgInputRef} hidden accept="image/*" onChange={onImageChange} />
                    <div className="space-y-2">
                        <label className={labelClass}>NOMBRE OFICIAL DE LA LIGA</label>
                        <input type="text" placeholder="EJ: LIGA MARIÑO" className="w-full p-5 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none font-black uppercase text-[13px] tracking-widest focus:bg-white focus:border-blue-900 shadow-sm" value={tempLeagueName} onChange={(e) => setTempLeagueName(e.target.value.toUpperCase())} />
                    </div>
                    <button disabled={!tempLeagueName.trim()} onClick={onConfirm}
                        className={`${actionButtonBase} w-full bg-red-600 text-white border-red-800 hover:bg-red-500 !h-14 !text-[12px] !rounded-2xl`}>
                        <CheckCircle size={22} /> CONFIRMAR REGISTRO
                    </button>
                </div>
            </div>
        </div>
    );
};
