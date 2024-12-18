import { Component, ViewChild, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import {ModulDasboardService} from 'src/app/private/modul-api/modul-laporan/dashboard'
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import {MoneyService} from 'src/app/private/services/money/index'
import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexNonAxisChartSeries,
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
	labels: any;
  };
  export type ChartPieOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	responsive: ApexResponsive[];
	labels: any;
  };
@Component({
	selector: 'app-main',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
	data:any
	search=false
	formInput: any
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	reloadTable: boolean
	getState: Observable<any>;
	public barChartOptions: Partial<ChartOptions>;
	public pieChart1Options:Partial<ChartPieOptions>;
	public pieChart2Options:Partial<ChartPieOptions>;
	constructor(
		private fb:FormBuilder,
		private ModulDasboardService:ModulDasboardService,
		private MoneyService:MoneyService,
		private spinner : NgxSpinnerService,

		) { }
		minDate=new Date()
		maxDate=new Date()
		
	ngOnInit() {
		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
		this.minDate = new Date(y, m, 1);
		this.maxDate= new Date(y, m + 1, 0);
		this.formInput = this.fb.group({
			date_from: [[new Date(y, m, 1), new Date()], [Validators.required]]
		})
		this.barChart2()
		this.pieCart1()
		this.pieCart2()
	}
	private pieCart1(){
		this.pieChart1Options={
			series: [44, 55, 13],
			chart: {
				width: 380,
				type: "pie"
			},
			labels: ["Dalam", "Luar", "Lainnya"],
			responsive: [
				{
				breakpoint: 480,
				options: {
					chart: {
					width: 200
					},
					legend: {
					position: "bottom"
					}
				}
				}
			]
		}
	}
	private pieCart2(){
		this.pieChart2Options={
			series: [44, 55, 13],
			chart: {
				width: 380,
				type: "pie"
			},
			labels: ["Laki-laki", "Perempuan", "Lainnya"],
			responsive: [
				{
				breakpoint: 480,
				options: {
					chart: {
					width: 200
					},
					legend: {
					position: "bottom"
					}
				}
				}
			]
		}
	}
	private barChart2() {
		this.barChartOptions = {
		  series: [
			{
			  name: 'Colds and Flu',
			  data: [44, 55, 41, 67, 22, 43],
			},
			
		  ],
		  chart: {
			type: 'bar',
			height: 350,
			foreColor: '#9aa0ac',
			stacked: true,
			toolbar: {
			  show: false,
			},
		  },
		  responsive: [
			{
			  breakpoint: 480,
			  options: {
				legend: {
				  position: 'bottom',
				  offsetX: -10,
				  offsetY: 0,
				},
			  },
			},
		  ],
		  plotOptions: {
			bar: {
			  horizontal: false,
			  columnWidth: '30%',
			},
		  },
		  dataLabels: {
			enabled: false,
		  },
		  xaxis: {
			type: 'category',
			categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		  },
		  legend: {
			show: false,
		  },
		  fill: {
			opacity: 0.8,
			colors: ['#01B8AA'],
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
	convertTime(tgl){
		let time= moment(new Date(tgl)).format("YYYY-MM-DD")+' 00:00:00'
		return new Date(time).getTime()
	}
	
	setMoney(val){
		return this.MoneyService.formatRupiah(val)
	}
	setDate(val){
		return moment(val).format("DD-MM-YYYY")
	}

}
