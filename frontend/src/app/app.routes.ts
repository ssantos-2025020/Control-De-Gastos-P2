import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  // Secciones visibles y portadas al router: se mostrarán Próximamente.
  {
    path: 'gastos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/proximamente/proximamente.component').then((m) => m.ProximamenteComponent),
    data: { titulo: 'Gastos', descripcion: 'Administra y categoriza todos tus gastos en detalle.', icono: 'trending-down' },
  },
  {
    path: 'movimientos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/proximamente/proximamente.component').then((m) => m.ProximamenteComponent),
    data: { titulo: 'Movimientos', descripcion: 'Consulta el historial completo de ingresos y gastos.', icono: 'history' },
  },
  {
    path: 'presupuestos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/proximamente/proximamente.component').then((m) => m.ProximamenteComponent),
    data: { titulo: 'Presupuestos', descripcion: 'Define límites mensuales por categoría y controla tu gasto.', icono: 'pie-chart' },
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/proximamente/proximamente.component').then((m) => m.ProximamenteComponent),
    data: { titulo: 'Categorías', descripcion: 'Gestiona las categorías que organizan tus movimientos.', icono: 'tag' },
  },
  {
    path: 'reportes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/proximamente/proximamente.component').then((m) => m.ProximamenteComponent),
    data: { titulo: 'Reportes', descripcion: 'Analiza tus finanzas con gráficos y comparativas.', icono: 'bar-chart-3' },
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/proximamente/proximamente.component').then((m) => m.ProximamenteComponent),
    data: { titulo: 'Usuarios', descripcion: 'Administra usuarios, roles y accesos al sistema.', icono: 'users' },
  },
  {
    path: 'configuracion',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];