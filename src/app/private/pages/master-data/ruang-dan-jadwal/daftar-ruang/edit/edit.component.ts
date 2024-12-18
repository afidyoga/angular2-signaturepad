import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControl, FormArray } from "@angular/forms";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import * as fromApp from 'src/app/private/states/private-app.states'
import * as DaftarRuangActions from 'src/app/private/states/master-data/ruang-dan-jadwal/daftar-ruang/daftar-ruang.actions'
import { DaftarRuangPayload } from 'src/app/private/models/class-payload-api/master-data/ruang-dan-jadwal/daftar-ruang-payload';
import { DaftarPoliklinikService } from 'src/app/private/services/manajemen-klinik/daftar-poliklinik.service';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  @ViewChild('selectPoliklinik') selectPoliklinik : ElementRef
  submitted : boolean = false
  formTambah: FormGroup;
  listPoliklinik : Array<any> = []
  // listDetailRuang = new FormArray([])
  dumpPoliklinik = new FormArray([])

  isEdit : boolean
  isLoadingButton : boolean
  reloadTable : boolean
  errorMessage : any | null
  submitButton : boolean
  getState: Observable<any>;
  daftarRuang : DaftarRuangPayload = new DaftarRuangPayload

  constructor(
    private fb : FormBuilder,
    private daftarPoliklinikService : DaftarPoliklinikService,
    private store : Store<fromApp.PrivateAppState>,
    private activatedRoute: ActivatedRoute,
    private spinner : NgxSpinnerService,

  ) {
    this.getState = this.store.select('masterData_ruangDanJadwal_daftarRuang')
   }
  // masterData_ruangDanJadwal_daftarRuang
  ngOnInit(): void {
    this.spinner.show('spinner1')
    this.loadPoliklinik()
    this.formTambah = this.fb.group({
      nama_ruang : ["", [Validators.required]]
    })
    this.activatedRoute.params.subscribe((params : Params) => {
      if(params) {
       
        this.store.dispatch( DaftarRuangActions.getByIdInitial({ payload : { id : params.id } }) )
      }
    })

    this.getState.subscribe((state) => {
      this.daftarRuang = state.daftarRuang
      this.isEdit = state.isEdit
      this.isLoadingButton = state.isLoadingButton
      this.errorMessage = state.errorMessage
      this.submitButton = state.submitButton
      if (this.daftarRuang != null) {
        if (this.isEdit) {
          this.formTambah.patchValue({
            nama_ruang : this.daftarRuang.nama_ruang
          })
          if(this.daftarRuang.detail != undefined) {
            if(this.daftarRuang.detail.length > 0) {
              this.daftarRuang.detail.forEach(el => {
                const newGroup = new FormGroup({})
                newGroup.addControl('id_poliklinik', new FormControl(el.id_poliklinik))
                newGroup.addControl('nama_poliklinik', new FormControl(el.nama_poliklinik))
                newGroup.addControl('id_ruang_detail', new FormControl(""))
                this.dumpPoliklinik.push(newGroup)
              })
            }
            this.spinner.hide('spinner1')
          }
          this.spinner.hide('spinner1')
        }
      }
    })
  }

  SubmitForm() {
    this.submitted = true
    if (this.formTambah.invalid) {
      return
    }
    this.spinner.show('spinner1')
    let payload = new DaftarRuangPayload
    payload.id_klinik = this.daftarRuang.id_klinik
    payload.id_ruang = this.daftarRuang.id_ruang
    payload.nama_ruang = this.formTambah.value.nama_ruang
    payload.detail = this.dumpPoliklinik.value

    this.store.dispatch( DaftarRuangActions.updateInitial({ payload : payload }) )
    setTimeout(() => {
      this.spinner.hide('spinner1')
    }, 400);
  }

  addDetailRuang(){
    let idSelectPoliklinik = this.selectPoliklinik.nativeElement.value
    if(idSelectPoliklinik != ""){
      let idIndex = this.listPoliklinik.findIndex((el, index) => {
        return el.id_poliklinik == idSelectPoliklinik
      })

      if(idIndex >= 0) {
        let find = this.listPoliklinik[idIndex]
        const newGroup = new FormGroup({})
        let havePoliklinik = this.dumpPoliklinik.value.findIndex((el, index) => {
          return el.id_poliklinik == find.id_poliklinik
        })

        if(havePoliklinik >= 0) {
          alert('Sepertinya anda sudah menambahkan data ini')
        } else {
          newGroup.addControl('id_poliklinik', new FormControl(find.id_poliklinik))
          newGroup.addControl('nama_poliklinik', new FormControl(find.nama_poliklinik))
          newGroup.addControl('id_ruang_detail', new FormControl(""))
          this.dumpPoliklinik.push(newGroup)
        }
      }
    }
  }

  HapusPoliklinikFromDump(id: any) {
    let havePoliklinik = this.dumpPoliklinik.value.findIndex((el, index) => {
      return el.id_poliklinik == id
    })

    if(havePoliklinik >= 0) {
      this.dumpPoliklinik.removeAt(havePoliklinik)
    }
  }

  loadPoliklinik() {
    this.daftarPoliklinikService.getByAkunKlinik()
    .subscribe(res => {
      this.listPoliklinik = res.response
      this.spinner.hide('spinner1')
    })
  }
}
