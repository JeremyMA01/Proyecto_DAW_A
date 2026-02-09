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
  currentYear: number;

  @ViewChild('donacionModalRef') modalElement!: ElementRef;
  modalRef: any;

  constructor(
    private servicioDonaciones: ServDonaciones,
    private servicioCategorias: ServCategorie,
    private router: Router,
    private fb: FormBuilder
  ) {
 
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
    this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
      console.log('Modal cerrado');
      this.editingId = null;
      this.formDonacion.reset({ 
        estado: 'Nuevo',
        donationDate: this.getCurrentDate()
      });
    });
    
    this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {
      console.log('Modal abierto');
    });
  }

  loadDonaciones(): void {
  console.log('Cargando donaciones...');
  this.servicioDonaciones.getDonaciones().subscribe(
    (data: Donacion[]) => { 
      this.donaciones = data;
      console.log('Donaciones cargadas:', data.length, 'registros');
      

      setTimeout(() => {
        this.donaciones = [...data];
      }, 0);
    },
    (error) => {
      console.error("Error al cargar donaciones:", error);
      alert('Error al cargar donaciones: ' + error.message);
    }
  );
}

  loadCategorias(): void {
    this.servicioCategorias.getCategories().subscribe(
      (data: Categorie[]) => {
  
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

  save() {
    if (this.formDonacion.invalid) {
      alert("Formulario incompleto. Por favor, complete todos los campos requeridos.");
      return;
    }

    const datos = this.formDonacion.value;
    
  
    const categoryId = Number(datos.categoryId);
    
    if (this.editingId) {

      const donacionActualizada: Donacion = { 
        ...datos,
        id: this.editingId,
        year: Number(datos.year),
        categoryId: categoryId,
        donationDate: datos.donationDate
      };

      this.servicioDonaciones.updateDonacion(donacionActualizada).subscribe(
        (response) => {
          console.log('Respuesta exitosa:', response);
          alert("Donación actualizada correctamente");
          
      
          if (this.modalRef) {
            this.modalRef.hide();
          }
          
        
          setTimeout(() => {
            this.loadDonaciones();
            this.editingId = null;
            this.formDonacion.reset();
          }, 100);
        },
        (error) => {
          console.error('Error completo:', error);
          alert(`Error al actualizar: ${error.error?.message || error.message}`);
        }
      );

    } else {
    
      const nuevaDonacion: Donacion = { 
        ...datos,
        convertedToInventory: false,
        year: Number(datos.year),
        categoryId: categoryId,
        donationDate: datos.donationDate
      };

      this.servicioDonaciones.addDonacion(nuevaDonacion).subscribe(
        (response) => {
          console.log('Respuesta exitosa:', response);
          alert("Donación creada correctamente");
          

          if (this.modalRef) {
            this.modalRef.hide();
          }
          
        
          setTimeout(() => {
            this.loadDonaciones();
            this.formDonacion.reset({ 
              estado: 'Nuevo',
              donationDate: this.getCurrentDate()
            });
          }, 100);
        },
        (error) => {
          console.error('Error completo:', error);
          alert(`Error al crear: ${error.error?.message || error.message}`);
        }
      );
    }
  }

  getErrorMessage(error: any): string {
    if (error.error?.errors) {

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
    if (confirm(`¿Seguro deseas desactivar la donación "${donacion.title}"?`)) {
      this.servicioDonaciones.deleteDonacion(donacion.id).subscribe(
        () => {
          alert("Donación desactivada correctamente");
          
      
          const index = this.donaciones.findIndex(d => d.id === donacion.id);
          if (index !== -1) {
            this.donaciones[index].active = false;
            this.donaciones = [...this.donaciones]; 
          }
        },
        (error) => {
          alert(`Error al desactivar: ${error.error?.message || error.message}`);
        }
      );
    }
  }

  activate(donacion: Donacion) {
    if (confirm(`¿Seguro deseas reactivar la donación "${donacion.title}"?`)) {
      this.servicioDonaciones.activateDonacion(donacion.id).subscribe(
        () => {
          alert("Donación reactivada correctamente");
          
       
          const index = this.donaciones.findIndex(d => d.id === donacion.id);
          if (index !== -1) {
            this.donaciones[index].active = true;
            this.donaciones = [...this.donaciones]; 
          }
        },
        (error) => {
          alert(`Error al reactivar: ${error.error?.message || error.message}`);
        }
      );
    }
  }

  getActiveStatus(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  getActiveClass(active: boolean): string {
    return active ? 'badge bg-success' : 'badge bg-danger';
  }

  convertToInventory(donacion: Donacion) {
    if (confirm(`¿Convertir "${donacion.title}" a inventario?`)) {
      this.servicioDonaciones.convertToInventory(donacion.id).subscribe(
        (response: any) => {
          alert(`Convertido a inventario. ID del libro: ${response.bookId}`);
          
          const index = this.donaciones.findIndex(d => d.id === donacion.id);
          if (index !== -1) {
            this.donaciones[index].convertedToInventory = true;
            this.donaciones = [...this.donaciones]; 
          }
          
          setTimeout(() => {
            this.loadDonaciones();
          }, 100);
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

  getCategoryName(categoryId: number): string {
    const categoria = this.categorias.find(c => c.id === categoryId);
    return categoria ? categoria.name : 'Desconocida';
  }

  getConvertedStatus(converted: boolean): string {
    return converted ? 'Sí' : 'No';
  }
}