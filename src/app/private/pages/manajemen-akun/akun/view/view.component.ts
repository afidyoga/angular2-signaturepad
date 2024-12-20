import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { AkunService } from 'src/app/private/services/manajemen-akun/akun.service'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgxSpinnerService } from "ngx-spinner";
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/private/states/private-app.states'
import * as AkunActions from 'src/app/private/states/manajemen-akun/akun/akun.actions'
@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

	getState: Observable<any>;
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	isLoadingButton: boolean
	errorMessage: string
	reloadTable: boolean
	constructor(
		private akunService: AkunService,
		private router: Router,
		private spinner : NgxSpinnerService,
		private store: Store<fromApp.PrivateAppState>,
	) {
		this.getState = this.store.select('managemenAkun_akun')
	}
	btnDetail=false
	btnDelete=false
	btnEdit=false
	btnSetting=false
	btnAdd=false
	view=false
	ngOnInit(): void {
		let item=JSON.parse(localStorage.getItem('currentUser'))
		item=item.menu_right
		this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='RRMAAU2')!=-1?true:false
		this.btnDetail=this.view=item.findIndex((val)=>val.kode=='RRMAAU1')!=-1?true:false

		if(!this.view){
			Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
			window.location.href='/'
			})
		}

		this.dtOptions = this.showDataTables(this.btnEdit)
		this.getState.subscribe((state) => {
			this.reloadTable = state.reloadTable
			this.isLoadingButton = state.isLoadingButton
			this.errorMessage = state.errorMessage
			if (this.reloadTable) {
				this.reLoadData()
			}
		})
	}

	showDataTables(edit) {
		this.spinner.show('spinner1')
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				this.akunService.showDataTable(dataTablesParameters)
					.subscribe((resp: any) => {
						callback({
							draw: resp.response.draw,
							recordsTotal: resp.response.recordsTotal,
							recordsFiltered: resp.response.recordsFiltered,
							data: resp.response.data
						});
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
				}, {
					data: 'nama_lengkap'
				}, {
					data: 'nameakun'
				}, {
					data: 'email'
				}, {
					data: 'nama_role'
				}, {
					data: 'nama_level'
				}, {
					data: 'no_hp'
				}, {
					data: 'status_akun',
					render(data: any, type: any, row: any, full: any) {
						if (data == '1') {
							return '<span class="badge col-green">Aktif</span>'
						} else {
							return '<span class="badge col-red">Tidak Aktif</span>'
						}
					}
				}, {
					orderable: false,
					searchable: false,
					render(data: any, type: any, row: any, full: any) {
						let status = row.status_akun == 1 ? 'Non Aktifkan' : 'Aktifkan'
						return edit?`<div style="white-space: nowrap;">
                      <button class="btn btn-sm btn-ubah update-data ">Edit</button>
                      <button class="btn nonaktif-data btn-hapus btn-sm">`+ status + `</button>
                    </div>`:'';
					}
				}
			],
			rowCallback: (row: Node, data: any[] | Object, index: number) => {
				const self = this;
				// Unbind first in order to avoid any duplicate handler
				// (see https://github.com/l-lin/angular-datatables/issues/87)
				// Note: In newer jQuery v3 versions, `unbind` and `bind` are
				// deprecated in favor of `off` and `on`
				$('td .update-data', row).on('click', () => {
					self.editData(data);
				});
				$('td .nonaktif-data', row).on('click', () => {
					self.nonAktif(data);
				});
				return row;
			}
		}
	}
	editData(data: any) {
		this.router.navigate(['manajemen-akun', 'akun', 'edit', data.id_akun])
	}
	nonAktif(data: any) {
		let label = data.status_akun == 1 ? 'Menonaktifkan' : 'Mengaktifkan'
		Swal.fire({
			title: 'Apakah anda yakin akan ' + label + ' data ini ?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonText: 'Ya',
			cancelButtonText: 'Tidak, Batalkan'
		}).then((result) => {
			if (result.value) {
				// console.log('info', info)
				this.store.dispatch(
					AkunActions.deleteAkun({ payload: { id: data.id_akun, status_akun: data.status_akun == 1 ? 0 : 1 } })
				)
			}
		});
	}
	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

}
