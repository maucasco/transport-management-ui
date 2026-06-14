import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { User } from '../../../core/auth/models/user.model';
import { DashboardHeaderComponent } from '../../../shared/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../../../shared/dashboard-sidebar/dashboard-sidebar.component';
import { WorkAreaComponent } from '../components/work-area/work-area.component';
import { DashboardFooterComponent } from '../dashboard-footer/dashboard-footer.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    WorkAreaComponent,
    DashboardFooterComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  readonly user = signal<User | null>(null);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (!currentUser) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
    this.user.set(currentUser);
  }
}
