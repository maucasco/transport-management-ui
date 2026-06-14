import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-footer',
  standalone: true,
  templateUrl: './dashboard-footer.component.html',
  styleUrl: './dashboard-footer.component.scss',
})
export class DashboardFooterComponent {
  readonly year = new Date().getFullYear();
}
