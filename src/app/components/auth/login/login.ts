import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Importamos el AuthService que configuramos con JWT
import { AuthService } from '../../../services/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  form: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Cambiado a AuthService
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Método para mostrar errores visuales en el HTML
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

    // Llamamos al servicio de autenticación
    this.authService.login(email, password).subscribe({
      next: (response) => {
        // Al usar AuthService.login, el token y el currentUser ya se guardan 
        // automáticamente gracias al operador 'tap' que pusimos en el servicio.

        this.errorMsg = '';
        console.log('¡Identidad confirmada!');

        // Redirección inteligente:
        // El servicio guarda el rol, así que lo leemos para saber a dónde ir.
        if (response.rol === 'administrador') {
          this.router.navigate(['/usuarios']);
        } else {
          this.router.navigate(['/home-components']);
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMsg = 'Correo o contraseña incorrectos o cuenta inactiva.';
      }
    });
  }
}