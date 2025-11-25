import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reusable-dialog', // <--- 1. CAMBIO DE NOMBRE (antes app-dialog-confirm)
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reusable-dialog.html', // Coincide con tu archivo físico
  styleUrl: './reusable-dialog.css',     // Coincide con tu archivo físico
})
export class ReusableDialog { // <--- 2. CAMBIO DE NOMBRE DE CLASE (antes DialogConfirm)

  @Input() titulo: string = 'Confirmación';
  @Input() mensaje: string = '¿Estás seguro de realizar esta acción?';
  @Input() textoAceptar: string = 'Aceptar';
  @Input() textoCancelar: string = 'Cancelar';
  @Input() tipo: 'danger' | 'primary' = 'primary';

  @Output() aceptar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onAceptar() {
    this.aceptar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }
}