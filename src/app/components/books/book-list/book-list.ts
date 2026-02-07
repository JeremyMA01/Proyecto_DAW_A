import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Book } from '../../../models/Book';
import { Genre } from '../../../models/Genre';
//import { ServBookJson} from '../../../services/serv-book-json';
import { ServBooksApi} from '../../../services/serv-books-api';
import { ReusableTable } from "../../reusable_component/reusable-table/reusable-table";
import { DialogConfirm } from '../../dialog/dialog-confirm/dialog-confirm';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validate } from '@angular/forms/signals';

declare const bootstrap: any;

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [ReusableTable, DialogConfirm, ReactiveFormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {

  @Input() datos: any[] = [];

  books: Book[] = [];
  book: Book | null = null;
  generos: Genre[] = [];
  booksAll :Book[]=[];

  columnas = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Titulo' },
    { key: 'author', label: 'Autor' },
    { key: 'year', label: 'Año' },
    { key: 'genreId', label: 'Genero' },
    { key: 'active', label: 'Estado' },
    {key: 'budget', label: 'Presupuesto'},
  ];

  formBook!: FormGroup;
  editingId: number | null = null;

  minDate = "1980-01-02";
  maxDate = new Date().toISOString().split("T")[0];

  dialogVisible = false;
  bookToDelete: Book | null = null;

  modalRef: any;

  constructor(
    private servBook: ServBooksApi,
    private fb: FormBuilder,
    private router :Router
  ) {
    this.loadBook();
    this.loadGenero();

    this.formBook = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ0-9 ]+$/)]],
      author: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZÀ-ÿ0-9 ]+$/)]],
      year: [null, Validators.required],
      genreId: [null, Validators.required],
      active: [true],      
      releaseDate: ['', Validators.required],
      budget:['', [Validators.required, Validators.min(10), Validators.max(100000000), Validators.pattern(/^\d+$/)]],
      poster: ['', Validators.required]
      
    });
  }

  @ViewChild('bookModalRef') modalElement!: ElementRef;
  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  
  loadBook(): void {
    this.servBook.getBook().subscribe((data: Book[]) => {
      this.booksAll = data;
      this.books = data;
    });
  }

 
  loadBookId(id: number): void {
    this.servBook.getBookId(id).subscribe((data: Book) => {
      this.book = data;
    });
  }

  getgeneroname(generoId:number){
    const genBuscar = this.generos.find((g)=> Number(g.id) === Number(generoId));
    return genBuscar ? genBuscar.name:"Sin genero";

  }

 
  loadGenero(): void {
    this.servBook.getGenre().subscribe((data: Genre[]) => {
      this.generos = data;
    });
  }


  getId(): string {
    if (this.books.length === 0) return '1';

    const id = this.books.map(t => Number(t.id) || 0);
    const stringId = Math.max(...id) + 1;

    return String(stringId);
  }


  search(busq: HTMLInputElement) {
    let parametro = busq.value.toLowerCase();
    if (!parametro) {
    this.books = [...this.booksAll];
    return;
  }
    this.servBook.searchBooks(parametro).subscribe((datos: Book[]) => {
      this.books = datos;
      
    });
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
      console.log("Libro enviado al view: ", book);
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
    
    if (this.formBook.invalid){ 
      if(this.formBook.invalid){
        alert("invalido")
      }
      return;

    }

    const datos = this.formBook.value;
    const nuevoLibro: any = { ...datos };

    if (this.editingId) {
      let bookUpdate: Book = { ...datos, id: this.editingId };
      this.servBook.updateBook(bookUpdate).subscribe(() => {
        alert("Libro actualizado");
        this.modalRef.hide();
        this.loadBook();
      });

    } else {

      //nuevoLibro.id = this.getId();
      /*const payload: any = { ...this.formBook.value };
       delete payload.id; // por si acaso*/
       let newBook :Book={...datos}
       console.log(newBook)
      this.servBook.addBook(newBook).subscribe(() => {
        alert("Libro creado");
        this.modalRef.hide();
        this.loadBook();
      });
    }
  }
     delete(book: Book){
      const confrimado = confirm('Estas seguro de eliminar la pelicula' + book.title + '?'); 
      if(confrimado){
        this.servBook.desactivateBook(book.id!).subscribe(()=>{
          alert("Eliminado Exitosamente"); 
          this.loadBook();
        })
      } 
     }
  }

  

    













