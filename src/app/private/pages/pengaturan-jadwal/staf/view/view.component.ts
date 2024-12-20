import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTableDirective } from 'angular-datatables'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from 'src/app/shared/_modal';
import { JadwalStafService } from 'src/app/private/modul-api/modul-master/modul-jadwal-staf.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import * as fromApp from 'src/app/private/states/private-app.states'
import * as JadwalStaffActions from 'src/app/private/states/pengaturan-jadwal/jadwal-staf/jadwal-staf.actions'
// import { JadwalStafPayload } from "src/app/private/models/class-payload-api/pengaturan-jadwal/jadwal-staf-payload";
import { Store } from '@ngrx/store';
import { INITIAL_EVENTS } from "./events-util";
import { NgxSpinnerService } from "ngx-spinner";
import {
	CalendarOptions,
	DateSelectArg,
	EventClickArg,
	EventApi,
	FullCalendarComponent,
} from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/angular";

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

	@ViewChild('calendar_ref') calendar_ref: FullCalendarComponent
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	formInput: FormGroup;
	titleModal: string = ""
	aksiModal: string
	isEdit: boolean
	isLoadingButton: boolean
	reloadTable: boolean
	errorMessage: any | null
	submitButton: boolean
	submitted: boolean
	getState: Observable<any>;
	calendarEvents: EventInput[];
	calendarApi: any
	listEvent: any
	detailEvent = null
	btnDetail=false
	btnDelete=false
	btnEdit=false
	btnSetting=false
	btnAdd=false
	view=false
	constructor(
		private modalService: ModalService,
		private fb: FormBuilder,
		private jadwalStaffService: JadwalStafService,
		private router: Router,
		private spinner : NgxSpinnerService,
		private store: Store<fromApp.PrivateAppState>,
	) {
		this.getState = this.store.select("pengaturanJadwal_jadwalStaf")
	}

	calendarOptions: CalendarOptions = {
		headerToolbar: {
			// left: "createButton",
			left: "prev,next today",
			center: "title",
			right: null,
		},
		customButtons: {
			createButton: {
				text: 'Tambah Baru',
				click: () => this.CreateNew()
			},
			next: {
				click: this.nextMonth.bind(this),
			},
			prev: {
				click: this.backMonth.bind(this),
			},
			// today: {
			//   text: 'Today'
			// }
		},
		initialView: "dayGridMonth",
		weekends: true,
		editable: true,
		selectable: true,
		selectMirror: true,
		dayMaxEvents: true,
		select: this.handleDateSelect.bind(this),
		eventClick: this.handleEventClick.bind(this),
	};

	ngOnInit(): void {
		this.spinner.show('spinner1')
		let item=JSON.parse(localStorage.getItem('currentUser'))
		item=item.menu_right
		this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='MGPJJS2')!=-1?true:false
		this.btnDetail=this.view=item.findIndex((val)=>val.kode=='MGPJJS1')!=-1?true:false

		if(!this.view){
			Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
			window.location.href='/'
			})
		}
		this.dtOptions = this.showDataTables(this.btnEdit)
		this.calendarEvents = INITIAL_EVENTS
		// this.calendarOptions.events = this.calendarEvents;

		this.getState.subscribe((state) => {
			this.reloadTable = state.reloadTable
			if (this.reloadTable) {
				this.reLoadData()
			}
		})
		this.loadCalender()
		setTimeout(() => {
			this.spinner.hide('spinner1')
		}, 600);
	}
	loadCalender(){
		const tanggal = new Date()
		let m = parseInt(moment(new Date(tanggal)).format('M'))
		let y = moment(new Date(tanggal)).format('YYYY')
		this.jadwalStaffService.getCalender(y, m)
			.subscribe((resp: any) => {
				if (resp.metaData.response_code == '0000') {
					let event = []
					resp.response.map((val, index) => {
						event.push({
							'id': val.id_jadwal_staff,
							'start': val.start,
							'end': val.end,
							'title': val.title,
							'className': val.groupId == 'libur' ? 'bg-danger' : 'bg-info'
						})
					})
					this.calendarOptions.events = event
				}

			})
	}
	CreateNew() {
		this.calendarApi = this.calendar_ref.getApi();
		this.calendarOptions.events = this.calendarEvents

		this.calendarApi.render();
	}
	buttonToday(ini: any): void {
		console.log(ini)
		// this.calendarApi = this.calendar_ref.getApi();
		// this.calendarOptions.events = this.calendarEvents
		// this.calendarApi.destroy();
		// this.calendarApi.render();
	}

	nextMonth(): void {
		this.calendarApi = this.calendar_ref.getApi();
		const tanggal = this.calendarApi.view.calendar.currentData.currentDate
		let m = parseInt(moment(new Date(tanggal)).format('M')) + 1
		let y = moment(new Date(tanggal)).format('YYYY')
		this.jadwalStaffService.getCalender(y, m)
			.subscribe((resp: any) => {
				if (resp.metaData.response_code == '0000') {
					let event = []
					resp.response.map((val, index) => {
						event.push({
							'id': val.id_jadwal_staff,
							'start': val.start,
							'end': val.end,
							'title': val.title,
							'className': val.groupId == 'libur' ? 'bg-danger' : 'bg-info'
						})
					})
					this.calendarOptions.events = event
				}

			})



		// this.calendarApi.destroy();
		// this.calendarApi.render();
		this.calendarApi.next();
	}
	backMonth(): void {
		this.calendarApi = this.calendar_ref.getApi();
		const tanggal = this.calendarApi.view.calendar.currentData.currentDate
		let m = parseInt(moment(new Date(tanggal)).format('M')) - 1
		let y = moment(new Date(tanggal)).format('YYYY')
		this.jadwalStaffService.getCalender(y, m)
			.subscribe((resp: any) => {
				if (resp.metaData.response_code == '0000') {
					let event = []
					resp.response.map((val, index) => {
						event.push({
							'id': val.id_jadwal_staff,
							'start': val.start,
							'end': val.end,
							'title': val.title,
							'className': val.groupId == 'libur' ? 'bg-danger' : 'bg-info'
						})
					})

					this.calendarOptions.events = event
				}

			})

		// this.calendarApi.destroy();
		// this.calendarApi.render();
		this.calendarApi.prev();
	}

	// getEventsByMonthBefore(event : DateSelectArg) {
	//   let anu = this.calendar_ref
	//   console.log('clickInfo',  anu)
	// }
	// getEventsByMonthAfter(clickInfo: EventClickArg) {

	// }
	handleDateSelect(selectInfo: DateSelectArg) {
		this.addNewEvent(selectInfo);
	}
	addNewEvent(selectInfo: any) {
		console.log('selectInfo', selectInfo.row)
	}
	setDate(tgl) {
		return moment(new Date(tgl)).format('DD-MM-YYYY')
	}
	handleEventClick(info: EventClickArg) {
		this.eventClick(info.event);
	}

	eventClick(row) {
		this.detailEvent = row
		this.OpenModal()
	}
	edit(id) {
		this.router.navigate(['pengaturan-jadwal', 'pengaturan-jadwal-staf', 'edit', id])
	}
	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

	editData(data: any) {
		this.router.navigate(['pengaturan-jadwal', 'pengaturan-jadwal-staf', 'edit', data.id_jadwal_staff])
	}

	nonAktif(data: any) {
		Swal.fire({
			title: 'Delete recurring event',
			html:
				'<div class=" mb-2 text-left"><input type="radio" checked value="this" name="eventOption" class="radio"> This event</div>' +
				'<div class=" mb-2 text-left"><input type="radio" value="this_after" name="eventOption" class="radio"> This and follow event</div>' +
				'<div class="w100 mb-2 text-left"><input type="radio" value="all" name="eventOption" class="radio"> All </div>',
			focusConfirm: false,
			preConfirm: () => {
				return $("[name='eventOption']").val()
			},
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		}).then((result) => {
			if (result.isConfirmed) {
				let val = result.value
				Swal.fire({
					title: 'Apakah anda yakin akan menghapus data ini ?',
					icon: 'warning',
					showCancelButton: true,
					allowOutsideClick: false,
					confirmButtonText: 'Ya, hapus saja!',
					cancelButtonText: 'Tidak, Batalkan'
				}).then((res) => {
					if (res.isConfirmed) {
						this.spinner.show('spinner1')
						this.store.dispatch(JadwalStaffActions.deleteInitial({ 'id': data.id_jadwal_staff, 'payload': { 'type_delete': val } }))
						setTimeout(() => {
							this.loadCalender()	
							this.spinner.hide('spinner1')
						}, 400);
					}
				})
			}

		})

	}

	showDataTables(edit) {
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				this.jadwalStaffService.getDataTables(dataTablesParameters)
					.subscribe((resp: any) => {
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
				}, {
					data: 'nama_staff'
				}, {
					data: 'kategori_jadwal'
				}, {
					data: 'nama_role'
				}, {
					data: 'tgl_kegiatan',
					render(data: any, type: any, row: any, full: any) {
						return moment(new Date(data)).format('DD-MM-YYYY')
					}
				}, {
					orderable: false,
					searchable: false,
					render(data: any, type: any, row: any, full: any) {
						return edit?`<div style="white-space: nowrap;">
                      <button class="btn btn-sm btn-ubah update-data">Edit</button>
                      <button class="btn nonaktif-data btn-hapus btn-sm">Hapus</button>
                    <div>`:'';
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
	OpenModal() {
		this.modalService.open("modalFormContent");
	}

	modalClose() {
		this.modalService.close("modalFormContent")

	}
	// tambahBaru() {
	//   this.titleModal = "Tambah Baru"
	// }

	// SubmitForm() {
	//   this.submitted = false;
	//   setTimeout(() => { this.submitted = true }, 200);
	// }
}
