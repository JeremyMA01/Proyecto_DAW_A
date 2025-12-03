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
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      ciudad: ['', Validators.required],
      rol: ['lector', Validators.required],   // por defecto lector
      password: ['', [Validators.required, Validators.minLength(6)]],
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

    const valores = this.form.value;

    const nuevoUsuario: Omit<Usuario, 'id'> = {
      nombre: valores.nombre,
      email: valores.email,
      telefono: valores.telefono,
      ciudad: valores.ciudad,
      rol: valores.rol,
      password: valores.password,
      estadoActivo: true,   // al registrarse queda activo
    };

    this.usuarioService.crear(nuevoUsuario).subscribe(() => {
      // No podemos escribir en el .json desde el navegador,
      // pero el servicio lo guarda en memoria (BehaviorSubject)
      this.registroExitosoVisible = true;
      this.form.reset({
        rol: 'lector',
      });
    });
  }

  irAlLogin(): void {
    this.registroExitosoVisible = false;
    this.router.navigate(['/login']);
  }
}
