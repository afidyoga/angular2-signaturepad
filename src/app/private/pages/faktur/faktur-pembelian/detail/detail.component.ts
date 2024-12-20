import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/_modal';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import { CurrencyMaskInputMode } from 'ngx-currency';
// import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import * as fromApp from 'src/app/private/states/private-app.states'
import * as FakturPembelianAction from 'src/app/private/states/faktur-pembelian/faktur-pembelian.action'
// import { fakturPayload, obatPayload, AlatKesehatanPayload } from 'src/app/private/models/class-payload-api/gudang-transaksi/pembelian-payload';
import { ModulFakturPembelianService } from 'src/app/private/modul-api/modul-gudang-transaksi/modul-faktur-pembelian.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { ActivatedRoute, Params } from '@angular/router';
import { ModulSupplierService } from "src/app/private/modul-api/modul-master-node/modul-supplier.service";
import { ModulObatService } from "src/app/private/modul-api/modul-master-node/modul-obat.service";
import { ModulAlatKesehatanService } from "src/app/private/modul-api/modul-master-node/modul-alat-kesehatan.service"
// import { NgbButtonLabel } from '@ng-bootstrap/ng-bootstrap';
import {MoneyService} from 'src/app/private/services/money/index'

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

	getState: Observable<any>;
	
	constructor(
		private ModulPembelianService: ModulFakturPembelianService,
		private spinner : NgxSpinnerService,
		private money:MoneyService,
		private activatedRoute: ActivatedRoute,
	) {
		
	}

	detailFaktur:any
	sub_total=0
	ppn=0
	total=0
	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params : Params) => {
			if(params) {
				this.spinner.show('spinner1')
				this.ModulPembelianService.show(params.id).subscribe(res=>{
					this.detailFaktur=res.response
					if(this.detailFaktur.pembelian_detail){
						this.detailFaktur.pembelian_detail.map(data=>{
							data.sub_total = data.total_harga - data.diskon_rupiah
							this.sub_total = this.sub_total + data.sub_total
							
						})
					}
					if(this.detailFaktur.pembelian_alat_kesehatan){
						this.detailFaktur.pembelian_alat_kesehatan.map(data=>{
							data.sub_total = data.total_harga - data.diskon_rupiah
							this.sub_total = this.sub_total + data.sub_total
						})
					}
					this.ppn=Number(this.sub_total)*(Number(this.detailFaktur.ppn_nilai)/100)
					this.total=this.sub_total+this.ppn
					this.spinner.hide('spinner1')
				})
			}
		})
	}
	
	Money(val){
			return this.money.formatRupiah(parseInt(val.toString().replace(".",",")))
	}
	subList(val,val2){
		return this.money.formatRupiah(Number(val)-Number(val2));
	}
	convertDate(date) {
		return moment(date).utc().format("DD-MM-YYYY")
	}
	convertDateYMD(date) {
		return moment(date).format('YYYY-MM-DD')
	}
	


}
