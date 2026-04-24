
import React from 'react';
import { Settings, Shield, Users, PlusCircle } from 'lucide-react';
import { actionButtonBase } from '../constants/styles';

interface DivisaListProps {
    currentDivisas: string[];
    divisaImages: Record<string, string>;
    isDivisasListHovered: boolean;
    setIsDivisasListHovered: (hovered: boolean) => void;
    divisaContextMenu: { x: number, y: number, divisa: string } | null;
    onSelectDivisa: (divisa: string) => void;
    onContextMenu: (e: React.MouseEvent, divisa: string) => void;
    onRegisterDivisa: () => void;
}

export const DivisaList: React.FC<DivisaListProps> = ({
    currentDivisas,
    divisaImages,
    isDivisasListHovered,
    setIsDivisasListHovered,
    divisaContextMenu,
    onSelectDivisa,
    onContextMenu,
    onRegisterDivisa
}) => {
    return (
        <div
            className="flex-grow flex flex-col min-h-0"
            onMouseEnter={() => setIsDivisasListHovered(true)}
            onMouseLeave={() => setIsDivisasListHovered(false)}
        >
            {currentDivisas.length > 0 ? (
                <div className="flex flex-col gap-2 px-10 pb-10 overflow-y-auto custom-scrollbar">
                    {currentDivisas.map((divisa) => (
                        <div
                            key={divisa}
                            className="group flex items-center gap-4 p-1.5 transition-all cursor-pointer select-none"
                            onClick={() => onSelectDivisa(divisa)}
                            onContextMenu={(e) => onContextMenu(e, divisa)}
                        >
                            <div className={`relative w-16 h-16 shrink-0 transition-all duration-500 transform ${isDivisasListHovered ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-10'}`}>
                                <div className={`w-full h-full rounded-full bg-white/10 border-2 overflow-hidden flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 ${divisaContextMenu?.divisa === divisa ? 'border-yellow-400 scale-110 ring-4 ring-yellow-400/30' : 'border-blue-900/40'}`}>
                                    {divisaImages[divisa] ? (
                                        <img src={divisaImages[divisa]} className="w-full h-full object-contain p-2" alt="Divisa Logo" />
                                    ) : (
                                        <Shield size={28} className="text-white/30" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-blue-900 text-yellow-400 p-1 rounded-full border border-yellow-400 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Settings size={8} />
                                </div>
                            </div>
                            <div className={`flex-1 py-1 transition-all duration-300 transform ${isDivisasListHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                                <h3 className={`font-black uppercase text-sm tracking-[0.2em] drop-shadow-lg transition-colors ${divisaContextMenu?.divisa === divisa ? 'text-yellow-400' : 'text-white'}`}>
                                    {divisa}
                                </h3>
                                <div className={`h-0.5 w-full max-w-[200px] mt-1 transition-all ${divisaContextMenu?.divisa === divisa ? 'bg-yellow-400 opacity-100 scale-x-110' : 'bg-blue-400 opacity-40'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white/10 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-white/20 mx-10">
                    <Users size={60} className="text-white/20 mb-4" />
                    <h3 className="text-white font-black uppercase text-xl mb-6">No hay divisas en esta liga</h3>
                    <button
                        onClick={onRegisterDivisa}
                        className={`${actionButtonBase} bg-blue-900 text-white border-blue-950 active:translate-y-1 active:border-b-0 hover:bg-blue-800 flex items-center gap-3 shadow-xl`}
                    >
                        <PlusCircle size={20} /> Agregar Primera Divisa
                    </button>
                </div>
            )}
            {currentDivisas.length > 0 && (
                <div className="px-10 pb-4 text-center shrink-0">
                    <span className="bg-blue-900/40 text-blue-200 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-blue-400/20">💡 Consejo: Haz clic derecho sobre una divisa para ver opciones de edición y directiva.</span>
                </div>
            )}
        </div>
    );
};
