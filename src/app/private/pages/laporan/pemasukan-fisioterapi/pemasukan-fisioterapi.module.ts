import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PemasukanFisioterapiRoutingModule } from './pemasukan-fisioterapi-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    PemasukanFisioterapiRoutingModule,
    ComponentsModule,
    BsDatepickerModule.forRoot()
  ]
})
export class PemasukanFisioterapiModule { }
