import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'antrean-resep',
    loadChildren: () => import('./antrean-resep/antrean-resep.module').then((m) => m.AntreanResepModule)
  },{
    path: 'penjualan-obat',
    loadChildren: () => import('./penjualan-obat/penjualan-obat.module').then((m) => m.PenjualanObatModule)
  },{
    path: 'proses-resep',
    loadChildren: () => import('./proses-resep/proses-resep.module').then((m) => m.ProsesResepModule)
  },{
    path: 'report-farmasi',
    loadChildren: () => import('./report-farmasi/report-farmasi.module').then((m) => m.ReportFarmasiModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmasiRoutingModule { }
