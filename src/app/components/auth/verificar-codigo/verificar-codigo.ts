import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar-codigo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verificar-codigo.html',
  styleUrl: './verificar-codigo.css',
})
export class VerificarCodigoComponent {

  codigoIngresado = '';
  errorMsg = '';

  constructor(private router: Router) {}

  verificar() {
    const codigoGuardado = localStorage.getItem('resetCode');

    if (this.codigoIngresado === codigoGuardado) {
      // código correcto → pasar a nueva contraseña
      this.router.navigate(['/nueva-contrasena']);
    } else {
      this.errorMsg = 'Código incorrecto.';
    }
  }
}
