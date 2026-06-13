import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

function buildJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-sig`;
}

const VALID_TOKEN = buildJwt({ sub: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 });

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => httpMock.verify());

  it('attaches Bearer token to requests targeting /entreprise/', () => {
    authService.getToken.and.returnValue(VALID_TOKEN);
    http.get('/entreprise/authentication/me').subscribe();
    const req = httpMock.expectOne('/entreprise/authentication/me');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${VALID_TOKEN}`);
    req.flush({});
  });

  it('does not attach token to requests outside /entreprise/', () => {
    authService.getToken.and.returnValue(VALID_TOKEN);
    http.get('/other/endpoint').subscribe();
    const req = httpMock.expectOne('/other/endpoint');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('does not attach token when no token is stored', () => {
    authService.getToken.and.returnValue(null);
    http.get('/entreprise/authentication/me').subscribe();
    const req = httpMock.expectOne('/entreprise/authentication/me');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('calls logout and navigates to /login on 401', () => {
    authService.getToken.and.returnValue(VALID_TOKEN);
    http.get('/entreprise/authentication/me').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/entreprise/authentication/me');
    req.flush({ detail: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does not call logout on non-401 errors', () => {
    authService.getToken.and.returnValue(VALID_TOKEN);
    http.get('/entreprise/authentication/me').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/entreprise/authentication/me');
    req.flush({ detail: 'Server Error' }, { status: 500, statusText: 'Server Error' });
    expect(authService.logout).not.toHaveBeenCalled();
  });
});
