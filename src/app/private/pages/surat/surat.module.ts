import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { DataTablesModule } from "angular-datatables";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule as ModalModuleCustom } from "src/app/shared/_modal";
import { SuratRoutingModule } from "./surat-routing.module";
import { NgxCurrencyModule } from "ngx-currency";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { StokOpnameReducers } from 'src/app/private/states/stok-opname/stok-opname.reducer';
// import { StokOpnameEffects } from 'src/app/private/states/stok-opname/stok-opname.effects';
import { ViewComponent } from "./surat-sakit/view.component";
import { ViewComponent as ViewDiagnosa } from "./surat-diagnosa/view.component";
import { ViewComponent as ViewKesehatan } from "./surat-sehat/view.component";
import { ViewComponent as ViewRujukan } from "./surat-rujukan/view.component";
import { ViewComponent as ViewDummy } from "./surat-dummy/view.component";

import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from "@ng-select/ng-select";
import { SignaturePadModule } from "angular2-signaturepad";
@NgModule({
  declarations: [
    ViewComponent,
    ViewDiagnosa,
    ViewKesehatan,
    ViewRujukan,
    ViewDummy,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbModule,
    NgSelectModule,
    ModalModuleCustom,
    SuratRoutingModule,
    ComponentsModule,
    DataTablesModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModuleCustom,
    NgxCurrencyModule,
    SignaturePadModule,
    // StoreModule.forFeature('stok_opname', StokOpnameReducers),
    // EffectsModule.forFeature([StokOpnameEffects]),
  ],
})
export class SuratModule {}
