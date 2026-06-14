import { Component, OnInit, inject, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard.model';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { LoadsSectionComponent } from '../loads-section/loads-section.component';

type LoadState = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-work-area',
  standalone: true,
  imports: [SummaryCardComponent, LoadsSectionComponent],
  templateUrl: './work-area.component.html',
  styleUrl: './work-area.component.scss',
})
export class WorkAreaComponent implements OnInit {
  readonly state = signal<LoadState>('loading');
  readonly summary = signal<DashboardSummary | null>(null);

  private readonly dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.state.set('loaded');
      },
      error: () => {
        this.state.set('error');
      },
    });
  }
}
