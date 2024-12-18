import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControl, FormArray } from "@angular/forms";
import { DaftarPoliklinikService } from 'src/app/private/services/manajemen-klinik/daftar-poliklinik.service';
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/private/states/private-app.states'
import * as DaftarRuangActions from 'src/app/private/states/master-data/ruang-dan-jadwal/daftar-ruang/daftar-ruang.actions'
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import { DaftarRuangService } from 'src/app/private/services/master-data/ruang-dan-jadwal/daftar-ruang.service';
import { DaftarRuangPayload } from 'src/app/private/models/class-payload-api/master-data/ruang-dan-jadwal/daftar-ruang-payload';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {

  @ViewChild('selectPoliklinik') selectPoliklinik : ElementRef
  formTambah: FormGroup;
  listPoliklinik : Array<any> = []
  // listDetailRuang = new FormArray([])
  dumpPoliklinik = new FormArray([])

  submitted : boolean = false
  isEdit : boolean
  isLoadingButton : boolean
  reloadTable : boolean
  errorMessage : any | null
  submitButton : boolean
  getState: Observable<any>;
  daftarRuang : DaftarRuangPayload = new DaftarRuangPayload

  constructor(
    private fb: FormBuilder,
    private daftarPoliklinikService : DaftarPoliklinikService,
    private store : Store<fromApp.PrivateAppState>,
    private spinner : NgxSpinnerService,

  ) {
    this.getState = this.store.select('masterData_ruangDanJadwal_daftarRuang')
  }
  // masterData_ruangDanJadwal_daftarRuang

  ngOnInit(): void {
    this.spinner.show('spinner1')
    this.loadPoliklinik()
    this.formTambah = this.fb.group({
      nama_ruang : ["", []]
    })

    this.getState.subscribe((state) => {
      this.daftarRuang = state.daftarRuang
      this.errorMessage = state.errorMessage
      this.submitButton = state.submitButton
      this.isLoadingButton = state.isLoadingButton
    })
  }

  SubmitForm() {
    this.submitted = true
    if (this.formTambah.invalid) {
      return
    }
    this.spinner.show('spinner1')
    let payload = new DaftarRuangPayload
    payload.nama_ruang = this.formTambah.value.nama_ruang
    payload.detail = this.dumpPoliklinik.value
    this.store.dispatch( DaftarRuangActions.addInitial({ payload : payload }) )
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
