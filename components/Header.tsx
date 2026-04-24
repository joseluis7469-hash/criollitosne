
import React from 'react';
import { Maximize, Minimize, Activity, Trash2, Globe, AtSign } from 'lucide-react';

interface HeaderProps {
    onToggleFullScreen: () => void;
    isFullScreen: boolean;
    onClearConfig: () => void;
    onResetApp: () => void;
}

export const Header = ({
    onToggleFullScreen,
    isFullScreen,
    onClearConfig,
    onResetApp
}: HeaderProps) => {
    return (
        <div className="flex items-center justify-between pointer-events-auto p-6 md:p-8">
            <div className="flex flex-col gap-1 drop-shadow-2xl">
                <div className="flex items-center gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=100&auto=format&fit=crop"
                        className="w-16 h-16 object-contain bg-white rounded-3xl p-1 border-4 border-white shadow-2xl"
                        alt="Criollitos Logo"
                    />
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none flex items-baseline gap-2">
                            SNE <span className="text-[14px] font-black text-yellow-400 uppercase tracking-widest not-italic -translate-y-1">Digital Board</span>
                        </h1>
                        <p className="text-[12px] font-bold text-blue-200 uppercase tracking-[0.4em] mt-1 ml-1">Criollitos de Nueva Esparta</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleFullScreen}
                    className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-xl group"
                    title="Pantalla Completa"
                >
                    {isFullScreen ? <Minimize size={20} className="group-hover:scale-110" /> : <Maximize size={20} className="group-hover:scale-110" />}
                </button>
                <button
                    onClick={onClearConfig}
                    className="p-3 bg-blue-600/20 backdrop-blur-md text-blue-200 rounded-2xl hover:bg-blue-600/40 transition-all border border-blue-400/20 shadow-xl group"
                    title="Consola de Administración"
                >
                    <Activity size={20} className="group-hover:scale-110" />
                </button>
                <button
                    onDoubleClick={onResetApp}
                    className="p-3 bg-red-600/20 backdrop-blur-md text-red-200 rounded-2xl hover:bg-red-600/40 transition-all border border-red-400/20 shadow-xl group"
                    title="Doble clic para Resetear Aplicación"
                >
                    <Trash2 size={20} className="group-hover:scale-110" />
                </button>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1 opacity-60">
                <div className="flex items-center gap-3"><Globe size={14} className="text-blue-300" /><span className="text-[10px] font-black uppercase text-white tracking-widest">www.criollosne.org</span></div>
                <div className="flex items-center gap-3"><AtSign size={14} className="text-blue-300" /><span className="text-[10px] font-black uppercase text-white tracking-widest">info@criollosne.org</span></div>
            </div>
        </div>
    );
};
