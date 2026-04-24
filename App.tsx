import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Edit3,
  Trash2,
  Maximize,
  Minimize,
  UserCog,
  Shield,
  User,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  MapPin,
  IdCard,
  Camera,
  PlusCircle,
  Search,
  Plus,
  X,
  Users,
  FileBadge,
  Activity,
  Percent,
  ArrowLeft
} from 'lucide-react';
import { LeagueGrid } from './components/LeagueGrid';
import { DivisaFilter } from './components/DivisaFilter';
import { DivisaList } from './components/DivisaList';
import { StaffManagement } from './components/StaffManagement';
import { PlayersManagement } from './components/PlayersManagement';
import { RosterManagement } from './components/RosterManagement';
import { StaffForm } from './components/StaffForm';
import { RosterForm } from './components/RosterForm';
import { PlayerForm } from './components/PlayerForm';
import { DirectivaForm } from './components/DirectivaForm';
import { DivisaDirectivaForm } from './components/DivisaDirectivaForm';
import { LeagueDeleteConfirm } from './components/LeagueDeleteConfirm';
import { DivisaDeleteConfirm } from './components/DivisaDeleteConfirm';
import { LeagueForm } from './components/LeagueForm';
import { DivisaForm } from './components/DivisaForm';

import { CATEGORIES, LEAGUES as INITIAL_LEAGUES, NAV_OPTIONS, CATEGORY_ORDER } from './constants';
import { Player, Roster, LeagueDivisas, View, SubView, ContextMenuState, StaffMember, Directiva, DirectivaMember } from './types';

// IMPORTACIONES DE FIREBASE
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

const INITIAL_STATUS_REASONS = ['LESIÓN', 'REPOSO', 'VIAJE', 'TRANSFERENCIA', 'RETIRO'];

// Estilos globales de input para reuso
const inputClass = "p-1.5 bg-blue-200 border-2 border-blue-500 rounded-lg outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-300 font-bold uppercase text-[9px] transition-all shadow-sm w-full focus:bg-white";
const labelClass = "text-[8px] font-black uppercase text-slate-500 ml-1";

// Utilidad para asegurar que los objetos sean planos y serializables
const sanitizeData = (obj: any): any => {
  if (!obj) return obj;
  try {
    // Intentamos la serialización estándar
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error("Error detectado en estructura de datos:", e);
    // Si falla (estructura circular), creamos un objeto nuevo solo con valores primitivos
    if (Array.isArray(obj)) return [];
    if (typeof obj === 'object') {
      const safeObj: any = {};
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (typeof val !== 'function' && typeof val !== 'object') {
          safeObj[key] = val;
        } else if (val === null) {
          safeObj[key] = null;
        }
        // Ignoramos sub-objetos complejos si ya falló la serialización profunda
      });
      return safeObj;
    }
    return String(obj);
  }
};

// Utilidad para asegurar que la aplicación permanezca en pantalla completa
const attemptFullScreen = () => {
  if (typeof document === 'undefined') return;

  const doc = document.documentElement;
  if (!document.fullscreenElement) {
    const requestMethod = doc.requestFullscreen ||
      (doc as any).webkitRequestFullscreen ||
      (doc as any).mozRequestFullScreen ||
      (doc as any).msRequestFullscreen;

    if (requestMethod) {
      requestMethod.call(doc).catch(() => {
        // Silencioso: los navegadores bloquean esto sin interacción previa
      });
    }
  }
};

// Utilidad para comprimir imágenes antes de guardarlas en Firestore (Límite 1MB por documento)
const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      // Exportar como JPEG con calidad reducida para ahorrar espacio significativamente
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str); // Fallback en caso de error
  });
};

interface StaffWithMeta extends StaffMember {
  id: string;
  league: string;
  team: string;
  role: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('menu');
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedDivisa, setSelectedDivisa] = useState<string | null>(null);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [staff, setStaff] = useState<StaffWithMeta[]>([]);
  const [tecnicos, setTecnicos] = useState<StaffWithMeta[]>([]);
  const [leagueDivisas, setLeagueDivisas] = useState<LeagueDivisas>({});
  const [leagueImages, setLeagueImages] = useState<Record<string, string>>({});
  const [leagueDirectivas, setLeagueDirectivas] = useState<Record<string, Directiva>>({});
  const [divisaImages, setDivisaImages] = useState<Record<string, string>>({});
  const [leaguesList, setLeaguesList] = useState<string[]>(INITIAL_LEAGUES);
  const [statusReasons, setStatusReasons] = useState<string[]>(INITIAL_STATUS_REASONS);
  const [isDivisasListHovered, setIsDivisasListHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Estado para el Menú Contextual de Divisas
  const [divisaContextMenu, setDivisaContextMenu] = useState<{ x: number, y: number, divisa: string } | null>(null);

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isConfiguringLeague, setIsConfiguringLeague] = useState(false);
  const [isConfiguringDirectiva, setIsConfiguringDirectiva] = useState(false);
  const [isConfiguringDivisaDirectiva, setIsConfiguringDivisaDirectiva] = useState(false);
  const [selectedDivisaForDirectiva, setSelectedDivisaForDirectiva] = useState<string | null>(null);
  const [isDirectivaUpdate, setIsDirectivaUpdate] = useState(false);
  const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);
  const [showDirectivaPreview, setShowDirectivaPreview] = useState(false);
  const [deleteConfirmLeague, setDeleteConfirmLeague] = useState<string | null>(null);
  const [deleteConfirmDivisa, setDeleteConfirmDivisa] = useState<string | null>(null);
  const [tempDivisaName, setTempDivisaName] = useState('');
  const [tempDivisaImage, setTempDivisaImage] = useState('');
  const [tempLeagueName, setTempLeagueName] = useState('');
  const [tempLeagueImage, setTempLeagueImage] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayerFormOpen, setIsPlayerFormOpen] = useState(false);
  const [isRosterViewOpen, setIsRosterViewOpen] = useState(false);
  const [isRosterFormOpen, setIsRosterFormOpen] = useState(false);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [showNoStaffModal, setShowNoStaffModal] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [isConsultMode, setIsConsultMode] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [selectedRosterId, setSelectedRosterId] = useState<number | null>(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteType, setDeleteType] = useState<'player' | 'roster' | 'staff'>('player');

  const [mgmtSubView, setMgmtSubView] = useState<'players' | 'staff' | 'roster' | 'participation' | 'percentage'>('players');

  const emptyStaff: StaffMember = { firstName: '', lastName: '', dni: '', photo: '', birthDate: '', address: '', phone: '' };

  // Nuevo estado para navegación del menú divisas
  const [navFocus, setNavFocus] = useState<{ main: number; sub: number }>({ main: -1, sub: -1 });

  const initialDirectiva: Directiva = {
    presidente: { ...emptyStaff },
    vicepresidente: { ...emptyStaff },
    secGeneral: { ...emptyStaff },
    secFinanzas: { ...emptyStaff },
    delegado1: { ...emptyStaff },
    delegado2: { ...emptyStaff },
    delegado3: { ...emptyStaff },
  };

  const [directivaFormData, setDirectivaFormData] = useState<Directiva>(initialDirectiva);
  const [divisaDirectivaFormData, setDivisaDirectivaFormData] = useState<Directiva>(initialDirectiva);
  const [originalDirectivaData, setOriginalDirectivaData] = useState<Directiva | null>(null);
  const [originalDivisaDirectivaData, setOriginalDivisaDirectivaData] = useState<Directiva | null>(null);

  const initialFormState: Player = {
    id: 0,
    code: '',
    firstName: '',
    lastName: '',
    dni: '',
    birthState: 'NUEVA ESPARTA',
    birthCity: 'PORLAMAR',
    birthDate: '',
    age: 0,
    category: '',
    team: '',
    league: '',
    photo: '',
    bloodType: 'O Rh +',
    medicalCondition: '',
    status: 'INACTIVO',
    statusReason: '',
    birthCertificate: 'NO',
    birthCertificateImage: '',
    batting: 'DERECHA',
    throwing: 'DERECHA',
    positions: [],
    fatherName: '',
    motherName: '',
    representante: '',
    address: '',
    phone: ''
  };

  const initialRosterFormState: Roster = {
    id: 0,
    league: '',
    team: '',
    category: '',
    letter: '',
    playerIds: Array(20).fill(null),
    technicians: [{ ...emptyStaff }, { ...emptyStaff }],
    delegate: { ...emptyStaff },
    manager: { ...emptyStaff },
    season: "2025 - 2026",
  };

  const initialStaffFormState: StaffWithMeta = {
    id: '',
    firstName: '',
    lastName: '',
    dni: '',
    photo: '',
    birthDate: '',
    address: '',
    phone: '',
    league: '',
    team: '',
    role: 'TÉCNICO'
  };

  const [formData, setFormData] = useState<Player>(initialFormState);
  const [rosterFormData, setRosterFormData] = useState<Roster>(initialRosterFormState);
  const [staffFormData, setStaffFormData] = useState<StaffWithMeta>(initialStaffFormState);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const divisaImgInputRef = useRef<HTMLInputElement>(null);
  const leagueImgInputRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const playerFormRef = useRef<HTMLDivElement>(null);
  const directivaFormRef = useRef<HTMLDivElement>(null);
  const divisaDirectivaFormRef = useRef<HTMLDivElement>(null);
  const rosterFormRef = useRef<HTMLDivElement>(null);
  const staffFormRef = useRef<HTMLDivElement>(null);
  const staffPhotoEditorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let syncCount = 0;
    const totalSyncs = 6;
    const checkLoading = () => {
      syncCount++;
      if (syncCount >= totalSyncs) setIsInitialLoading(false);
    };

    const unsubPlayers = onSnapshot(collection(db, "players"), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => sanitizeData(doc.data()) as Player));
      checkLoading();
    }, (error) => {
      console.error("Error de Firebase (Players):", error);
      setFirebaseError(prev => prev ? `${prev} | Players: ${error.message}` : `Players: ${error.message}`);
      checkLoading();
    });

    const unsubRosters = onSnapshot(collection(db, "rosters"), (snapshot) => {
      setRosters(snapshot.docs.map(doc => sanitizeData(doc.data()) as Roster));
      checkLoading();
    }, (error) => {
      console.error("Error de Firebase (Rosters):", error);
      setFirebaseError(prev => prev ? `${prev} | Rosters: ${error.message}` : `Rosters: ${error.message}`);
      checkLoading();
    });

    const unsubStaff = onSnapshot(collection(db, "staff"), (snapshot) => {
      setStaff(snapshot.docs.map(doc => sanitizeData(doc.data()) as StaffWithMeta));
      checkLoading();
    }, (error) => {
      console.error("Error de Firebase (Staff):", error);
      setFirebaseError(prev => prev ? `${prev} | Staff: ${error.message}` : `Staff: ${error.message}`);
      checkLoading();
    });

    const unsubTecnicos = onSnapshot(collection(db, "tecnicos"), (snapshot) => {
      setTecnicos(snapshot.docs.map(doc => sanitizeData(doc.data()) as StaffWithMeta));
      checkLoading();
    }, (error) => {
      console.error("Error de Firebase (Tecnicos):", error);
      checkLoading();
    });

    const unsubLeagues = onSnapshot(collection(db, "leagues"), (snapshot) => {
      const divisasMap: LeagueDivisas = {};
      const imageMap: Record<string, string> = {};
      const directivasMap: Record<string, Directiva> = {};
      const divImagesMap: Record<string, string> = {};
      const names: string[] = [];
      snapshot.docs.forEach(docSnap => {
        const data = sanitizeData(docSnap.data());
        divisasMap[docSnap.id] = data.divisas || [];
        imageMap[docSnap.id] = data.image || '';
        directivasMap[docSnap.id] = data.directiva || null;
        if (data.divisaImages) Object.assign(divImagesMap, data.divisaImages);
        names.push(docSnap.id);
      });
      setLeaguesList(names.length > 0 ? names.sort() : INITIAL_LEAGUES);
      setLeagueDivisas(divisasMap);
      setLeagueImages(imageMap);
      setLeagueDirectivas(directivasMap);
      setDivisaImages(divImagesMap);
      checkLoading();
    }, (error) => {
      console.error("Error de Firebase (Leagues):", error);
      setFirebaseError(error.message);
      checkLoading();
    });

    const unsubConfig = onSnapshot(doc(db, "settings", "statusReasons"), (snapshot) => {
      if (snapshot.exists()) setStatusReasons(sanitizeData(snapshot.data()).reasons || INITIAL_STATUS_REASONS);
      checkLoading();
    }, (error) => {
      console.error("Error de Firebase (Config):", error);
      setFirebaseError(prev => prev ? `${prev} | Config: ${error.message}` : `Config: ${error.message}`);
      checkLoading();
    });

    const safetyTimeout = setTimeout(() => setIsInitialLoading(false), 3000);

    return () => {
      unsubPlayers(); unsubRosters(); unsubStaff(); unsubTecnicos(); unsubLeagues(); unsubConfig();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const handleSaveLeague = async () => {
    if (!tempLeagueName.trim()) return;
    let rawName = tempLeagueName.trim().toUpperCase();
    const leagueName = rawName.startsWith("LIGA ") ? rawName : `LIGA ${rawName}`;

    await setDoc(doc(db, "leagues", leagueName), sanitizeData({
      divisas: leagueDivisas[leagueName] || [],
      image: tempLeagueImage,
      directiva: leagueDirectivas[leagueName] || initialDirectiva
    }), { merge: true });

    setIsConfiguringLeague(false);
    setSelectedLeague(leagueName);
    setTempLeagueName('');
    setTempLeagueImage('');
  };

  const handleSaveDivisa = async () => {
    if (!tempDivisaName.trim()) return;
    let rawName = tempDivisaName.trim().toUpperCase();
    const finalName = rawName.startsWith("E.B.M. ") ? rawName : `E.B.M. ${rawName}`;

    const currentDivisas = leagueDivisas[selectedLeague!] || [];
    const currentList = currentDivisas.includes(finalName) ? [...currentDivisas] : [...currentDivisas, finalName];
    const currentDivImages = { ...divisaImages, [finalName]: tempDivisaImage };
    await setDoc(doc(db, "leagues", selectedLeague!), sanitizeData({ divisas: currentList, image: leagueImages[selectedLeague!] || '', divisaImages: currentDivImages }), { merge: true });
    setIsConfiguring(false);
    setTempDivisaName('');
    setTempDivisaImage('');
    handleOpenDivisaDirectiva(selectedLeague!, finalName);
  };

  const handleLeagueImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setTempLeagueImage(compressed);
        setTimeout(attemptFullScreen, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivisaImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setTempDivisaImage(compressed);
        setTimeout(attemptFullScreen, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  // Efecto para cerrar el menú contextual al hacer clic en cualquier parte
  useEffect(() => {
    const handleClickOutside = () => setDivisaContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleClickOutside, true);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleClickOutside, true);
    };
  }, []);

  // Efecto para navegación por teclado en el menú de divisas
  useEffect(() => {
    if (currentView !== 'divisas' || isConfiguring || isConfiguringLeague || isConfiguringDirectiva || isConfiguringDivisaDirectiva) return;

    const navStructure = [
      { id: 'divisas', subs: 4 },
      { id: 'calendario', subs: 3 },
      { id: 'juegos', subs: 3 },
      { id: 'posiciones', subs: 1 },
      { id: 'lideres', subs: 1 },
      { id: 'retornar', subs: 0 }
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
        e.preventDefault();
      } else {
        return;
      }

      setNavFocus(prev => {
        let { main, sub } = prev;

        if (main === -1) {
          if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'Enter'].includes(e.key)) {
            main = 0;
            if (e.key === 'ArrowDown') sub = 0;
            return { main, sub };
          }
          return prev;
        }

        if (e.key === 'ArrowRight') {
          main = (main + 1) % navStructure.length;
          sub = -1;
        } else if (e.key === 'ArrowLeft') {
          main = (main - 1 + navStructure.length) % navStructure.length;
          sub = -1;
        } else if (e.key === 'ArrowDown') {
          if (navStructure[main].subs > 0) {
            sub = (sub + 1) % navStructure[main].subs;
          }
        } else if (e.key === 'ArrowUp') {
          if (sub > 0) sub--;
          else sub = -1;
        } else if (e.key === 'Enter') {
          if (main === 0) {
            if (sub === 0 || sub === -1) setIsConfiguring(true);
            else if (sub === 1) handleViewDirectiva(selectedLeague!);
            else if (sub === 2) handleOpenDirectiva(selectedLeague!);
            else if (sub === 3) handleDeleteDirectiva();
          } else if (main === 5) {
            setCurrentView('menu');
          }
        }
        return { main, sub };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, isConfiguring, isConfiguringLeague, isConfiguringDirectiva, isConfiguringDivisaDirectiva, selectedLeague]);

  const allStaff = useMemo(() => {
    const combined = [...staff];
    tecnicos.forEach(t => {
      if (!combined.find(s => s.dni === t.dni)) combined.push(t);
    });
    return combined;
  }, [staff, tecnicos]);

  const currentDivisas = useMemo(() => {
    if (!selectedLeague) return [];

    // Divisas registradas explícitamente en la liga
    const registered = leagueDivisas[selectedLeague] || [];

    // Divisas descubiertas de jugadores y staff
    const discovered = new Set<string>(registered);
    players.forEach(p => {
      if ((p.league || '').trim().toUpperCase() === (selectedLeague || '').trim().toUpperCase() && p.team) discovered.add(p.team);
    });
    allStaff.forEach(s => {
      if ((s.league || '').trim().toUpperCase() === (selectedLeague || '').trim().toUpperCase() && s.team) discovered.add(s.team);
    });

    return Array.from(discovered).sort();
  }, [selectedLeague, leagueDivisas, players, allStaff]);

  const filteredPlayers = useMemo(() => {
    return players
      .filter(p =>
        (p.league || '').trim().toUpperCase() === (selectedLeague || '').trim().toUpperCase() &&
        (p.team || '').trim().toUpperCase() === (selectedDivisa || '').trim().toUpperCase() &&
        (p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.dni.includes(searchQuery) ||
          (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())))
      )
      .sort((a, b) => {
        const orderA = CATEGORY_ORDER[a.category] || 99;
        const orderB = CATEGORY_ORDER[b.category] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return (a.code || "").localeCompare(b.code || "");
      });
  }, [players, selectedLeague, selectedDivisa, searchQuery]);

  const filteredStaff = useMemo(() => {
    return allStaff.filter(s => (s.league || '').trim().toUpperCase() === (selectedLeague || '').trim().toUpperCase() && (s.team || '').trim().toUpperCase() === (selectedDivisa || '').trim().toUpperCase());
  }, [allStaff, selectedLeague, selectedDivisa]);

  const currentDivisaRosters = useMemo(() => {
    return rosters.filter(r => (r.team || '').trim().toUpperCase() === (selectedDivisa || '').trim().toUpperCase() && (r.league || '').trim().toUpperCase() === (selectedLeague || '').trim().toUpperCase());
  }, [rosters, selectedDivisa, selectedLeague]);

  const hasDirectivaChanged = useMemo(() => {
    if (!originalDirectivaData) return false;
    try {
      return JSON.stringify(directivaFormData) !== JSON.stringify(originalDirectivaData);
    } catch (e) {
      return true;
    }
  }, [directivaFormData, originalDirectivaData]);

  const hasDivisaDirectivaChanged = useMemo(() => {
    if (!originalDivisaDirectivaData) return false;
    try {
      return JSON.stringify(divisaDirectivaFormData) !== JSON.stringify(originalDivisaDirectivaData);
    } catch (e) {
      return true;
    }
  }, [divisaDirectivaFormData, originalDivisaDirectivaData]);

  const handleEnterKeyNavigation = (e: React.KeyboardEvent, customRef?: React.RefObject<HTMLDivElement | null>) => {
    if (e.key === 'Enter') {
      const form = customRef?.current || playerFormRef.current;
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

  const handleOpenPlayerForm = () => {
    setFormData({ ...initialFormState, code: selectedDivisa ? generateAutoCode(selectedDivisa) : '' });
    setIsPlayerFormOpen(true);
    setIsConsultMode(false);
    setValidationError(null);
    setTimeout(() => firstNameRef.current?.focus(), 100);
  };

  const handleEditPlayer = () => {
    if (selectedPlayerIds.length === 0) {
      setValidationError("DEBE SELECCIONAR UN REGISTRO...!");
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    const player = players.find(p => p.id === selectedPlayerIds[0]);
    if (player) { setFormData(sanitizeData(player)); setIsPlayerFormOpen(true); setIsConsultMode(false); setValidationError(null); }
  };

  const handleConsultPlayer = () => {
    if (selectedPlayerIds.length === 0) {
      setValidationError("DEBE SELECCIONAR UN REGISTRO...!");
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    const player = players.find(p => p.id === selectedPlayerIds[0]);
    if (player) { setFormData(sanitizeData(player)); setIsPlayerFormOpen(true); setIsConsultMode(true); setValidationError(null); }
  };

  const generateAutoCode = (divisa: string) => {
    const acronym = divisa.split(' ').filter(word => word.length > 0).map(word => word[0].toUpperCase()).join('');
    const divisaPlayersCodes = players.filter(p => p.team === divisa && p.code.startsWith(acronym)).map(p => parseInt(p.code.split('-').pop() || '0', 10));
    const nextNum = divisaPlayersCodes.length > 0 ? Math.max(...divisaPlayersCodes) + 1 : 1;
    return `${acronym}-${nextNum.toString().padStart(3, '0')}`;
  };

  const handleDNIChange = (val: string, setter?: (v: string) => void) => {
    let raw = val.toUpperCase().replace(/[^VE0-9]/g, '');
    if (raw.length === 0) {
      if (setter) setter(''); else setFormData(p => ({ ...p, dni: '' }));
      return;
    }
    let prefix = raw.charAt(0);
    if (!['V', 'E'].includes(prefix)) {
      prefix = 'V';
      raw = prefix + raw.replace(/[^0-9]/g, '');
    }
    let numbers = raw.slice(1).replace(/[^0-9]/g, '').slice(0, 9);
    let formatted = prefix;
    if (numbers.length > 0) {
      formatted += ' - ' + numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    if (setter) setter(formatted); else setFormData(p => ({ ...p, dni: formatted }));
  };

  const handlePhoneChange = (val: string) => {
    let raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length === 0) {
      setFormData(p => ({ ...p, phone: '' }));
      return;
    }
    let formatted = '';
    if (raw.length <= 4) formatted = raw;
    else if (raw.length <= 7) formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    else if (raw.length <= 9) formatted = `${raw.slice(0, 4)}-${raw.slice(4, 7)}.${raw.slice(7)}`;
    else formatted = `${raw.slice(0, 4)}-${raw.slice(4, 7)}.${raw.slice(7, 9)}.${raw.slice(9)}`;
    setFormData(p => ({ ...p, phone: formatted }));
  };

  const handleSavePlayer = async () => {
    if (!hasUserInput || isConsultMode) return;
    const error = validateForm();
    if (error) { setValidationError(error); setTimeout(() => setValidationError(null), 4000); return; }
    const cleanPlayerData: Player = {
      id: formData.id || Date.now(),
      code: formData.code || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      dni: formData.dni || '',
      birthState: formData.birthState || 'NUEVA ESPARTA',
      birthCity: formData.birthCity || 'PORLAMAR',
      birthDate: formData.birthDate || '',
      age: formData.age || 0,
      category: formData.category || '',
      team: selectedDivisa || '',
      league: selectedLeague || '',
      photo: formData.photo || '',
      bloodType: formData.bloodType || 'O Rh +',
      medicalCondition: formData.medicalCondition || '',
      status: 'INACTIVO',
      statusReason: '',
      birthCertificate: formData.birthCertificate || 'NO',
      birthCertificateImage: formData.birthCertificateImage || '',
      batting: formData.batting || 'DERECHA',
      throwing: formData.throwing || 'DERECHA',
      positions: [...(formData.positions || [])],
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      representante: formData.representante || '',
      address: formData.address || '',
      phone: formData.phone || ''
    };
    try {
      await setDoc(doc(db, "players", cleanPlayerData.id.toString()), sanitizeData(cleanPlayerData));
      const newCode = selectedDivisa ? generateAutoCode(selectedDivisa) : '';
      setFormData({ ...initialFormState, code: newCode });
      setShowSaveSuccess(true);
      setTimeout(() => { setShowSaveSuccess(false); firstNameRef.current?.focus(); }, 3000);
    } catch (e) {
      console.error("Error al guardar jugador:", e);
      setValidationError("ERROR AL GUARDAR EN LA BASE DE DATOS.");
    }
  };

  const validateForm = () => {
    const fieldNames: Record<string, string> = { firstName: 'NOMBRES', lastName: 'APELLIDOS', birthState: 'ESTADO DE NACIMIENTO', birthCity: 'CIUDAD DE NACIMIENTO', birthDate: 'FECHA DE NACIMIENTO', fatherName: 'NOMBRE DEL PADRE', motherName: 'NOMBRE DE LA MADRE', representante: 'NOMBRE DEL REPRESENTANTE', phone: 'TELÉFONO DE CONTACTO' };
    const required = ['firstName', 'lastName', 'birthState', 'birthCity', 'birthDate', 'fatherName', 'motherName', 'representante', 'phone'];
    for (const key of required) { if (!formData[key as keyof Player] || formData[key as keyof Player]?.toString().trim() === '') return `EL CAMPO "${fieldNames[key]}" ES OBLIGATORIO.`; }
    if (formData.age >= 10 && (!formData.dni || formData.dni.trim() === '')) return "EL N° DE CÉDULA ES OBLIGATORIO PARA JUGADORES DE 10 AÑOS O MÁS.";
    const isDuplicate = players.some(p => p.id !== formData.id && p.firstName.trim().toUpperCase() === formData.firstName.trim().toUpperCase() && p.lastName.trim().toUpperCase() === formData.lastName.trim().toUpperCase());
    if (isDuplicate) return "YA EXISTE UN JUGADOR REGISTRADO CON ESTOS NOMBRES Y APELLIDOS.";
    return null;
  };

  const handleDeletePlayer = () => {
    if (selectedPlayerIds.length === 0) { setValidationError("DEBE SELECCIONAR UN REGISTRO...!"); setTimeout(() => setValidationError(null), 3000); return; }
    setDeleteType('player');
    setShowDeleteConfirmModal(true);
  };

  const handleSaveRoster = async () => {
    if (!rosterFormData.category) { setValidationError("DEBE SELECCIONAR UNA CATEGORÍA...!"); setTimeout(() => setValidationError(null), 3000); return; }
    let assignedLetter = rosterFormData.letter;
    const existingInCategory = rosters.filter(r => r.team === selectedDivisa && r.league === selectedLeague && r.category === rosterFormData.category && r.id !== rosterFormData.id);
    if (existingInCategory.length > 0 && !assignedLetter) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      assignedLetter = alphabet[existingInCategory.length] || 'Z';
    }
    const isDuplicateRoster = rosters.some(r => r.id !== rosterFormData.id && r.league === selectedLeague && r.team === selectedDivisa && r.category === rosterFormData.category && r.letter === (assignedLetter || ''));
    if (isDuplicateRoster) {
      setValidationError(`YA EXISTE UN ROSTER PARA LA CATEGORÍA ${rosterFormData.category} ${assignedLetter ? 'LETRA ' + assignedLetter : ''}`);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    const cleanRosterData = {
      id: rosterFormData.id || Date.now(),
      league: selectedLeague || '',
      team: selectedDivisa || '',
      category: rosterFormData.category || '',
      letter: assignedLetter || '',
      playerIds: [...(rosterFormData.playerIds || [])],
      manager: { ...rosterFormData.manager },
      technicians: rosterFormData.technicians.map(t => ({ ...t })),
      delegate: { ...rosterFormData.delegate },
      season: rosterFormData.season || "2025 - 2026"
    };
    try {
      await setDoc(doc(db, "rosters", cleanRosterData.id.toString()), sanitizeData(cleanRosterData));
      const activePlayerIds = (rosterFormData.playerIds || []).filter(pId => pId !== null);
      if (activePlayerIds.length > 0) {
        await Promise.all(activePlayerIds.map(pId => {
          const playerRef = doc(db, "players", pId.toString());
          return setDoc(playerRef, { status: 'ACTIVO' }, { merge: true });
        }));
      }
      setShowSaveSuccess(true);
      setTimeout(() => { setShowSaveSuccess(false); setIsRosterFormOpen(false); }, 3000);
    } catch (e) {
      console.error("Error al guardar roster:", e);
      setValidationError("ERROR AL GUARDAR EL ROSTER.");
    }
  };

  const handleDeleteRoster = () => {
    if (!selectedRosterId) { setValidationError("DEBE SELECCIONAR UN ROSTER...!"); setTimeout(() => setValidationError(null), 3000); return; }
    setDeleteType('roster');
    setShowDeleteConfirmModal(true);
  };

  const handleSaveStaff = async () => {
    if (!staffFormData.firstName.trim() || !staffFormData.lastName.trim()) {
      setValidationError("NOMBRES Y APELLIDOS SON OBLIGATORIOS.");
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    const staffId = staffFormData.id || Date.now().toString();
    const cleanStaffData = {
      ...staffFormData,
      id: staffId,
      league: selectedLeague || '',
      team: selectedDivisa || '',
    };
    try {
      await setDoc(doc(db, "staff", staffId), sanitizeData(cleanStaffData));
      setStaffFormData(initialStaffFormState);
      setIsStaffFormOpen(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Error al guardar técnico:", e);
      setValidationError("ERROR AL GUARDAR EL TÉCNICO.");
    }
  };

  const handleDeleteStaff = () => {
    if (selectedStaffIds.length === 0) { setValidationError("DEBE SELECCIONAR UN REGISTRO...!"); setTimeout(() => setValidationError(null), 3000); return; }
    setDeleteType('staff');
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAction = async () => {
    try {
      if (deleteType === 'player') {
        for (const id of selectedPlayerIds) await deleteDoc(doc(db, "players", id.toString()));
        setSelectedPlayerIds([]);
      } else if (deleteType === 'staff') {
        for (const id of selectedStaffIds) await deleteDoc(doc(db, "staff", id));
        setSelectedStaffIds([]);
      } else {
        if (selectedRosterId) await deleteDoc(doc(db, "rosters", selectedRosterId.toString()));
        setSelectedRosterId(null);
      }
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
    setShowDeleteConfirmModal(false);
  };

  const handleBirthDateChange = (date: string) => {
    if (!date) return;
    const birth = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    let category = 'NO CALIFICA';
    if (age >= 4 && age <= 5) category = 'PREPARATORIA I NIVEL';
    else if (age >= 6 && age <= 7) category = 'PREPARATORIA II NIVEL';
    else if (age >= 8 && age <= 9) category = 'PREINFANTIL';
    else if (age >= 10 && age <= 11) category = 'INFANTIL';
    else if (age >= 12 && age <= 13) category = 'PREJUNIOR';
    else if (age >= 14 && age <= 15) category = 'JUNIOR';
    else if (age >= 16 && age <= 17) category = 'JUVENIL';
    setFormData(prev => ({ ...prev, birthDate: date, age, category }));
  };

  const handleCategoryChange = (category: string) => {
    if (isConsultMode) return;
    let nextLetter = '';
    if (category) {
      const existingInCategory = rosters.filter(r => r.team === selectedDivisa && r.league === selectedLeague && r.category === category && r.id !== rosterFormData.id);
      if (existingInCategory.length > 0) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        nextLetter = alphabet[existingInCategory.length] || 'Z';
      }
    }
    setRosterFormData(p => ({ ...p, category, letter: nextLetter }));
  };

  const hasUserInput = useMemo(() => {
    const watchedFields = ['firstName', 'lastName', 'dni', 'fatherName', 'motherName', 'representante', 'address', 'phone', 'medicalCondition'];
    return watchedFields.some(key => formData[key as keyof Player]?.toString().trim().length > 0);
  }, [formData]);

  const hasRosterInput = useMemo(() => {
    if (isConsultMode) return false;
    if (rosterFormData.category) return true;
    const staff = [rosterFormData.manager, rosterFormData.delegate, ...rosterFormData.technicians];
    const hasStaffText = staff.some(s => s.firstName.trim().length > 0 || s.lastName.trim().length > 0 || s.dni.trim().length > 0 || (s.photo && s.photo.length > 0));
    const hasPlayers = rosterFormData.playerIds.some(id => id !== null);
    return hasStaffText || hasPlayers;
  }, [rosterFormData, isConsultMode]);

  const hasStaffInput = useMemo(() => {
    return staffFormData.firstName.trim().length > 0 || staffFormData.lastName.trim().length > 0 || staffFormData.dni.trim().length > 0 || (staffFormData.photo && staffFormData.photo.length > 0);
  }, [staffFormData]);

  // Clase BASE renovada para botones de acción con aspecto 3D y ancho dinámico según contenido
  const actionButtonBase = "h-[46px] px-6 justify-center rounded-2xl font-black uppercase text-[10px] tracking-[0.1em] transition-all flex items-center gap-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none border-b-[5px]";

  const handleOpenDirectiva = async (league: string) => {
    setSelectedLeague(league);
    setIsDirectivaUpdate(true);
    setIsConsultMode(false);
    const docRef = doc(db, "leagues", league);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().directiva) {
      const data = sanitizeData(snap.data().directiva);
      setDirectivaFormData(data);
      setOriginalDirectivaData(data);
    } else {
      setDirectivaFormData(initialDirectiva);
      setOriginalDirectivaData(initialDirectiva);
    }
    setIsConfiguringDirectiva(true);
  };

  const handleViewDirectiva = async (league: string) => {
    setSelectedLeague(league);
    setIsDirectivaUpdate(false);
    setIsConsultMode(true);
    const docRef = doc(db, "leagues", league);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().directiva) {
      const data = sanitizeData(snap.data().directiva);
      setDirectivaFormData(data);
      setOriginalDirectivaData(data);
    } else {
      setDirectivaFormData(initialDirectiva);
      setOriginalDirectivaData(initialDirectiva);
    }
    setIsConfiguringDirectiva(true);
  };

  const handleDeleteDirectiva = async () => {
    if (!selectedLeague) return;
    const confirmed = window.confirm("¿ESTÁ TOTALMENTE SEGURO QUE DESEA ELIMINAR LA DIRECTIVA DE ESTA LIGA? ESTA ACCIÓN ES IRREVERSIBLE.");
    if (!confirmed) return;
    try {
      await setDoc(doc(db, "leagues", selectedLeague), { directiva: initialDirectiva }, { merge: true });
      setDirectivaFormData(initialDirectiva);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
    } catch (e) {
      console.error("Error al eliminar directiva:", e);
      setValidationError("ERROR AL ELIMINAR LA DIRECTIVA.");
    }
  };

  const handleOpenDivisaDirectiva = async (league: string, divisa: string) => {
    setSelectedLeague(league);
    setSelectedDivisaForDirectiva(divisa);
    setIsConsultMode(false);
    const docRef = doc(db, "leagues", league);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().divisaDirectivas && snap.data().divisaDirectivas[divisa]) {
      const data = sanitizeData(snap.data().divisaDirectivas[divisa]);
      setDivisaDirectivaFormData(data);
      setOriginalDivisaDirectivaData(data);
    } else {
      setDivisaDirectivaFormData(initialDirectiva);
      setOriginalDivisaDirectivaData(initialDirectiva);
    }
    setIsConfiguringDivisaDirectiva(true);
  };

  const handleViewDivisaDirectiva = async (league: string, divisa: string) => {
    setSelectedLeague(league);
    setSelectedDivisaForDirectiva(divisa);
    setIsConsultMode(true);
    const docRef = doc(db, "leagues", league);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().divisaDirectivas && snap.data().divisaDirectivas[divisa]) {
      const data = sanitizeData(snap.data().divisaDirectivas[divisa]);
      setDivisaDirectivaFormData(data);
      setOriginalDivisaDirectivaData(data);
    } else {
      setDivisaDirectivaFormData(initialDirectiva);
      setOriginalDivisaDirectivaData(initialDirectiva);
    }
    setIsConfiguringDivisaDirectiva(true);
  };

  const handleSaveDirectiva = async () => {
    if (!selectedLeague) return;
    try {
      await setDoc(doc(db, "leagues", selectedLeague), { directiva: sanitizeData(directivaFormData) }, { merge: true });
      setIsConfiguringDirectiva(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Error al guardar directiva:", e);
      setValidationError("ERROR AL GUARDAR LA DIRECTIVA.");
    }
  };

  const handleSaveDivisaDirectiva = async () => {
    if (!selectedLeague || !selectedDivisaForDirectiva) return;
    try {
      const docRef = doc(db, "leagues", selectedLeague);
      const snap = await getDoc(docRef);
      const currentDirectivas = snap.exists() ? (sanitizeData(snap.data().divisaDirectivas) || {}) : {};
      const updatedDirectivas = { ...currentDirectivas, [selectedDivisaForDirectiva]: divisaDirectivaFormData };
      await setDoc(docRef, { divisaDirectivas: sanitizeData(updatedDirectivas) }, { merge: true });
      setIsConfiguringDivisaDirectiva(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Error al guardar directiva de divisa:", e);
      setValidationError("ERROR AL GUARDAR LA DIRECTIVA DE LA DIVISA.");
    }
  };

  const handlePrintDirectiva = () => {
    window.print();
  };

  const togglePosition = (pos: string) => {
    if (isConsultMode) return;
    setFormData(prev => {
      let newPositions = [...prev.positions];
      if (pos === 'TODAS') {
        if (newPositions.includes('TODAS')) {
          newPositions = [];
        } else {
          newPositions = ['RECECTOR', 'LANZADOR', 'INFILDER', 'OUTFILDER', 'TODAS'];
        }
      } else {
        if (newPositions.includes(pos)) {
          newPositions = newPositions.filter(p => p !== pos && p !== 'TODAS');
        } else {
          newPositions.push(pos);
          const individuals = ['RECECTOR', 'LANZADOR', 'INFILDER', 'OUTFILDER'];
          if (individuals.every(i => newPositions.includes(i))) {
            newPositions.push('TODAS');
          }
        }
      }
      return { ...prev, positions: newPositions };
    });
  };

  const handleDivisaContextMenu = (e: React.MouseEvent, divisa: string) => {
    e.preventDefault();
    setDivisaContextMenu({
      x: e.clientX,
      y: e.clientY,
      divisa
    });
  };

  const handleStaffPhoneFormat = (val: string) => {
    let raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length === 0) return '';
    let formatted = '';
    if (raw.length <= 4) formatted = raw;
    else if (raw.length <= 7) formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    else if (raw.length <= 9) formatted = `${raw.slice(0, 4)}-${raw.slice(4, 7)}.${raw.slice(7)}`;
    else formatted = `${raw.slice(0, 4)}-${raw.slice(4, 7)}.${raw.slice(7, 9)}.${raw.slice(9)}`;
    return formatted;
  };

  const handleStaffDNIFormat = (val: string) => {
    let raw = val.toUpperCase().replace(/[^VE0-9]/g, '');
    if (raw.length === 0) return '';
    let prefix = raw.charAt(0);
    if (!['V', 'E'].includes(prefix)) {
      prefix = 'V';
      raw = prefix + raw.replace(/[^0-9]/g, '');
    }
    let numbers = raw.slice(1).replace(/[^0-9]/g, '').slice(0, 9);
    let formatted = prefix;
    if (numbers.length > 0) {
      formatted += ' - ' + numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return formatted;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Efecto para activar pantalla completa al iniciar la aplicación
  useEffect(() => {
    // Intentar al montar
    attemptFullScreen();

    // Mantener activo en cualquier interacción para asegurar que se mantenga
    const handleInteraction = () => {
      attemptFullScreen();
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('focus', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('focus', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const isAnyFormOpen = isPlayerFormOpen || isStaffFormOpen || isRosterFormOpen;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <div className="relative"><div className="w-24 h-24 border-8 border-blue-900/30 border-t-yellow-400 rounded-full animate-spin"></div><Shield size={40} className="absolute inset-0 m-auto text-yellow-400 animate-pulse" /></div>
        <div className="text-center">
          <h2 className="text-white font-black uppercase tracking-[0.4em] text-xl mb-2">Cargando Sistema</h2>
          <p className="text-blue-300 font-bold uppercase text-[10px] tracking-widest animate-pulse">Sincronizando con Base de Datos...</p>
          {firebaseError && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-xl max-w-xs">
              <p className="text-red-200 font-bold uppercase text-[8px] leading-tight">Error de Conexión: {firebaseError}</p>
              <p className="text-red-400 text-[7px] mt-1 font-medium">Verifique su conexión a internet o la configuración de Firebase.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col select-none overflow-x-hidden print:bg-white">
      {/* Estructura para Impresión de Directiva */}
      <div className="hidden print:block p-10 font-serif">
        <div className="text-center mb-10 border-b-4 border-blue-900 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest text-blue-900">JUNTA DIRECTIVA OFICIAL</h1>
          <h2 className="text-xl font-bold uppercase text-red-600 tracking-wider">{selectedLeague}</h2>
          <p className="text-sm font-bold uppercase text-slate-500 mt-2 italic">CORPORACIÓN CRIOLLITOS DE VENEZUELA - SECCIONAL NUEVA ESPARTA</p>
        </div>
        <div className="grid grid-cols-2 gap-y-12 gap-x-8">
          {[
            { cargo: "Presidente(a)", data: directivaFormData.presidente },
            { cargo: "Vicepresidente(a)", data: directivaFormData.vicepresidente },
            { cargo: "Secretario(a) General", data: directivaFormData.secGeneral },
            { cargo: "Secretario(a) de Finanzas", data: directivaFormData.secFinanzas },
            { cargo: "1er. Delegado(a)", data: directivaFormData.delegado1 },
            { cargo: "2do. Delegado(a)", data: directivaFormData.delegado2 },
            { cargo: "3er. Delegado(a)", data: directivaFormData.delegado3 }
          ].map((m, idx) => (
            <div key={idx} className="flex gap-4 border-l-4 border-blue-900 pl-4">
              <div className="w-24 h-28 bg-slate-100 border border-slate-300 rounded overflow-hidden shadow-sm shrink-0">
                {m.data.photo ? <img src={m.data.photo} className="w-full h-full object-cover" alt="Member" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={40} /></div>}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-1">{m.cargo}</span>
                <span className="text-sm font-black uppercase text-blue-900 leading-tight">{m.data.firstName} {m.data.lastName}</span>
                <span className="text-[11px] font-bold text-slate-600 mt-1 italic">C.I: {m.data.dni || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 flex justify-around items-center gap-10">
          <div className="w-64 border-t-2 border-black text-center pt-2 flex flex-col">
            <span className="text-[9px] font-black uppercase">FIRMA PRESIDENTE(A)</span>
            <span className="text-[8px] italic">{selectedLeague}</span>
          </div>
          <div className="w-40 h-40 border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase italic">Sello Húmedo de la Liga</div>
          <div className="w-64 border-t-2 border-black text-center pt-2 flex flex-col">
            <span className="text-[9px] font-black uppercase">FIRMA SECRETARIO(A) GENERAL</span>
            <span className="text-[8px] italic">{selectedLeague}</span>
          </div>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
          <div className="bg-green-600 text-white px-10 py-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-5 border-4 border-white transform scale-110"><CheckCircle size={48} className="animate-bounce" /><span className="font-black uppercase tracking-widest text-lg">LOS DATOS FUERON GUARDADOS EXITOSAMENTE.....!</span></div>
        </div>
      )}
      {showDeleteSuccess && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
          <div className="bg-red-600 text-white px-10 py-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-5 border-4 border-white transform scale-110"><Trash2 size={48} className="animate-bounce" /><span className="font-black uppercase tracking-widest text-lg">EL REGISTRO FUE ELIMINADO CON ÉXITO.....!</span></div>
        </div>
      )}
      {validationError && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none animate-in zoom-in duration-200"><div className="bg-red-600 text-white px-10 py-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-5 border-4 border-white max-w-lg text-center transform scale-110"><AlertTriangle size={48} className="shrink-0 animate-pulse" /><span className="font-black uppercase tracking-widest text-lg">{validationError}</span></div></div>
      )}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl p-8 border-4 border-red-600 w-full max-w-sm text-center transform animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-red-100 shadow-inner overflow-hidden"><TriangleAlert size={42} className="text-red-600 m-auto" /></div>
            <h3 className="text-red-600 font-black uppercase text-[14px] tracking-wider mb-1 italic">¡ALERTA DE SEGURIDAD!</h3>
            <p className="text-slate-600 font-bold uppercase text-[10px] mb-8 leading-relaxed px-2">¿ESTÁ TOTALMENTE SEGURO QUE DESEA ELIMINAR EL REGISTRO SELECCIONADO? ESTA ACCIÓN ES IRREVERSIBLE.</p>
            <div className="flex gap-4">
              <button onClick={confirmDeleteAction} className="flex-1 bg-red-600 text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl border-b-[6px] border-red-800 active:translate-y-1 active:border-b-0 transition-all">SÍ, ELIMINAR</button>
              <button onClick={() => setShowDeleteConfirmModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 border-b-[6px] border-slate-300 active:translate-y-1 active:border-b-0 transition-all">CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal No Técnicos Registrados */}
      {showNoStaffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl p-8 border-4 border-blue-900 w-full max-w-sm text-center transform animate-in zoom-in-95 duration-200">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-blue-100 shadow-inner overflow-hidden"><AlertCircle size={42} className="text-blue-900 m-auto" /></div>
            <h3 className="text-blue-900 font-black uppercase text-[14px] tracking-wider mb-1 italic">¡SIN REGISTROS!</h3>
            <p className="text-slate-600 font-bold uppercase text-[10px] mb-8 leading-relaxed px-2">NO EXISTEN TECNICOS REGISTRADOS, DESEAS REGISTRAR NUEVOS TECNICOS?</p>
            <div className="flex gap-4">
              <button
                onClick={() => { setShowNoStaffModal(false); setStaffFormData(initialStaffFormState); setIsStaffFormOpen(true); }}
                className="flex-1 bg-blue-900 text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl border-b-[6px] border-blue-950 active:translate-y-1 active:border-b-0 transition-all"
              >
                SÍ, REGISTRAR
              </button>
              <button
                onClick={() => { setShowNoStaffModal(false); setCurrentView('divisas'); }}
                className="flex-1 bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 border-b-[6px] border-slate-300 active:translate-y-1 active:border-b-0 transition-all"
              >
                NO, REGRESAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menú Contextual Dinámico para Divisas */}
      {divisaContextMenu && (
        <div
          className="fixed z-[1000] w-52 bg-blue-950/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] py-2 overflow-hidden animate-in fade-in zoom-in duration-150"
          style={{ top: divisaContextMenu.y, left: divisaContextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 border-b border-white/10 mb-1">
            <div className="text-[7px] font-black text-yellow-400 uppercase tracking-widest leading-none">GESTIONAR DIVISA</div>
            <div className="text-[10px] font-black text-white uppercase truncate mt-0.5">{divisaContextMenu.divisa}</div>
          </div>
          <button
            onClick={() => { handleOpenDivisaDirectiva(selectedLeague!, divisaContextMenu.divisa); setDivisaContextMenu(null); }}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/10 transition-colors group"
          >
            <Edit3 size={14} className="text-blue-400 group-hover:text-yellow-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest group-hover:text-yellow-400">Editar Datos</span>
          </button>
          <div className="h-px bg-white/10 my-1"></div>
          <button
            onClick={() => { handleViewDivisaDirectiva(selectedLeague!, divisaContextMenu.divisa); setDivisaContextMenu(null); }}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/10 transition-colors group"
          >
            <UserCog size={14} className="text-emerald-400 group-hover:text-yellow-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest group-hover:text-yellow-400">Junta Directiva</span>
          </button>
          <div className="h-px bg-white/10 my-1"></div>
          <button
            onClick={() => { setDeleteConfirmDivisa(divisaContextMenu.divisa); setDivisaContextMenu(null); }}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-600/20 transition-colors group"
          >
            <Trash2 size={14} className="text-red-500 group-hover:text-red-400" />
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest group-hover:text-red-400">Eliminar Divisa</span>
          </button>
        </div>
      )}

      <header className="bg-blue-900 text-white py-2 px-6 shadow-2xl text-center border-b-4 border-red-600 relative overflow-hidden print:hidden shrink-0 flex items-center justify-between">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
        <div className="w-10"></div> {/* Spacer for symmetry */}
        <div className="flex-1">
          <h1 className="text-lg md:text-xl font-black tracking-widest uppercase leading-tight">BEISBOL MENOR STATS</h1>
          <p className="text-yellow-400 text-[10px] font-bold tracking-[0.2em] uppercase italic leading-none">Seccional Nueva Esparta {players.length > 0 && `| ${players.length} JUGADORES`}</p>
        </div>
        <button
          onClick={toggleFullScreen}
          className="bg-blue-950 text-white p-2.5 rounded-xl border-b-4 border-blue-950 active:translate-y-1 active:border-b-0 hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2 group"
          title={isFullScreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
        >
          {isFullScreen ? <Minimize size={18} className="text-yellow-400" /> : <Maximize size={18} className="text-yellow-400" />}
          <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">{isFullScreen ? 'SALIR' : 'PANTALLA COMPLETA'}</span>
        </button>
      </header>

      <main className="flex-grow max-w-[1600px] mx-auto w-full p-2 md:p-3 overflow-hidden flex flex-col print:hidden">
        {currentView === 'menu' && (
          <LeagueGrid
            leaguesList={leaguesList}
            leagueImages={leagueImages}
            leagueDivisas={leagueDivisas}
            hoveredLeague={hoveredLeague}
            setHoveredLeague={setHoveredLeague}
            onSelectLeague={(league) => { setSelectedLeague(league); setCurrentView('divisas'); }}
            onRegisterLeague={() => { setTempLeagueName(''); setTempLeagueImage(''); setIsConfiguringLeague(true); }}
            onEditLeague={(league) => { setTempLeagueName(league); setTempLeagueImage(leagueImages[league] || ''); setIsConfiguringLeague(true); }}
            onDeleteLeague={setDeleteConfirmLeague}
            onManageDirectiva={handleOpenDirectiva}
          />
        )}


        {currentView === 'divisas' && (
          <div className="animate-fade-in w-full mx-auto max-w-[1400px] flex-grow flex flex-col">
            <DivisaFilter
              selectedLeague={selectedLeague}
              leagueDirectivas={leagueDirectivas}
              onBack={() => setCurrentView('menu')}
              onRegisterDivisa={() => setIsConfiguring(true)}
              navFocus={navFocus}
              setNavFocus={setNavFocus}
              onViewDirectiva={() => handleViewDirectiva(selectedLeague!)}
              onEditDirectiva={() => handleOpenDirectiva(selectedLeague!)}
              onDeleteDirectiva={handleDeleteDirectiva}
            />

            <DivisaList
              currentDivisas={currentDivisas}
              divisaImages={divisaImages}
              isDivisasListHovered={isDivisasListHovered}
              setIsDivisasListHovered={setIsDivisasListHovered}
              divisaContextMenu={divisaContextMenu}
              onSelectDivisa={(divisa) => { setSelectedDivisa(divisa); setCurrentView('players_mgmt'); setMgmtSubView('players'); }}
              onContextMenu={handleDivisaContextMenu}
              onRegisterDivisa={() => setIsConfiguring(true)}
            />
          </div>
        )}


        {currentView === 'players_mgmt' && (
          <div className={`animate-fade-in w-full mx-auto ${isRosterFormOpen ? 'max-w-[1400px]' : (isStaffFormOpen || (mgmtSubView === 'staff' && !isPlayerFormOpen) ? 'max-w-fit' : 'max-w-[950px]')} ${isStaffFormOpen ? 'bg-transparent border-none shadow-none' : 'bg-white border-4 border-blue-900 rounded-[24px] shadow-2xl'} overflow-hidden flex flex-col mb-1 h-[calc(100vh-120px)] transition-all duration-500`}>
            {!isAnyFormOpen && (
              <>
                <div className="bg-blue-950 p-1.5 border-b-4 border-red-600 flex justify-between items-center text-white shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative z-[80]">
                  <div className="flex items-center gap-2.5">{selectedDivisa && divisaImages[selectedDivisa] && <img src={divisaImages[selectedDivisa]} className="w-8 h-8 object-contain bg-white rounded-lg p-0.5 border-2 border-yellow-400 shadow-lg" alt="" />}<div className="flex flex-col gap-0"><h2 className="font-black uppercase truncate italic text-[16px] leading-none tracking-tighter">{selectedDivisa}</h2><h3 className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest opacity-90 leading-none">{selectedLeague}</h3></div></div>
                  <button onClick={() => { setCurrentView('divisas'); setSelectedPlayerIds([]); }} className="bg-red-600 p-1.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shrink-0 border-b-4 border-red-800 active:translate-y-1 active:border-b-0"><X size={16} /></button>
                </div>
                <div className="bg-white/50 backdrop-blur-md border-b border-blue-100 py-3 px-4 shrink-0 overflow-x-auto custom-scrollbar shadow-sm">
                  <div className="flex items-center justify-center gap-3 min-w-max px-2">
                    {[
                      { id: 'players', label: 'Jugadores', icon: Users, color: 'text-blue-600', activeBg: 'bg-blue-600 text-white shadow-blue-200' },
                      { id: 'staff', label: 'Técnicos', icon: UserCog, color: 'text-emerald-600', activeBg: 'bg-emerald-600 text-white shadow-emerald-200' },
                      { id: 'roster', label: 'Roster', icon: FileBadge, color: 'text-amber-600', activeBg: 'bg-amber-600 text-white shadow-amber-200' },
                      { id: 'participation', label: 'Participación', icon: Activity, color: 'text-red-600', activeBg: 'bg-red-600 text-white shadow-red-200' },
                      { id: 'percentage', label: 'Porcentaje', icon: Percent, color: 'text-violet-600', activeBg: 'bg-violet-600 text-white shadow-violet-200' },
                      { id: 'return', label: 'Regresar', icon: ArrowLeft, color: 'text-slate-600', activeBg: 'bg-slate-800 text-white shadow-slate-200' },
                    ].map((item) => {
                      const isActive = (mgmtSubView === item.id && !isRosterFormOpen && !isPlayerFormOpen && !isStaffFormOpen) || (item.id === 'roster' && isRosterViewOpen && !isRosterFormOpen);
                      return (
                        <button key={item.id} onClick={() => {
                          if (item.id === 'return') { setCurrentView('divisas'); setSelectedPlayerIds([]); }
                          else if (item.id === 'roster') { setMgmtSubView('roster'); setIsRosterViewOpen(true); }
                          else if (item.id === 'staff') { if (filteredStaff.length === 0) setShowNoStaffModal(true); else { setMgmtSubView('staff'); setIsRosterViewOpen(false); } }
                          else if (item.id === 'players') { setMgmtSubView('players'); setIsRosterViewOpen(false); }
                          else { setMgmtSubView(item.id as any); setIsRosterViewOpen(false); }
                        }}
                          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.05em] transition-all duration-300 border-b-[4px] active:translate-y-1 active:border-b-0 ${isActive ? `${item.activeBg} border-black/20 shadow-xl scale-105` : `bg-white ${item.color} border-slate-200 hover:border-blue-300 hover:bg-slate-50 shadow-md`}`}>
                          <item.icon size={18} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="p-1.5 flex-grow overflow-hidden flex flex-col gap-1 relative">
              {isStaffFormOpen ? (
                <StaffForm
                  formData={staffFormData}
                  setFormData={setStaffFormData}
                  selectedDivisa={selectedDivisa}
                  onSave={handleSaveStaff}
                  onCancel={() => setIsStaffFormOpen(false)}
                  hasInput={hasStaffInput}
                  onDNIFormat={handleStaffDNIFormat}
                  onPhoneFormat={handleStaffPhoneFormat}
                />
              ) : isRosterFormOpen ? (
                <RosterForm
                  formData={rosterFormData}
                  setFormData={setRosterFormData}
                  isConsultMode={isConsultMode}
                  selectedDivisa={selectedDivisa}
                  selectedLeague={selectedLeague}
                  divisaImages={divisaImages}
                  players={players}
                  onSave={handleSaveRoster}
                  onCancel={() => setIsRosterFormOpen(false)}
                  onCategoryChange={handleCategoryChange}
                  hasInput={hasRosterInput}
                />
              ) : isRosterViewOpen ? (
                <RosterManagement
                  currentDivisaRosters={currentDivisaRosters}
                  selectedRosterId={selectedRosterId}
                  setSelectedRosterId={setSelectedRosterId}
                  onCreateRoster={() => { setRosterFormData(initialRosterFormState); setIsRosterFormOpen(true); setIsConsultMode(false); }}
                  onEditRoster={() => { const r = rosters.find(x => x.id === selectedRosterId); if (r) { setRosterFormData(sanitizeData(r)); setIsRosterFormOpen(true); setIsConsultMode(false); } else { setValidationError("DEBE SELECCIONAR UN REGISTRO...!"); setTimeout(() => setValidationError(null), 3000); } }}
                  onConsultRoster={() => { const r = rosters.find(x => x.id === selectedRosterId); if (r) { setRosterFormData(sanitizeData(r)); setIsRosterFormOpen(true); setIsConsultMode(true); } else { setValidationError("DEBE SELECCIONAR UN REGISTRO...!"); setTimeout(() => setValidationError(null), 3000); } }}
                  onPrint={() => window.print()}
                  onDeleteRoster={handleDeleteRoster}
                  onBack={() => setIsRosterViewOpen(false)}
                />
              ) : isPlayerFormOpen ? (
                <PlayerForm
                  formData={formData}
                  setFormData={setFormData}
                  isConsultMode={isConsultMode}
                  onSave={handleSavePlayer}
                  onCancel={() => setIsPlayerFormOpen(false)}
                  onDNIChange={handleDNIChange}
                  onPhoneChange={handlePhoneChange}
                  onBirthDateChange={handleBirthDateChange}
                  hasUserInput={hasUserInput}
                />
              ) : mgmtSubView === 'players' ? (
                <PlayersManagement
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredPlayers={filteredPlayers}
                  selectedPlayerIds={selectedPlayerIds}
                  setSelectedPlayerIds={setSelectedPlayerIds}
                  onAddPlayer={handleOpenPlayerForm}
                  onEditPlayer={handleEditPlayer}
                  onConsultPlayer={handleConsultPlayer}
                  onPrint={() => window.print()}
                  onDeletePlayer={handleDeletePlayer}
                />
              ) : mgmtSubView === 'staff' ? (
                <StaffManagement
                  filteredStaff={filteredStaff}
                  selectedStaffIds={selectedStaffIds}
                  setSelectedStaffIds={setSelectedStaffIds}
                  onAddStaff={() => { setStaffFormData(initialStaffFormState); setIsStaffFormOpen(true); }}
                  onEditStaff={() => { const s = staff.find(x => x.id === selectedStaffIds[0]); if (s) { setStaffFormData(sanitizeData(s)); setIsStaffFormOpen(true); } else { setValidationError("DEBE SELECCIONAR UN REGISTRO...!"); setTimeout(() => setValidationError(null), 3000); } }}
                  onDeleteStaff={handleDeleteStaff}
                  onBack={() => setMgmtSubView('players')}
                />
              ) : mgmtSubView === 'participation' ? (
                <div className="animate-fade-in flex flex-col w-full h-full items-center justify-center bg-slate-100/50 rounded-[40px] border-4 border-dashed border-slate-300">
                  <Activity size={100} className="text-blue-900/20 mb-6" />
                  <h3 className="text-blue-900 font-black uppercase text-2xl tracking-[0.2em] italic">Participación Oficial</h3>
                  <p className="text-slate-500 font-bold uppercase text-[12px] mt-4 tracking-widest">Módulo de control de asistencia técnica</p>
                  <button onClick={() => setMgmtSubView('players')} className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 mt-10`}><ArrowLeft size={20} /> REGRESAR</button>
                </div>
              ) : mgmtSubView === 'percentage' ? (
                <div className="animate-fade-in flex flex-col w-full h-full items-center justify-center bg-slate-100/50 rounded-[40px] border-4 border-dashed border-slate-300">
                  <Percent size={100} className="text-blue-900/20 mb-6" />
                  <h3 className="text-blue-900 font-black uppercase text-2xl tracking-[0.2em] italic">Estadísticas y Porcentajes</h3>
                  <p className="text-slate-500 font-bold uppercase text-[12px] mt-4 tracking-widest">Cálculo de rendimiento por categoría</p>
                  <button onClick={() => setMgmtSubView('players')} className={`${actionButtonBase} bg-slate-700 text-white border-slate-900 mt-10`}><ArrowLeft size={20} /> REGRESAR</button>
                </div>
              ) : null}

            </div>
          </div>
        )}

        {isConfiguringLeague && (
          <LeagueForm
            tempLeagueImage={tempLeagueImage}
            tempLeagueName={tempLeagueName}
            setTempLeagueName={setTempLeagueName}
            onClose={() => setIsConfiguringLeague(false)}
            onImageClick={() => leagueImgInputRef.current?.click()}
            onConfirm={handleSaveLeague}
            leagueImgInputRef={leagueImgInputRef}
            onImageChange={handleLeagueImageChange}
            labelClass={labelClass}
          />
        )}

        {isConfiguringDirectiva && selectedLeague && (
          <DirectivaForm
            selectedLeague={selectedLeague}
            formData={directivaFormData}
            setFormData={setDirectivaFormData}
            isConsultMode={isConsultMode}
            isDirectivaUpdate={isDirectivaUpdate}
            onSave={handleSaveDirectiva}
            onCancel={() => setIsConfiguringDirectiva(false)}
            onPrint={handlePrintDirectiva}
            hasChanged={hasDirectivaChanged}
          />
        )}

        {isConfiguring && selectedLeague && (
          <DivisaForm
            tempDivisaImage={tempDivisaImage}
            tempDivisaName={tempDivisaName}
            setTempDivisaName={setTempDivisaName}
            onClose={() => setIsConfiguring(false)}
            onImageClick={() => divisaImgInputRef.current?.click()}
            onConfirm={handleSaveDivisa}
            divisaImgInputRef={divisaImgInputRef}
            onImageChange={handleDivisaImageChange}
            labelClass={labelClass}
          />
        )}

        {isConfiguringDivisaDirectiva && selectedLeague && selectedDivisaForDirectiva && (
          <DivisaDirectivaForm
            selectedLeague={selectedLeague}
            selectedDivisa={selectedDivisaForDirectiva}
            formData={divisaDirectivaFormData}
            setFormData={setDivisaDirectivaFormData}
            isConsultMode={isConsultMode}
            onSave={handleSaveDivisaDirectiva}
            onCancel={() => setIsConfiguringDivisaDirectiva(false)}
            onPrint={handlePrintDirectiva}
            hasChanged={hasDivisaDirectivaChanged}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        )}

        {deleteConfirmLeague && (
          <LeagueDeleteConfirm
            leagueName={deleteConfirmLeague}
            onConfirm={async () => { await deleteDoc(doc(db, "leagues", deleteConfirmLeague)); setDeleteConfirmLeague(null); setShowDeleteSuccess(true); setTimeout(() => setShowDeleteSuccess(false), 3000); }}
            onCancel={() => setDeleteConfirmLeague(null)}
          />
        )}

        {deleteConfirmDivisa && selectedLeague && (
          <DivisaDeleteConfirm
            divisaName={deleteConfirmDivisa}
            onConfirm={async () => {
              const leagueRef = doc(db, "leagues", selectedLeague);
              const currentList = leagueDivisas[selectedLeague] || [];
              const updatedList = currentList.filter(d => d !== deleteConfirmDivisa);
              const updatedDivImages = { ...divisaImages };
              delete updatedDivImages[deleteConfirmDivisa];
              try {
                await setDoc(leagueRef, sanitizeData({ divisas: updatedList, divisaImages: updatedDivImages }), { merge: true });
                setDeleteConfirmDivisa(null);
                setShowDeleteSuccess(true);
                setTimeout(() => setShowDeleteSuccess(false), 3000);
              } catch (e) {
                console.error("Error al eliminar divisa:", e);
                setValidationError("ERROR AL ELIMINAR LA DIVISA.");
              }
            }}
            onCancel={() => setDeleteConfirmDivisa(null)}
          />
        )}
      </main>
      <footer className="bg-slate-900/90 text-slate-500 py-1.5 text-center mt-auto border-t-4 border-red-600 print:hidden shrink-0"><p className="text-[7px] font-black uppercase tracking-[0.4em]">BEISBOL MENOR STATS • Nueva Esparta • 2024</p></footer>
    </div>
  );
}
