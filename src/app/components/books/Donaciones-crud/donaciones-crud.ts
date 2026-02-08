import { Component, ElementRef, ViewChild } from '@angular/core';
import { Donacion } from '../../../models/Donacion';
import { ServDonaciones } from '../../../services/donaciones/serv-donaciones';
import { ServCategorie } from '../../../services/categorie/serv-categorie';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReusableSearch } from '../../reusable_component/reusable-search/reusable-search';
import { Categorie } from '../../../models/Categorie';

declare const bootstrap: any;

@Component({
  selector: 'app-donaciones-crud',
  imports: [ReactiveFormsModule, CommonModule, ReusableSearch],
  templateUrl: './donaciones-crud.html',
  styleUrls: ['./donaciones-crud.css'],
})
export class DonacionesCrud {
  donaciones: Donacion[] = [];
  categorias: Categorie[] = [];
  formDonacion!: FormGroup;
  editingId: number | null = null;
  
  // AGREGAR ESTA PROPIEDAD
  currentYear: number;

  @ViewChild('donacionModalRef') modalElement!: ElementRef;
  modalRef: any;

  constructor(
    private servicioDonaciones: ServDonaciones,
    private servicioCategorias: ServCategorie,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Inicializar el año actual
    this.currentYear = new Date().getFullYear();
    
    this.loadDonaciones();
    this.loadCategorias();

    this.formDonacion = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      author: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1000), Validators.max(this.currentYear)]], // Usar this.currentYear
      categoryId: [null, Validators.required],
      estado: ['Nuevo', Validators.required],
      donatedBy: ['', Validators.required],
      donationDate: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  loadDonaciones(): void {
    this.servicioDonaciones.getDonaciones().subscribe(
      (data: Donacion[]) => { 
        this.donaciones = data;
        console.log('Donaciones cargadas:', data);
      },
      (error) => console.error("Error al cargar donaciones:", error)
    );
  }

  loadCategorias(): void {
    this.servicioCategorias.getCategories().subscribe(
      (data: Categorie[]) => {
        // Filtrar solo categorías activas
        this.categorias = data.filter(c => c.active);
      },
      (error) => console.error("Error al cargar categorías:", error)
    );
  }

  searchText(param: string) {
    const text = param.toLowerCase();
    this.servicioDonaciones.searchDonaciones(text).subscribe(
      (datos: Donacion[]) => {
        this.donaciones = datos;
      },
      (error) => console.error("Error en búsqueda:", error)
    );
  }

  openNew() {
    this.editingId = null;
    this.formDonacion.reset({ 
      estado: 'Nuevo',
      donationDate: this.getCurrentDate()
    });
    this.modalRef.show();
  }

  openEdit(donacion: Donacion) {
    this.editingId = donacion.id;
    
    // Formatear fecha para input
    const formattedDate = donacion.donationDate 
      ? new Date(donacion.donationDate).toISOString().split('T')[0]
      : this.getCurrentDate();
    
    this.formDonacion.patchValue({
      title: donacion.title,
      author: donacion.author,
      year: donacion.year,
      categoryId: donacion.categoryId,
      estado: donacion.estado,
      donatedBy: donacion.donatedBy,
      donationDate: formattedDate
    });

    this.modalRef.show();
  }

// donaciones-crud.ts - en el método save()
save() {
  if (this.formDonacion.invalid) {
    alert("Formulario incompleto. Por favor, complete todos los campos requeridos.");
    return;
  }

  const datos = this.formDonacion.value;
  
  // VALIDACIÓN CLIENTE-SIDE
  const currentYear = new Date().getFullYear();
  const year = Number(datos.year);
  
  if (year > currentYear) {
    alert(`Error: El año (${year}) no puede ser mayor que el año actual (${currentYear})`);
    return;
  }
  
  // Validar fecha de donación
  const donationDate = new Date(datos.donationDate);
  const today = new Date();
  if (donationDate > today) {
    alert('Error: La fecha de donación no puede ser futura');
    return;
  }
  
  // Asegurar que categoryId sea number
  const categoryId = Number(datos.categoryId);
  if (isNaN(categoryId)) {
    alert('Error: Categoría inválida');
    return;
  }

  if (this.editingId) {
    // Editar
    const donacionActualizada: Donacion = { 
      ...datos,
      id: this.editingId,
      year: year,
      categoryId: categoryId,
      donationDate: donationDate.toISOString().split('T')[0]
    };

    this.servicioDonaciones.updateDonacion(donacionActualizada).subscribe(
      (response) => {
        console.log('Respuesta exitosa:', response);
        alert("Donación actualizada correctamente");
        this.modalRef.hide();
        this.loadDonaciones();
      },
      (error) => {
        console.error('Error completo:', error);
        const errorMessage = this.getErrorMessage(error);
        alert(`Error al actualizar: ${errorMessage}`);
      }
    );

  } else {
    // Crear nueva
    const nuevaDonacion: Donacion = { 
      ...datos,
      convertedToInventory: false,
      year: year,
      categoryId: categoryId,
      donationDate: donationDate.toISOString().split('T')[0]
    };

    this.servicioDonaciones.addDonacion(nuevaDonacion).subscribe(
      (response) => {
        console.log('Respuesta exitosa:', response);
        alert("Donación creada correctamente");
        this.modalRef.hide();
        this.loadDonaciones();
      },
      (error) => {
        console.error('Error completo:', error);
        const errorMessage = this.getErrorMessage(error);
        alert(`Error al crear: ${errorMessage}`);
      }
    );
  }
}

// Método para obtener mensaje de error amigable
getErrorMessage(error: any): string {
  if (error.error?.errors) {
    // Si hay errores de validación detallados
    const errors = error.error.errors;
    let messages = [];
    
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        messages.push(`${key}: ${errors[key].join(', ')}`);
      }
    }
    
    return messages.join('\n');
  }
  
  return error.error?.message || error.message || 'Error desconocido';
}

  delete(donacion: Donacion) {
    if (confirm(`¿Seguro deseas eliminar la donación "${donacion.title}"?`)) {
      this.servicioDonaciones.deleteDonacion(donacion.id).subscribe(
        () => {
          alert("Eliminado correctamente");
          this.loadDonaciones();
        },
        (error) => {
          alert(`Error al eliminar: ${error.error?.message || error.message}`);
        }
      );
    }
  }

  convertToInventory(donacion: Donacion) {
    if (confirm(`¿Convertir "${donacion.title}" a inventario?`)) {
      this.servicioDonaciones.convertToInventory(donacion.id).subscribe(
        (response: any) => {
          alert(`Convertido a inventario. ID del libro: ${response.bookId}`);
          this.loadDonaciones();
        },
        (error) => {
          alert(`Error: ${error.error?.message || error.message}`);
        }
      );
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Helper para obtener nombre de categoría
  getCategoryName(categoryId: number): string {
    const categoria = this.categorias.find(c => c.id === categoryId);
    return categoria ? categoria.name : 'Desconocida';
  }

  // Helper para estado convertido
  getConvertedStatus(converted: boolean): string {
    return converted ? 'Sí' : 'No';
  }
}