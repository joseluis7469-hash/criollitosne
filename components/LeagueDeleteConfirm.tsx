
import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { actionButtonBase } from '../constants/styles';

interface LeagueDeleteConfirmProps {
    leagueName: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const LeagueDeleteConfirm: React.FC<LeagueDeleteConfirmProps> = ({
    leagueName,
    onConfirm,
    onCancel
}) => {
    if (!leagueName) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[500] flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] p-10 border-[6px] border-red-600 w-auto max-w-md text-center animate-in zoom-in duration-200">
                <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                    <TriangleAlert size={56} className="text-red-600 animate-bounce" />
                </div>
                <h3 className="text-red-600 font-black uppercase text-xl mb-2 tracking-widest">¿ELIMINAR LIGA?</h3>
                <p className="text-slate-600 font-bold uppercase text-[12px] mb-10 leading-relaxed px-4">
                    ESTA ACCIÓN ELIMINARÁ PERMANENTEMENTE A: <span className="text-red-700 font-black">{leagueName}</span>
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className={`${actionButtonBase} flex-1 bg-red-600 text-white border-red-800 hover:bg-red-500 !h-12`}
                    >
                        SÍ, ELIMINAR
                    </button>
                    <button
                        onClick={onCancel}
                        className={`${actionButtonBase} flex-1 bg-slate-700 text-white border-slate-900 !h-12`}
                    >
                        NO, CANCELAR
                    </button>
                </div>
            </div>
        </div>
    );
};
