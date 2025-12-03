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

  @Output() filaClick = new EventEmitter<any>();
  @Output() eliminarClick = new EventEmitter<any>();   // 👈 nombre corregido

  // variables para la paginación
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

  onEliminarClick(fila: any) {
    this.eliminarClick.emit(fila);
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
    return Math.ceil(this.datos.length / this.pageSize);
  }

  setPage(p: number) {
    this.page = p;
  }
}
