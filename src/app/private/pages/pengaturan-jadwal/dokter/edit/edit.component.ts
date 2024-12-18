import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { AkunService } from 'src/app/private/services/manajemen-akun/akun.service'
import { DaftarRuangService } from 'src/app/private/services/master-data/ruang-dan-jadwal/daftar-ruang.service'
import { JadwalSesiService } from 'src/app/private/services/master-data/ruang-dan-jadwal/jadwal-sesi.service'
import { JadwalDokterService } from 'src/app/private/services/pengaturan-jadwal/jadwal-dokter.service'
import * as moment from 'moment';
import * as fromApp from 'src/app/private/states/private-app.states'
import * as JadwalDokterActions from 'src/app/private/states/pengaturan-jadwal/jadwal-dokter/jadwal-dokter.actions'
// import { JadwalDokterPayload } from "src/app/private/models/class-payload-api/pengaturan-jadwal/jadwal-dokter-payload";
// import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

	formInput: FormGroup;
	listDokter: Array<any> = []
	listDaftarRuang: Array<any> = []
	listJadwalSesi: Array<any> = []
	tglSekarang: any = new Date()
	minDate: Date = new Date()

	loadingListDokter: boolean = false
	loadingListDaftarRuang: boolean = false
	loadingListJadwalSesi: boolean = false

	paramDokter = { last_data: 0, get_data: 10, search: "" }
	paramDaftarRuang = { last_data: 0, get_data: 10, search: "" }
	paramJadwalSesi = { last_data: 0, get_data: 10, search: "" }

	isLoadingButton: boolean
	errorMessage: any | null
	submitButton: boolean
	submitted: boolean = false
	isEdit: boolean
	id_jadwal_dokter = null
	getState: Observable<any>;

	jadwalDokter: any

	constructor(
		private akunService: AkunService,
		private daftarRuangService: DaftarRuangService,
		private fb: FormBuilder,
		private jadwalSesiService: JadwalSesiService,
		private store: Store<fromApp.PrivateAppState>,
		private activatedRoute: ActivatedRoute,
		private JadwalDokterService: JadwalDokterService,
		private spinner : NgxSpinnerService,

	) {
		this.getState = this.store.select("pengaturanJadwal_jadwalDokter")
	}

	ngOnInit(): void {
		let tgl = moment().add(1, 'days').format("DD-MM-YYYY")
		this.formInput = this.fb.group({
			id_akun_dokter: [null, [Validators.required]],
			tgl_masuk: [tgl, [Validators.required]],
			kategori: [null, [Validators.required]],
			id_jadwal_sesi: [null, []],
			detail: this.fb.array([])
		})
		this.spinner.show('spinner1')
		this.prosesSelectDokter('', 'open')
		this.prosesSelectDaftarRuang('', 'open')
		setTimeout(() => {
			this.activatedRoute.params.subscribe((params: Params) => {
				if (params) {
					this.id_jadwal_dokter = params.id
					this.JadwalDokterService.show(params.id)
						.subscribe((resp: any) => {
							if (resp.metaData.response_code == '0000') {
								this.jadwalDokter = resp.response
								this.formInput.patchValue({
									id_akun_dokter: this.jadwalDokter.id_akun_dokter,
									kategori: this.jadwalDokter.kategori_jadwal,
									tgl_masuk: moment(this.jadwalDokter.tgl_kegiatan, 'YYYY-MM-DD').format('DD-MM-YYYY'),
								})
								if (this.jadwalDokter.detail != undefined) {
									if (this.jadwalDokter.detail.length > 0) {
										this.jadwalDokter.detail.forEach(el => {
	
											let control = <FormArray>this.formInput.controls.detail;
											control.push(
												this.fb.group({
													id_jadwal_dokter_detail: [el.id_jadwal_dokter_detail, []],
													id_jadwal_sesi: [el.id_jadwal_sesi, []],
													nama_sesi: [el.nama_sesi, []],
													id_ruang: [el.id_ruang, []],
													jam_mulai: [this.parseTime(el.jam_mulai), []],
													jam_selesai: [this.parseTime(el.jam_selesai), []],
												})
											)
										});
									}
								}
	
							}
							this.spinner.hide('spinner1')
						})
				}
			})
		}, 400);



	}

	async SubmitForm() {
		this.submitted = false
		setTimeout(() => { this.submitted = true }, 200);
		if (this.formInput.invalid) {
			return false
		}
		this.spinner.show('spinner1')
		let detail = Array();
		this.formInput.value.detail.forEach(el => {
			detail.push({
				id_jadwal_dokter_detail: el.id_jadwal_dokter_detail,
				id_jadwal_sesi: el.id_jadwal_sesi,
				jam_mulai: moment(el.jam_mulai).format("HH:mm:ss"),
				jam_selesai: moment(el.jam_selesai).format("HH:mm:ss"),
				id_ruang: el.id_ruang.toString()
			})
		});
		let payload = {
			tgl_kegiatan: moment(this.formInput.value.tgl_masuk, 'DD-MM-YYYY').format('YYYY-MM-DD'),
			detail: detail,
			id_jadwal_dokter: this.id_jadwal_dokter
		}
		this.store.dispatch(JadwalDokterActions.updateInitial({ payload: payload }))
		setTimeout(() => {
			this.spinner.hide('spinner1')
		}, 400);
	}
	onFocus(id){
		document.getElementById(id).click()
	}
	
	simpanDetailSesi() {
		let idJadwalSesi = this.formInput.value.id_jadwal_sesi
		if (idJadwalSesi) {
			let indexJadwal = this.listJadwalSesi.findIndex((el) => {
				return el.id_jadwal_sesi == idJadwalSesi
			})
			if (indexJadwal >= 0) {
				let find = this.listJadwalSesi[indexJadwal]
				let control = <FormArray>this.formInput.controls.detail;
				control.push(
					this.fb.group({
						id_jadwal_sesi: [find.id_jadwal_sesi, []],
						nama_sesi: [find.nama_sesi, []],
						id_ruang: [find.id_ruang, []],
						jam_mulai: [new Date(''), []],
						jam_selesai: [new Date(''), []],
					})
				)
			}
		}
	}
	deleteDetailSesi(i: number) {
		let control = <FormArray>this.formInput.controls.detail
		control.controls.splice(i, 1)
	}
	prosesSelectDokter(event: any, aksi: string) {
		this.loadingListDokter = true
		let param = this.paramDokter
		if (aksi == 'search')
		{
			this.listDaftarRuang=[]
			param.search = event.term
			param.last_data=0
		}
		else
		{
			param.search = ""
		}
		
		if(aksi=="last_page"){
			let last=param.last_data+param.get_data
			param.last_data=last
		}else{
			param.last_data=0
		}
		this.akunService.prosesSelectAkun(param, aksi, 'dokter')
			.subscribe(resp => {
				this.loadingListDokter = false
				if(resp){
					if(this.listDokter.length==0){
						this.listDokter=resp.response
					}else{
						resp.response.map(val=>{
							let index=this.listDokter.findIndex(x=>x.id_akun_dokter==val.id_akun_dokter)
							if(index<0){
								this.listDokter.push(val)
							}
						})
					}
				}
			}, err => {
				this.loadingListDokter = false
			})
	}

	prosesSelectDaftarRuang(event: any, aksi: string) {
		this.loadingListDaftarRuang = true
		let param = this.paramDaftarRuang
		if (aksi == 'search')
		{
			this.listDaftarRuang=[]
			param.search = event.term
			param.last_data=0
		}
		else
		{
			param.search = ""
		}
		
		if(aksi=="last_page"){
			let last=param.last_data+param.get_data
			param.last_data=last
		}else{
			param.last_data=0
		}
		this.daftarRuangService.prosesSelectDaftarRuang(param, aksi)
			.subscribe(resp => {
				this.loadingListDaftarRuang = false
				if(resp){
					if(this.listDaftarRuang.length==0){
						this.listDaftarRuang=resp.response
					}else{
						resp.response.map(val=>{
							let index=this.listDaftarRuang.findIndex(x=>x.id_ruang==val.id_ruang)
							if(index<0){
								this.listDaftarRuang.push(val)
							}
						})
					}
				}
			}, err => {
				this.loadingListDaftarRuang = false
			})
	}

	parseTime(t: any) {
		var d = new Date();
		var time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
		d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
		d.setMinutes(parseInt(time[2]) || 0);
		return d;
	}

	prosesSelectJadwalSesi(event: any, aksi: string) {
		this.loadingListJadwalSesi = true
		let param = this.paramJadwalSesi
		if (aksi == 'search')
		{
			this.listJadwalSesi=[]
			param.search = event.term
			param.last_data=0
		}
		else
		{
			param.search = ""
		}
		
		if(aksi=="last_page"){
			let last=param.last_data+param.get_data
			param.last_data=last
		}else{
			param.last_data=0
		}
		this.jadwalSesiService.prosesSelectJadwalSesi(param, aksi)
			.subscribe(res => {
				this.loadingListJadwalSesi = false
				this.listJadwalSesi = []
				if(res){
					if(this.listJadwalSesi.length==0){
						res.response.forEach(el => {
							this.listJadwalSesi.push({
								id_jadwal_sesi: el.id_jadwal_sesi,
								nama_sesi: el.nama_sesi
									+ ' ('
									+ moment(this.parseTime(el.jam_buka)).format("HH:mm")
									+ ' - '
									+ moment(this.parseTime(el.jam_tutup)).format("HH:mm")
									+ ')'
							})
						});
					}else{
						res.response.map(el=>{
							let index=this.listJadwalSesi.findIndex(x=>x.id_jadwal_sesi==el.id_jadwal_sesi)
							if(index<0){
								this.listJadwalSesi.push({
									id_jadwal_sesi: el.id_jadwal_sesi,
									nama_sesi: el.nama_sesi
										+ ' ('
										+ moment(this.parseTime(el.jam_buka)).format("HH:mm")
										+ ' - '
										+ moment(this.parseTime(el.jam_tutup)).format("HH:mm")
										+ ')'
								})
							}
						})
					}
				}
				
			}, err => {
				this.loadingListJadwalSesi = false
			})
	}

}
