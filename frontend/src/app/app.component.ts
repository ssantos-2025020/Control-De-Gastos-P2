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

  /** Throttle (ms) para no disparar la detección de actividad por cada evento. */
  private static readonly THROTTLE_MS = 10_000;
  private ultimaNotificacionActividad: number = 0;
  private listenersLimpiados: (() => void)[] = [];

  ngOnInit(): void {
    this.authService.iniciarVigilancia();
    this.authService.marcarActividad();
    this.montarDeteccionActividad();

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
    this.destruirDeteccionActividad();
  }

  /**
   * Escucha la actividad del usuario (mouse, clic, teclado, scroll y touch)
   * con throttling para no sobrecargar de eventos. Cada detección actualiza la
   * marca de actividad del servicio de sesión (sliding session).
   */
  private montarDeteccionActividad(): void {
    const target = window;

    const alDetectar = (): void => {
      const ahora = Date.now();
      if (ahora - this.ultimaNotificacionActividad >= AppComponent.THROTTLE_MS) {
        this.ultimaNotificacionActividad = ahora;
        this.authService.registrarActividad();
      }
    };

    const eventos: (keyof WindowEventMap)[] = [
      'mousemove',
      'click',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
    ];

    const manejar = (): void => alDetectar();

    for (const tipo of eventos) {
      target.addEventListener(tipo, manejar, { passive: true });
      this.listenersLimpiados.push(() => target.removeEventListener(tipo, manejar));
    }
  }

  private destruirDeteccionActividad(): void {
    for (const limpiar of this.listenersLimpiados) {
      limpiar();
    }
    this.listenersLimpiados = [];
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