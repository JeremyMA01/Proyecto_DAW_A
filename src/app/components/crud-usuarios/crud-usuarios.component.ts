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

  // PATRONES DE VALIDACIÓN (REGEX)
  // Solo letras, espacios y caracteres latinos (áéíóúñ...)
  readonly patronSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  // Solo números
  readonly patronSoloNumeros = /^[0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
  }

  /**
   * Inicializa el formulario con validaciones estrictas
   */
  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          // REGLA: Nombre no puede tener números
          Validators.pattern(this.patronSoloLetras)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          // REGLA: Formato estricto de email
          Validators.email
        ]
      ],
      telefono: [
        '',
        [
          // REGLA: Solo números (7 a 15 dígitos opcionalmente, o solo patrón numérico)
          Validators.pattern(this.patronSoloNumeros),
          Validators.minLength(7),
          Validators.maxLength(15)
        ]
      ],
      ciudad: [
        '',
        [
          Validators.required,
          // REGLA: Ciudad solo letras, no números
          Validators.pattern(this.patronSoloLetras)
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
          // REGLA: Mínimo 6 caracteres
          Validators.minLength(6)
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
      // CREAR (El ID lo maneja el servicio automáticamente)
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

  onEditarClick(usuario: Usuario): void {
    this.onFilaClick(usuario);
  }

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

  onVerClick(usuario: Usuario): void {
    console.log('Ver usuario:', usuario);
  }

  // ------------------------------------------------------------------
  // METODOS AUXILIARES PARA EL HTML (Opcional: usar con keypress)
  // ------------------------------------------------------------------

  /**
   * Bloquea la escritura de números. Usar en (keypress)="bloquearNumeros($event)"
   */
  bloquearNumeros(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    if (pattern.test(event.key)) {
      event.preventDefault(); // Evita que se escriba el número
    }
  }

  /**
   * Bloquea la escritura de letras. Usar en (keypress)="bloquearLetras($event)"
   */
  bloquearLetras(event: KeyboardEvent): void {
    const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    if (pattern.test(event.key)) {
      event.preventDefault(); // Evita que se escriba la letra
    }
  }
}