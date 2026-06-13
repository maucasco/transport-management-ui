import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { User } from '../../../../core/auth/models/user.model';

@Component({
  selector: 'app-abstract-login-mngr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './abstract-login-mngr.component.html',
  styleUrl: './abstract-login-mngr.component.scss',
})
export class AbstractLoginMngrComponent {
  @Output() loginSuccess = new EventEmitter<User>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  state: 'idle' | 'loading' | 'error' = 'idle';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.state = 'loading';
    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      next: (user) => {
        this.state = 'idle';
        this.loginSuccess.emit(user);
      },
      error: (err: HttpErrorResponse) => {
        this.state = 'error';
        if (err.status === 403) {
          this.errorMessage = 'Cuenta inactiva';
        } else if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else {
          this.errorMessage = 'Error de conexión. Intenta de nuevo.';
        }
      },
    });
  }
}
