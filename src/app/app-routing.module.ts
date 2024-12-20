import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './authentication/page404/page404.component';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthTokenGuard } from './core/guard/auth-token.guard'
import { LoginGuard } from './core/guard/login.guard';
import { Role } from './core/models/role';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { DashboardDokterModule } from '../app/private/pages/laporan/dashboard-dokter/dashboard-dokter.module';
import { DashboardPerawatModule } from '../app/private/pages/laporan/dashboard-perawat/dashboard-perawat.module';
import { DashboardResepsionisModule } from '../app/private/pages/laporan/dashboard-resepsionis/dashboard-resepsionis.module';
import { DashboardAdminKlinikModule } from '../app/private/pages/laporan/dashboard-admin-klinik/dashboard-admin-klinik.module';
import { DashboardAdminGudangModule } from '../app/private/pages/laporan/dashboard-gudang/dashboard-admin-gudang.module';
import { DashboardFisioterapiModule } from '../app/private/pages/laporan/dashboard-fisioterapi/dashboard-fisioterapi.module';
import { DashboardFarmasiModule } from '../app/private/pages/laporan//dashboard-farmasi/dashboard-farmasi.module';
import { DashboardAdminPoliUmumModule } from '../app/private/pages/laporan/dashboard-admin-poli-umum/dashboard-admin-poliumum.module';
import { SuratModule } from '../app/private/pages/surat/surat.module';

let currentUser:any=localStorage.getItem('currentUser')
currentUser=currentUser!=null?JSON.parse(currentUser):null
let kode=['DBAK01','DBAU01','DBPF01','DBAF01','DBAG01','DBRS01','DBPR01','DBDK01','DBFT01','DBFM01','DBGD01','DBM']
let dashboard=""
if(currentUser!=null){
	if(currentUser.username.search("superadmin")>=0||currentUser.username.search("owner")>=0){
		dashboard="superadmin"
	}else{
		kode.map((val)=>{
			if(currentUser.menu_right.findIndex((x)=>x.kode==val)!=-1){
				dashboard=val
			}
		})
	}
	
}
const routes: Routes = [

	{
		path: '', component: MainLayoutComponent, canActivate: [AuthTokenGuard],
		children: [
			{ path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
			{
				path: 'admin',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
			},
			{
				path: 'admin/dashboard',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
			},
			{
				path: 'admin/dashboard/gudang',
				redirectTo:'/laporan/dashboard-gudang/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/farmasi',
				redirectTo:'/laporan/dashboard-farmasi/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/perawat',
				redirectTo:'/laporan/dashboard-perawat/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/dokter',
				redirectTo:'/laporan/dashboarddokter/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/klinik',
				redirectTo:'/laporan/dashboard-admin-klinik/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/resepsionis',
				redirectTo:'/laporan/dashboard-resepsionis/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/poli',
				redirectTo:'/laporan/dashboard-admin-poliumum/main',
				pathMatch:'full'
			},
			{
				path: 'admin/dashboard/fisioterapi',
				redirectTo:'/laporan/dashboard-fisioterapi/main',
				pathMatch:'full'
			},
			{
				path: 'bussines-intelegent',
				loadChildren: () => import('./private/pages/laporan/bussines-intelegent/bussines-intelegent.module').then((m) => m.BussinesIntelegentModule)
				
			},
			{
				path: 'riset',
				loadChildren: () => import('./private/pages/riset/riset.module').then((m) => m.RisetModule)
			},
			{
				path: 'master-data',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/master-data/master-data.module').then((m) => m.MasterDataModule)
			},
			 {
				path: 'role-and-rights',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/role-and-rights/role-and-rights.module').then((m) => m.RoleAndRightsModule)
			},
			{
				path: 'manajemen-akun',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/manajemen-akun/manajemen-akun.module').then((m) => m.ManajemenAkunModule)
			},
			{
				path: 'manajemen-menu',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/manajemen-menu/manajemen-menu.module').then((m) => m.ManajemenMenuModule)
			},
			{
				path: 'manajemen-klinik',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/manajemen-klinik/manajemen-klinik.module').then((m) => m.ManajemenKlinikModule)
			},
			{
				path: 'pengaturan-jadwal',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/pengaturan-jadwal/pengaturan-jadwal.module').then((m) => m.PengaturanJadwalModule)
			},
			{
				path: 'pasien',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/pasien/pasien.module').then((m) => m.PasienModule)
			},
			{
				path: 'perawat',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/perawat/perawat.module').then((m) => m.PerawatModule)
			},
			{
				path: 'dokter',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/dokter/dokter.module').then((m) => m.DokterModule)
			},
			{
				path: 'farmasi',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/farmasi/farmasi.module').then((m) => m.FarmasiModule)
			},
			{
				path: 'laporan',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/laporan/laporan.module').then((m) => m.LaporanModule)
			},
			{
				path: 'surat',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/surat/surat.module').then((m) => m.SuratModule)
			},
			{
				path: 'rekam-medis',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/rekam-medis/rekam-medis.module').then((m) => m.RekamMedisModule)
			},
			{
				path: 'pengaturan',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/pengaturan/pengaturan.module').then((m) => m.PengaturanModule)
			},
			{
				path: 'katalog-obat',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/katalog-obat/katalog-obat.module').then((m) => m.KatalogObatModule)
			},
			{
				path: 'log',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/log/log.module').then((m) => m.LogModule)
			},
			{
				path: 'faktur',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/faktur/faktur.module').then((m) => m.FakturModule)
			}, {
				path: 'stok-opname',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/stok-opname/stok-opname.module').then((m) => m.StokOpnameModule)
			},
			{
				path: 'penjualan',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/penjualan/penjualan.module').then((m) => m.PenjualanModule)
			},
			 {
				path: 'stok-obat',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/stok-obat/stok-obat.module').then((m) => m.StokObatModule)
			},
			 {
				path: 'retur',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/retur/retur.module').then((m) => m.ReturModule)
			},
			{
				path: 'barang',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/barang/barang-module').then((m) => m.BarangModule)
			},
			{
				path: 'konsolidasi-data',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/konsolidasi-data/konsolidasi-data.module').then((m) => m.KonsolidasiDataModule)
			},
			{
				path: 'resep',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/resep/resep.module').then((m) => m.ResepModule)
			},
			{
				path: 'chat',
				canActivate: [AuthTokenGuard],
				loadChildren: () => import('./private/pages/chat/chat.module').then((m) => m.ChatModule)
			},

			
		],
	},

	{
		path: 'authentication',
		canActivate: [LoginGuard],
		component: AuthLayoutComponent,
		loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
	},
	{ path: '**', component: Page404Component },
];
@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule],
})
export class AppRoutingModule { }
