import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule)
  }, {
    path: 'riwayat',
    loadChildren: () => import('./riwayat/riwayat.module').then((m) => m.RiwayatModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StokOpnameRoutingModule { }
