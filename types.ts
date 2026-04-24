
export interface Category {
  name: string;
  min: number;
  max: number;
}

export interface StaffMember {
  firstName: string;
  lastName: string;
  dni: string;
  photo?: string; // Foto en formato base64
  birthDate?: string;
  address?: string;
  phone?: string;
}

export interface DirectivaMember extends StaffMember { }

export interface Directiva {
  presidente: DirectivaMember;
  vicepresidente: DirectivaMember;
  secGeneral: DirectivaMember;
  secFinanzas: DirectivaMember;
  delegado1: DirectivaMember;
  delegado2: DirectivaMember;
  delegado3: DirectivaMember;
}

export interface Player {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthState: string;
  birthCity: string;
  birthDate: string;
  age: number;
  category: string;
  team: string;
  league: string;
  fatherName: string;
  motherName: string;
  representante: string;
  address: string;
  phone: string;
  photo?: string; // Cadena base64
  // Datos Técnicos
  batting: string;
  throwing: string;
  bloodType: string;
  positions: string[];
  // Documentación y Estado
  birthCertificate: string; // "SI" | "NO"
  birthCertificateImage?: string; // Cadena base64
  status: 'ACTIVO' | 'INACTIVO';
  statusReason?: string;
  medicalCondition?: string;
}

export interface Roster {
  id: number;
  league: string;
  team: string;
  category: string;
  letter: string; // A, B, C...
  playerIds: number[]; // Arreglo de 20 IDs
  manager: StaffMember;
  technicians: StaffMember[]; // Arreglo de 2 técnicos
  delegate: StaffMember;
  season: string;
}

export interface LeagueDivisas {
  [leagueName: string]: string[];
}

export type View = 'menu' | 'divisas' | 'players_mgmt';
export type SubView = 'option_selector' | 'players_mgmt' | 'roster' | 'calendar' | 'leaders' | 'standings';

export interface ContextMenuState {
  x: number;
  y: number;
  index: number;
}

export interface StaffWithMeta extends StaffMember {
  id: string;
  league: string;
  team: string;
  role: string;
}
