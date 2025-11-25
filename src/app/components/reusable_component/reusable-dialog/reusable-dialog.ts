import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reusable-dialog', 
  imports: [CommonModule],
  templateUrl: './reusable-dialog.html', 
  styleUrl: './reusable-dialog.css',     
})
export class ReusableDialog { 

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