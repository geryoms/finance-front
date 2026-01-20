import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {
  constructor(private authService: AuthService, private router: Router, public themeService: ThemeService) {}
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}