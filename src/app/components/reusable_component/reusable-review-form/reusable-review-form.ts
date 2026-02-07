import { 
  AfterViewInit, 
  Component, 
  ElementRef, 
  Output, 
  ViewChild, 
  EventEmitter, 
  Input 
} from '@angular/core';
import { Review } from '../../../models/Review';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-reusable-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reusable-review-form.html',
  styleUrl: './reusable-review-form.css',
})
export class ReusableReviewForm implements AfterViewInit {

  @Input() mostrarCampos: boolean = false;
  @Output() onSaveReview = new EventEmitter<Review>();

  formReview!: FormGroup;
  editingId: number | null = null;
  modalRef: any;

  constructor(private fb: FormBuilder) {
    this.formReview = this.fb.group({
      user: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/),
        ],
      ],
      id_Book: [''],
      score: ['', Validators.required],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(300),
          Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,\s¿?\[\]'"()-]+$/),
        ],
      ],
      isRecommend: [true],
      publishedDate: ['']
    });
  }

  @ViewChild('reviewModalRef') modalElement!: ElementRef;

  ngAfterViewInit() {
    try{
      if (this.modalElement) {
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement, {
        focus: false,
      });
    }  
    }catch(error){
      console.warn("Bootstrap no cargó a tiempo, pero seguiremos con la lógica", error);
    }
    
  }

  openNew() {
    this.editingId = null;
    this.formReview.reset({ isRecommend: true, id_Book: '' });

    const idBookCtrl = this.formReview.get('id_Book');

    if (this.mostrarCampos) {
      idBookCtrl?.setValidators([Validators.required]);
    } else {
      idBookCtrl?.clearValidators();
    }

    idBookCtrl?.updateValueAndValidity();
    this.modalRef.show();
  }

  openEdit(review: Review) {
    this.editingId = review.id ?? null;
    this.formReview.patchValue(review);

    if (this.modalElement) {
      this.modalElement.nativeElement.removeAttribute('aria-hidden');
      this.modalElement.nativeElement.removeAttribute('tabindex');
    }

    this.modalRef.show();
  }

  close() {
    this.modalRef.hide();
  }

  save() {
    console.log('Entrando a guardar');

    if (this.formReview.invalid) {
      this.formReview.markAllAsTouched();
      console.log('Campos inválidos, revise por favor');
      return;
    }

    const datos = this.formReview.value;
    console.log("Datos: " + JSON.stringify(datos));

    const reviewF: Review = { ...datos,
       id: this.editingId
    };

    console.log("ReviewF" + JSON.stringify(reviewF));

    this.onSaveReview.emit(reviewF);
    this.close();
  }
}
