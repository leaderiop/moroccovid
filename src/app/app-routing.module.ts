import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsAutneticatedGuard } from './helpers/guards/is-autneticated.guard';
import { IsNotAutneticatedGuard } from './helpers/guards/is-not-authenticated.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [IsNotAutneticatedGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    canActivate: [IsNotAutneticatedGuard],
    loadChildren: () =>
      import('./pages/register/register.module').then(
        m => m.RegisterPageModule,
      ),
  },
  {
    path: 'tracking',
    canActivate: [IsAutneticatedGuard],
    loadChildren: () =>
      import('./pages/tracking/tracking.module').then(
        m => m.TrackingPageModule,
      ),
  },
  { path: '*', redirectTo: 'login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
