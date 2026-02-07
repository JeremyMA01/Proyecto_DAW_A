import { Component, ElementRef, ViewChild } from '@angular/core';
import { Book } from '../../../models/Book';
import { ServBooksApi } from '../../../services/serv-books-api';
import { Genre } from '../../../models/Genre';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReusableSearch } from '../../reusable_component/reusable-search/reusable-search';

declare const bootstrap: any;

@Component({
  selector: 'app-donaciones-crud',
  imports: [ReactiveFormsModule, CommonModule, ReusableSearch],
  templateUrl: './donaciones-crud.html',
  styleUrls: ['./donaciones-crud.css'],
})
export class DonacionesCrud {

  books: Book[] = [];
  generos: Genre[] = [];
  formBook!: FormGroup;
  editingId: number | null = null;

  @ViewChild('bookModalRef') modalElement!: ElementRef;
  modalRef: any;

  constructor(
    private miServicio: ServBooksApi,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loadBook();
    this.loadGenero();

    this.formBook = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      author: ['', Validators.required],   
      genre: ['', Validators.required],
      releaseDate: ['', Validators.required],
      Estado: ['Nuevo', Validators.required],
      poster: ['']  
    });
  }

  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  loadBook(): void {
    this.miServicio.getBook().subscribe(
      (data: Book[]) => { this.books = data; },
      (error) => console.error("Error al cargar:", error)
    );
  }

  searchText(param: string) {
    const text = param.toLowerCase();
    this.miServicio.serchBook(text).subscribe((datos: Book[]) => {
      this.books = datos;
    });
  }

  loadGenero(): void {
    this.miServicio.getGenre().subscribe((data: Genre[]) => {
      this.generos = data;
    });
  }

  openNew() {
    this.editingId = null;
    this.formBook.reset({ Estado: 'Nuevo' });
    this.modalRef.show();
  }

  openEdit(book: Book) {
    this.editingId = book.id ?? null;

    this.formBook.patchValue({
      title: book.title,
      author: book.author,    
      genre: book.genre,
      releaseDate: book.releaseDate,
      Estado: book.Estado,
      poster: book.poster ?? ""
    });

    this.modalRef.show();
  }

  save() {
    if (this.formBook.invalid) {
      alert("Formulario incompleto");
      return;
    }

    const datos = this.formBook.value;

    if (this.editingId) {
      const bookUpdated: Book = { ...datos, id: this.editingId };

      this.miServicio.updateBook(bookUpdated).subscribe(() => {
        alert("Registro actualizado correctamente");
        this.modalRef.hide();
        this.loadBook();
      });

    } else {
      const newBook: Book = { ...datos };

      this.miServicio.addBook(newBook).subscribe(() => {
        alert("Donación creada correctamente");
        this.modalRef.hide();
        this.loadBook();
      });
    }
  }

  delete(book: Book) {
    if (confirm(`¿Seguro deseas eliminar "${book.title}"?`)) {
      this.miServicio.removeBook(book.id!).subscribe(() => {
        alert("Eliminado correctamente");
        this.loadBook();
      });
    }
  }

  view(id: number | undefined) {
    if (id) this.router.navigate([`book-view/${id}`]);
  }
}
