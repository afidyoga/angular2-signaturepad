import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;
import { NgxSpinnerService } from "ngx-spinner";

import Swal from 'sweetalert2/dist/sweetalert2.js'
import { ModulImportKatalogService } from 'src/app/private/modul-api/modul-import-file/module-import-katalog';
@Component({
	selector: 'app-import-csv',
	templateUrl: './import-csv.component.html',
	styleUrls: ['./import-csv.component.sass']
})
export class ImportCsvComponent implements OnInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	file = null
	fileBase64 = null
	constructor(
		private spinner : NgxSpinnerService,
		private ModulImportKatalogService: ModulImportKatalogService,
	) { }

	ngOnInit(): void {
	}
	reset() {
		this.myInputVariable.nativeElement.value = '';
		this.file=null
	}
	incomingfile(e: any) {
		this.file = e
		var fl = e.target.files[0];
		const reader: FileReader = new FileReader();
		reader.onload = (e) => {
			this.fileBase64 = e.target.result
		}
		reader.readAsDataURL(fl);
	}
	
	Upload() {
		this.spinner.show('spinner1')
		this.ModulImportKatalogService.importObat(this.file.target.files[0])
			.subscribe((resp: any) => {
				if (resp.metaData.response_code == '0000') {
					Swal.fire("Success", "Data berhasil disimpan", 'success').then((res)=>{
						location.reload();
					})
				} else {
					Swal.fire("Error", resp.metaData.message, 'error')
				}
				this.spinner.hide('spinner1')
			},err=>{
				Swal.fire("Error", err.metaData.message, 'error')
			})
	}
}
