import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  form: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    this.usuarioService.getUsuarios().subscribe((usuarios: Usuario[]) => {
      const encontrado = usuarios.find(
        u => u.email === email && u.password === password && u.estadoActivo
      );

      if (encontrado) {
        this.errorMsg = '';
        // Aquí podrías guardar sesión si quieres
        // localStorage.setItem('usuarioActual', JSON.stringify(encontrado));
        this.router.navigate(['/home-components']);   // Home después de login
      } else {
        this.errorMsg = 'Correo o contraseña incorrectos, o usuario inactivo.';
      }
    });
  }
}