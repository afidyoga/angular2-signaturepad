import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { AntreanPasienService } from 'src/app/private/services/pasien/antrean-pasien.service';
import { AntreanPerawatService } from 'src/app/private/services/perawat/antrean-perawat.service';
import { DataTableDirective } from 'angular-datatables'
import { DaftarPoliklinikService } from 'src/app/private/services/manajemen-klinik/daftar-poliklinik.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false}) datatableElement : any = DataTableDirective
  @ViewChild('id_select_poliklinik') id_select_poliklinik : ElementRef
  listPoliklinik : Array<any> = []
  type_poli : string = ''
  poli_name : string = ''
  tableAktif : string = ''
  constructor(
    private antreanPerawatService : AntreanPerawatService,
    private router : Router,
    private spinner : NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private daftarPoliklinikService : DaftarPoliklinikService,
  ) {

  }
  btnDetail=false
  btnDelete=false
  btnEdit=false
  btnSetting=false
  btnAdd=false
  view=false
  ngOnInit(): void {
    let item=JSON.parse(localStorage.getItem('currentUser'))
    item=item.menu_right
    this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='AMATAU2')!=-1?true:false
    this.btnDetail=this.view=item.findIndex((val)=>val.kode=='AMATAU1')!=-1?true:false

    if(!this.view){
        Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
          window.location.href='/'
        })
    }
    // this.loadListPoliklinik()
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params) {
        this.type_poli = params.kode
        if(this.tableAktif === '') {
          this.dtOptions = this.showDataTables(this.btnEdit)
          this.tableAktif = params.kode
        } else if (this.tableAktif !== params.kode) {
          this.reLoadData()
          this.tableAktif = params.kode
        }
        this.poli_name = 'Poli ' + this.capitalizeFirstLetter(params.kode)
      }
    })
  }
  capitalizeFirstLetter(string : string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  loadListPoliklinik() {
    this.daftarPoliklinikService.getByAkunKlinik()
    .subscribe(succ => {
      this.listPoliklinik = succ.response
    })
  }
  ButtonCari() {
    this.reLoadData()
  }
  prosesAntrean(data : any) {
    this.router.navigate(['perawat','antrean-perawat', this.type_poli, 'proses-antrean', data.id_antrian])
  }
  prosesAntreanEdit(data : any) {
    this.router.navigate(['perawat','antrean-perawat', this.type_poli, 'proses-antrean', 'edit', data.id_antrian])
  }
  reLoadData() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  showDataTables(edit) {
    this.spinner.show('spinner1')
    return {
      pageLength: 10,
      serverSide: true,
      processing: true,
      order : [[0, 'ASC']],
      ajax : (dataTablesParameters: any, callback: any) => {
        Object.assign(dataTablesParameters, {type_poli : this.type_poli})
        this.antreanPerawatService.getDataTables(dataTablesParameters)
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
      columns: [
        {
          data: 'no_antrian'
        },{
          data: 'nama'
        },{
          data: 'nama_sesi'
        },{
          data: 'proses_antrian'
        },{
          data: 'status_input_pasien',
          render(data: any, type: any, row: any, full: any) {
            if (data == 'B') {
              return 'Baru'
            } else {
              return 'Lama'
            }
          }
        },{
          data: 'tgl_antrian'
        }, {
          orderable: false,
          searchable: false,
          render(data: any, type: any, row: any, full: any) {
            let button
            if(row.proses_antrian == 'sudah') {
              return edit?`<button class="btn btn-sm btn-secondary edit-antrean-data">Edit Antrean</button>`:''
            } else {

              return edit?`<button class="btn btn-sm btn-orange proses-antrean-data">Proses Antrean</button>`:''

            }
            // return `<div style="white-space: nowrap;"> ${button} </div>`;
          }
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are
        // deprecated in favor of `off` and `on`
        $('td .proses-antrean-data', row).on('click', () => {
          self.prosesAntrean(data);
        });
        $('td .edit-antrean-data', row).on('click', () => {
          self.prosesAntreanEdit(data);
        });
        return row;
      }
    }
  }

}
