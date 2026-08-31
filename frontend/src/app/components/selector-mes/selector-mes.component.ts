import { Component, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { FiltroFechaService } from '../../services/filtro-fecha.service';

@Component({
  selector: 'app-selector-mes',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="selector-mes-wrap" (click)="$event.stopPropagation()">
      <button class="selector-btn" [class.fuera-mes-actual]="noEsMesActual" (click)="toggleDropdown()">
        <lucide-icon [name]="'calendar'" [size]="14"></lucide-icon>
        <span class="selector-label">{{ filtroFecha.getLabelMes() }}</span>
        <span class="selector-dot" *ngIf="noEsMesActual"></span>
        <lucide-icon [name]="'chevron-down'" [size]="14" class="selector-chevron" [class.open]="abierto"></lucide-icon>
      </button>

      <div class="selector-dropdown" *ngIf="abierto">
        <div class="dropdown-year">
          <button class="year-arrow" (click)="anioAnterior()"><lucide-icon [name]="'chevron-left'" [size]="16"></lucide-icon></button>
          <span class="year-label">{{ anioVisual }}</span>
          <button class="year-arrow" (click)="anioSiguiente()"><lucide-icon [name]="'chevron-right'" [size]="16"></lucide-icon></button>
        </div>

        <div class="dropdown-grid">
          <button
            *ngFor="let m of meses"
            class="month-chip"
            [class.active]="m.numero === filtroFecha.mes() && anioVisual === filtroFecha.anio()"
            (click)="seleccionarMes(m.numero)"
          >
            {{ m.abrev }}
          </button>
        </div>

        <div class="dropdown-divider"></div>

        <button
          class="btn-mes-actual"
          [class.disabled]="!noEsMesActual"
          [disabled]="!noEsMesActual"
          (click)="irAlMesActual()"
        >
          <lucide-icon [name]="'refresh-cw'" [size]="13"></lucide-icon>
          <span>Mes actual</span>
          <span class="mes-actual-dot" *ngIf="noEsMesActual"></span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: inline-block; position: relative; }

    .selector-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border-input);
      border-radius: 10px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .selector-btn:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.16);
    }

    .selector-icon { font-size: 14px; }

    .selector-label {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      color: var(--text-primary);
    }

    .selector-chevron {
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }

    .selector-chevron.open { transform: rotate(180deg); }

    .selector-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      width: 310px;
      background: var(--bg-dropdown);
      border: 1px solid var(--glass-border-strong);
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
      z-index: 1100;
      animation: drop-in 0.2s ease-out;
    }

    @keyframes drop-in {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .dropdown-year {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 14px;
    }

    .year-arrow {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border-strong);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      padding: 0;
    }

    .year-arrow:hover {
      background: var(--blue-icon-bg);
      border-color: rgba(1,159,252,0.3);
      color: var(--blue-light);
    }

    .year-label {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: var(--text-heading);
      min-width: 50px;
      text-align: center;
    }

    .dropdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    .month-chip {
      padding: 9px 4px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: var(--glass-bg);
      color: var(--text-secondary);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }

    .month-chip:hover {
      background: var(--blue-bg);
      border-color: rgba(1,159,252,0.25);
      color: var(--blue-light);
    }

    .month-chip.active {
      background: var(--gradient-brand);
      border-color: transparent;
      color: var(--text-white);
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(1,159,252,0.4);
    }

    .selector-btn.fuera-mes-actual {
      border-color: rgba(1,159,252,0.45);
      box-shadow: 0 0 0 1px rgba(1,159,252,0.25), 0 4px 14px rgba(1,159,252,0.2);
    }

    .selector-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--blue-primary);
      box-shadow: 0 0 6px rgba(1,159,252,0.8);
      flex-shrink: 0;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--glass-border-strong);
      margin: 14px 0 12px;
    }

    .btn-mes-actual {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 9px 12px;
      background: transparent;
      border: 1px solid rgba(1,159,252,0.25);
      border-radius: 9px;
      color: var(--blue-light);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-mes-actual:hover:not(.disabled) {
      background: var(--blue-bg);
      border-color: rgba(1,159,252,0.4);
      color: #aee7ff;
    }

    .btn-mes-actual.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .mes-actual-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--blue-primary);
      box-shadow: 0 0 6px rgba(1,159,252,0.8);
    }
  `],
})
export class SelectorMesComponent {
  @Output() mesSeleccionado = new EventEmitter<{ mes: number; anio: number }>();

  filtroFecha = inject(FiltroFechaService);
  abierto = false;
  anioVisual = this.filtroFecha.anio();

  mesActual = new Date().getMonth() + 1;
  anioActual = new Date().getFullYear();

  get noEsMesActual(): boolean {
    return this.filtroFecha.mes() !== this.mesActual || this.filtroFecha.anio() !== this.anioActual;
  }

  meses = [
    { numero: 1, abrev: 'Ene' }, { numero: 2, abrev: 'Feb' }, { numero: 3, abrev: 'Mar' },
    { numero: 4, abrev: 'Abr' }, { numero: 5, abrev: 'May' }, { numero: 6, abrev: 'Jun' },
    { numero: 7, abrev: 'Jul' }, { numero: 8, abrev: 'Ago' }, { numero: 9, abrev: 'Sep' },
    { numero: 10, abrev: 'Oct' }, { numero: 11, abrev: 'Nov' }, { numero: 12, abrev: 'Dic' },
  ];

  toggleDropdown(): void {
    this.abierto = !this.abierto;
    if (this.abierto) this.anioVisual = this.filtroFecha.anio();
  }

  anioAnterior(): void { this.anioVisual--; }
  anioSiguiente(): void { this.anioVisual++; }

  seleccionarMes(mes: number): void {
    this.filtroFecha.setMesAnio(mes, this.anioVisual);
    this.mesSeleccionado.emit({ mes, anio: this.anioVisual });
    this.abierto = false;
  }

  irAlMesActual(): void {
    if (!this.noEsMesActual) return;
    this.filtroFecha.setMesAnio(this.mesActual, this.anioActual);
    this.mesSeleccionado.emit({ mes: this.mesActual, anio: this.anioActual });
    this.abierto = false;
  }

  @HostListener('document:click')
  cerrarDropdown(): void {
    this.abierto = false;
  }
}
