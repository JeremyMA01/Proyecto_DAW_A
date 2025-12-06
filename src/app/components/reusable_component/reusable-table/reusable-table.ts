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

  // Datos que se mostrarán en las filas
  @Input() datos: any[] = [];

  // Columnas de la tabla
  @Input() columnas: { key: string; label: string }[] = [];

  // Eventos hacia el padre
  @Output() filaClick = new EventEmitter<any>();

  // 👉 Este lo usa BookList (para libros)
  @Output() emilinarClick = new EventEmitter<any>();

  // 👉 Este lo usa CrudUsuariosComponent (para usuarios)
  @Output() eliminarClick = new EventEmitter<any>();

  @Output() verclick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();

  // Paginación
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

  Onview(fila: any) {
    this.verclick.emit(fila);
  }

  // 👇 Click en el tachito
  onEliminarClick(fila: any, event: MouseEvent) {
    event.stopPropagation();        // No disparamos el click de la fila
    this.eliminarClick.emit(fila);  // Para CrudUsuariosComponent
    this.emilinarClick.emit(fila);  // Para BookList (mantiene compatibilidad)
  }

  OnEditClick(fila: any) {
    this.editClick.emit(fila);
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
