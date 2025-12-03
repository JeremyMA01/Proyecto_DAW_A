export type RolUsuario = 'lector' | 'donante' | 'admin';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  ciudad: string;
  rol: RolUsuario;
  password: string;
  estadoActivo: boolean;
}
