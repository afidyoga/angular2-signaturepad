import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'data-pasien',
    loadChildren: () => import('./data-pasien/data-pasien.module').then((m) => m.DataPasienModule)
  },{
    path: 'data-transaksi',
    loadChildren: () => import('./data-transaksi/data-transaksi.module').then((m) => m.DataTransaksiModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFarmasiRoutingModule { }
