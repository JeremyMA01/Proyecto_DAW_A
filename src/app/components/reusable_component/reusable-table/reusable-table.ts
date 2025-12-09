import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.css',
})
export class ReusableTable implements OnChanges {

  @Input() datos: any[] = [];
  @Input() generos:any[] =[]; 
  @Input() obtenerGeneroNombre!: (id: number) => string;

  @Input() columnas: { key: string; label: string }[] = [];

  @Output() filaClick = new EventEmitter<any>();
  
  @Output() searchClick = new EventEmitter<any>();

  @Output() newClick = new EventEmitter<any>();
  // para compatibilidad con BookList
  @Output() emilinarClick = new EventEmitter<any>();

  // para CrudUsuarios
  @Output() eliminarClick = new EventEmitter<any>();
  @Output() verClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();

  // 👇 IMPORTANTE: emitimos la FILA, no un Event
  @Output() toggleActivo = new EventEmitter<any>();
  busq:string = '';
  page = 1;
  pageSize = 5;

  
  ngOnChanges() {
    if ((!this.columnas || this.columnas.length === 0) && this.datos.length > 0) {
      this.columnas = Object.keys(this.datos[0]).map(key => ({
        key,
        label: this.capitalizar(key),
      }));
    }
  }

  onFilaClick(fila: any) {
    this.filaClick.emit(fila);
  }

  Onview(fila: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.verClick.emit(fila);
  }

  onSearch(user: string){
    this.busq = user.toLowerCase();
    this.searchClick.emit(user);
    this.page = 1;
  }


  OnEditClick(fila: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.editClick.emit(fila);
  }

  onEliminarClick(fila: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.eliminarClick.emit(fila);   // CrudUsuarios
    this.emilinarClick.emit(fila); 
    }  // BookList

  onNewClick(){
    this.newClick.emit();
  }
  



  OnToggleActivo(fila: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.toggleActivo.emit(fila);    // aquí sale un Usuario hacia el padre
  }


  private capitalizar(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  pageActual() {
    let filtrado = this.datos;
    if(this.busq){
      filtrado = this.datos.filter(r =>
        Object.values(r).some(val =>
          String(val).toLowerCase().includes(this.busq)
        ));
    }
    const inicio = (this.page - 1) * this.pageSize;
    const fin = inicio + this.pageSize;
    return filtrado.slice(inicio, fin);
  }

  totalPaginas() {
    let filtrado = this.datos;
    if(this.busq){
      filtrado = this.datos.filter( r => 
        Object.values(r).some(val => 
          String(val).toLowerCase().includes(this.busq)
        ));
    }
    const total = Math.ceil(filtrado.length / this.pageSize);
    return total || 1;
  }

  setPage(p: number) {
    this.page = p;
  }



}
