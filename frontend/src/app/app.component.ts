import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  protected authService = inject(AuthService);
  private router = inject(Router);

  extendiendo = signal(false);

  private vigilanciaUI: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.authService.iniciarVigilancia();

    // Vigilancia directa en la UI: si la sesión expira en cualquier momento,
    // volvemos al login aunque los timers del servicio fallen.
    this.vigilanciaUI = setInterval(() => {
      if (this.authService.sesionExpirada()) {
        this.authService.descartarAviso();
        if (this.router.url.split('?')[0] !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.vigilanciaUI !== null) {
      clearInterval(this.vigilanciaUI);
      this.vigilanciaUI = null;
    }
  }

  extender(): void {
    this.extendiendo.set(true);

    this.authService.extenderSesion().subscribe({
      next: () => {
        this.extendiendo.set(false);
        this.authService.descartarAviso();
      },
      error: () => {
        this.extendiendo.set(false);
        this.authService.descartarAviso();
      },
    });
  }

  noExtender(): void {
    this.authService.descartarAviso();
  }
}