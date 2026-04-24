
import React from 'react';
import { Shield, UserCog, Edit3, Trash2 } from 'lucide-react';

interface LeagueCardProps {
    league: string;
    imageUrl?: string;
    onSelect: (league: string) => void;
    onEditDirectiva: (league: string) => void;
    onEditLeague: (league: string) => void;
    onDelete: (league: string) => void;
}

export const LeagueCard = ({
    league,
    imageUrl,
    onSelect,
    onEditDirectiva,
    onEditLeague,
    onDelete
}: LeagueCardProps) => {
    return (
        <div className="group relative animate-in fade-in zoom-in duration-500">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                    onClick={(e) => { e.stopPropagation(); onEditDirectiva(league); }}
                    title="Gestionar Directiva"
                    className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-500 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                >
                    <UserCog size={12} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEditLeague(league); }}
                    className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-500 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                >
                    <Edit3 size={12} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(league); }}
                    className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-500 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                >
                    <Trash2 size={12} />
                </button>
            </div>
            <div
                onClick={() => onSelect(league)}
                className="cursor-pointer bg-slate-100/10 backdrop-blur-sm flex items-center justify-center relative rounded-t-[24px] overflow-hidden aspect-square"
            >
                {imageUrl ? (
                    <img src={imageUrl} className="w-full h-full object-contain p-2" alt={`${league} Logo`} />
                ) : (
                    <Shield size={44} className="text-white/30" />
                )}
            </div>
            <div className="p-2 bg-blue-900/10 rounded-b-[24px] relative flex items-center justify-center transition-colors">
                <h3 className="text-[9px] font-black uppercase text-white text-center truncate flex-1 px-4 tracking-wider">
                    {league}
                </h3>
            </div>
        </div>
    );
};
