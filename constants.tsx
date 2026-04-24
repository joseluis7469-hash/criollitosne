
import { Users, Calendar, Trophy, BarChart3, LucideIcon } from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { name: 'PREPARATORIA I NIVEL', min: 4, max: 5 },
  { name: 'PREPARATORIA II NIVEL', min: 6, max: 7 },
  { name: 'PREINFANTIL', min: 8, max: 9 },
  { name: 'INFANTIL', min: 10, max: 11 },
  { name: 'PREJUNIOR', min: 12, max: 13 },
  { name: 'JUNIOR', min: 14, max: 15 },
  { name: 'JUVENIL', min: 16, max: 17 },
];

export const LEAGUES: string[] = ["LIGA DIAZ", "LIGA MARCANO", "LIGA MARIÑO"];

interface NavOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_OPTIONS: NavOption[] = [
  { id: 'players_mgmt', label: 'Jugadores', icon: Users },
  { id: 'roster', label: 'Roster de equipos', icon: Users },
  { id: 'calendar', label: 'Calendario de juegos', icon: Calendar },
  { id: 'leaders', label: 'Lideratos', icon: Trophy },
  { id: 'standings', label: 'Tabla de posiciones', icon: BarChart3 },
];

export const VENEZUELA_DATA: Record<string, string[]> = {
  "AMAZONAS": ["PUERTO AYACUCHO", "SAN FELIPE", "SAN FERNANDO DE APURE"],
  "ANZOÁTEGUI": ["BARCELONA", "PUERTO LA CRUZ", "EL TIGRE", "ANACO"],
  "APURE": ["SAN FERNANDO DE APURE", "GUASDUALITO"],
  "ARAGUA": ["MARACAY", "TURMERO", "LA VICTORIA", "CAGUA"],
  "BARINAS": ["BARINAS", "SOCOPO", "BARINITAS"],
  "BOLÍVAR": ["CIUDAD BOLÍVAR", "PUERTO ORDAZ", "UPATA"],
  "CARABOBO": ["VALENCIA", "PUERTO CABELLO", "GUACARA"],
  "COJEDES": ["SAN CARLOS", "TINACO"],
  "DELTA AMACURO": ["TUCUPITA"],
  "DISTRITO CAPITAL": ["CARACAS"],
  "FALCÓN": ["CORO", "PUNTO FIJO"],
  "GUÁRICO": ["SAN JUAN DE LOS MORROS", "VALLE DE LA PASCUA", "CALABOZO"],
  "LARA": ["BARQUISIMETO", "CABUDARE", "EL TOCUYO"],
  "MÉRIDA": ["MÉRIDA", "EL VIGÍA", "EJIDO"],
  "MIRANDA": ["LOS TEQUES", "GUARENAS", "GUATIRE", "CHARALLAVE"],
  "MONAGAS": ["MATURÍN", "CARIPITO"],
  "NUEVA ESPARTA": ["LA ASUNCIÓN", "PORLAMAR", "PAMPATAR", "JUAN GRIEGO", "VILLA ROSA", "SAN JUAN BAUTISTA"],
  "PORTUGUESA": ["GUANARE", "ACARIGUA"],
  "SUCRE": ["CUMANÁ", "CARÚPANO"],
  "TÁCHIRA": ["SAN CRISTÓBAL", "TÁRIBA", "RUBIO"],
  "TRUJILLO": ["TRUJILLO", "VALERA", "BOCONÓ"],
  "VARGAS": ["LA GUAIRA", "MAIQUETÍA", "CATIA LA MAR"],
  "YARACUY": ["SAN FELIPE", "YARITAGUA"],
  "ZULIA": ["MARACAIBO", "CABIMAS", "CIUDAD OJEDA", "MACHIQUES"]
};

export const CATEGORY_ORDER: Record<string, number> = {
  'PREPARATORIA II NIVEL': 1,
  'PREPARATORIA I NIVEL': 2,
  'PREINFANTIL': 3,
  'INFANTIL': 4,
  'PREJUNIOR': 5,
  'JUNIOR': 6,
  'JUVENIL': 7,
  'NO CALIFICA': 8
};
