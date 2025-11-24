import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  //imports: [],
  templateUrl: './dialog-confirm.html',
  styleUrl: './dialog-confirm.css',
})
export class DialogConfirm {

//@Input() mensaje: string = "¿Seguro que desea eliminar?";
  @Output() aceptar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();


}
