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
  // Formulario
  form!: FormGroup;
  
  // Datos
  usuarios: Usuario[] = [];
  
  // Columnas para tabla
  columnasTabla = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'rol', label: 'Rol' },
    { key: 'active', label: 'Estado' }
  ];
  
  // Modal
  @ViewChild('usuarioModalRef') modalElement!: ElementRef;
  modalRef: any;
  
  // Edición
  editando = false;
  usuarioEditando: Usuario | null = null;
  
  // Diálogos (como en categorías - variables separadas)
  showDeleteDialog = false;
  showSuccessDialog = false;
  showErrorDialog = false;
  showFormErrorDialog = false;
  
  // Mensajes para diálogos (variables separadas como en categorías)
  successMessage = '';
  errorMessage = '';
  formErrorMessage = '';
  
  // Para eliminar
  usuarioParaEliminar: Usuario | null = null;
  
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
  
  ngAfterViewInit() {
    if (this.modalElement) {
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
    }
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
      active: [true]
    });
  }
  
  // Getter para acceder a los controles del formulario
  get f() {
    return this.form.controls;
  }
  
  // Cargar usuarios
  private cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }
  
  // Búsqueda
  search(busq: HTMLInputElement) {
    let parametro = busq.value.toLowerCase();
    this.usuarioService.searchUsuarios(parametro).subscribe(
      (datos: Usuario[]) => {
        this.usuarios = datos;
      }
    );
  }
  
  // Abrir modal para nuevo usuario
  openNew() {
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
  
  // Abrir modal para editar usuario
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
  
  // Enviar formulario (guardar o actualizar)
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formErrorMessage = 'Por favor, complete todos los campos correctamente.';
      this.showFormErrorDialog = true;
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
        active: datos.active
      };
      
      this.usuarioService.actualizar(usuarioActualizado).subscribe(
        () => {
          this.successMessage = 'Usuario actualizado exitosamente';
          this.showSuccessDialog = true;
          this.modalRef.hide();
          this.cargarUsuarios();
        },
        (error) => {
          this.errorMessage = 'Error al actualizar usuario: ' + error.message;
          this.showErrorDialog = true;
        }
      );
    } else {
      // Crear nuevo
      let nextId: string;
      if (this.usuarios.length > 0) {
        const maxId = Math.max(...this.usuarios.map(u => parseInt(String(u.id)) || 0));
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
        active: datos.active
      };
      
      this.usuarioService.crear(nuevoUsuario).subscribe(
        () => {
          this.successMessage = 'Usuario creado exitosamente';
          this.showSuccessDialog = true;
          this.modalRef.hide();
          this.cargarUsuarios();
        },
        (error) => {
          this.errorMessage = 'Error al crear usuario: ' + error.message;
          this.showErrorDialog = true;
        }
      );
    }
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
          this.successMessage = 'Usuario eliminado exitosamente';
          this.showSuccessDialog = true;
          this.showDeleteDialog = false;
          this.usuarioParaEliminar = null;
          this.cargarUsuarios();
        },
        (error) => {
          this.errorMessage = 'Error al eliminar usuario: ' + error.message;
          this.showErrorDialog = true;
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
      active: !usuario.active
    };
    
    this.usuarioService.actualizar(usuarioActualizado).subscribe(
      () => {
        this.cargarUsuarios();
      },
      (error) => {
        this.errorMessage = 'Error al cambiar estado: ' + error.message;
        this.showErrorDialog = true;
      }
    );
  }
  
  // Cerrar diálogos (métodos separados como en categorías)
  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
  }
  
  closeErrorDialog(): void {
    this.showErrorDialog = false;
  }
  
  closeFormErrorDialog(): void {
    this.showFormErrorDialog = false;
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