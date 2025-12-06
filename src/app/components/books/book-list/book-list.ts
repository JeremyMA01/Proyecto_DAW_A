import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Book } from '../../../models/Book';
import { Genre } from '../../../models/Genre';
import { ServBookJson } from '../../../services/serv-book-json';
import { ReusableTable } from "../../reusable_component/reusable-table/reusable-table";
import { DialogConfirm } from '../../dialog/dialog-confirm/dialog-confirm';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare const bootstrap: any;

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [ReusableTable, DialogConfirm, ReactiveFormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {

  private router = new Router();
  @Input() datos: any[] = [];

  books: Book[] = [];
  book: Book | null = null;
  generos: Genre[] = [];

  columnas = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Titulo' },
    { key: 'author', label: 'Autor' },
    { key: 'year', label: 'Año' },
    { key: 'genre', label: 'Genero' },
    { key: 'active', label: 'Estado' },
    { key: 'action', label: 'Acciones' },
  ];

  formBook!: FormGroup;
  editingId: number | null = null;

  minDate = "1980-01-02";
  maxDate = new Date().toISOString().split("T")[0];

  dialogVisible = false;
  bookToDelete: Book | null = null;

  modalRef: any;

  constructor(
    private servBook: ServBookJson,
    private fb: FormBuilder
  ) {
    this.loadBook();
    this.loadGenero();

    this.formBook = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      genre: ['', Validators.required],
      year: ['', Validators.required],
      releaseDate: ['', Validators.required],
      poster: ['', Validators.required],
      active: [true]
    });
  }

  @ViewChild('bookModalRef') modalElement!: ElementRef;
  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  // 📌 Carga todos los libros
  loadBook(): void {
    this.servBook.getBook().subscribe((data: Book[]) => {
      this.books = data;
    });
  }

  // 📌 Cargar libro por ID (versión HEAD)
  loadBookId(id: number): void {
    this.servBook.getBookId(id).subscribe((data: Book) => {
      this.book = data;
    });
  }

  // 📌 Cargar Géneros (versión del otro commit)
  loadGenero(): void {
    this.servBook.getGenre().subscribe((data: Genre[]) => {
      this.generos = data;
    });
  }

  // -----------------------
  // FUNCIONES COMPLEMENTARIAS
  // -----------------------

  search(busq: HTMLInputElement) {
    let parametro = busq.value.toLowerCase();
    this.servBook.serchBook(parametro).subscribe((datos: Book[]) => {
      this.books = datos;
    });
  }

  delete(book: Book) {
    this.bookToDelete = book;
    this.dialogVisible = true;
  }

  onAceptar() {
    if (!this.bookToDelete) return;

    this.servBook.removeBook(this.bookToDelete.id!).subscribe(() => {
      alert("Libro eliminado");
      this.loadBook();
      this.dialogVisible = false;
      this.bookToDelete = null;
    });
  }

  onCancelar() {
    this.dialogVisible = false;
    this.bookToDelete = null;
  }

  view(book: Book) {
    this.router.navigate(['/book-view', book.id]);
  }

  openNew() {
    this.editingId = null;
    this.formBook.reset();
    this.modalRef.show();
  }

  openEdit(book: Book) {
    this.editingId = Number(book.id);
    this.formBook.patchValue(book);
    this.modalRef.show();
  }

  save() {
    if (this.formBook.invalid) return;

    const datos = this.formBook.value;

    if (this.editingId) {
      let bookUpdate: Book = { ...datos, id: this.editingId };
      this.servBook.updateBook(bookUpdate).subscribe(() => {
        alert("Libro actualizado");
        this.modalRef.hide();
        this.loadBook();
      });

    } else {
      let nuevoLibro: Book = { ...datos };
      this.servBook.addBook(nuevoLibro).subscribe(() => {
        alert("Libro creado");
        this.modalRef.hide();
        this.loadBook();
      });
    }
  }

}
