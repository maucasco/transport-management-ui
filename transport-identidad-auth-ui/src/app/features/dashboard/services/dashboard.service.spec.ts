import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from '../models/dashboard.model';

const MOCK_SUMMARY: DashboardSummary = {
  gastos_ejecutados: 0,
  viaticos: 0,
  cargas_transportadas: [],
  cargas_asignadas: [],
};

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GET to /entreprise/dashboard/summary', () => {
    service.getSummary().subscribe();
    const req = httpMock.expectOne('/entreprise/dashboard/summary');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_SUMMARY);
  });

  it('returns the summary data', (done) => {
    service.getSummary().subscribe(summary => {
      expect(summary.gastos_ejecutados).toBe(0);
      expect(summary.cargas_transportadas).toEqual([]);
      done();
    });
    httpMock.expectOne('/entreprise/dashboard/summary').flush(MOCK_SUMMARY);
  });

  it('propagates HTTP errors', (done) => {
    service.getSummary().subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
        done();
      },
    });
    httpMock.expectOne('/entreprise/dashboard/summary').flush({}, { status: 401, statusText: 'Unauthorized' });
  });
});
