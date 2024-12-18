import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { AntreanPasienRoutingModule } from './antrean-pasien-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ModalModule as ModalModuleCustom } from 'src/app/shared/_modal';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { CanvasOdontogramaComponent } from './odontogram/odontogram.component';
@NgModule({
  declarations: [
    ViewComponent,
    CanvasOdontogramaComponent
  ],
  imports: [
    CommonModule,
    AntreanPasienRoutingModule,
    ComponentsModule,
    FormsModule,
    NgSelectModule,
    ModalModuleCustom,
    NgxSpinnerModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class AntreanPasienModule { }
