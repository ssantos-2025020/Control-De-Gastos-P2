import { Injectable, signal } from '@angular/core';

const CONFIG_KEY = 'cg_config';

export type FormatoFecha = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
export type FormatoHora = '12' | '24';

export interface ZonaHoraria {
  id: string;
  label: string;
}

export const ZONAS_HORARIAS: ZonaHoraria[] = [
  { id: 'gmt-07-mex-pac', label: '(GMT-07:00) Tijuana, Hermosillo (Pacífico)' },
  { id: 'gmt-06-mex-centro', label: '(GMT-06:00) Ciudad de México (Centro)' },
  { id: 'gmt-06-guatemala', label: '(GMT-06:00) Ciudad de Guatemala' },
  { id: 'gmt-06-monta', label: '(GMT-06:00) San José, Managua (Centroamérica)' },
  { id: 'gmt-05-colombia', label: '(GMT-05:00) Bogotá, Lima, Quito' },
  { id: 'gmt-05-cuba', label: '(GMT-05:00) La Habana' },
  { id: 'gmt-04-caracas', label: '(GMT-04:00) Caracas' },
  { id: 'gmt-04-bolivia', label: '(GMT-04:00) La Paz, Asunción' },
  { id: 'gmt-04-chile', label: '(GMT-04:00) Santiago de Chile (Editable)' },
  { id: 'gmt-03-buenos-aires', label: '(GMT-03:00) Buenos Aires, Montevideo' },
  { id: 'gmt-02-santiago', label: '(GMT-02:00) Santiago (Verano)' },
  { id: 'gmt-00-utc', label: '(GMT+00:00) UTC' },
  { id: 'gmt+01-madrid', label: '(GMT+01:00) Madrid, París, Berlín' },
  { id: 'gmt+02-atenas', label: '(GMT+02:00) Atenas, El Cairo' },
];

export interface ConfiguracionGeneral {
  nombreApp: string;
  descripcion: string;
  formatoFecha: FormatoFecha;
  formatoHora: FormatoHora;
  zonaHoraria: string;
}

const DEFAULTS: ConfiguracionGeneral = {
  nombreApp: 'Legatus - Control de Gastos',
  descripcion: 'Sistema de control y gestión de ingresos, gastos y presupuestos.',
  formatoFecha: 'dd/mm/yyyy',
  formatoHora: '12',
  zonaHoraria: 'gmt-06-guatemala',
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  nombreApp = signal<string>(DEFAULTS.nombreApp);
  descripcion = signal<string>(DEFAULTS.descripcion);
  formatoFecha = signal<FormatoFecha>(DEFAULTS.formatoFecha);
  formatoHora = signal<FormatoHora>(DEFAULTS.formatoHora);
  zonaHoraria = signal<string>(DEFAULTS.zonaHoraria);

  constructor() {
    this.cargar();
  }

  private cargar(): void {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as Partial<ConfiguracionGeneral>;
      if (typeof data.nombreApp === 'string' && data.nombreApp) this.nombreApp.set(data.nombreApp);
      if (typeof data.descripcion === 'string') this.descripcion.set(data.descripcion);
      if (data.formatoFecha === 'dd/mm/yyyy' || data.formatoFecha === 'mm/dd/yyyy' || data.formatoFecha === 'yyyy-mm-dd') {
        this.formatoFecha.set(data.formatoFecha);
      }
      if (data.formatoHora === '12' || data.formatoHora === '24') this.formatoHora.set(data.formatoHora);
      if (typeof data.zonaHoraria === 'string' && data.zonaHoraria) this.zonaHoraria.set(data.zonaHoraria);
    } catch {
      localStorage.removeItem(CONFIG_KEY);
    }
  }

  setGenerales(valores: ConfiguracionGeneral): void {
    this.nombreApp.set(valores.nombreApp);
    this.descripcion.set(valores.descripcion);
    this.formatoFecha.set(valores.formatoFecha);
    this.formatoHora.set(valores.formatoHora);
    this.zonaHoraria.set(valores.zonaHoraria);
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      nombreApp: valores.nombreApp,
      descripcion: valores.descripcion,
      formatoFecha: valores.formatoFecha,
      formatoHora: valores.formatoHora,
      zonaHoraria: valores.zonaHoraria,
    }));
  }

  getZonas(): ZonaHoraria[] {
    return ZONAS_HORARIAS;
  }

  getZonaActual(): ZonaHoraria {
    return ZONAS_HORARIAS.find((z) => z.id === this.zonaHoraria()) ?? ZONAS_HORARIAS[2];
  }

  /** Formatea una fecha ISO según el formato global (default DD/MM/AAAA). */
  formatearFecha(fecha?: string): string {
    const d = fecha ? new Date(fecha) : new Date();
    if (isNaN(d.getTime())) return '—';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    switch (this.formatoFecha()) {
      case 'mm/dd/yyyy': return `${mm}/${dd}/${yyyy}`;
      case 'yyyy-mm-dd': return `${yyyy}-${mm}-${dd}`;
      default: return `${dd}/${mm}/${yyyy}`;
    }
  }

  /** Formatea la hora según el formato global (12h con AM/PM o 24h). */
  formatearHora(fecha?: string): string {
    const d = fecha ? new Date(fecha) : new Date();
    if (isNaN(d.getTime())) return '—';
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (this.formatoHora() === '24') {
      return `${String(d.getHours()).padStart(2, '0')}:${mm}`;
    }
    let h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${mm} ${ampm}`;
  }
}