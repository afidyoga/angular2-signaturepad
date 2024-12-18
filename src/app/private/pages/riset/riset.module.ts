import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RisetRoutingModule } from './riset-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    RisetRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class RisetModule { }
