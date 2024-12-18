import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/_modal';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import { ModulStokOpnameObatService } from 'src/app/private/modul-api/modul-gudang-transaksi/modul-stok-opname-obat.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/private/states/private-app.states'
import * as StokOpnameAction from 'src/app/private/states/stok-opname/stok-opname.action'
import { StokOpnameObatPayload } from 'src/app/private/models/class-payload-api/gudang-transaksi/stok-opname-payload';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
@Component({
	selector: 'app-stok-opname',
	templateUrl: './stok-opname.component.html',
	styleUrls: ['./stok-opname.component.sass']
})
export class StokOpnameComponent implements OnInit {
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	reloadTable: boolean
	getState: Observable<any>;
	dataObat: StokOpnameObatPayload = new StokOpnameObatPayload

	constructor(
		private modalService: ModalService,
		private spinner : NgxSpinnerService,
		private modulStokOpname: ModulStokOpnameObatService,
		private router: Router,
		private store: Store<fromApp.PrivateAppState>,
	) {
		this.getState = this.store.select('stok_opname')
	}
	btnDetail=false
	btnDelete=false
	btnEdit=false
	btnSetting=false
	btnAdd=false
	view=false
	ngOnInit(): void {
		this.spinner.show('spinner1')
		let item=JSON.parse(localStorage.getItem('currentUser'))
		item=item.menu_right
		this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='IVSOAS2')!=-1?true:false
		this.btnDetail=this.view=item.findIndex((val)=>val.kode=='IVSOAS1')!=-1?true:false

		if(!this.view){
			Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
			window.location.href='/'
			})
		}
		this.dtOptions = this.showDataTables()

		this.getState.subscribe((state) => {
			this.reloadTable = state.reloadTable
			if (this.reloadTable === true) {
				this.reLoadData()
			}
		})
	}

	// editData(data: any) {
	// 	this.router.navigate(['barang/katalog/edit-buat-baru/' + data.id_obat])
	// }

	// nonAktif(data: any) {
	// 	Swal.fire({
	// 		title: 'Apakah anda yakin akan menghapus data ini ?',
	// 		icon: 'warning',
	// 		showCancelButton: true,
	// 		allowOutsideClick: false,
	// 		confirmButtonText: 'Ya, hapus saja!',
	// 		cancelButtonText: 'Tidak, Batalkan'
	// 	}).then((result) => {
	// 		if (result.value) {
	// 			this.store.dispatch(
	// 				StokOpnameAction.deleteInitial({ payload: { id: data.id_obat } })
	// 			)
	// 		}
	// 	})
	// }

	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

	showDataTables() {
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				this.modulStokOpname.listRiwayat(dataTablesParameters)
					.subscribe((resp: any) => {
						this.spinner.hide('spinner1')
						callback({
							draw: resp.response.draw,
							recordsTotal: resp.response.recordsTotal,
							recordsFiltered: resp.response.recordsFiltered,
							data: resp.response.data
						})
					})
			},
			columns: [
				{
					orderable: false,
					searchable: false,
					render(data: any, type: any, row: any, full: any) {
						return full.row + 1 + full.settings._iDisplayStart;
					}
				},
				{
					data: 'waktu_mulai_unix',
					render(data: any, type: any, row: any, full: any) {
						return moment(new Date(data)).format('DD-MM-YYYY')
					}
				},
				{
					data: 'waktu_selesai_unix',
					render(data: any, type: any, row: any, full: any) {
						return moment(new Date(data)).format('DD-MM-YYYY')
					}
				},
				// {
				// 	orderable: false,
				// 	searchable: false,
				// 	render(data: any, type: any, row: any, full: any) {
				// 		return `<button class="btn btn-sm btn-ubah update-data">Edit</button>
				//       <button class="btn nonaktif-data btn-hapus btn-sm">Hapus</button>`;
				// 	}
				// }
			],
			// rowCallback: (row: Node, data: any[] | Object, index: number) => {
			// 	const self = this;
			// 	// Unbind first in order to avoid any duplicate handler
			// 	// (see https://github.com/l-lin/angular-datatables/issues/87)
			// 	// Note: In newer jQuery v3 versions, `unbind` and `bind` are
			// 	// deprecated in favor of `off` and `on`
			// 	$('td .update-data', row).on('click', () => {
			// 		self.editData(data);
			// 	});
			// 	$('td .nonaktif-data', row).on('click', () => {
			// 		self.nonAktif(data);
			// 	});
			// 	return row;
			// }
		}
	}


	mulai() {
		Swal.fire({
			title: 'Apa anda yakin?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonText: 'Ya, lanjutkan!',
			cancelButtonText: 'Batal',
		}).then(res=>{
			if(res.isConfirmed){
				this.store.dispatch(
					StokOpnameAction.startInitial()
				)
			}
		})
	}
	go(path) {
		this.router.navigate([path])
	}
	open(content) {
		this.modalService.open(content)
	}
	modalClose(content) {
		this.modalService.close(content)
	}
}
