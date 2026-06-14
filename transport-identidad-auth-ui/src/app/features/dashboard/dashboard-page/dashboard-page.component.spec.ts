import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../../../core/auth/models/user.model';

const MOCK_USER: User = {
  id: 'u-1',
  email: 'admin@empresa.com',
  role: 'admin',
  company_id: 'c-1',
  first_name: 'María',
  last_name: 'García',
};

const MOCK_SUMMARY = {
  gastos_ejecutados: 0,
  viaticos: 0,
  cargas_transportadas: [],
  cargas_asignadas: [],
};

describe('DashboardPageComponent', () => {
  let fixture: ComponentFixture<DashboardPageComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let dashSpy: jasmine.SpyObj<DashboardService>;
  let router: Router;

  function setup(userInStorage: User | null = MOCK_USER) {
    authSpy = jasmine.createSpyObj('AuthService', ['getUser', 'logout']);
    dashSpy = jasmine.createSpyObj('DashboardService', ['getSummary']);

    authSpy.getUser.and.returnValue(userInStorage);
    dashSpy.getSummary.and.returnValue(of(MOCK_SUMMARY));

    TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
        { provide: DashboardService, useValue: dashSpy },
      ],
    });
  }

  describe('when user is in storage', () => {
    beforeEach(async () => {
      setup(MOCK_USER);
      await TestBed.compileComponents();
      router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      fixture = TestBed.createComponent(DashboardPageComponent);
      fixture.detectChanges();
    });

    it('renders dashboard header', () => {
      const header = fixture.debugElement.query(By.css('app-dashboard-header'));
      expect(header).toBeTruthy();
    });

    it('renders sidebar', () => {
      const sidebar = fixture.debugElement.query(By.css('app-dashboard-sidebar'));
      expect(sidebar).toBeTruthy();
    });

    it('renders work area', () => {
      const workArea = fixture.debugElement.query(By.css('app-work-area'));
      expect(workArea).toBeTruthy();
    });

    it('renders footer', () => {
      const footer = fixture.debugElement.query(By.css('app-dashboard-footer'));
      expect(footer).toBeTruthy();
    });
  });

  describe('when no user in storage', () => {
    beforeEach(async () => {
      setup(null);
      await TestBed.compileComponents();
      router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      fixture = TestBed.createComponent(DashboardPageComponent);
      fixture.detectChanges();
    });

    it('calls logout and navigates to /login', () => {
      expect(authSpy.logout).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
