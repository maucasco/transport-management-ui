import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly SUMMARY_URL = '/entreprise/dashboard/summary';
  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummary> {
    console.debug('[DashboardService] Fetching dashboard summary');
    return this.http.get<DashboardSummary>(this.SUMMARY_URL).pipe(
      tap(() => console.debug('[DashboardService] Dashboard summary loaded')),
      catchError((err: HttpErrorResponse) => {
        console.error(`[DashboardService] Dashboard summary failed: status=${err.status}`);
        return throwError(() => err);
      }),
    );
  }
}
