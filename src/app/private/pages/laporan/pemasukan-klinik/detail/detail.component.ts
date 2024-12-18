import { Component, OnInit,ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import {MoneyService} from 'src/app/private/services/money/index'
import { ModulPemasukanKlinikService } from 'src/app/private/modul-api/modul-laporan/pemasukan-klinik'
import { ModulPemasukanKlinikExportService } from 'src/app/private/modul-api/modul-laporan/pemasukan-klinik-export'
import * as moment from 'moment';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

  constructor(
    private spinner : NgxSpinnerService,
    private router : Router,
    private pemasukanExport:ModulPemasukanKlinikExportService,
    private pemasukan:ModulPemasukanKlinikService,
    private money:MoneyService,
    private fb : FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }
  formInput:any
  @ViewChild(DataTableDirective, {static: false}) datatableElement : any = DataTableDirective
  dtOptions: DataTables.Settings = {};
  reloadTable : boolean
  params:any
	currentUser:any=localStorage.getItem('currentUser')
	ngOnInit(): void {
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
      date_from: [new Date(), [Validators.required]],
    });
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params) {
      this.dtOptions=this.showDataTables(params.id)
      this.params.id_poliklinik=params.id
      }
    })
  }

  reLoadData() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  download(resp){
		const url = window.URL.createObjectURL(new Blob([resp],{type:"application/ms-excel"}));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `Detail Laporan Pemasukan Klinik.xlsx`);
		document.body.appendChild(link);
		link.click();
	}
  export(){
        this.spinner.show('spinner1')
        this.pemasukanExport.getDetailExport(this.params)
        .subscribe((resp : any) => {
          this.download(resp)
          this.spinner.hide('spinner1')
        })
  }
  showDataTables(id) {
    let self=this
    this.spinner.show('spinner1')
    return {
      searching: false,
      pageLength: 10,
      serverSide: true,
      processing: true,
      order : [],
      ajax : (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.id_poliklinik=id
        this.pemasukan.getDetail(dataTablesParameters)
        .subscribe((resp : any) => {
          callback({
            draw: resp.response.draw,
            recordsTotal: resp.response.recordsTotal,
            recordsFiltered: resp.response.recordsFiltered,
            data: resp.response.data
          })
          this.spinner.hide('spinner1')
        })
       
      },
      columns : [
        {
          orderable: false,
          searchable: false,
          render(data: any, type: any, row: any, full: any) {
            return full.row + 1 + full.settings._iDisplayStart;
          }
        },
        {
          data: 'tanggal',
          render(data: any, type: any, row: any, full: any) {
            return moment(data).format("DD-MM-YYYY")
          }
        },
        {
          data: 'pasien_bpjs'
        },
        {
          data: 'pemasukan_bpjs',
          render(data: any, type: any, row: any, full: any) {
						return self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
        },
        {
          data: 'pasien_reguler'
        },
        {
          data: 'pemasukan_reguler',
          render(data: any, type: any, row: any, full: any) {
						return self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
        },
        {
          data: 'total_pemasukan',
          render(data: any, type: any, row: any, full: any) {
						return data==null?self.money.formatRupiah(0):self.money.formatRupiah(parseInt(data.replace(".",",")))
					}
        }
      ],
    }
  }
  onOpenCalendar(container : any){
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

}
