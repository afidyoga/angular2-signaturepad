import { Component, ViewChild, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import {ModulPembelianService} from 'src/app/private/modul-api/modul-laporan/laporan-pembelian'
import {ModulPembelianExportService} from 'src/app/private/modul-api/modul-laporan/laporan-pembelian-export'
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import * as moment from 'moment';
import {MoneyService} from 'src/app/private/services/money/index'
import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexDataLabels,
	ApexTooltip,
	ApexYAxis,
	ApexPlotOptions,
	ApexStroke,
	ApexLegend,
	ApexFill,
	ApexResponsive,
} from 'ng-apexcharts';
export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	stroke: ApexStroke;
	tooltip: ApexTooltip;
	dataLabels: ApexDataLabels;
	legend: ApexLegend;
	responsive: ApexResponsive[];
	plotOptions: ApexPlotOptions;
	fill: ApexFill;
	colors: string[];
};
@Component({
	selector: 'app-main',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
	public cardChart1: any;
	public cardChart1Data: any;
	public cardChart1Label: any;

	public cardChart2: any;
	public cardChart2Data: any;
	public cardChart2Label: any;

	public cardChart3: any;
	public cardChart3Data: any;
	public cardChart3Label: any;

	public cardChart4: any;
	public cardChart4Data: any;
	public cardChart4Label: any;

	public areaChartOptions: Partial<ChartOptions>;
	public barChartOptions: Partial<ChartOptions>;
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};

	reloadTable: boolean
	getState: Observable<any>;
	constructor(
		private ModulPembelianService:ModulPembelianService,
		private pembelianExport:ModulPembelianExportService,
		private fb: FormBuilder,
		private spinner:NgxSpinnerService,
		private money:MoneyService
	) { }
	formInput=null
	listPoliklinik=[]
	search=false
	listKunjungan=[]
	tableShow=false
	pembelian="Rp.0.000"
	persentase=0
	total_bayar=[]
	tgl_faktur=[]
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
		})
		this.chart1();
		this.dtOptions = this.showDataTables()
		this.loadData()
	}
	async loadData(){
		this.spinner.show('spinner1')
		let dataTablesParameters={date_from:0,date_to:0}
		dataTablesParameters.date_from=new Date(this.convertTime(this.formInput.value.date_from[0])).getTime()
		dataTablesParameters.date_to=new Date(this.convertTime(this.formInput.value.date_from[1])).getTime()
		await this.ModulPembelianService.getObatTotal(dataTablesParameters).subscribe((resp: any) => {
			this.pembelian=this.money.formatRupiah(resp.response.pembelian)
			this.persentase=resp.response.persentase
		})
		await this.ModulPembelianService.getObatGrafik(dataTablesParameters).subscribe((resp: any) => {
			this.total_bayar=resp.response.total_bayar
			this.tgl_faktur=resp.response.tgl_faktur
			this.spinner.hide('spinner1')
		})
	}
	reLoadData() {
		this.loadData()
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}
	searchAction(){
		this.search=true
		if (this.formInput.invalid) {
				return false
			}
		this.reLoadData()
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
		this.spinner.show('spinner1')
		this.pembelianExport.getObatExport(this.params)
		.subscribe((resp: any) => {
			this.download(resp)
			this.spinner.hide('spinner1')
		})
	}
	convertTime(tgl){
		let time= moment(new Date(tgl)).format("YYYY-MM-DD")+' 00:00:00'
		return new Date(time).getTime()
	}
	showDataTables() {
		this.spinner.show('spinner1')
		this.tableShow=true
		let self=this
		return {
			pageLength: 10,
			serverSide: true,  
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				if(this.formInput.value.date_from!=null){
					dataTablesParameters.date_from=new Date(this.convertTime(this.formInput.value.date_from[0])).getTime()
					dataTablesParameters.date_to=new Date(this.convertTime(this.formInput.value.date_from[1])).getTime()
					this.ModulPembelianService.getObatFaktur(dataTablesParameters)
						.subscribe((resp: any) => {
							callback({
								draw: resp.response.draw,
								recordsTotal: resp.response.recordsTotal,
								recordsFiltered: resp.response.recordsFiltered,
								data: resp.response.data
							})
							this.spinner.hide('spinner1')
						})
				}
			
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
					data: 'tempo',
				},
				{
					data: 'tempo',
				},
				{
					data: 'nama_supplier'
				},
				{
					data: 'total_bayar_obat',
					render(data: any, type: any, row: any, full: any) {
						return self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
				},

			],

		}
	}




	private chart1() {
		this.areaChartOptions = {
			series: [
				{
					name: 'Total Pembelian',
					data: this.total_bayar,
				},
			],
			chart: {
				height: 350,
				type: 'bar',
				toolbar: {
					show: false,
				},
				foreColor: '#9aa0ac',
			},
			colors: ['#407fe4', '#908e8e'],
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
			},
			xaxis: {
				type: 'datetime',
				categories: this.tgl_faktur,
			},
			legend: {
				show: true,
				position: 'top',
				horizontalAlign: 'center',
				offsetX: 0,
				offsetY: 0,
			},

			tooltip: {
				theme: 'dark',
				marker: {
					show: true,
				},
				x: {
					show: true,
				},
			},
		};
	}

}
