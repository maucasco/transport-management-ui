import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from '../../core/auth/models/user.model';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  readonly user = input.required<User>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get roleBadge(): string {
    return this.user().role === 'admin' ? 'Administrador' : 'Conductor';
  }
}
