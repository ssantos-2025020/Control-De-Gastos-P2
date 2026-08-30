import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  cargando = signal(false);
  errorMensaje = signal<string | null>(null);
  mostrarPassword = signal(false);
  capsLockActivo = signal(false);
  anio = new Date().getFullYear();

  ngOnInit(): void {
    // Si ya está autenticado, redirigir automáticamente al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Si hay un mensaje de sesión expirada al cargar el login, mostrarlo
    const expMsg = this.authService.sesionExpirada();
    if (expMsg) {
      this.errorMensaje.set(expMsg);
    }
  }

  togglePassword(): void {
    this.mostrarPassword.update((valor) => !valor);
  }

  /** Detecta si Bloq Mayús está activado mientras se escribe la contraseña. */
  detectarCapsLock(event: KeyboardEvent): void {
    const esLetra = event.key.length === 1 && /[a-zA-Z]/.test(event.key);
    if (!esLetra) {
      return;
    }
    this.capsLockActivo.set(event.getModifierState('CapsLock'));
  }

  /** Inclina la tarjeta siguiendo el mouse (efecto 3D). */
  cardTilt(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rotate-y', `${px * 8}deg`);
    card.style.setProperty('--rotate-x', `${-py * 8}deg`);
  }

  cardReset(): void {
    const card = document.querySelector('.login-panel-inner') as HTMLElement | null;
    if (!card) return;
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--rotate-x', '0deg');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(
          err?.error?.message ?? 'No se pudo iniciar sesión. Intenta nuevamente.',
        );
      },
    });
  }

  get emailInvalido(): boolean {
    const c = this.loginForm.controls.email;
    return (c.touched || c.dirty) && !!c.errors;
  }

  get emailValido(): boolean {
    const c = this.loginForm.controls.email;
    return c.valid && (c.touched || c.dirty);
  }

  get passwordInvalido(): boolean {
    const c = this.loginForm.controls.password;
    return (c.touched || c.dirty) && !!c.errors;
  }

  get passwordValido(): boolean {
    const c = this.loginForm.controls.password;
    return c.valid && (c.touched || c.dirty);
  }
}
