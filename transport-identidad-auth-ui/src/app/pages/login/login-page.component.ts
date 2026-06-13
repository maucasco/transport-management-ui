import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractLoginMngrComponent } from '../../features/auth/components/abstract-login-mngr/abstract-login-mngr.component';
import { User } from '../../core/auth/models/user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AbstractLoginMngrComponent],
  template: `
    <main class="login-page">
      <app-abstract-login-mngr (loginSuccess)="onLoginSuccess($event)" />
    </main>
  `,
  styles: [`
    .login-page {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
    }
  `],
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  onLoginSuccess(_user: User): void {
    this.router.navigate(['/dashboard']);
  }
}
