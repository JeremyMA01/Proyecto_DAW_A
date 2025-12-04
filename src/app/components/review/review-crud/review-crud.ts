import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { Review } from '../../../models/Review';
import { ServReviewJson } from '../../../services/review/serv-review-json';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Modal } from 'bootstrap';
declare var bootstrap:any;

@Component({
  selector: 'app-review-crud',
  imports: [ReactiveFormsModule, UpperCasePipe, DatePipe],
  templateUrl: './review-crud.html',
  styleUrl: './review-crud.css',
})
export class ReviewCrud {
  review:Review[] = [];
  formReview!:FormGroup;
  editingId!:number|null;
  modalRef:any;
  promedioGeneral: number = 0;
  totalOpiniones: number = 0;
  distribucion: any = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };
  
  currentBook: any = {
    "title": "Cien Años de Soledad",
    "author": "Gabriel García Márquez",
    "year": 1967,
    "genre": "Romance",
    "price": 20,
    "poster": "https://images.penguinrandomhouse.com/cover/9780307474728" // Una url real para que se vea bien
  };


  @ViewChild('reviewModalRef') modalElement!:ElementRef;
  ngAfterViewInit(){
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
    this.modalRef.show();
  }
  constructor(private servReview:ServReviewJson, private router:Router, private fb:FormBuilder){
    
      this.formReview = this.fb.group({
        user: [{value: '', disable:true}],
        score:['',[Validators.required]],
        comment:['',[Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
        isRecommend:[false,[Validators.requiredTrue]],
        publishDate:['',[Validators.required]]    
      });
  }

  ngOnInit(){
    this.loadReview();
  }

  loadReview():void{
    this.servReview.getReview().subscribe(
      (data:Review[])=>{
        this.review = data;
        this.calcularEstadistica();
      });
  }

  calcularEstadistica(){
    if(this.review.length === 0)return;
    this.totalOpiniones = this.review.length;
    let sumaTotalPuntos = 0;

    this.distribucion = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};

    this.review.forEach(r =>{
      sumaTotalPuntos += r.score;
      
      if(this.distribucion[r.score] !== undefined){
        this.distribucion[r.score]++;
      }
    });

    this.promedioGeneral = sumaTotalPuntos / this.totalOpiniones;
    this.promedioGeneral = parseFloat(this.promedioGeneral.toFixed(1));
  }

  getPorcentaje(estrellas:number):number{
    if(this.totalOpiniones === 0)return 0;
    const cantidad = this.distribucion[estrellas];
    return (cantidad / this.totalOpiniones) * 100;


  }

  getScore(score:number):number[]{
    return Array(5).fill(0).map((_, i) => (i < score ? 1: 0));
  }

  getAvatarClass(name:string):string{
    let colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8', '#009688', '#FFC107'];
    let index = name.length % colors.length;
    return colors[index];
  }

  save(){
    if(this.formReview.invalid){
      this.formReview.markAllAsTouched();
      return;
    }

    const datos = this.formReview.getRawValue();

    if(this.editingId){
      //Actualizar
      let reviewUpdate:Review = {...datos, id:this.editingId} as Review; 
      this.servReview.updateReview(reviewUpdate).subscribe(()=>{
        alert("Reseña actualizada con exito!");
        this.modalRef.hide();
        this.loadReview();
      });
    }else{
      //Publicar
      let reviewAdd:Review = {...datos} as Review;
      this.servReview.addReview(reviewAdd).subscribe(()=>{
        alert("Reseña publicada!");
        this.modalRef.hide();
        this.loadReview();
      });
    }
  }

  openView():void{
    this.editingId = null;
    this.formReview.reset();
    this.modalRef.show();
  }

  openEdit(review:Review):void{
    this.editingId = review.id ?? null;
    this.formReview.patchValue(review);
    this.modalRef.show();
  }
    delete(id:number){
      const confirmar = confirm('¿Estas seguro de eliminar la reseña?');
      if(confirmar){
        this.servReview.deleteReview(id).subscribe(()=>{
          alert('Reseña eliminada');
          this.loadReview();
        })
      }
  }
    search(busq:HTMLInputElement){
      let parametro = busq.value.toLowerCase();
      this.servReview.searchReview(parametro).subscribe((dato:Review[])=>{
        this.review = dato;
      })
    }

   
}

