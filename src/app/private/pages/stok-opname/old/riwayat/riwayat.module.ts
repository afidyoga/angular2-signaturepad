import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiwayatRoutingModule } from './riwayat-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule as ModalModuleCustom } from 'src/app/shared/_modal';

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    RiwayatRoutingModule,
    ComponentsModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModuleCustom
  ]
})
export class RiwayatModule { }
