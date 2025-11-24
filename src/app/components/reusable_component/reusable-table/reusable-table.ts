import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reusable-table',
  imports: [],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.css',
})
export class ReusableTable {
  //Datos que se mostraran en las filas
  @Input() datos:any[] = [];
  //Las columnas pertenecientes a las tablas
  @Input() columnas:{ key:string; label:string}[] = [];
  @Output() filaClick = new EventEmitter<any>();
  //ngOnInit(){}

  //variables para la paginacion
  page = 1;
  pageSize = 5;
    
  ngOnChanges(){
    if(!this.columnas && this.datos.length > 0){
      this.columnas = Object.keys(this.datos[0]).map(key => ({
        key,
        label: this.capitalizar(key)
      }));
    }
  }

  onFilaClick(fila:any){
    this.filaClick.emit(fila);
  }

  private capitalizar(text:string){
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  pageActual(){
    const inicio = (this.page - 1) * this.pageSize;
    const fin = inicio + this.pageSize;
    return this.datos.slice(inicio,fin);
  }

  totalPaginas(){
    return Math.ceil(this.datos.length / this.pageSize);
  }

  setPage(p: number) {
  this.page = p;
  }

}
