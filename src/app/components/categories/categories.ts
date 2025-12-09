import { Component, ElementRef, ViewChild } from '@angular/core';
import { Categorie } from '../../models/Categorie';
import { ServCategorie } from '../../services/categorie/serv-categorie';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReusableTable } from '../reusable_component/reusable-table/reusable-table';
import { ReusableDialog } from '../reusable_component/reusable-dialog/reusable-dialog';
declare const bootstrap: any;

@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule, ReusableTable, ReusableDialog], // Agregar componentes
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories: Categorie[] = [];
  selectedCategorie: Categorie | null = null;
  showDeleteDialog = false;

  // Columnas para la tabla reutilizable
  columnas = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'active', label: 'Estado' },
    { key: 'action', label: 'Acciones' }
  ];

  formCategorie!: FormGroup;
  editingId: string | null = null;
  modalRef: any;

  constructor(
    private miServicio: ServCategorie,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loadCategories();

    this.formCategorie = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      description: ['', Validators.required],
      active: [true]
    });
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

  // Para el estado en la tabla
  obtenerEstadoNombre(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  // Modal para nueva categoría
  openNew() {
    this.editingId = null;
    this.formCategorie.reset({ active: true });
    this.modalRef.show();
  }

  // Modal para editar categoría
  openEdit(categorie: Categorie) {
    this.editingId = categorie.id;
    this.formCategorie.patchValue(categorie);
    this.modalRef.show();
  }

  // Diálogo para eliminar
  openDeleteDialog(categorie: Categorie) {
    this.selectedCategorie = categorie;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.selectedCategorie) {
      this.miServicio.deleteCategorie(this.selectedCategorie.id).subscribe(
        () => {
          alert("Categoría eliminada exitosamente");
          this.loadCategories();
          this.showDeleteDialog = false;
          this.selectedCategorie = null;
        }
      );
    }
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.selectedCategorie = null;
  }

  // Guardar (nuevo o editar)
  save() {
    if (this.formCategorie.invalid) {
      alert("Formulario inválido");
      return;
    }

    const datos = this.formCategorie.value;

    if (this.editingId) { // Editando
      let categorieUpdate: Categorie = { ...datos, id: this.editingId };
      this.miServicio.updateCategorie(categorieUpdate).subscribe(
        () => {
          alert("Categoría actualizada");
          this.modalRef.hide();
          this.loadCategories();
        }
      );
    } else { // Creando nuevo
      // Calcular nuevo ID como string basado en las categorías existentes
      let nextId: string;

      if (this.categories.length > 0) {
        // Convertir IDs a números, encontrar el máximo, sumar 1 y convertir a string
        const maxId = Math.max(...this.categories.map(c => parseInt(c.id)));
        nextId = (maxId + 1).toString();
      } else {
        nextId = "1"; // Primera categoría
      }

      let categorieNew: Categorie = {
        ...datos,
        id: nextId  // ID como string
      };

      this.miServicio.addCategorie(categorieNew).subscribe(
        () => {
          alert("Categoría registrada exitosamente");
          this.modalRef.hide();
          this.loadCategories();
        }
      );
    }
  }
}