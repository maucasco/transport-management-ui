import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractLoginMngrComponent } from '../../features/auth/components/abstract-login-mngr/abstract-login-mngr.component';
import { User } from '../../core/auth/models/user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AbstractLoginMngrComponent],
  template: `
    <div class="login-page">
      <div class="login-page__brand">
        <span class="login-page__brand-dot"></span>
        TransportManagement
      </div>
      <app-abstract-login-mngr (loginSuccess)="onLoginSuccess($event)" />
      <p class="login-page__footer">
        © 2026 TransportManagement · Todos los derechos reservados
      </p>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .login-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-6);
      padding: var(--space-8) var(--space-4);
      background: var(--color-neutral-50);
    }

    .login-page__brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      letter-spacing: -0.02em;
    }

    .login-page__brand-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: var(--radius-full);
      background: var(--color-accent);
    }

    .login-page__footer {
      font-size: var(--font-size-xs);
      color: var(--color-neutral-400);
    }
  `],
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  onLoginSuccess(_user: User): void {
    this.router.navigate(['/dashboard']);
  }
}
