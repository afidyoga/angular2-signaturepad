import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlatBantuRoutingModule } from './alat-bantu-routing.module';
import { ViewComponent } from './view/view.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    AlatBantuRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class AlatBantuModule { }
