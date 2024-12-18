import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/_modal';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import { ModulKonsolidasiDataService } from 'src/app/private/modul-api/modul-rekam-medis/modul-konsolidasi-data.service';
import { DataPasienService } from 'src/app/private/services/pasien/data-pasien.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as KonsolidasiActions from 'src/app/private/states/konsolidasi-data/konsolidasi-data.action'
import * as fromApp from 'src/app/private/states/private-app.states'
import { NgxSpinnerService } from "ngx-spinner";
@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	reloadTable: boolean
	getState: Observable<any>;
	params = {
		"last_data": "0",
		"get_data": "10",
		"search": ""
	}
	constructor(
		private router: Router,
		private DataPasienService: DataPasienService,
		private modalService: ModalService,
		private spinner : NgxSpinnerService,
		private modulKonsolidasi: ModulKonsolidasiDataService,
		private store: Store<fromApp.PrivateAppState>,
	) { }
	loadingPasien: boolean
	listPasien: any[] = []
	toMerge: string = ""
	fromMerge: string = ""
	submitted = false
	idAntrianFrom = ""
	btnDetail=false
	btnDelete=false
	btnEdit=false
	btnSetting=false
	btnAdd=false
	view=false
	ngOnInit(): void {
		let item=JSON.parse(localStorage.getItem('currentUser'))
		item=item.menu_right
		this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='RMMDKS2')!=-1?true:false
		this.btnDetail=this.view=item.findIndex((val)=>val.kode=='RMMDKS1')!=-1?true:false

		if(!this.view){
			Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
			window.location.href='/'
			})
		}

	}
	prosesSelectPasien(event: any, aksi: string) {
		this.loadingPasien = true
		let param = this.params
		if (aksi == 'search')
		{
			this.listPasien=[]
			this.params.search = event.term
			this.params.last_data="0"
		}
		else
		{
			this.params.search = ""
		}
		
		if(aksi=="last_page"){
			let last=parseInt(this.params.last_data)+parseInt(this.params.get_data)
			this.params.last_data=last.toString()
		}else{
			this.params.last_data="0"
		}
		if (aksi == 'last_page') {
		this.params.get_data = this.params.get_data + 10
		}
		this.DataPasienService.getSelectOption(this.params)
			.subscribe((resp: any) => {
				this.loadingPasien = false
				if(resp){
					if(this.listPasien.length==0){
						this.listPasien=resp.response
					}else{
						resp.response.map(val=>{
							let index=this.listPasien.findIndex(x=>x.id_pasien==val.id_pasien)
							if(index<0){
								this.listPasien.push(val)
							}
						})
					}
				}
			})
	}
	cari() {
		this.submitted = false
		setTimeout(() => {
			this.submitted = true
		}, 300);
		if (this.fromMerge.length == 0 || this.toMerge.length == 0) {
			return false
		}
		this.dtOptions = this.showDataTables(this.fromMerge, this.toMerge,this.btnEdit)
	}
	
	check(i, id) {
		let res = false
		if (i == 1) {
			res = this.toMerge == id ? true : false
		} else {
			res = this.fromMerge == id ? true : false
		}
		return res
	}
	merge(data: any) {
		Swal.fire({
			title: 'Apa anda yakin?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonText: 'Ya, lanjutkan!',
		}).then((result) => {
			if (result) {
				let param = {
					"id_pasien_from": this.fromMerge,
					"id_pasien_target": this.toMerge
				}
				this.store.dispatch(KonsolidasiActions.addInitial({ payload: param, id: data.id_antrian }))
				this.cari()
			}
		})

	}

	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

	showDataTables(idFrom, idTo,merge) {
		this.spinner.show('spinner1')
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				dataTablesParameters.id_pasien_from = idFrom
				dataTablesParameters.id_pasien_target = idTo
				this.modulKonsolidasi.listDatatables(dataTablesParameters)
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
					data: 'tgl_antrian',
					render(data: any, type: any, row: any, full: any) {
						let tgl = new Date(data)
						let m = (tgl.getMonth() + 1 > 10) ? tgl.getMonth() + 1 : "0" + (tgl.getMonth() + 1)
						let d = (tgl.getDate() > 10) ? tgl.getDate() : "0" + tgl.getDate()
						return d + "/" + m + "/" + tgl.getFullYear()
					}
				},
				{
					data: "nama_sesi"
				},
				{
					data: "no_antrian"
				},
				{
					data: "status_antrian"
				},
				{
					orderable: false,
					searchable: false,
					render(data: any, type: any, row: any, full: any) {
						return merge?`<button class="btn btn-sm btn-info merge">Merge</button>`:'';
					}
				}
			],
			rowCallback: (row: Node, data: any[] | Object, index: number) => {
				const self = this;
				// Unbind first in order to avoid any duplicate handler
				// (see https://github.com/l-lin/angular-datatables/issues/87)
				// Note: In newer jQuery v3 versions, `unbind` and `bind` are
				// deprecated in favor of `off` and `on`
				$('td .merge', row).on('click', () => {
					self.merge(data);
				});

				return row;
			}
		}
	}
}
