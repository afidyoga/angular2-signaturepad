import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/_modal';
import { DataTableDirective } from 'angular-datatables'
import { Observable } from 'rxjs';
import { ModulKonsolidasiDataService } from 'src/app/private/modul-api/modul-rekam-medis/modul-konsolidasi-data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/private/states/private-app.states'
@Component({
	selector: 'app-merge',
	templateUrl: './merge.component.html',
	styleUrls: ['./merge.component.sass']
})
export class MergeComponent implements OnInit {
	fromMerge = []
	secondFormGroup = false
	firstFormGroup = false
	threeFormGroup = false
	forFormGroup = false
	merge = [false, false, false]
	@ViewChild(DataTableDirective, { static: false }) datatableElement: any = DataTableDirective
	dtOptions: DataTables.Settings = {};
	reloadTable: boolean
	getState: Observable<any>;
	constructor(
		private router: Router,
		private modalService: ModalService,
		private modulKonsolidasi: ModulKonsolidasiDataService,
		private store: Store<fromApp.PrivateAppState>,
	) { }
	isLinear = false
	ngOnInit(): void {
	}

	merged(i) {
		this.merge[i] = true
	}
	selesai() {
		this.router.navigate(['konsolidasi-data'])
	}
	mergeAction(data: any) {
		this.router.navigate(['konsolidasi-data/merge/1'])
	}

	reLoadData() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.ajax.reload();
		});
	}

	showDataTables() {
		return {
			pageLength: 10,
			serverSide: true,
			processing: true,
			order: [],
			ajax: (dataTablesParameters: any, callback: any) => {
				this.modulKonsolidasi.listDatatables(dataTablesParameters)
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
					data: 'TanggalKunjungan'
				},
				{
					data: "JenisAntri"
				},
				{
					data: "SesiAntrian"
				},
				{
					data: "No Antrian"
				},
				{
					data: "CekKesehatan"
				},
				{
					data: "Status"
				},
				{
					orderable: false,
					searchable: false,
					render(data: any, type: any, row: any, full: any) {
						return `<button class="btn btn-sm btn-info merge">Merge</button>>`;
					}
				}
			],
			rowCallback: (row: Node, data: any[] | Object, index: number) => {
				const self = this;
				// Unbind first in order to avoid any duplicate handler
				// (see https://github.com/l-lin/angular-datatables/issues/87)
				// Note: In newer jQuery v3 versions, `unbind` and `bind` are
				// deprecated in favor of `off` and `on`
				$('td .merge', row).on('click', () => {
					self.mergeAction(data);
				});

				return row;
			}
		}
	}
}
