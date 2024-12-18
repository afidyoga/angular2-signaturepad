import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ModalService } from 'src/app/shared/_modal';
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as fromApp from 'src/app/private/states/private-app.states'
// import * as JadwalSesiActions from 'src/app/private/states/master-data/ruang-dan-jadwal/jadwal-sesi/jadwal-sesi.actions'
import * as biayaActions from 'src/app/private/states/master-data/biaya/biaya.actions'
import { ModulBiayaService } from 'src/app/private/modul-api/modul-master-node/modul-biaya.service';
import { DataTableDirective } from 'angular-datatables'
import Swal from 'sweetalert2/dist/sweetalert2.js'
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

  titleModal : string
  formInput : FormGroup
  isEdit : boolean
  isLoadingButton : boolean
  reloadTable : boolean
  errorMessage : any | null
  submitButton : boolean
  getState: Observable<any>;
  submitted : boolean = false
  aksiModal : string

  @ViewChild(DataTableDirective, {static: false}) datatableElement : any = DataTableDirective
  dtOptions: DataTables.Settings = {}
  btnDetail=false
  btnDelete=false
  btnEdit=false
  btnSetting=false
  btnAdd=false
  view=false
  biaya=null
  constructor (
    private fb : FormBuilder,
    private modalService : ModalService,
    private store : Store<fromApp.PrivateAppState>,
    private el : ElementRef,
    private modulBiaya : ModulBiayaService
  ) {
    // masterData_biaya
    this.getState = this.store.select('biaya')
  }

  ngOnInit(): void {
    let item=JSON.parse(localStorage.getItem('currentUser'))
    item=item.menu_right
    this.btnAdd=this.btnDelete=this.btnEdit=item.findIndex((val)=>val.kode=='MDMBTB2')!=-1?true:false
    this.btnDetail=this.view=item.findIndex((val)=>val.kode=='MDMBTB1')!=-1?true:false

    if(!this.view){
        Swal.fire("Warning","Anda tidak mempunyai akses halaman ini",'warning').then(()=>{
          window.location.href='/'
        })
    }
    this.dtOptions = this.showDataTables(this.btnEdit)
    this.formInput = this.fb.group({
      nama_biaya : ["", [Validators.required]],
    })
    this.getState.subscribe((state) => {
      this.biaya = state.biaya
      this.isLoadingButton = state.isLoadingButton
      this.errorMessage = state.errorMessage
      this.reloadTable = state.reloadTable
      this.submitButton = state.submitButton
      this.isEdit = state.isEdit
      if (this.isEdit === true) {
        this.formInput.patchValue({
          nama_biaya : this.biaya.nama_biaya,
        });
        this.modalService.open("modalFormContent");
      }
      if(this.reloadTable == true) {
        this.reLoadData()
        this.modalService.close("modalFormContent");
      }
    });
  }

  SubmitForm() {
    this.submitted = false
    setTimeout(() => { this.submitted = true }, 200)

    if (this.formInput.invalid) {
      for (const key of Object.keys(this.formInput.controls)) {
        if (this.formInput.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus()
          break;
        }
      }
      return
    }

    let payload:any ={
      id_biaya:this.biaya.id_biaya,
      nama_biaya : this.formInput.value.nama_biaya,
    }
    
    if(this.aksiModal === 'add') {
      this.store.dispatch( biayaActions.addInitial({ payload : payload }) )
    } else {
      
      this.store.dispatch( biayaActions.updateInitial({ payload : payload }) )
    }
  }

  btnTambahBaru() {
    this.submitted = false
    this.titleModal = 'Tambah Baru'
    this.aksiModal = 'add'
    this.formInput.reset()
    this.modalService.open("modalFormContent");
    this.store.dispatch( biayaActions.clearData() )
  }
  modalClose() {
    this.modalService.close("modalFormContent")
  }

  editData(data: any) {
    this.submitted = false
    this.aksiModal = 'update'
    this.titleModal= "Form Edit Metode Bayar"
    this.store.dispatch( biayaActions.getByIdInitial({ payload : { id : data.id_biaya } }) )
  }

  nonAktif(data : any) {
    Swal.fire({
      title: 'Apakah anda yakin akan menghapus data ini ?',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Ya, hapus saja!',
      cancelButtonText: 'Tidak, Batalkan'
    }).then((result) => {
      if (result.value) {
        this.store.dispatch(
          biayaActions.deleteInitial({ payload: { id : data.id_biaya } })
        )
      }
    })
  }

  reLoadData() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  showDataTables(edit) {
    return {
      pageLength: 10,
      serverSide: true,
      processing: true,
      order : [],
      ajax : (dataTablesParameters: any, callback: any) => {
        this.modulBiaya.listDatatables(dataTablesParameters)
        .subscribe((resp : any) => {
          callback({
            draw: resp.response.draw,
            recordsTotal: resp.response.recordsTotal,
            recordsFiltered: resp.response.recordsFiltered,
            data: resp.response.data
          })
        })
      },
      columns : [
        {
          orderable: false,
          searchable: false,
          render(data: any, type: any, row: any, full: any) {
            return full.row + 1 + full.settings._iDisplayStart;
          }
        },{
          data : 'nama_biaya'
        },
        // {
        //   data: 'nilai'
        // },
        {
          data:'created_at',
          render(data: any, type: any, row: any, full: any) {
						return moment(data).format("DD-MM-YYYY")
					}
        }
        , {
          orderable: false,
          searchable: false,
          render(data: any, type: any, row: any, full: any) {
            return edit?`<button class="btn btn-sm btn-ubah update-data">Edit</button>
                    <button class="btn nonaktif-data btn-hapus btn-sm">Hapus</button>`:'';
          }
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are
        // deprecated in favor of `off` and `on`
        $('td .update-data', row).on('click', () => {
          self.editData(data);
        });
        $('td .btn-hapus', row).on('click', () => {
          self.nonAktif(data);
        });
       
        return row;
      }
    }
  }

}
