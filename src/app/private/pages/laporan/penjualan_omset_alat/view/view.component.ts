import { Component, ViewChild, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import {ModulPenjualanService} from 'src/app/private/modul-api/modul-laporan/laporan-penjualan'
import {ModulPenjualanExportService} from 'src/app/private/modul-api/modul-laporan/laporan-penjualan-export'
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
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
	dtOptionsPenjualanOmset: DataTables.Settings = {};
	dtOptionsPenjualanObat: DataTables.Settings = {};
	dtOptionsPenjualanAlat: DataTables.Settings = {};
	search=false
	showTable=false
	reloadTable: boolean
	getState: Observable<any>;
	formInput=null
	dataPenjualan={
		jlm_penjualan: 0,
		rata_rata_penjualan:0,
		total_penjualan: 0
	}
	labelGrafik=[]
	dataGrafik={data:[],category:[]}
	constructor(
		private ModulPenjualanService:ModulPenjualanService,
		private exportPenjualan:ModulPenjualanExportService,
		private fb: FormBuilder,
		private spinner:NgxSpinnerService ,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private money:MoneyService
	) { }
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
		this.activatedRoute.params.subscribe((params: Params) => {
			if (params) {
				console.log(params)
				this.formInput = this.fb.group({
					date_month: [[new Date(params.tgl1),new Date(params.tgl2)], [Validators.required]],
				})
			}else{
				this.formInput = this.fb.group({
					date_month: [ [new Date(y, m, 1), new Date()], [Validators.required]],
				})
			}
		})
	
		this.chart1();
		this.dtOptionsPenjualanOmset = this.showDataPenjualanHarian()
		this.dtOptionsPenjualanAlat = this.showDataPenjualanAlat()

		this.getPenjualanOmset()
		this.getGrafikData()
		
		
	}
	onOpenCalendar(container : any){
		container.monthSelectHandler = (event: any): void => {
		  container._store.dispatch(container._actions.select(event.date));
		};
		container.setViewMode('month');
	  }
	  reLoadData() {
		
		this.router.navigate(['laporan/penjualan-omset/view/'+moment(this.formInput.value.date_month[0]).format("YYYY-MM-DD")+'/'+moment(this.formInput.value.date_month[1]).format("YYYY-MM-DD")])
		// this.getGrafikData()
		// this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
		// 	dtInstance.ajax.reload();
		// });
	}
	getGrafikData(){
		this.spinner.show('spinner1')
		let param={
			"unixtime_start":new Date(this.formInput.value.date_month[0]).getTime(),
			"unixtime_end":new Date(this.formInput.value.date_month[1]).getTime()
		}
		this.ModulPenjualanService.getPenjualanGrafikAlat(param).subscribe((resp: any) => {
			if(resp.metaData.response_code=="0000"){
				this.labelGrafik=Object.keys(resp.response)
				this.labelGrafik.map(val=>{
					let arr=[]
					resp.response[val].map(x=>{
						arr.push(parseInt(x.value))
						this.dataGrafik.category.push(x.label)
					})
					this.dataGrafik.data.push(
						{
							name: val,
							data:arr,
						}
					)
					
				})
				this.spinner.hide('spinner1')
			}
		})
	}
	getPenjualanOmset(){
		this.spinner.show('spinner1')
		let params={
		    "unixtime_start": new Date(this.formInput.value.date_month[0]).getTime(),
		    "unixtime_end": new Date(this.formInput.value.date_month[1]).getTime()
		}
		this.ModulPenjualanService.getPenjualanAlatOmset(params).subscribe((resp: any) => {
			if(resp.metaData.response_code=="0000"){
				this.dataPenjualan=resp.response
				this.spinner.hide('spinner1')
			}
		})
	}
	setMoney(val){
		return this.money.formatRupiah(val)
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
		link.setAttribute('download', `Laporan Penjualan Dan Omset Obat.xlsx`);
		document.body.appendChild(link);
		link.click();
	}
	export(){
		this.spinner.show('spinner1')
		let currentUser:any=localStorage.getItem('currentUser')
		currentUser=currentUser!=null?JSON.parse(currentUser):null
		let param={
			"Authorization": currentUser.token,
			"x_api_key": currentUser.key,
			"search": {
				"value": "",
				"regex": false
			},
			"unixtime_start": 0,
			"unixtime_end": 0
		}
		param.unixtime_start=new Date(this.formInput.value.date_month[0]).getTime()
		param.unixtime_end=new Date(this.formInput.value.date_month[1]).getTime()
		this.exportPenjualan.exportAlatHarian(param)
					.subscribe((resp: any) => {
			this.download(resp)
			this.spinner.hide('spinner1')
		})
	}
	exportAlat(){
		this.spinner.show('spinner1')
		let currentUser:any=localStorage.getItem('currentUser')
		currentUser=currentUser!=null?JSON.parse(currentUser):null
		let param={
			"Authorization": currentUser.token,
			"x_api_key": currentUser.key,
			"search": {
				"value": "",
				"regex": false
			},
			"unixtime_start": 0,
			"unixtime_end": 0
		}
		param.unixtime_start=new Date(this.formInput.value.date_month[0]).getTime()
		param.unixtime_end=new Date(this.formInput.value.date_month[1]).getTime()
		this.exportPenjualan.exportAlat(param)
					.subscribe((resp: any) => {
			this.download(resp)
			this.spinner.hide('spinner1')
		})
	}
	showDataPenjualanAlat() {
		this.spinner.show('spinner1')
		let self=this
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
			    dataTablesParameters.unixtime_start=new Date(this.formInput.value.date_month[0]).getTime()
			    dataTablesParameters.unixtime_end=new Date(this.formInput.value.date_month[1]).getTime()
				this.ModulPenjualanService.getPenjualanAlat(dataTablesParameters)
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
					data: 'nama_obat',
				},
				{
					data: 'qty'
				},
				{
					data: 'satuan'
				},
				{
					data: 'harga_satuan'
				},
				{
					data: 'total_harga',
					render(data: any, type: any, row: any, full: any) {
						return self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
				},
			],

		}
	}
	showDataPenjualanHarian() {
		this.spinner.show('spinner1')
		let self=this
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				 dataTablesParameters.unixtime_start=new Date(this.formInput.value.date_month[0]).getTime()
			    dataTablesParameters.unixtime_end=new Date(this.formInput.value.date_month[1]).getTime()
				this.ModulPenjualanService.getPenjualanHarianAlat(dataTablesParameters)
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
					data: 'tgl_transaksi',
					render(data: any, type: any, row: any, full: any) {
						return moment(data).format("DD-MM-YYYY")
					}
				},
				{
					data: 'total_transaksi',
					render(data: any, type: any, row: any, full: any) {
						return self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
				},
			],

		}
	}
	

	private chart1() {
		this.areaChartOptions = {
			series: this.dataGrafik.data!=undefined?this.dataGrafik.data:[],
			chart: {
				height: 350,
				type: 'bar',
				toolbar: {
					show: false,
				},
				foreColor: '#9aa0ac',
			},
			colors: ['orange', 'red'],
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
			},
			xaxis: {
				type: 'datetime',
				categories: this.dataGrafik.category,
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
