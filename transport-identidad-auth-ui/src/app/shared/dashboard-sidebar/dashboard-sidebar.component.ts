import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  disabled: boolean;
}

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  readonly menuItems: MenuItem[] = [
    { label: 'Seleccionar carga e iniciar transporte', icon: 'truck', disabled: true },
    { label: 'Finalizar transporte', icon: 'check', disabled: true },
    { label: 'Registrar detalle de gastos', icon: 'receipt', disabled: true },
  ];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
