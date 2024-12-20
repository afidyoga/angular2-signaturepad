import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import {MoneyService} from 'src/app/private/services/money/index'
import { ModulMutasiExportService } from 'src/app/private/modul-api/modul-laporan/laporan-mutasi-export'
import { ModulMutasiService } from 'src/app/private/modul-api/modul-laporan/laporan-mutasi';
import * as moment from 'moment';
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
  	formInput: FormGroup;
	constructor(
		private modulExport: ModulMutasiExportService,
		private ModulMutasi: ModulMutasiService,
		private money:MoneyService,
    	private fb : FormBuilder,
	) { }
	search=false
	params:any
	currentUser:any=localStorage.getItem('currentUser')
	minDate=new Date()
	maxDate=new Date()
	ngOnInit(): void {
		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
		this.minDate = new Date(y, m, 1);
		this.maxDate= new Date(y, m + 1, 0);
		this.currentUser=this.currentUser!=null?JSON.parse(this.currentUser):null
		this.params={
			"Authorization": this.currentUser.token,
			"x_api_key": this.currentUser.key,
			"search": {
			"value": "",
			"regex": false
			},
			"transaksi_jenis": "masuk",
			"start":"",
			"end":"",
			"expired_in":0
		}
    this.formInput = this.fb.group({
      date_from: [ [new Date(y, m, 1), new Date()], [Validators.required]],
      pengguna:["all",[Validators.required]]
    });
		this.dtOptions = this.showDataTables()
		this.getState.subscribe((state) => {
			this.reloadTable = state.reloadTable
			if (this.reloadTable === true) {
				this.reLoadData()
			}
		})
	}
	reLoadData() {
		this.search=true
		if (this.formInput.invalid) {
		return
		}
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
			this.search=true
		});
	}
	convertTime(tgl){
		let time= moment(new Date(tgl)).format("YYYY-MM-DD")+' 00:00:00'
		return new Date(time).getTime()
	}
	download(resp){
		const url = window.URL.createObjectURL(new Blob([resp],{type:"application/ms-excel"}));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `Laporan Pembelian Obat.xlsx`);
		document.body.appendChild(link);
		link.click();
	}
	export(){
		this.search=true
		if (this.formInput.invalid) {
		return
		}
		this.params.date_from=new Date(this.convertTime(this.formInput.value.date_from[0])).getTime()
		this.params.date_to=new Date(this.convertTime(this.formInput.value.date_from[1])).getTime()
		this.params.pengguna=this.formInput.value.pengguna
		this.modulExport.exportObat(this.params)
			.subscribe((resp: any) => {
				this.download(resp)
			this.search=false
		})
	}
	showDataTables() {
		let self=this
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				dataTablesParameters.date_from=new Date(this.convertTime(this.formInput.value.date_from[0])).getTime()
				dataTablesParameters.date_to=new Date(this.convertTime(this.formInput.value.date_from[1])).getTime()
				dataTablesParameters.pengguna=this.formInput.value.pengguna
				this.ModulMutasi.getObat(dataTablesParameters)
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
				},
				{
					data: 'tgl_faktur_unix',
					render(data: any, type: any, row: any, full: any) {
						return moment(data).format("DD-MM-YYYY")
					}
				},
				{
					data: 'nomor_faktur'
				},
				{
					data: 'nama_supplier'
				},
				{
					data: 'nama_creator'
				},
				{
					data: 'pembayaran'
				},
				{
					data: 'total',
					render(data: any, type: any, row: any, full: any) {
						return self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
				},
			],

		}
	}


}
