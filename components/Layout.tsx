
import React from 'react';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { attemptFullScreen } from '../utils/helpers';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isFullScreen, setIsFullScreen } = useApp() as any; // Assuming these are in context later

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-blue-900 overflow-hidden relative">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-yellow-400/5 blur-[100px] rounded-full"></div>
      </div>

      <Header 
        onToggleFullScreen={() => {
          attemptFullScreen();
          setIsFullScreen?.(!isFullScreen);
        }}
        isFullScreen={isFullScreen}
        onClearConfig={() => {}} // TODO: implement
        onResetApp={() => {}} // TODO: implement
      />

      <main className="flex-grow flex flex-col relative z-10 overflow-hidden">
        {children}
      </main>

      <footer className="p-4 flex flex-col items-center gap-1 opacity-40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white">Digital Board System</span>
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white">Version Professional 2.0</span>
          </div>
          <p className="text-[6px] font-bold text-blue-200 uppercase tracking-widest text-center mt-0.5 opacity-60">© 2025 Criollitos Nueva Esparta • Dirección de Tecnología y Comunicaciones</p>
      </footer>
    </div>
  );
};
