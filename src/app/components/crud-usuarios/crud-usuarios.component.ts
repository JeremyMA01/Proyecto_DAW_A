import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

import { ReusableTable } from '../reusable_component/reusable-table/reusable-table';
import { ReusableDialog } from '../reusable_component/reusable-dialog/reusable-dialog';

declare const bootstrap: any;

@Component({
  selector: 'app-crud-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReusableTable,
    ReusableDialog
  ],
  templateUrl: './crud-usuarios.component.html',
  styleUrl: './crud-usuarios.component.css',
})
export class CrudUsuariosComponent implements OnInit {

  form!: FormGroup;
  usuarios: Usuario[] = [];

  columnasTabla = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'rol', label: 'Rol' },
    { key: 'active', label: 'Estado' }
  ];

  @ViewChild('usuarioModalRef') modalElement!: ElementRef;
  modalRef: any;

  editando = false;
  usuarioEditando: Usuario | null = null;

  showDeleteDialog = false;
  showSuccessDialog = false;
  showErrorDialog = false;
  showFormErrorDialog = false;

  successMessage = '';
  errorMessage = '';
  formErrorMessage = '';

  usuarioParaEliminar: Usuario | null = null;

  readonly patronSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  readonly patronSoloNumeros = /^[0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
  }

  ngAfterViewInit(): void {
    if (this.modalElement) {
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  // 🔑 GETTER NECESARIO PARA EL HTML (f['campo'])
  get f() {
    return this.form.controls;
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.patronSoloLetras)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(this.patronSoloNumeros), Validators.minLength(7), Validators.maxLength(15)]],
      ciudad: ['', [Validators.required, Validators.pattern(this.patronSoloLetras)]],
      rol: ['lector', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      active: [true]
    });
  }

  private cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: (err) => console.error(err)
    });
  }

 
  search(busq: HTMLInputElement): void {
    const parametro = busq.value.toLowerCase();
    this.usuarioService.searchUsuarios(parametro).subscribe({
      next: (datos) => this.usuarios = datos,
      error: (err) => console.error(err)
    });
  }

  openNew(): void {
    this.editando = false;
    this.usuarioEditando = null;
    this.form.reset({
      nombre: '',
      email: '',
      telefono: '',
      ciudad: '',
      rol: 'lector',
      password: '',
      active: true
    });
    this.modalRef.show();
  }

  onEditarClick(usuario: Usuario): void {
    this.editando = true;
    this.usuarioEditando = usuario;

    this.form.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono || '',
      ciudad: usuario.ciudad,
      rol: usuario.rol,
      password: usuario.password,
      active: usuario.active
    });

    this.modalRef.show();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formErrorMessage = 'Por favor complete correctamente el formulario';
      this.showFormErrorDialog = true;
      return;
    }

    const datos = this.form.value;

    if (this.editando && this.usuarioEditando) {

      const usuarioActualizado: Usuario = {
        ...this.usuarioEditando,
        ...datos
      };

      this.usuarioService.actualizar(usuarioActualizado).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado correctamente';
          this.showSuccessDialog = true;
          this.modalRef.hide();
          this.cargarUsuarios();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.showErrorDialog = true;
        }
      });

    } else {

      
      const nuevoUsuario: Usuario = {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || '',
        ciudad: datos.ciudad,
        rol: datos.rol,
        password: datos.password,
        active: datos.active
      };

      this.usuarioService.crear(nuevoUsuario).subscribe({
        next: () => {
          this.successMessage = 'Usuario creado correctamente';
          this.showSuccessDialog = true;
          this.modalRef.hide();
          this.cargarUsuarios();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.showErrorDialog = true;
        }
      });
    }
  }

  onEliminarClick(usuario: Usuario): void {
    this.usuarioParaEliminar = usuario;
    this.showDeleteDialog = true;
  }

  confirmarEliminar(): void {
    if (!this.usuarioParaEliminar) return;

    this.usuarioService
      .eliminar(Number(this.usuarioParaEliminar.id))
      .subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado correctamente';
          this.showSuccessDialog = true;
          this.showDeleteDialog = false;
          this.usuarioParaEliminar = null;
          this.cargarUsuarios();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.showErrorDialog = true;
        }
      });
  }

  cancelarEliminar(): void {
    this.showDeleteDialog = false;
    this.usuarioParaEliminar = null;
  }

  onToggleActivo(usuario: Usuario): void {
    const usuarioActualizado: Usuario = {
      ...usuario,
      active: !usuario.active
    };

    this.usuarioService.actualizar(usuarioActualizado).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => {
        this.errorMessage = err.message;
        this.showErrorDialog = true;
      }
    });
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
  }

  closeFormErrorDialog(): void {
    this.showFormErrorDialog = false;
  }

  
  bloquearNumeros(event: KeyboardEvent): void {
    if (/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  bloquearLetras(event: KeyboardEvent): void {
    if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
