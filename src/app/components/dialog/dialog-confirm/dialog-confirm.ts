import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  templateUrl: './dialog-confirm.html',
  styleUrl: './dialog-confirm.css',
})
export class DialogConfirm {

  @Output() aceptar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();


}
