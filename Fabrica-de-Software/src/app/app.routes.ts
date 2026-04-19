// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Posteriormente você fará os imports reais dos componentes:
// import { LoginPageComponent } from './pages/login-page/login-page.component';
// import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
// import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
    // canActivate: [AuthGuard] <- Adicionaremos a validação de login aqui depois
  },
  {
    path: 'professors',
    loadComponent: () =>
      import('./pages/professors-page/professors-page').then((m) => m.ProfessorsPage),
    // canActivate: [AuthGuard]
  },
  {
    path: 'students',
    loadComponent: () => import('./pages/students-page/students-page').then((m) => m.StudentsPage),
    // canActivate: [AuthGuard]
  },
  {
    path: 'requests',
    loadComponent: () => import('./pages/requests-page/requests-page').then((m) => m.RequestsPage),
    // canActivate: [AuthGuard]
  },
  {
    path: 'requests/:id',
    loadComponent: () =>
      import('./pages/request-detail-page/request-detail-page').then((m) => m.RequestDetailPage),
    // canActivate: [AuthGuard]
  },
  {
    path: 'workgroups',
    loadComponent: () =>
      import('./pages/workgroups-page/workgroups-page').then((m) => m.WorkgroupsPage),
    // canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects-page/projects-page').then((m) => m.ProjectsPage),
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
