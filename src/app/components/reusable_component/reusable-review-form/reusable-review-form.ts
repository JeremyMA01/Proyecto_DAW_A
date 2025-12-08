import { AfterViewInit, Component, ElementRef, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { Review } from '../../../models/Review';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap:any;

@Component({
  selector: 'app-reusable-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reusable-review-form.html',
  styleUrl: './reusable-review-form.css',
})
export class ReusableReviewForm implements AfterViewInit{
  @Input() mostrarCampos:boolean = false;
  @Output() onSaveReview = new EventEmitter<Review>();

  formReview!:FormGroup;
  editingId:number | null = null;
  modalRef:any;
  
  constructor(private fb:FormBuilder){
    this.formReview = this.fb.group({
        user:['', [Validators.required, Validators.minLength(3), Validators.maxLength(25),
                  Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
             ]],
        score:['', Validators.required],
        comment:['', [Validators.required, Validators.minLength(3), Validators.maxLength(300),
                  Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,\s¿?\[\]'"()-]+$/)]],
        isRecommend:[true],
        id: ['', Validators.required],
        id_book: ['', Validators.required]
    });
  } 

  @ViewChild('reviewModalRef')modalElement!:ElementRef;
  ngAfterViewInit(){
    if(this.modalElement){
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement, {
        focus:false
      });
    }
  }

  /*Abrir modalRef - Crear*/
  /*
  openNew(){
    this.editingId = null;
    this.formReview.reset({isRecommend:true});
    
    if(this.modalElement){
      this.modalElement.nativeElement.removeAttribute('aria-hidden');
      this.modalElement.nativeElement.removeAttribute('tabindex');
    }

    this.modalRef.show();
  }
  */

  openNew(){
    this.editingId = null;
    this.formReview.reset({isRecommend:true});
    
    const id = this.formReview.get('id');
    const id_book = this.formReview.get('id_book');
    if(this.mostrarCampos){
      id?.setValidators([Validators.required]);
      id_book?.setValidators([Validators.required]);
    }else{
      id?.clearValidators();
      id_book?.clearValidators();
    }
    
    id?.updateValueAndValidity();
    id_book?.updateValueAndValidity();

      this.modalRef.show();

  }
  
  /*Abrir modalRef - Editar*/
  openEdit(review:Review){
    this.editingId = review.id ?? null;   
    this.formReview.patchValue(review);

    if(this.modalElement){
      this.modalElement.nativeElement.removeAttribute('aria-hidden');
      this.modalElement.nativeElement.removeAttribute('tabindex');
    }
  
    this.modalRef.show();
  } 

  /*Cerrar el modal*/
  close(){
    this.modalRef.hide();
  }

  /*Guardar contenido formReview*/
  save(){
    console.log('Entrando a guardar');

    if(this.formReview.invalid){
        this.formReview.markAllAsTouched();
        console.log('Campos invalidos, revise por favor');
        return;
    }

    //Obteniendo los valores del formulario
    const datos = this.formReview.value;
    //Creando el objeto final
    const reviewF: Review = {...datos, id:this.editingId};
    //Enviando el objeto al padre
    this.onSaveReview.emit(reviewF);
    this.close();
  }
 

}
