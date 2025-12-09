export type RolUsuario = 'lector' | 'donante' | 'administrador';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  ciudad: string;
  rol: RolUsuario;
  password: string;
  estadoActivo: boolean;
}
