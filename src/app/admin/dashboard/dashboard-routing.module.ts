// import { DashboardComponent as patientDashboard } from './../../patient/dashboard/dashboard.component';
// import { DashboardComponent as doctorDashboard } from './../../doctor/dashboard/dashboard.component';
import { Page404Component } from './../../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { ViewComponent } from './view/view.component';
import { WelcomeComponent } from './welcome/welcome.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full',
  },
  {
    path: 'view',
    component : ViewComponent
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component,
  },
  // {
  //   path: 'doctor-dashboard',
  //   component: doctorDashboard,
  // },
  // {
  //   path: 'patient-dashboard',
  //   component: patientDashboard,
  // },

  { path: '**', component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
