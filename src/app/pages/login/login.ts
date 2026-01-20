import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
    console.log('Token:', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Credenciales incorrectas o error de conexión';
      }
    });
  }
  toggleThemeTemp() {
  this.themeService.toggleTheme();
}
}