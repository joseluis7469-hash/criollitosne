
import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { actionButtonBase } from '../constants/styles';

interface DivisaDeleteConfirmProps {
    divisaName: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DivisaDeleteConfirm: React.FC<DivisaDeleteConfirmProps> = ({
    divisaName,
    onConfirm,
    onCancel
}) => {
    if (!divisaName) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[500] flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] p-10 border-[6px] border-red-600 w-auto max-w-md text-center transform animate-in zoom-in duration-200">
                <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100 shadow-inner overflow-hidden">
                    <TriangleAlert size={52} className="text-red-600 m-auto animate-pulse" />
                </div>
                <h3 className="text-red-600 font-black uppercase text-xl tracking-wider mb-2 italic">¡ALERTA MÁXIMA!</h3>
                <p className="text-gray-600 font-bold uppercase text-[11px] mb-10 px-4 leading-relaxed">
                    ¿DESEA ELIMINAR LA DIVISA: <span className="text-blue-900 font-black">{divisaName}</span>? ESTA ACCIÓN NO PUEDE DESHACERSE.
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
                        className={`${actionButtonBase} flex-1 bg-slate-100 text-slate-500 border-slate-300 !h-12`}
                    >
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    );
};
