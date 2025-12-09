import { Component, Input, ViewChild } from '@angular/core';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { Router } from '@angular/router';
import { Review } from '../../../models/Review';
import { ReusableTable } from '../../reusable_component/reusable-table/reusable-table';
import { ReusableReviewForm } from '../../reusable_component/reusable-review-form/reusable-review-form';

@Component({
  selector: 'app-review-crud',
  standalone: true,
  imports: [ReusableTable, ReusableReviewForm],
  templateUrl: './review-crud.html',
  styleUrl: './review-crud.css',
})
export class ReviewCrud {
  reviews: Review[] = [];

  @ViewChild('modalReview') modalReview!: ReusableReviewForm;

  columnas = [
    { key: 'id', label: 'ID' },
    { key: 'id_book', label: 'Libro' },
    { key: 'user', label: 'Usuario' },
    { key: 'score', label: 'Score' },
    { key: 'comment', label: 'Comentario' },
    { key: 'isRecommend', label: 'Recomendación' },
    { key: 'publishedDate', label: 'Fecha de Publicación' },
  ];

  constructor(
    private servReview: ServReviewJson,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReview();
  }

  loadReview(): void {
    this.servReview.getReview().subscribe((data: Review[]) => {
      this.reviews = data;
    });
  }

  
  loadReviewBook(id: number): void {
    this.servReview.getReviewIdBook(id).subscribe((data: Review[]) => {
      this.reviews = data;
    });
  }

  search(parametroRaw: string): void {
    const parametro = (parametroRaw || '').toLowerCase().trim();

    if (parametro === '') {
      this.loadReview();
      return;
    }

    this.servReview.searchReview(parametro).subscribe((data: Review[]) => {
      this.reviews = data;
    });
  }

  save(review: Review) {
    const reviewF: any = {
      ...review,
      id: review.id,
      id_book: Number(review.id_book),
      score: Number(review.score),
      publishedDate: review.id ? review.publishedDate
        : new Date().toISOString().substring(0,10),
    };

    if (reviewF.id) {
      this.servReview.updateReview(reviewF).subscribe(() => {
        alert('Reseña Editada!');
        this.loadReview();
      });
    } else {
      reviewF.id = this.getId();

      this.servReview.addReview(reviewF).subscribe(() => {
        alert('Reseña Creada!');
        this.loadReview();
      });
    }
  }

  getId(): string {
    if (this.reviews.length === 0) return '1';

    const id = this.reviews.map(r => Number(r.id) || 0);
    const stringId = Math.max(...id) + 1;

    return String(stringId);
  }

  delete(review: Review): void {
    const confirmar = confirm('¿Estás seguro de eliminar la reseña?');

    if (confirmar) {
      this.servReview.deleteReview(review.id!).subscribe(() => {
        alert('Reseña eliminada!');
        this.loadReview();
      });
    }
  }

}
