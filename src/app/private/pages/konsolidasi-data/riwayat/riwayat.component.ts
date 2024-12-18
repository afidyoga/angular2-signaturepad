import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/_modal';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import { ModulKonsolidasiDataService } from 'src/app/private/modul-api/modul-rekam-medis/modul-konsolidasi-data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/private/states/private-app.states'
import { NgxSpinnerService } from "ngx-spinner";
@Component({
	selector: 'app-view',
	templateUrl: './riwayat.component.html',
	styleUrls: ['./riwayat.component.sass']
})
export class RiwayatComponent implements OnInit {
	fromMerge = []
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	reloadTable: boolean
	getState: Observable<any>;
	dataDetail = null
	btnDetail=false
	btnDelete=false
	btnEdit=false
	btnSetting=false
	btnAdd=false
	view=false
	constructor(
		private router: Router,
		private modalService: ModalService,
		private spinner : NgxSpinnerService,
		private modulKonsolidasi: ModulKonsolidasiDataService,
		private store: Store<fromApp.PrivateAppState>,
	) { }
	ngOnInit(): void {
		let item=JSON.parse(localStorage.getItem('currentUser'))
		item=item.menu_right
		// this.btnAdd,this.btnDelete,this.btnEdit=item.findIndex((val)=>val.kode=='MRMMDKS2')!=-1?true:false
		this.btnDetail=this.view=item.findIndex((val)=>val.kode=='RMMDRK1')!=-1?true:false

		if(!this.view){
			Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
			window.location.href='/'
			})
		}
		this.dtOptions = this.showDataTables(this.btnDetail)
	}

	detail(data: any) {
		this.router.navigate(['konsolidasi-data', 'detail', data.id_antrian])
	}

	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

	showDataTables(detail) {
		this.spinner.show('spinner1')
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {

				this.modulKonsolidasi.listDatatablesRiwayat(dataTablesParameters)
					.subscribe((resp: any) => {
						callback({
							draw: resp.response.draw,
							recordsTotal: resp.response.recordsTotal,
							recordsFiltered: resp.response.recordsFiltered,
							data: resp.response.data
						})
						this.spinner.hide('spinner1')
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
					data: 'tgl_antrian',
					render(data: any, type: any, row: any, full: any) {
						let tgl = new Date(data)
						let m = (tgl.getMonth() + 1 > 10) ? tgl.getMonth() + 1 : "0" + (tgl.getMonth() + 1)
						let d = (tgl.getDate() > 10) ? tgl.getDate() : "0" + tgl.getDate()
						return d + "/" + m + "/" + tgl.getFullYear()
					}
				},
				{
					data: "pasien_from",
					render(data: any, type: any, row: any, full: any) {
						return "Nama: " + data.nama + "<br>" + "Nama Panggilan: " + data.nama_panggilan + "<br> No RM :" + data.full_rm
					}
				},
				{
					data: "pasien_target",
					render(data: any, type: any, row: any, full: any) {
						return "Nama: " + data.nama + "<br>" + "Nama Panggilan: " + data.nama_panggilan + "<br> No RM :" + data.full_rm
					}
				},
				{
					orderable: false,
					searchable: false,
					render(data: any, type: any, row: any, full: any) {
						return detail?`<button class="btn btn-sm btn-info detail">Detail</button>`:'';
					}
				}
			],
			rowCallback: (row: Node, data: any[] | Object, index: number) => {
				const self = this;
				// Unbind first in order to avoid any duplicate handler
				// (see https://github.com/l-lin/angular-datatables/issues/87)
				// Note: In newer jQuery v3 versions, `unbind` and `bind` are
				// deprecated in favor of `off` and `on`
				$('td .detail', row).on('click', () => {
					self.detail(data);
				});

				return row;
			}
		}
	}
	modalClose() {
		this.modalService.close("modalFormContent")
	}
	modalOpen() {
		this.modalService.open("modalFormContent")
	}
}
