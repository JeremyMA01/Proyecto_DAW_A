import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { ReusableDialog } from '../reusable_component/reusable-dialog/reusable-dialog';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ReusableDialog],
  templateUrl: './registro-usuario.html',
  styleUrl: './registro-usuario.css',
})
export class RegistroUsuarioComponent {

  form: FormGroup;
  registroExitosoVisible = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      ciudad: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        ]
      ],
      rol: ['lector', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  soloLetras(event: KeyboardEvent): void {
    if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ ]/.test(event.key)) {
      event.preventDefault();
    }
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.value;

    // ✅ SIN ID (lo crea el backend)
    const nuevoUsuario: Usuario = {
      nombre: valores.nombre,
      email: valores.email,
      telefono: valores.telefono || '',
      ciudad: valores.ciudad,
      rol: 'lector',
      password: valores.password,
      active: true
    };

    this.usuarioService.crear(nuevoUsuario).subscribe({
      next: () => {
        this.registroExitosoVisible = true;
        this.form.reset({ rol: 'lector' });
      },
      error: (err) => console.error(err)
    });
  }

  irAlLogin(): void {
    this.registroExitosoVisible = false;
    this.router.navigate(['/login']);
  }
}
