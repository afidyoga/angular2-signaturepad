import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component'
import { DetailComponent } from './detail/detail.component';
import { RiwayatComponent } from './riwayat/riwayat.component';
const routes: Routes = [
	{
		path: '', redirectTo: 'view', pathMatch: 'full'
	},
	{
		path: 'view',
		component: ViewComponent
	},
	{
		path: 'riwayat',
		component: RiwayatComponent
	},
	{
		path: 'detail/:id',
		component: DetailComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class KonsolidasiDataRoutingModule { }