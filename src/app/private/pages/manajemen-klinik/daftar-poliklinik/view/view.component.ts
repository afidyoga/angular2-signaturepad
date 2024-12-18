import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DaftarPoliklinikService } from 'src/app/private/services/manajemen-klinik/daftar-poliklinik.service';
import { DaftarPoliklinikPayload } from 'src/app/private/models/class-payload-api/manajemen-klinik/daftar-poliklinik-payload';
import { DaftarKlinikService } from 'src/app/private/services/manajemen-klinik/daftar-klinik.service';
import { MasterPoliService } from 'src/app/private/services/manajemen-klinik/master-poli.service';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import * as fromApp from 'src/app/private/states/private-app.states'
import * as DaftarPoliklinikActions from 'src/app/private/states/manajemen-klinik/daftar-poliklinik/daftar-poliklinik.actions'
import { NgxSpinnerService } from "ngx-spinner";

import { ModalService } from 'src/app/shared/_modal';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	@ViewChild('formContent', { static: false }) formContentModal: any;

	getState: Observable<any>
	public formTambah: FormGroup;
	titleModal: string
	aksiModal: string
	isEdit: boolean
	isLoadingButton: boolean
	reloadTable: boolean
	errorMessage: any | null
	submitButton: boolean
	daftarPoliklinik: DaftarPoliklinikPayload = new DaftarPoliklinikPayload
	listPoli: Array<any> = []
	listKlinik: Array<any> = []
	submitted: boolean = false
	btnDetail=false
		btnDelete=false
		btnEdit=false
		btnSetting=false
		btnAdd=false
		view=false
	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private daftarKlinikService: DaftarKlinikService,
		private masterPoliService: MasterPoliService,
		private daftarPoliklinikService: DaftarPoliklinikService,
		private store: Store<fromApp.PrivateAppState>,
		private modalSrce: ModalService,
		private spinner : NgxSpinnerService,
	) {
		this.getState = this.store.select('manajemenKlinik_daftatPoliklinik')
	}

	ngOnInit(): void {
		this.modalService.dismissAll(this.formContentModal)
		this.store.dispatch(DaftarPoliklinikActions.clearData())
		this.formTambah = this.fb.group({
			id_master_poli: ["", [Validators.required]],
			id_klinik: ["", [Validators.required]],
			nama_poliklinik: ["", [Validators.required]],
			alamat_poliklinik: ["", [Validators.required]],
			status_aktif: [1, []],
		})
		
		let item=JSON.parse(localStorage.getItem('currentUser'))
		item=item.menu_right
		this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='MGMKDP2')!=-1?true:false
		this.btnDetail=this.view=item.findIndex((val)=>val.kode=='MGMKDP1')!=-1?true:false
		this.dtOptions = this.showDataTables(this.btnEdit)
		if(!this.view){
			Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
			  window.location.href='/'
			})
		  }
		this.loadPoli()
		this.loadKlinik()

		this.getState.subscribe((state) => {
			this.daftarPoliklinik = state.daftarPoliklinik
			this.isLoadingButton = state.isLoadingButton
			this.errorMessage = state.errorMessage
			this.reloadTable = state.reloadTable
			this.submitButton = state.submitButton
			this.isEdit = state.isEdit
			if (this.isEdit) {
				this.formTambah.patchValue({
					id_master_poli: this.daftarPoliklinik.id_master_poli,
					id_klinik: this.daftarPoliklinik.id_klinik,
					nama_poliklinik: this.daftarPoliklinik.nama_poliklinik,
					alamat_poliklinik: this.daftarPoliklinik.alamat_poliklinik,
					status_aktif: this.daftarPoliklinik.status_aktif
				})
				this.submitted = false
				this.spinner.hide('spinner1')
				this.modalSrce.open("modalForm")
				// this.modalService.open(this.formContentModal, { ariaLabelledBy: "modal-basic-title", backdrop : 'static', keyboard : false });
			}
			if (this.reloadTable) {
				this.reLoadData()
				this.modalSrce.close("modalForm")
			}
		})
	}


	hideModal() {
		this.modalSrce.close("modalForm")

	}

	SubmitForm() {
		this.submitted = false
		setTimeout(() => { this.submitted = true }, 200)

		if (this.formTambah.invalid) {
			return
		}
		this.spinner.show('spinner1')
		let payload = new DaftarPoliklinikPayload
		payload.id_poliklinik = this.daftarPoliklinik.id_poliklinik
		payload.nama_poliklinik = this.formTambah.value.nama_poliklinik
		payload.id_master_poli = this.formTambah.value.id_master_poli
		payload.id_klinik = this.formTambah.value.id_klinik
		payload.alamat_poliklinik = this.formTambah.value.alamat_poliklinik
		payload.status_aktif = String(Number(this.formTambah.value.status_aktif))

		if (this.aksiModal == 'add') {
			this.store.dispatch(DaftarPoliklinikActions.addDaftarPoliklinik({ payload: payload }))
		} else {
			this.store.dispatch(DaftarPoliklinikActions.updateDaftarPoliklinik({ payload: payload }))
		}
		setTimeout(() => {
			this.spinner.hide('spinner1')
		}, 400);
	}

	FormModalOpen() {
		this.submitted = false
		this.modalSrce.open("modalForm")
		this.store.dispatch(DaftarPoliklinikActions.clearData())

		this.titleModal = "Form Tambah Daftar Poliklinik"
		this.aksiModal = 'add'
		// this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", backdrop : 'static', keyboard : false });
		this.formTambah.reset()
		this.formTambah.patchValue({
			id_master_poli: "",
			id_klinik: "",
			status_aktif: 1
		})
	}

	showModalEvent(event: any) {

	}
	hideModalEvent(event: any) {

	}
	setStatus(val) {
		this.formTambah.patchValue({
			status_aktif: val
		})
	}
	editData(data: any) {
		this.aksiModal = 'update'
		this.titleModal = "Form Edit Poliklinik"
		this.spinner.show('spinner1')

		this.store.dispatch(
			DaftarPoliklinikActions.getBbyIdDaftarPoliklinik({ payload: { id: data.id_poliklinik } })
		)
	}

	nonAktif(data: any) {
		Swal.fire({
			title: 'Apakah anda yakin akan menghapus data ini ?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonText: 'Ya, hapus saja!',
			cancelButtonText: 'Tidak, Batalkan'
		}).then((result) => {
			if (result.value) {
				this.store.dispatch(
					DaftarPoliklinikActions.deleteDaftarPoliklinik({ payload: { id: data.id_poliklinik } })
				)
			}
		})
	}


	loadPoli() {
		this.masterPoliService.getAll()
			.subscribe(succ => {
				this.listPoli = succ.response
			})
	}

	loadKlinik() {
		this.daftarKlinikService.getAll()
			.subscribe(succ => {
				this.listKlinik = succ.response
			})
	}

	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

	showDataTables(edit) {
		this.spinner.show('spinner1')
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				this.daftarPoliklinikService.getDataTables(dataTablesParameters)
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
				}, {
					data: 'nama_klinik'
				}, {
					data: 'nama_poli'
				}, {
					data: 'no_reg_poliklinik'
				}, {
					data: 'nama_poliklinik'
				}, {
					data: 'alamat_poliklinik'
				}, {
					data: 'status_aktif',
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
						return edit?`<div style="white-space: nowrap;">
                  <button class="btn btn-sm btn-ubah update-data ">Edit</button>
                  <button class="btn nonaktif-data btn-hapus btn-sm">Hapus</button>
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

}
