import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store';
import { AkunService } from 'src/app/private/services/manajemen-akun/akun.service'
import { DaftarRuangService } from 'src/app/private/services/master-data/ruang-dan-jadwal/daftar-ruang.service'
import { JadwalSesiService } from 'src/app/private/services/master-data/ruang-dan-jadwal/jadwal-sesi.service'
import * as moment from 'moment';
import * as fromApp from 'src/app/private/states/private-app.states'
import * as JadwalStaffActions from 'src/app/private/states/pengaturan-jadwal/jadwal-staf/jadwal-staf.actions'
import { JadwalStafPayload } from "src/app/private/models/class-payload-api/pengaturan-jadwal/jadwal-staf-payload";
import { NgxSpinnerService } from "ngx-spinner";
import {ValidateService} from 'src/app/private/services/validate/validateService'
@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {

	formInput: FormGroup;
	listStaff: Array<any> = []
	listDaftarRuang: Array<any> = []
	listJadwalSesi: Array<any> = []
	tglSekarang: any = new Date()
	minDate: Date = new Date()

	loadingListStaff: boolean = false
	loadingListDaftarRuang: boolean = false
	loadingListJadwalSesi: boolean = false

	paramStaff = { last_data: 0, get_data: 10, search: "" }
	paramDaftarRuang = { last_data: 0, get_data: 10, search: "" }
	paramJadwalSesi = { last_data: 0, get_data: 10, search: "" }

	isLoadingButton: boolean
	errorMessage: any | null
	submitButton: boolean
	submitted: boolean = false

	getState: Observable<any>;

	jadwalStaff: JadwalStafPayload = new JadwalStafPayload

	constructor(
		private akunService: AkunService,
		private validate:ValidateService,
		private daftarRuangService: DaftarRuangService,
		private fb: FormBuilder,
		private spinner : NgxSpinnerService,
		private jadwalSesiService: JadwalSesiService,
		private store: Store<fromApp.PrivateAppState>,
	) {
		this.getState = this.store.select('pengaturanJadwal_jadwalStaf');
		this.minDate.setDate(this.minDate.getDate() + 1);
		// this.minDate.setDate(this.minDate.getDate() + 1);
	}

	ngOnInit(): void {


		let tgl = moment().add(1, 'days').format("DD-MM-YYYY")
		this.formInput = this.fb.group({
			id_akun_staff: [null, [Validators.required]],
			tgl_masuk: [tgl, [Validators.required]],
			id_jadwal_sesi: [null, []],
			repeat: ["none", []],
			repeat_number: [1, []],
			repeat_date: ["day", []],
			repeat_on: this.fb.group({
				senin: [null],
				selasa: [null],
				rabu: [null],
				kamis: [null],
				jumat: [null],
				sabtu: [null],
				minggu: [null],

			}),
			kategori: [null, [Validators.required]],
			end: ["on"],
			end_on_date: [tgl],
			end_occurrences: [1],
			detail: this.fb.array([])
		})

		this.getState.subscribe((state) => {
			this.errorMessage = state.errorMessage
			this.submitButton = state.submitButton
			this.isLoadingButton = state.isLoadingButton
		})
	}
	isNumber(e){
		return this.validate.Number(e)
	}
	onFocus(id){
		document.getElementById(id).click()
	}
	SubmitForm() {
		this.submitted = false
		setTimeout(() => { this.submitted = true }, 200);
		if (this.formInput.invalid) {
			return
		}
		this.spinner.show('spinner1')
		let payload = new JadwalStafPayload
		payload.id_akun_staff = this.formInput.value.id_akun_staff
		payload.tgl_awal = moment(this.formInput.value.tgl_masuk, 'DD-MM-YYYY').format('YYYY-MM-DD')
		payload.tgl_end_type = this.formInput.value.end
		payload.repeat = this.formInput.value.repeat
		let week = []
		this.formInput.value.repeat_on.minggu != null ? week.push(0) : ''
		this.formInput.value.repeat_on.senin != null ? week.push(1) : ''
		this.formInput.value.repeat_on.selasa != null ? week.push(2) : ''
		this.formInput.value.repeat_on.rabu != null ? week.push(3) : ''
		this.formInput.value.repeat_on.kamis != null ? week.push(4) : ''
		this.formInput.value.repeat_on.jumat != null ? week.push(5) : ''
		this.formInput.value.repeat_on.sabtu != null ? week.push(6) : ''

		payload.repeat_on_week = week
		payload.repeat_value = this.formInput.value.repeat_number
		payload.repeat_type = this.formInput.value.repeat_date
		payload.kategori_jadwal = this.formInput.value.kategori
		payload.tgl_end_on = moment(this.formInput.value.end_on_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
		let detail = Array();
		this.formInput.value.detail.forEach(el => {
			detail.push({
				id_jadwal_sesi: el.id_jadwal_sesi,
				jam_mulai: moment(el.jam_mulai).format("HH:mm:ss"),
				jam_selesai: moment(el.jam_selesai).format("HH:mm:ss"),
				id_ruang: el.id_ruang?el.id_ruang.toString():""
			})
		});
		payload.detail = detail

		this.store.dispatch(JadwalStaffActions.addInitial({ payload: payload }))
		setTimeout(() => {
			this.spinner.hide('spinner1')
		}, 400);
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
						id_ruang: [null, []],
						jam_mulai: [new Date('Tue Apr 26 2022 00:00:00'), []],
						jam_selesai: [new Date('Tue Apr 26 2022 00:00:00'), []],
					})
				)
			}
		}
	}



	deleteDetailSesi(num: number) {
		let index = this.formInput.get('detail') as FormArray
		index.removeAt(num)
	}

	prosesSelectStaff(event: any, aksi: string) {
		this.loadingListStaff = true
		let param = this.paramStaff
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
		this.akunService.prosesSelectAkun(param, aksi, 'staff')
			.subscribe(resp => {
				this.loadingListStaff = false
				if(resp){
					if(this.listStaff.length==0){
						this.listStaff=resp.response
					}else{
						resp.response.map(val=>{
							let index=this.listStaff.findIndex(x=>x.id_akun_staff==val.id_akun_staff)
							if(index<0){
								this.listStaff.push(val)
							}
						})
					}
				}
			}, err => {
				this.loadingListStaff = false
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
