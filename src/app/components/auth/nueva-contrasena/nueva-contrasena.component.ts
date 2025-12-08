import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-nueva-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  templateUrl: './nueva-contrasena.component.html',
  styleUrl: './nueva-contrasena.component.css'
})
export class NuevaContrasenaComponent {

  password = '';
  confirmarPassword = '';
  errorMsg = '';
  okMsg = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  guardarNuevaPassword() {
    // --- VALIDACIONES DE FORMULARIO ---
    if (!this.password || !this.confirmarPassword) {
      this.errorMsg = 'Debes ingresar y confirmar la nueva contraseña.';
      this.okMsg = '';
      return;
    }

    if (this.password.length < 4) {
      this.errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
      this.okMsg = '';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      this.okMsg = '';
      return;
    }

    // --- RECUPERAR EMAIL DEL LOCALSTORAGE ---
    const email = localStorage.getItem('resetEmail');

    if (!email) {
      this.errorMsg = 'No se encontró el correo asociado. Vuelve a iniciar el proceso.';
      this.okMsg = '';
      return;
    }

    // --- AHORA TODO ES ASÍNCRONO CON JSON SERVER ---
    this.usuarioService.getUsuarios().subscribe((usuarios: Usuario[]) => {

      const usuario = usuarios.find((u: Usuario) => u.email === email);

      if (!usuario) {
        this.errorMsg = 'El usuario ya no existe o fue eliminado.';
        this.okMsg = '';
        return;
      }

      // --- CREAR OBJETO ACTUALIZADO ---
      const actualizado: Usuario = {
        ...usuario,
        password: this.password
      };

      // --- ACTUALIZAR EN JSON SERVER ---
      this.usuarioService.actualizar(actualizado).subscribe(() => {
        
        this.errorMsg = '';
        this.okMsg = 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.';

        // Limpiar datos temporales
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetCode');

        // Redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      });
    });
  }
}
