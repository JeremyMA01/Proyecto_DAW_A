import { Component, ElementRef, ViewChild } from '@angular/core';
import { Categorie } from '../../models/Categorie';
import { ServCategorie } from '../../services/categorie/serv-categorie';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReusableTable } from '../reusable_component/reusable-table/reusable-table';
import { ReusableDialog } from '../reusable_component/reusable-dialog/reusable-dialog';
import { CommonModule } from '@angular/common';

declare const bootstrap: any;
@Component({
  selector: 'app-categories',
  imports: [CommonModule, ReactiveFormsModule, ReusableTable, ReusableDialog],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories: Categorie[] = [];
  selectedCategorie: Categorie | null = null;
  
  showDeleteDialog = false;
  showSuccessDialog = false;
  showErrorDialog = false;
  showFormErrorDialog = false;
  
  successMessage = '';
  errorMessage = '';
  formErrorMessage = '';

  columnas = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'createdDate', label: 'Fecha Creación' },
    { key: 'active', label: 'Estado' }
  ];

  formCategorie!: FormGroup;
  editingId: number | null = null;
  modalRef: any;

  constructor(
    private miServicio: ServCategorie,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loadCategories();

    this.formCategorie = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      createdDate: [this.getCurrentDate(), Validators.required],
      active: [true]
    });
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  @ViewChild('categorieModalRef') modalElement!: ElementRef;

  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  loadCategories(): void {
    this.miServicio.getCategories().subscribe(
      (data: Categorie[]) => {
        this.categories = data;
      }
    );
  }

  search(busq: HTMLInputElement) {
    let parametro = busq.value.toLowerCase();
    this.miServicio.searchCategories(parametro).subscribe(
      (datos: Categorie[]) => {
        this.categories = datos;
      }
    );
  }

  obtenerEstadoNombre(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  openNew() {
    this.editingId = null;
    this.formCategorie.reset({
      name: '',
      description: '',
      createdDate: this.getCurrentDate(),
      active: true
    });
    this.modalRef.show();
  }

  /*
  openEdit(categorie: Categorie) {
    this.editingId = categorie.id;
    const formattedDate = categorie.createdDate 
      ? new Date(categorie.createdDate).toISOString().split('T')[0]
      : this.getCurrentDate();
    
    this.formCategorie.patchValue({
      ...categorie,
      createdDate: formattedDate
    });
    this.modalRef.show();
  }
    */
   openEdit(categorie: Categorie) {
  this.editingId = categorie.id; // Ahora categorie.id es number
  
  // Formatear la fecha
  const formattedDate = categorie.createdDate 
    ? new Date(categorie.createdDate).toISOString().split('T')[0]
    : this.getCurrentDate();
  
  this.formCategorie.patchValue({
    ...categorie,
    createdDate: formattedDate
  });
  this.modalRef.show();
}

  openDeleteDialog(categorie: Categorie) {
    this.selectedCategorie = categorie;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.selectedCategorie) {
      this.miServicio.deleteCategorie(this.selectedCategorie.id).subscribe(
        () => {
          this.successMessage = 'Categoría eliminada exitosamente';
          this.showSuccessDialog = true;
          this.loadCategories();
          this.showDeleteDialog = false;
          this.selectedCategorie = null;
        },
        (error) => {
          this.errorMessage = 'Error al eliminar categoría: ' + error.message;
          this.showErrorDialog = true;
          this.showDeleteDialog = false;
        }
      );
    }
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.selectedCategorie = null;
  }

save() {
  if (this.formCategorie.invalid) {
    this.formErrorMessage = 'Formulario inválido. Por favor, complete todos los campos correctamente.';
    this.showFormErrorDialog = true;
    return;
  }

  const datos = this.formCategorie.value;

  if (this.editingId !== null) { // Editando
    // Convertir ID a number si es string
    const idNum = typeof this.editingId === 'string' ? parseInt(this.editingId) : this.editingId;
    
    let categorieUpdate: Categorie = { 
      ...datos, 
      id: idNum  // El ID debe ser número
    };
    
    this.miServicio.updateCategorie(categorieUpdate).subscribe(
      () => {
        this.successMessage = 'Categoría actualizada exitosamente';
        this.showSuccessDialog = true;
        this.modalRef.hide();
        this.loadCategories();
      },
      (error) => {
        this.errorMessage = 'Error al actualizar categoría: ' + error.message;
        this.showErrorDialog = true;
      }
    );
  } else { // Creando nuevo
    // No enviar ID - la API lo generará automáticamente
    // También quitamos el id del objeto
    const { id, ...categorieNew } = datos;
    
    this.miServicio.addCategorie(categorieNew).subscribe(
      (response: Categorie) => {
        this.successMessage = 'Categoría registrada exitosamente';
        this.showSuccessDialog = true;
        this.modalRef.hide();
        this.loadCategories();
      },
      (error) => {
        this.errorMessage = 'Error al crear categoría: ' + error.message;
        this.showErrorDialog = true;
      }
    );
  }
}

  closeSuccessDialog() {
    this.showSuccessDialog = false;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
  }

  closeFormErrorDialog() {
    this.showFormErrorDialog = false;
  }

  get f() {
    return this.formCategorie.controls;
  }
}

