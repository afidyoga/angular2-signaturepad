import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasienRoutingModule } from './pasien-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { DetailComponent } from './detail/detail.component';
import { PrintComponent } from './print/print.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [
    ViewComponent,
    DetailComponent,
    PrintComponent
  ],
  imports: [
    CommonModule,
    PasienRoutingModule,
    ComponentsModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot()
  ]
})
export class PasienModule { }
