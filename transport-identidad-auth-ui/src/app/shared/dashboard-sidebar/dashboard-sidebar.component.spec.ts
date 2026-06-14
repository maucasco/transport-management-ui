import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DashboardSidebarComponent } from './dashboard-sidebar.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';

describe('DashboardSidebarComponent', () => {
  let fixture: ComponentFixture<DashboardSidebarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardSidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSidebarComponent);
    fixture.detectChanges();
  });

  it('renders 3 menu items', () => {
    const items = fixture.debugElement.queryAll(By.css('.dash-sidebar__item'));
    expect(items.length).toBe(3);
  });

  it('all menu items are disabled', () => {
    const links = fixture.debugElement.queryAll(By.css('.dash-sidebar__link--disabled'));
    expect(links.length).toBe(3);
  });

  it('disabled items have aria-disabled=true', () => {
    const links = fixture.debugElement.queryAll(By.css('.dash-sidebar__link'));
    links.forEach(link => {
      expect(link.attributes['aria-disabled']).toBe('true');
    });
  });

  it('all disabled items show Próximamente badge', () => {
    const badges = fixture.debugElement.queryAll(By.css('.dash-sidebar__badge'));
    expect(badges.length).toBe(3);
    badges.forEach(badge => {
      expect((badge.nativeElement.textContent as string).trim()).toBe('Próximamente');
    });
  });

  it('calls logout and navigates to /login on logout button click', () => {
    const btn = fixture.debugElement.query(By.css('.dash-sidebar__logout'));
    btn.triggerEventHandler('click', null);
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
