import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { LucideIconComponent } from '../../components/lucide-icon/lucide-icon.component';

/**
 * Página genérica para las secciones portadas pero aún no desarrolladas
 * (Gastos, Presupuestos, Categorías, Reportes, Usuarios, Configuración...).
 * Los datos (título, descripción, icono) llegan vía data de la ruta.
 */
@Component({
  selector: 'app-proximamente',
  standalone: true,
  imports: [CommonModule, SidebarComponent, LucideIconComponent],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>

      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <h2 class="page-title">{{ titulo }}</h2>
          </div>
        </header>

        <main class="page-content">
          <div class="coming-soon-card">
            <div class="coming-soon-icon">
              <lucide-icon [name]="icono" [size]="38"></lucide-icon>
            </div>
            <span class="coming-soon-badge">Próximamente</span>
            <h3 class="coming-soon-title">{{ titulo }}</h3>
            <p class="coming-soon-text">{{ descripcion }}</p>
            <p class="coming-soon-note">
              Esta sección se habilitará en una próxima versión del sistema.
            </p>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    :host {
      display: block;
      font-family: 'Inter', sans-serif;
      color: var(--text-primary);
      min-height: 100vh;
      box-sizing: border-box;
    }

    /* ===== LAYOUT ===== */
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .main-area {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      background: var(--bg-primary);
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 36px;
      position: sticky;
      top: 0;
      z-index: 500;
      background: var(--bg-topbar);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--glass-border);
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      margin-bottom: 3px;
    }

    .breadcrumb-link {
      color: var(--text-muted);
      font-weight: 500;
    }

    .breadcrumb-sep {
      color: var(--text-placeholder);
    }

    .breadcrumb-current {
      color: var(--blue-light);
      font-weight: 600;
    }

    .page-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      margin: 0;
      color: var(--text-heading);
    }

    .page-content {
      max-width: 1320px;
      width: 100%;
      margin: 24px auto 0;
      padding: 0 36px 60px;
      display: flex;
      flex-direction: column;
      gap: 22px;
      box-sizing: border-box;
    }

    .coming-soon-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 14px;
      min-height: 60vh;
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 22px;
      padding: 56px 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .coming-soon-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 84px;
      height: 84px;
      border-radius: 50%;
      background: var(--blue-bg);
      border: 1px solid var(--blue-border);
      color: var(--blue-light);
      box-shadow: 0 8px 24px rgba(1, 159, 252, 0.25);
    }

    .coming-soon-badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.4px;
      color: var(--blue-light);
      background: var(--blue-bg);
      border: 1px solid var(--blue-border);
      padding: 4px 14px;
      border-radius: 999px;
    }

    .coming-soon-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: var(--text-heading);
      margin: 0;
      letter-spacing: -0.4px;
    }

    .coming-soon-text {
      font-size: 14.5px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
      max-width: 420px;
    }

    .coming-soon-note {
      font-size: 12.5px;
      color: var(--text-muted);
      margin: 4px 0 0;
    }
  `],
})
export class ProximamenteComponent {
  private route = inject(ActivatedRoute);

  titulo: string;
  descripcion: string;
  icono: string;

  constructor() {
    const data = this.route.snapshot.data as Record<string, string>;
    this.titulo = data['titulo'] ?? 'Sección';
    this.descripcion = data['descripcion'] ?? 'Esta sección estará disponible próximamente.';
    this.icono = data['icono'] ?? 'clock';
  }
}