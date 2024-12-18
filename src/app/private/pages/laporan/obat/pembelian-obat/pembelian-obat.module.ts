import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PembelianObatRoutingModule } from './pembelian-obat-routing.module';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from "src/app/shared/components/components.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTablesModule } from "angular-datatables";
@NgModule({
	declarations: [
		ViewComponent
	],
	imports: [
		CommonModule,
		PembelianObatRoutingModule,
		ComponentsModule,
		DataTablesModule,
		FormsModule, ReactiveFormsModule,
		BsDatepickerModule.forRoot()
	]
})
export class PembelianObatModule { }
