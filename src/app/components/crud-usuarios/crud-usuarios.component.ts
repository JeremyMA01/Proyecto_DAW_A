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

  // Formulario reactivo
  form!: FormGroup;

  // Datos
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  // Columnas para la tabla reutilizable
  columnasTabla = [
    { key: 'id',           label: 'ID' },
    { key: 'nombre',       label: 'Nombre' },
    { key: 'email',        label: 'Correo' },
    { key: 'rol',          label: 'Rol' },
    { key: 'ciudad',       label: 'Ciudad' },
    { key: 'estadoActivo', label: 'Activo' },
    { key: 'action',       label: 'Acciones' }
  ];

  // Texto de búsqueda
  terminoBusqueda = '';

  // Edición
  editando = false;
  usuarioSeleccionado: Usuario | null = null;

  // Diálogo de confirmación de eliminación
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

  /**
   * Inicializa el formulario con validaciones:
   * - nombre y ciudad: solo letras y espacios
   * - teléfono: solo números (7 a 15 dígitos)
   */
  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          // solo letras y espacios (incluye tildes y ñ)
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      telefono: [
        '',
        [
          // opcional, pero si escribe algo deben ser solo números (7-15 dígitos)
          Validators.pattern(/^[0-9]{7,15}$/)
        ]
      ],
      ciudad: [
        '',
        [
          Validators.required,
          // solo letras y espacios
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        ]
      ],
      rol: [
        'lector',
        [
          Validators.required
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ],
      estadoActivo: [true]
    });
  }

  /**
   * Carga todos los usuarios desde JSON-Server
   */
  private cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.aplicarFiltro();
    });
  }

  /**
   * Aplica filtro en memoria por nombre, email y ciudad
   */
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

  /**
   * Guardar (crear o actualizar) usando JSON-Server
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.value;

    if (this.editando && this.usuarioSeleccionado) {
      // ACTUALIZAR
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
      // CREAR
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

  /**
   * Click en la fila (o en el lápiz) → cargar datos al formulario
   */
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

  /**
   * Click en el botón eliminar de la tabla → abrir modal de confirmación
   */
  onEliminarClick(usuario: Usuario): void {
    this.usuarioParaEliminar = usuario;
    this.dialogVisible = true;
  }

  /**
   * Confirmar eliminar en el diálogo reutilizable
   */
  confirmarEliminar(): void {
    if (!this.usuarioParaEliminar) return;

    this.usuarioService.eliminar(this.usuarioParaEliminar.id).subscribe(() => {
      this.dialogVisible = false;
      this.usuarioParaEliminar = null;
      this.cargarUsuarios();
    });
  }

  /**
   * Cancelar eliminación
   */
  cancelarEliminar(): void {
    this.dialogVisible = false;
    this.usuarioParaEliminar = null;
  }

  /**
   * Reset del formulario a estado inicial
   */
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

  /**
   * Helper para mostrar errores en los campos
   */
  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  /**
   * Click en el icono de editar de la tabla
   */
  onEditarClick(usuario: Usuario): void {
    this.onFilaClick(usuario);
  }

  /**
   * Click en el switch/acción de "Activo / Inactivo"
   * (si lo conectas desde la tabla con (toggleActivo)="onToggleActivo($event)")
   */
  onToggleActivo(usuario: Usuario): void {
    const actualizado: Usuario = {
      ...usuario,
      estadoActivo: !usuario.estadoActivo
    };

    this.usuarioService.actualizar(actualizado).subscribe(() => {
      if (this.usuarioSeleccionado && this.usuarioSeleccionado.id === actualizado.id) {
        this.usuarioSeleccionado = actualizado;
        this.form.patchValue({ estadoActivo: actualizado.estadoActivo });
      }
      this.cargarUsuarios();
    });
  }

  /**
   * Click en "ver" (si en algún momento quieres usarlo)
   */
  onVerClick(usuario: Usuario): void {
    console.log('Ver usuario:', usuario);
  }
}
