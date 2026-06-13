import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/dashboard' } as RouterStateSnapshot;

  function runGuard() {
    return TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
  }

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'isTokenExpired']);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
    router = TestBed.inject(Router);
  });

  it('returns true when token exists and is not expired', () => {
    authService.getToken.and.returnValue('valid.jwt.token');
    authService.isTokenExpired.and.returnValue(false);
    expect(runGuard()).toBeTrue();
  });

  it('redirects to /login when no token is stored', () => {
    authService.getToken.and.returnValue(null);
    authService.isTokenExpired.and.returnValue(true);
    const result = runGuard() as ReturnType<Router['createUrlTree']>;
    expect(result.toString()).toBe('/login');
  });

  it('redirects to /login when token is expired', () => {
    authService.getToken.and.returnValue('expired.jwt.token');
    authService.isTokenExpired.and.returnValue(true);
    const result = runGuard() as ReturnType<Router['createUrlTree']>;
    expect(result.toString()).toBe('/login');
  });
});
