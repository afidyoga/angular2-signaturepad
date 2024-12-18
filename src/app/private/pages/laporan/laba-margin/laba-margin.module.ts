import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LabaMarginRoutingModule } from './laba-margin-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DataTablesModule } from "angular-datatables";
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
	declarations: [
		ViewComponent
	],
	imports: [
		CommonModule,
		LabaMarginRoutingModule,
		ComponentsModule,
		DataTablesModule,
		StoreModule,
		FormsModule,
		NgxSpinnerModule,
		ReactiveFormsModule,
		EffectsModule,
		BsDatepickerModule.forRoot()
	]
})
export class LabaMarginModule { }
