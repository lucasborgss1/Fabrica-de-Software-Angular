// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/layout/app-layout/app-layout').then((m) => m.AppLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'professors',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/professors-page/professors-page').then((m) => m.ProfessorsPage),
      },
      {
        path: 'students',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/students-page/students-page').then((m) => m.StudentsPage),
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./pages/requests-page/requests-page').then((m) => m.RequestsPage),
      },
      {
        path: 'requests/:id',
        loadComponent: () =>
          import('./pages/request-detail-page/request-detail-page').then(
            (m) => m.RequestDetailPage,
          ),
      },
      {
        path: 'workgroups',
        loadComponent: () =>
          import('./pages/workgroups-page/workgroups-page').then((m) => m.WorkgroupsPage),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects-page/projects-page').then((m) => m.ProjectsPage),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
