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
  @Input() columnas: { key: string; label: string }[] = [];

  @Output() filaClick = new EventEmitter<any>();

  // para compatibilidad con BookList
  @Output() emilinarClick = new EventEmitter<any>();

  // para CrudUsuarios
  @Output() eliminarClick = new EventEmitter<any>();

  @Output() verClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();

  // 👇 IMPORTANTE: emitimos la FILA, no un Event
  @Output() toggleActivo = new EventEmitter<any>();

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


  OnEditClick(fila: any) {
    this.editClick.emit(fila);
  }

  onEliminarClick(fila: any) {
    this.eliminarClick.emit(fila);
    this.emilinarClick.emit(fila); // Mantengo ambos por tu compatibilidad
  }

  OnToggleActivo(fila: any, event: MouseEvent) {
    event.stopPropagation(); // Evita que se abra el detalle al cambiar estado
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
