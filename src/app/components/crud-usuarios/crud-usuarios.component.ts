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
  // Formulario
  form!: FormGroup;
  
  // Datos
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  
  // Columnas para tabla
  columnasTabla = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'rol', label: 'Rol' },
    { key: 'estadoActivo', label: 'Estado' },
    { key: 'action', label: 'Acciones' }
  ];
  
  // Búsqueda
  terminoBusqueda = '';
  
  // Edición
  editando = false;
  usuarioEditando: Usuario | null = null;
  
  // Diálogos
  showDeleteDialog = false;
  showSuccessDialog = false;
  showErrorDialog = false;
  
  // Datos para diálogos
  usuarioParaEliminar: Usuario | null = null;
  dialogMessage = '';
  dialogTitle = '';
  
  // Patrones
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
  
  // Inicializar formulario
  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.patronSoloLetras)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      telefono: ['', [
        Validators.pattern(this.patronSoloNumeros),
        Validators.minLength(7),
        Validators.maxLength(15)
      ]],
      ciudad: ['', [
        Validators.required,
        Validators.pattern(this.patronSoloLetras)
      ]],
      rol: ['lector', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      estadoActivo: [true]
    });
  }
  
  // Cargar usuarios
  private cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.aplicarFiltro();
    });
  }
  
  // Aplicar filtro de búsqueda
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
  
  // Enviar formulario (guardar o actualizar)
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('Por favor, complete todos los campos correctamente');
      return;
    }
    
    const datos = this.form.value;
    
    if (this.editando && this.usuarioEditando) {
      // Actualizar
      const usuarioActualizado: Usuario = {
        ...this.usuarioEditando,
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || '',
        ciudad: datos.ciudad,
        rol: datos.rol,
        password: datos.password,
        estadoActivo: datos.estadoActivo
      };
      
      this.usuarioService.actualizar(usuarioActualizado).subscribe(
        () => {
          this.showSuccess('Usuario actualizado exitosamente');
          this.resetFormulario();
          this.cargarUsuarios();
        },
        (error) => {
          this.showError('Error al actualizar usuario: ' + error.message);
        }
      );
    } else {
      // Crear nuevo
      let nextId: string;
      if (this.usuarios.length > 0) {
        const maxId = Math.max(...this.usuarios.map(u => parseInt(u.id) || 0));
        nextId = (maxId + 1).toString();
      } else {
        nextId = "1";
      }
      
      const nuevoUsuario: Usuario = {
        id: nextId,
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || '',
        ciudad: datos.ciudad,
        rol: datos.rol,
        password: datos.password,
        estadoActivo: datos.estadoActivo
      };
      
      this.usuarioService.crear(nuevoUsuario).subscribe(
        (response) => {
          this.showSuccess('Usuario creado exitosamente');
          this.resetFormulario();
          this.cargarUsuarios();
        },
        (error) => {
          this.showError('Error al crear usuario: ' + error.message);
        }
      );
    }
  }
  
  // Editar usuario (desde tabla)
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
      estadoActivo: usuario.estadoActivo
    });
    
    // Scroll al formulario
    setTimeout(() => {
      document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  
  // Abrir diálogo para eliminar
  onEliminarClick(usuario: Usuario): void {
    this.usuarioParaEliminar = usuario;
    this.showDeleteDialog = true;
  }
  
  // Confirmar eliminación
  confirmarEliminar(): void {
    if (this.usuarioParaEliminar) {
      this.usuarioService.eliminar(this.usuarioParaEliminar.id).subscribe(
        () => {
          this.showSuccess('Usuario eliminado exitosamente');
          this.showDeleteDialog = false;
          this.usuarioParaEliminar = null;
          this.cargarUsuarios();
        },
        (error) => {
          this.showError('Error al eliminar usuario: ' + error.message);
          this.showDeleteDialog = false;
          this.usuarioParaEliminar = null;
        }
      );
    }
  }
  
  // Cancelar eliminación
  cancelarEliminar(): void {
    this.showDeleteDialog = false;
    this.usuarioParaEliminar = null;
  }
  
  // Cambiar estado activo/inactivo
  onToggleActivo(usuario: Usuario): void {
    const usuarioActualizado: Usuario = {
      ...usuario,
      estadoActivo: !usuario.estadoActivo
    };
    
    this.usuarioService.actualizar(usuarioActualizado).subscribe(
      () => {
        // Actualizar en memoria
        const index = this.usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
          this.usuarios[index] = usuarioActualizado;
          this.aplicarFiltro();
        }
      },
      (error) => {
        this.showError('Error al cambiar estado: ' + error.message);
      }
    );
  }
  
  // Ver usuario
  onVerClick(usuario: Usuario): void {
    console.log('Ver usuario:', usuario);
  }
  
  // Resetear formulario
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
    this.usuarioEditando = null;
  }
  
  // Helper para mostrar errores
  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched);
  }
  
  // Mostrar diálogo de éxito
  private showSuccess(message: string): void {
    this.dialogTitle = 'Éxito';
    this.dialogMessage = message;
    this.showSuccessDialog = true;
  }
  
  // Mostrar diálogo de error
  private showError(message: string): void {
    this.dialogTitle = 'Error';
    this.dialogMessage = message;
    this.showErrorDialog = true;
  }
  
  // Cerrar diálogo de éxito
  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
  }
  
  // Cerrar diálogo de error
  closeErrorDialog(): void {
    this.showErrorDialog = false;
  }
  
  // Métodos para bloqueo de caracteres
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