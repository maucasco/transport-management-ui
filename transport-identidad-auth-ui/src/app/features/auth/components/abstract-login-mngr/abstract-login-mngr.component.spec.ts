import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NEVER, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractLoginMngrComponent } from './abstract-login-mngr.component';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { User } from '../../../../core/auth/models/user.model';

const MOCK_USER: User = {
  id: 'u1', email: 'admin@empresa.com', role: 'admin',
  company_id: 'c1', first_name: 'Admin', last_name: 'Test',
};

describe('AbstractLoginMngrComponent', () => {
  let fixture: ComponentFixture<AbstractLoginMngrComponent>;
  let component: AbstractLoginMngrComponent;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    await TestBed.configureTestingModule({
      imports: [AbstractLoginMngrComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AbstractLoginMngrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initial render', () => {
    it('renders an email input', () => {
      expect(fixture.debugElement.query(By.css('input[type="email"]'))).toBeTruthy();
    });

    it('renders a password input', () => {
      expect(fixture.debugElement.query(By.css('input[type="password"]'))).toBeTruthy();
    });

    it('renders a submit button', () => {
      expect(fixture.debugElement.query(By.css('button[type="submit"]'))).toBeTruthy();
    });

    it('starts in idle state', () => {
      expect(component.state).toBe('idle');
    });

    it('does not show an error message initially', () => {
      expect(fixture.debugElement.query(By.css('.login-form__error'))).toBeNull();
    });
  });

  describe('form validation', () => {
    it('does not call login when form is empty', () => {
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('does not call login when email is invalid', () => {
      component.form.setValue({ email: 'not-an-email', password: 'pass123' });
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('on successful login', () => {
    beforeEach(() => {
      authService.login.and.returnValue(of(MOCK_USER));
      component.form.setValue({ email: 'admin@empresa.com', password: 'admin123' });
    });

    it('emits loginSuccess with the user', fakeAsync(() => {
      let emitted: User | undefined;
      component.loginSuccess.subscribe((u) => (emitted = u));
      component.onSubmit();
      tick();
      expect(emitted).toEqual(MOCK_USER);
    }));

    it('returns to idle state after success', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(component.state).toBe('idle');
    }));
  });

  describe('loading state', () => {
    it('sets state to loading while the request is in-flight', () => {
      authService.login.and.returnValue(NEVER);
      component.form.setValue({ email: 'admin@empresa.com', password: 'admin123' });
      component.onSubmit();
      expect(component.state).toBe('loading');
    });

    it('disables the submit button while loading', () => {
      component.state = 'loading';
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
      expect(btn.disabled).toBeTrue();
    });
  });

  describe('on failed login (401)', () => {
    beforeEach(() => {
      authService.login.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))
      );
      component.form.setValue({ email: 'admin@empresa.com', password: 'wrong' });
    });

    it('sets state to error', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(component.state).toBe('error');
    }));

    it('shows the error message in the template', fakeAsync(() => {
      component.onSubmit();
      tick();
      fixture.detectChanges();
      const errorEl = fixture.debugElement.query(By.css('.login-form__error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.nativeElement.textContent).toContain('Credenciales incorrectas');
    }));
  });

  describe('on failed login (403 inactive)', () => {
    it('shows the inactive account message', fakeAsync(() => {
      authService.login.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 403, statusText: 'Forbidden' }))
      );
      component.form.setValue({ email: 'inactive@empresa.com', password: 'admin123' });
      component.onSubmit();
      tick();
      fixture.detectChanges();
      const errorEl = fixture.debugElement.query(By.css('.login-form__error'));
      expect(errorEl.nativeElement.textContent).toContain('Cuenta inactiva');
    }));
  });
});
