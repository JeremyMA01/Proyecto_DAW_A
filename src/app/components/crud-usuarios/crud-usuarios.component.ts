import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

import { ReusableTable } from '../reusable_component/reusable-table/reusable-table';
import { ReusableDialog } from '../reusable_component/reusable-dialog/reusable-dialog';

@Component({
  selector: 'app-crud-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReusableTable,
    ReusableDialog
  ],
  templateUrl: './crud-usuarios.component.html',
  styleUrl: './crud-usuarios.component.css',
})
export class CrudUsuariosComponent implements OnInit {

  // formulario reactivo
  form!: FormGroup;

  // datos
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  // columnas para la tabla reutilizable
  columnasTabla = [
    { key: 'id',           label: 'ID' },
    { key: 'nombre',       label: 'Nombre' },
    { key: 'email',        label: 'Correo' },
    { key: 'rol',          label: 'Rol' },
    { key: 'ciudad',       label: 'Ciudad' },
    { key: 'estadoActivo', label: 'Activo' },
    { key: 'action', label: 'Acciones' }
  ];

  terminoBusqueda = '';

  // edición
  editando = false;
  usuarioSeleccionado: Usuario | null = null;

  // diálogo de confirmación
  dialogVisible = false;
  usuarioParaEliminar: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      ciudad: ['', Validators.required],
      rol: ['lector', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      estadoActivo: [true]
    });
  }

  private cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro(): void {
    const txt = this.terminoBusqueda.toLowerCase().trim();

    if (!txt) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(txt) ||
      u.email.toLowerCase().includes(txt) ||
      u.ciudad.toLowerCase().includes(txt)
    );
  }

  onBuscarCambio(): void {
    this.aplicarFiltro();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.value;

    if (this.editando && this.usuarioSeleccionado) {
      const actualizado: Usuario = {
        ...this.usuarioSeleccionado,
        nombre: valores.nombre,
        email: valores.email,
        telefono: valores.telefono || '',
        ciudad: valores.ciudad,
        rol: valores.rol,
        password: valores.password,
        estadoActivo: valores.estadoActivo
      };

      this.usuarioService.actualizar(actualizado).subscribe(() => {
        this.resetFormulario();
        this.cargarUsuarios();
      });

    } else {
      const nuevo: Omit<Usuario, 'id'> = {
        nombre: valores.nombre,
        email: valores.email,
        telefono: valores.telefono || '',
        ciudad: valores.ciudad,
        rol: valores.rol,
        password: valores.password,
        estadoActivo: valores.estadoActivo
      };

      this.usuarioService.crear(nuevo).subscribe(() => {
        this.resetFormulario();
        this.cargarUsuarios();
      });
    }
  }

  // viene del componente app-reusable-table (click en una fila)
  onFilaClick(usuario: Usuario): void {
    this.editando = true;
    this.usuarioSeleccionado = usuario;

    this.form.setValue({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono || '',
      ciudad: usuario.ciudad,
      rol: usuario.rol,
      password: usuario.password,
      estadoActivo: usuario.estadoActivo
    });
  }

  // viene del componente app-reusable-table (click en botón eliminar)
  onEliminarClick(usuario: Usuario): void {
    this.usuarioParaEliminar = usuario;
    this.dialogVisible = true;
  }

  // aceptar en app-reusable-dialog
  confirmarEliminar(): void {
    if (!this.usuarioParaEliminar) return;

    this.usuarioService.eliminar(this.usuarioParaEliminar.id).subscribe(() => {
      this.dialogVisible = false;
      this.usuarioParaEliminar = null;
      this.cargarUsuarios();
    });
  }

  // cancelar en app-reusable-dialog
  cancelarEliminar(): void {
    this.dialogVisible = false;
    this.usuarioParaEliminar = null;
  }

  resetFormulario(): void {
    this.form.reset({
      nombre: '',
      email: '',
      telefono: '',
      ciudad: '',
      rol: 'lector',
      password: '',
      estadoActivo: true
    });
    this.editando = false;
    this.usuarioSeleccionado = null;
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
