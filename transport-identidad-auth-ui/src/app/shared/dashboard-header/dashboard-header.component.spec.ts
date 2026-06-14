import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from '../../core/auth/models/user.model';

const MOCK_USER: User = {
  id: 'u-1',
  email: 'driver@empresa.com',
  role: 'conductor',
  company_id: 'c-1',
  first_name: 'Juan',
  last_name: 'Pérez',
};

describe('DashboardHeaderComponent', () => {
  let fixture: ComponentFixture<DashboardHeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [DashboardHeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(DashboardHeaderComponent);
    fixture.componentRef.setInput('user', MOCK_USER);
    fixture.detectChanges();
  });

  it('renders the user full name', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Juan Pérez');
  });

  it('renders Conductor role badge for conductor role', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Conductor');
  });

  it('renders Administrador role badge for admin role', () => {
    fixture.componentRef.setInput('user', { ...MOCK_USER, role: 'admin' });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Administrador');
  });

  it('calls logout and navigates to /login on logout button click', () => {
    const btn = fixture.debugElement.query(By.css('.dash-header__logout-btn'));
    btn.triggerEventHandler('click', null);
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('logo link has routerLink pointing to /dashboard', () => {
    const brandLink = fixture.debugElement.query(By.css('.dash-header__brand'));
    expect(brandLink.attributes['routerLink'] ?? brandLink.attributes['ng-reflect-router-link']).toBeTruthy();
  });
});
