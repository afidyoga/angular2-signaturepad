import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables'
import { AntreanDokterUmumService } from 'src/app/private/services/dokter/antrean/antrean-dokter-umum.service';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { RekamMedis, Perawat, DokterUmum, Assessment, AkunDokter } from 'src/app/private/models/pages/dokter/umum/rekam-medis';
import { ModulResepService } from 'src/app/private/modul-api/modul-gudang-transaksi/modul-resep.service';

@Component({
  selector: 'app-rekam-medis',
  templateUrl: './rekam-medis.component.html',
  styleUrls: ['./rekam-medis.component.sass']
})

export class RekamMedisComponent implements OnInit {

  @ViewChild('bodyTable') bodyTable : ElementRef
  @Input() PasienProperty : string
  @Input() open : boolean
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false}) datatableElement : any = DataTableDirective
  // dtTrigger: Subject<DatatableRekamMedis>[] = [];
  // PasienBaru : Pasien = new Pasien

  idPasien : string
  idPasienDump : string = ""
  hiddenDataTable : boolean = false
  idAntrianSelected : string = ""
  rekamMedis : RekamMedis = new RekamMedis
  constructor(
    private antreanDokterUmumService : AntreanDokterUmumService,
    private spinner : NgxSpinnerService,
    private resep:ModulResepService
  ) { }
  listResep=[]
  ngOnInit(): void {
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.open){
      let cekValue = this.PasienProperty
      if(cekValue !== undefined) {
        let pasien =  JSON.parse(cekValue)
        console.log(pasien)
        this.idPasien = pasien.id_pasien
      }
      if(this.idPasienDump == "") {
        if(this.idPasien != "" && this.idPasien != undefined) {
          this.hiddenDataTable = true
          this.dtOptions = this.showDataTables()
          this.idPasienDump = this.idPasien
        }
      } else if (this.idPasienDump != "" ) {
        this.reLoadData()
        this.rekamMedis = new RekamMedis
      }
    }
  }
  selectedData(data: any) {
    setTimeout(() => {
      if(this.bodyTable.nativeElement.querySelector('.selected')) {
        if(this.idAntrianSelected != data.id_antrian) {
          this.spinner.show('spinner1');
          
          this.antreanDokterUmumService.getRekamMedisByIdAntrian(data.id_antrian)
          .subscribe(res => {
            this.rekamMedis = new RekamMedis
            this.spinner.hide('spinner1');
            if( res.response.dokter_umum !== null ) {
              let umum = res.response.dokter_umum
              this.rekamMedis.dokter_umum = new DokterUmum
              this.rekamMedis.dokter_umum.assessment = new Array<Assessment>()
              this.rekamMedis.dokter_umum.akun_dokter = new AkunDokter
              this.rekamMedis.dokter_umum = umum
            }
            this.rekamMedis.tindakan_medis=res.response.tindakan_medis
            if(res.response.perawat !== null) {
              let perawat = res.response.perawat
              this.rekamMedis.perawat = new Perawat
              this.rekamMedis.perawat = perawat
            }
            if(res.response.resep_obat.length>0){
              this.listResep=res.response.resep_obat
            }
          }, (err : any) => {
            this.spinner.hide('spinner1');
          })
        }
      }
    }, 50);
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
      select: true,
      ajax : (dataTablesParameters: any, callback: any) => {
        // Object.assign(dataTablesParameters, { type_poli : 'umum' })
        this.antreanDokterUmumService.getDataTablesRekamMedis(dataTablesParameters, this.idPasien )
        .subscribe((resp : any) => {
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
          orderable: false,
          data : 'tgl_antrian',
          render(data: any, type: any, row: any, full: any) {
            return moment(data).locale('id').format('DD-MMM-YYYY, HH:mm')
          }
        },
        {
          orderable: false,
          data : 'nama_lengkap'
        },

      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are
        // deprecated in favor of `off` and `on`
        $('td ', row).on('click', () => {
          self.selectedData(data);
        });
        return row;
      }
    }
  }


}


