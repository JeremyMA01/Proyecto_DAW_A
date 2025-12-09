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
  @Input() generos: any[] = [];
  @Input() obtenerGeneroNombre!: (id: number) => string;

  @Input() columnas: { key: string; label: string }[] = [];

  @Output() filaClick = new EventEmitter<any>();
  @Output() searchClick = new EventEmitter<any>();
  @Output() newClick = new EventEmitter<any>();
  @Output() eliminarClick = new EventEmitter<any>();
  @Output() verClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() toggleActivo = new EventEmitter<any>();

  //busq: string = '';
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

  /*
  onSearch(user: string) {
    this.busq = user.toLowerCase();
    this.searchClick.emit(user);
    this.page = 1;
  }
    

  onNewClick() {
    this.newClick.emit();
  }
*/
  OnEditClick(fila: any) {
    this.editClick.emit(fila);
  }

  onEliminarClick(fila: any) {
    this.eliminarClick.emit(fila);
  }

  OnToggleActivo(fila: any, event: MouseEvent) {
    event.stopPropagation();
    this.toggleActivo.emit(fila);
  }

  private capitalizar(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  pageActual() {
    const inicio = (this.page - 1) * this.pageSize;
    const fin = inicio + this.pageSize;
    return this.datos.slice(inicio, fin);
  }

  totalPaginas() {
    const total = Math.ceil(this.datos.length / this.pageSize);
    return total || 1;
  }

  setPage(p: number) {
    this.page = p;
  }
}
