import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataPasienRoutingModule } from './data-pasien-routing.module';
import { ViewComponent } from './view/view.component';

import { ComponentsModule } from "src/app/shared/components/components.module";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    DataPasienRoutingModule,
    ComponentsModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DataPasienModule { }
