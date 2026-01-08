import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/api.models';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user: User = { email: '', password: '' };
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log(response.message); 
        
        this.successMessage = '¡Cuenta creada! Redirigiendo al login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error al registrarse.';
        }
      }
    });
  }
}