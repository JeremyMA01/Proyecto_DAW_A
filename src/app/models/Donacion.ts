// models/Donacion.ts
export interface Donacion {
    id: number;
    title: string;
    author: string;
    year: number;
    estado: string;  // "Nuevo", "Usado", etc.
    donationDate: string;  // Fecha de donación
    donatedBy: string;  // Nombre del donante
    convertedToInventory: boolean;  // Si ya pasó a inventario
    active: boolean; 
    categoryId: number;  // ID de la categoría
    category?: {  // Opcional: datos completos de la categoría
        id: number;
        name: string;
        description: string;
    };
}