import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Review } from '../../../models/Review';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, UpperCasePipe, DatePipe } from '@angular/common';
import { ServBookJson } from '../../../services/serv-book-json';
import { Book } from '../../../models/Book';
import { ServHomeJson } from '../../../services/home/serv-home-json';

declare var bootstrap: any;

@Component({
  selector: 'app-review-view',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, ReactiveFormsModule],
  templateUrl: './review-view.html',
  styleUrl: './review-view.css',
})
export class ReviewView implements OnInit, AfterViewInit {
  reviews: Review[] = [];
  review: Review | null = null;
  book: Book | null = null;
  editingId: number | null = null;
  promedioGeneral: number = 0;
  totalOpiniones: number = 0;
  formReview!: FormGroup;
  modalRef: any;
  distribucion: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  currentBookId: number = 0;

  @ViewChild('reviewModalRef') modalElement!: ElementRef;

  constructor(
    private servReview: ServReviewJson,
    private servBook: ServBookJson,
    private servHome: ServHomeJson,
    private router: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formReview = this.fb.group({
      user: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500), Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,\s!?'"()-]+$/)]],
      score: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      isRecommend: [true]
    });
  }

  ngOnInit() {
    this.currentBookId = Number(this.router.snapshot.paramMap.get("id"));
    
    if (this.currentBookId) {
      this.loadBookId(this.currentBookId);
      this.loadReviewBook(this.currentBookId);
    }
  }

  ngAfterViewInit() {
    if (this.modalElement) {
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  loadBookId(id: number): void {
    if (id != 0) {
      this.servBook.getBookId(id).subscribe((data: Book) => {
          this.book = data;
      });
    }
  }

  loadReviewBook(id: number): void {
    this.servReview.getReviewIdBook(id).subscribe((data: Review[]) => {
        this.reviews = data;
        this.calcularEstadistica();
    });
  }

  calcularEstadistica() {
    if (this.reviews.length === 0) {
      this.totalOpiniones = 0;
      this.promedioGeneral = 0;
      this.distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      return;
    }

    this.totalOpiniones = this.reviews.length;
    let sumaTotalPuntos = 0;
    this.distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    this.reviews.forEach(r => {
      sumaTotalPuntos += r.score;
      if (this.distribucion[r.score] !== undefined) {
        this.distribucion[r.score]++;
      }
    });

    this.promedioGeneral = sumaTotalPuntos / this.totalOpiniones;
    this.promedioGeneral = parseFloat(this.promedioGeneral.toFixed(1));
  }

  getPorcentaje(estrellas: number): number {
    if (this.totalOpiniones === 0) return 0;
    const cantidad = this.distribucion[estrellas];
    return (cantidad / this.totalOpiniones) * 100;
  }

  getScore(score: number): number[] {
    return Array(5).fill(0).map((_, i) => (i < Math.round(score) ? 1 : 0));
  }

  getAvatarClass(name: string): string {
    if (!name) return '#ccc';
    let colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8', '#009688', '#FFC107'];
    let index = name.length % colors.length;
    return colors[index];
  }

  comprar(book: Book) {
    this.servHome.comprar(book);
  }

  openNew() {
    this.editingId = null;
    this.review = null;
    
    this.formReview.reset({
      user: '', 
      score: 5,
      isRecommend: true,
      comment: ''
    });

    if (this.modalRef) this.modalRef.show();
  }

  openEdit(r: Review) {
    this.editingId = r.id ?? null;
    this.review = r;
    this.formReview.patchValue(r);
    if (this.modalRef) this.modalRef.show();
  }

  save() {
    if (this.formReview.invalid) {
      this.formReview.markAllAsTouched();
      return;
    }

    const datos = this.formReview.value;
    
    if(this.currentBookId) datos.id_book = this.currentBookId;

    if (this.editingId) {
      let reviewUpdate: Review = { ...datos, id: this.editingId };
      this.servReview.updateReview(reviewUpdate).subscribe(() => {
        alert("¡Review Actualizada!");
        this.modalRef.hide();
        this.loadReviewBook(this.currentBookId); 
      });
    } else {
      let reviewNew: Review = { ...datos };
      this.servReview.addReview(reviewNew).subscribe(() => {
        alert("¡Review publicada!");
        this.modalRef.hide();
        this.loadReviewBook(this.currentBookId);
      });
    }
  }

  search(user: HTMLInputElement) {
    let parametro = user.value.toLowerCase();
    this.servReview.searchReview(parametro).subscribe((data: Review[]) => {
        this.reviews = data;
        // Opcional: recalcular estadística basada en búsqueda
    });
  }

  delete(review: Review) {
    const confirmar = confirm('¿Estas seguro de eliminar la reseña?');
    if (confirmar) {
      this.servReview.deleteReview(review.id!).subscribe(() => {
          alert("¡Eliminado exitosamente!");
          this.loadReviewBook(this.currentBookId); 
      });
    }
  }
}