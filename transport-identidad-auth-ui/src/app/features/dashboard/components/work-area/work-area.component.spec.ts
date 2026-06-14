import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { WorkAreaComponent } from './work-area.component';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard.model';

const MOCK_SUMMARY: DashboardSummary = {
  gastos_ejecutados: 200,
  viaticos: 50,
  cargas_transportadas: [
    { id: 'l-1', origin: 'Bogotá', destination: 'Medellín', status: 'completada' },
  ],
  cargas_asignadas: [],
};

describe('WorkAreaComponent', () => {
  let fixture: ComponentFixture<WorkAreaComponent>;
  let serviceSpy: jasmine.SpyObj<DashboardService>;

  function setup(summary: DashboardSummary | null = MOCK_SUMMARY, error = false) {
    serviceSpy = jasmine.createSpyObj('DashboardService', ['getSummary']);
    serviceSpy.getSummary.and.returnValue(
      error ? throwError(() => new Error('500')) : of(summary!)
    );

    TestBed.configureTestingModule({
      imports: [WorkAreaComponent],
      providers: [{ provide: DashboardService, useValue: serviceSpy }],
    });

    fixture = TestBed.createComponent(WorkAreaComponent);
  }

  it('shows skeleton loader on init', () => {
    setup();
    // Don't detect changes yet — state is loading
    expect(fixture.componentInstance.state()).toBe('loading');
  });

  it('shows summary cards after data loads', fakeAsync(() => {
    setup();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.state()).toBe('loaded');
    const cards = fixture.debugElement.queryAll(By.css('app-summary-card'));
    expect(cards.length).toBe(2);
  }));

  it('shows loads sections after data loads', fakeAsync(() => {
    setup();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const sections = fixture.debugElement.queryAll(By.css('app-loads-section'));
    expect(sections.length).toBe(2);
  }));

  it('shows error state on service failure', fakeAsync(() => {
    setup(null, true);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.state()).toBe('error');
    const error = fixture.debugElement.query(By.css('.work-area__error'));
    expect(error).toBeTruthy();
  }));
});
