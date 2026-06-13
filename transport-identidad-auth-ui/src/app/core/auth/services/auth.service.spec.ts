import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

const MOCK_USER: User = {
  id: 'u1', email: 'admin@empresa.com', role: 'admin',
  company_id: 'c1', first_name: 'Admin', last_name: 'Test',
};

const MOCK_TOKEN = buildJwt({ sub: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 });
const EXPIRED_TOKEN = buildJwt({ sub: 'u1', exp: Math.floor(Date.now() / 1000) - 10 });

function buildJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-sig`;
}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('posts credentials and returns the user', (done) => {
      service.login('admin@empresa.com', 'admin123').subscribe(user => {
        expect(user.email).toBe('admin@empresa.com');
        done();
      });
      http.expectOne('/entreprise/authentication/login')
        .flush({ access_token: MOCK_TOKEN, user: MOCK_USER });
    });

    it('stores the JWT in localStorage', (done) => {
      service.login('admin@empresa.com', 'admin123').subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBe(MOCK_TOKEN);
        done();
      });
      http.expectOne('/entreprise/authentication/login')
        .flush({ access_token: MOCK_TOKEN, user: MOCK_USER });
    });

    it('propagates HTTP errors to the caller', (done) => {
      service.login('x@x.com', 'wrong').subscribe({
        error: (err) => { expect(err.status).toBe(401); done(); },
      });
      http.expectOne('/entreprise/authentication/login')
        .flush({ detail: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getToken', () => {
    it('returns null when not logged in', () => {
      expect(service.getToken()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem('auth_token', MOCK_TOKEN);
      expect(service.getToken()).toBe(MOCK_TOKEN);
    });
  });

  describe('isTokenExpired', () => {
    it('returns true when no token is stored', () => {
      expect(service.isTokenExpired()).toBeTrue();
    });

    it('returns false for a valid non-expired token', () => {
      localStorage.setItem('auth_token', MOCK_TOKEN);
      expect(service.isTokenExpired()).toBeFalse();
    });

    it('returns true for an expired token', () => {
      localStorage.setItem('auth_token', EXPIRED_TOKEN);
      expect(service.isTokenExpired()).toBeTrue();
    });
  });

  describe('logout', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem('auth_token', MOCK_TOKEN);
      service.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});
