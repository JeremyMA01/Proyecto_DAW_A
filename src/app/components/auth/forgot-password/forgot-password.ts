import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import { ReusableDialog } from '../../reusable_component/reusable-dialog/reusable-dialog';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReusableDialog],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {

  email = '';
  errorMsg = '';
  okMsg = '';

  dialogVisible = false;
  codigoGenerado = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  enviarCodigo() {
    const usuario = this.usuarioService
      .getUsuariosSnapshot()
      .find(u => u.email === this.email);

    if (!usuario) {
      this.errorMsg = 'El correo no está registrado.';
      this.okMsg = '';
      return;
    }

    this.errorMsg = '';

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    this.codigoGenerado = codigo;

    // Guardar temporalmente
    localStorage.setItem('resetEmail', this.email);
    localStorage.setItem('resetCode', codigo);

    
    this.dialogVisible = true;
  }

  irAVerificar() {
    this.dialogVisible = false;
    this.router.navigate(['/verificar-codigo']);
  }

  cerrarModal() {
    this.dialogVisible = false;
  }
}
