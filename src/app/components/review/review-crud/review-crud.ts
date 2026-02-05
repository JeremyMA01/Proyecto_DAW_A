import { Component, Input, ViewChild } from '@angular/core';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { Router } from '@angular/router';
import { Review } from '../../../models/Review';
import { ReusableTable } from '../../reusable_component/reusable-table/reusable-table';
import { ReusableReviewForm } from '../../reusable_component/reusable-review-form/reusable-review-form';
import { ReusableDialog } from '../../reusable_component/reusable-dialog/reusable-dialog'; 
import { ServReviewApi } from '../../../services/review/serv-review-api';

@Component({
  selector: 'app-review-crud',
  standalone: true,
  imports: [ReusableTable, ReusableReviewForm, ReusableDialog], 
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


  showSuccessDialog = false;
  showErrorDialog = false;
  showDeleteDialog = false;
  dialogMessage = '';
  dialogTitle = '';
  reviewParaEliminar: Review | null = null;

  constructor(
    private servReview:ServReviewApi,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReview();
  }
  
  loadReview(): void {
    this.servReview.getReviews().subscribe((data: Review[]) => {
      this.reviews = data;
    });
  }

  loadReviewBook(id: number): void {
    this.servReview.getReviewsBook(id).subscribe((data: Review[]) => {
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
      : this.getLocalDateString(),
    };

    if (reviewF.id) {
      this.servReview.updateReview(reviewF).subscribe(
        () => {
          this.showSuccess('Reseña editada exitosamente');
          this.loadReview();
        },
        (error) => {
          this.showError('Error al editar reseña: ' + error.message);
        }
      );
    } else {
      this.servReview.addReview(reviewF).subscribe(
        () => {
          this.showSuccess('Reseña creada exitosamente');
          this.loadReview();
        },
        (error) => {
          this.showError('Error al crear reseña: ' + error.message);
        }
      );
    }
  }


  search(parametroRaw: string): void {
    const parametro = (parametroRaw || '').toLowerCase().trim();

    if (parametro === '') {
      this.loadReview();
      return;
    }
    this.servReview.searchReview(parametro).subscribe(data => this.reviews = data);

  }


    private getLocalDateString(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }


  
  
  delete(review: Review): void {
    this.reviewParaEliminar = review;
    this.showDeleteDialog = true;
  }

  confirmarEliminar(): void {
    if (this.reviewParaEliminar) {
      this.servReview.deleteReview(this.reviewParaEliminar.id!).subscribe(
        () => {
          this.showSuccess('Reseña eliminada exitosamente');
          this.showDeleteDialog = false;
          this.reviewParaEliminar = null;
          this.loadReview();
        },
        (error) => {
          this.showError('Error al eliminar reseña: ' + error.message);
          this.showDeleteDialog = false;
          this.reviewParaEliminar = null;
        }
      );
    }
  }

  cancelarEliminar(): void {
    this.showDeleteDialog = false;
    this.reviewParaEliminar = null;
  }

  onVerClick(review: Review): void {
    console.log('Ver reseña:', review);
  }

  private showSuccess(message: string): void {
    this.dialogTitle = 'Éxito';
    this.dialogMessage = message;
    this.showSuccessDialog = true;
  }

  private showError(message: string): void {
    this.dialogTitle = 'Error';
    this.dialogMessage = message;
    this.showErrorDialog = true;
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
  }
}