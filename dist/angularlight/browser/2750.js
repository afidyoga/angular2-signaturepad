"use strict";(self.webpackChunkangularlight=self.webpackChunkangularlight||[]).push([[2750],{2750:(j,g,o)=>{o.r(g),o.d(g,{PengeluaranAlatModule:()=>C});var f=o(69808),p=o(50072),u=o(64035),d=o(65415),s=o(93075),h=o(15439),t=o(5e3),b=o(89159),v=o(1909),T=o(94554),Z=o(33399),m=o(67236);function A(r,l){1&r&&(t.TgZ(0,"p",24),t._uU(1,"Tanggal transaksi tidak boleh kosong"),t.qZA())}const _=function(){return["Alat Kesehatan"]},w=function(){return{dateInputFormat:"DD/MM/YYYY",rangeInputFormat:"DD/MM/YYYY"}},D=function(){return["Alat Kesehatan"]},x=function(){return["../../../../../view"]},k=[{path:"",redirectTo:"view",pathMatch:"full"},{path:"view",component:(()=>{class r{constructor(e,a,n,i,c,M){this.spinner=e,this.router=a,this.pengeluaran=n,this.pengeluaranExport=i,this.money=c,this.fb=M,this.datatableElement=d.G,this.dtOptions={},this.search=!1,this.minDate=new Date,this.maxDate=new Date}ngOnInit(){var e=new Date,a=e.getFullYear(),n=e.getMonth();this.minDate=new Date(a,n,1),this.maxDate=new Date(a,n+1,0),this.formInput=this.fb.group({date_from:[[new Date(a,n,1),new Date],[s.kI.required]]}),this.dtOptions=this.showDataTables()}convertTime(e){let a=h(new Date(e)).format("YYYY-MM-DD")+" 00:00:00";return new Date(a).getTime()}reLoadData(){this.datatableElement.dtInstance.then(e=>{e.ajax.reload(),this.search=!1})}detail(e){this.router.navigate(["laporan/alat/pengeluaran-alat/detail/"+e.id_barang+"/"+e.nama_barang+"/"+this.convertTime(this.formInput.value.date_from[0])+"/"+this.convertTime(this.formInput.value.date_from[1])])}download(e){const a=window.URL.createObjectURL(new Blob([e],{type:"application/ms-excel"})),n=document.createElement("a");n.href=a,n.setAttribute("download","Laporan Pengeluaran Alat Kesehatan.xlsx"),document.body.appendChild(n),n.click()}export(){let e=localStorage.getItem("currentUser");e=null!=e?JSON.parse(e):null;let a={Authorization:e.token,x_api_key:e.key,search:{value:"",regex:!1},date_from:null,date_to:null};this.spinner.show("spinner1"),a.date_from=this.convertTime(this.formInput.value.date_from[0]),a.date_to=this.convertTime(this.formInput.value.date_from[1]),this.pengeluaranExport.exportAlat(a).subscribe(n=>{this.download(n),this.search=!1,this.spinner.hide("spinner1")})}showDataTables(){return this.spinner.show("spinner1"),{pageLength:10,serverSide:!0,processing:!0,order:[],ajax:(e,a)=>{e.date_from=this.convertTime(this.formInput.value.date_from[0]),e.date_to=this.convertTime(this.formInput.value.date_from[1]),this.pengeluaran.getAlat(e).subscribe(n=>{a({draw:n.response.draw,recordsTotal:n.response.recordsTotal,recordsFiltered:n.response.recordsFiltered,data:n.response.data}),this.spinner.hide("spinner1")})},columns:[{orderable:!1,searchable:!1,render:(e,a,n,i)=>i.row+1+i.settings._iDisplayStart},{data:"nama_barang"},{data:"jumlah_bpjs"},{data:"jumlah_reguler"},{data:"jumlah_langsung"},{data:"jumlah_total"},{data:"stok_akhir"},{orderable:!1,searchable:!1,render:(e,a,n,i)=>'<button class="btn btn-sm btn-info detail">Detail</button>'}],rowCallback:(e,a,n)=>{const i=this;return $("td .detail",e).on("click",()=>{i.detail(a)}),e}}}}return r.\u0275fac=function(e){return new(e||r)(t.Y36(p.t2),t.Y36(u.F0),t.Y36(b.r),t.Y36(v.X),t.Y36(T.r),t.Y36(s.qu))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-view"]],viewQuery:function(e,a){if(1&e&&t.Gf(d.G,5),2&e){let n;t.iGM(n=t.CRH())&&(a.datatableElement=n.first)}},decls:55,vars:9,consts:[[1,"content"],[1,"content-block"],[1,"block-header"],[3,"title","items","active_item"],[1,"text-center","mb-4"],[1,"row","clearfix"],[1,"col-xs-12","col-sm-12","col-md-12","col-lg-12"],[1,"card"],[1,"header"],[1,"body"],[3,"formGroup"],[1,"row"],[1,"col-sm-2","col-form-label","fw-bold"],[1,"col-sm-8"],["type","text","formControlName","date_from","bsDaterangepicker","",1,"form-control",3,"bsConfig"],["class","text-danger",4,"ngIf"],[1,"col-sm-9","offset-md-2"],["type","button",1,"btn","btn-md","btn-tampilkan-cari",3,"click"],[1,"fa","fa-download"],["type","button",1,"btn","btn-md","btn-primary",3,"click"],[1,"fa","fa-search"],["datatable","","width","100%",1,"table","table-striped","table-bordered","table-sm","table-sm",3,"dtOptions"],["rowspan","2"],["colspan","3",1,"text-center"],[1,"text-danger"]],template:function(e,a){1&e&&(t.TgZ(0,"section",0)(1,"div",1)(2,"div",2),t._UZ(3,"app-breadcrumb",3),t.qZA(),t.TgZ(4,"h3",4),t._uU(5,"Laporan Pengeluaran Alat Kesehatan"),t.qZA(),t.TgZ(6,"div",5)(7,"div",6)(8,"div",7)(9,"div",8)(10,"h2")(11,"strong"),t._uU(12,"Pencarian"),t.qZA()()(),t.TgZ(13,"div",9)(14,"form",10)(15,"div",11)(16,"label",12),t._uU(17,"Tanggal Transaksi"),t.qZA(),t.TgZ(18,"div",13),t._UZ(19,"input",14),t.YNc(20,A,2,0,"p",15),t.qZA()(),t.TgZ(21,"div",11)(22,"div",16)(23,"button",17),t.NdJ("click",function(){return a.export()}),t._UZ(24,"i",18),t._uU(25," Excel"),t.qZA(),t.TgZ(26,"button",19),t.NdJ("click",function(){return a.reLoadData()}),t._UZ(27,"i",20),t._uU(28," Cari"),t.qZA()()()()()(),t.TgZ(29,"div",7),t._UZ(30,"div",8),t.TgZ(31,"div",9)(32,"table",21)(33,"thead")(34,"tr")(35,"th",22),t._uU(36,"No"),t.qZA(),t.TgZ(37,"th",22),t._uU(38,"Nama Alat Kesehatan"),t.qZA(),t.TgZ(39,"th",23),t._uU(40,"Tipe Pengeluaran"),t.qZA(),t.TgZ(41,"th",22),t._uU(42,"Total Pengeluaran"),t.qZA(),t.TgZ(43,"th",22),t._uU(44,"Stok Akhir"),t.qZA(),t.TgZ(45,"th",22),t._uU(46,"Aksi"),t.qZA()(),t.TgZ(47,"tr")(48,"th"),t._uU(49,"Pasien BPJS"),t.qZA(),t.TgZ(50,"th"),t._uU(51,"Pasien Reguler"),t.qZA(),t.TgZ(52,"th"),t._uU(53,"Penjualan"),t.qZA()()(),t._UZ(54,"tbody"),t.qZA()()()()()()()),2&e&&(t.xp6(3),t.Q6J("title","Laporan")("items",t.DdM(7,_))("active_item","Laporan Pengeluaran Alat Kesehatan"),t.xp6(11),t.Q6J("formGroup",a.formInput),t.xp6(5),t.Q6J("bsConfig",t.DdM(8,w)),t.xp6(1),t.Q6J("ngIf",""==a.formInput.value.date_from&&a.search),t.xp6(12),t.Q6J("dtOptions",a.dtOptions))},directives:[Z.L,s._Y,s.JL,s.sg,s.Fj,m.TB,s.JJ,s.u,m.FR,f.O5,d.G],styles:[""]}),r})()},{path:"detail/:id/:alat/:tgl1/:tgl2",component:(()=>{class r{constructor(e,a,n,i){this.spinner=e,this.activatedRoute=a,this.pengeluaran=n,this.pengeluaranExport=i,this.datatableElement=d.G,this.dtOptions={},this.alat="",this.periode="",this.currentUser=localStorage.getItem("currentUser")}ngOnInit(){this.currentUser=null!=this.currentUser?JSON.parse(this.currentUser):null,this.params={Authorization:this.currentUser.token,x_api_key:this.currentUser.key,search:{value:"",regex:!1},id_barang:"4cd91923-70bf-43ea-a827-38668daeca63",date_from:"2023-03-01",date_to:"2023-03-21"},this.activatedRoute.params.subscribe(e=>{e&&(this.alat=e.alat,this.params.date_from=e.tgl1,this.params.date_to=e.tgl2,this.periode=h(new Date(parseInt(e.tgl1))).format("DD/MM/YYYY")+" - "+h(new Date(parseInt(e.tgl2))).format("DD/MM/YYYY"),this.params.id_barang=e.id,this.dtOptions=this.showDataTables())})}download(e){const a=window.URL.createObjectURL(new Blob([e],{type:"application/ms-excel"})),n=document.createElement("a");n.href=a,n.setAttribute("download","Detail Laporan Pengeluaran Alat Kesehatan.xlsx"),document.body.appendChild(n),n.click()}export(){this.spinner.show("spinner1"),this.pengeluaranExport.exportAlatDetail(this.params).subscribe(e=>{this.download(e),this.spinner.hide("spinner1")})}showDataTables(){return this.spinner.show("spinner1"),{pageLength:10,serverSide:!0,processing:!0,order:[],ajax:(e,a)=>{e.date_from=this.params.date_from,e.date_to=this.params.date_to,e.id_barang=this.params.id_barang,this.pengeluaran.getAlatDetail(e).subscribe(n=>{a({draw:n.response.draw,recordsTotal:n.response.recordsTotal,recordsFiltered:n.response.recordsFiltered,data:n.response.data}),this.spinner.hide("spinner1")})},columns:[{orderable:!1,searchable:!1,render:(e,a,n,i)=>i.row+1+i.settings._iDisplayStart},{data:"formatted_date",render(e,a,n,i){let c=e.split("-");return c[2]+"-"+c[1]+"-"+c[0]}},{data:"jumlah_bpjs"},{data:"jumlah_reguler"},{data:"jumlah_langsung"},{data:"jumlah_total"},{data:"stok_akhir"}]}}}return r.\u0275fac=function(e){return new(e||r)(t.Y36(p.t2),t.Y36(u.gz),t.Y36(b.r),t.Y36(v.X))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-view"]],viewQuery:function(e,a){if(1&e&&t.Gf(d.G,5),2&e){let n;t.iGM(n=t.CRH())&&(a.datatableElement=n.first)}},decls:49,vars:9,consts:[[1,"content"],[1,"content-block"],[1,"block-header"],[3,"title","items","active_item"],[1,"text-center","mb-4"],[1,"row","clearfix"],[1,"col-xs-12","col-sm-12","col-md-12","col-lg-12"],["type","button",1,"btn","btn-kembali","btn-lg","mb-3",3,"routerLink"],[1,"fas","fa-arrow-left"],[1,"card"],[1,"body"],[1,"row","mb-4"],[1,"col-sm-8"],[1,"row","mb-2"],[1,"col-md-3"],[1,"col-sm-9"],[1,"col-sm-4","text-right"],[1,"btn","btn-md","btn-tampilkan-cari",3,"click"],[1,"fa","fa-download"],["width","100%","datatable","",1,"table","table-striped","table-bordered","table-sm","table-sm",3,"dtOptions"],["rowspan","2"],["colspan","3",1,"text-center"]],template:function(e,a){1&e&&(t.TgZ(0,"section",0)(1,"div",1)(2,"div",2),t._UZ(3,"app-breadcrumb",3),t.qZA(),t.TgZ(4,"h3",4),t._uU(5,"Detail Pengeluaran Alat Kesehatan"),t.qZA(),t.TgZ(6,"div",5)(7,"div",6)(8,"button",7),t._UZ(9,"i",8),t._uU(10," Kembali"),t.qZA(),t.TgZ(11,"div",9)(12,"div",10)(13,"div",11)(14,"div",12)(15,"div",13)(16,"div",14),t._uU(17,"Nama Alat Kesehatan"),t.qZA(),t.TgZ(18,"div",15),t._uU(19),t.qZA()(),t.TgZ(20,"div",13)(21,"div",14),t._uU(22,"Tanggal Transaksi"),t.qZA(),t.TgZ(23,"div",15),t._uU(24),t.qZA()()(),t.TgZ(25,"div",16)(26,"button",17),t.NdJ("click",function(){return a.export()}),t._UZ(27,"i",18),t._uU(28," Excel"),t.qZA()()(),t.TgZ(29,"table",19)(30,"thead")(31,"tr")(32,"th",20),t._uU(33,"No"),t.qZA(),t.TgZ(34,"th",20),t._uU(35,"Tanggal Transaksi"),t.qZA(),t.TgZ(36,"th",21),t._uU(37,"Tipe Pengeluaran"),t.qZA(),t.TgZ(38,"th",20),t._uU(39,"Total Pengeluaran"),t.qZA(),t.TgZ(40,"th",20),t._uU(41,"Stok Akhir"),t.qZA()(),t.TgZ(42,"tr")(43,"th"),t._uU(44,"Pasien BPJS"),t.qZA(),t.TgZ(45,"th"),t._uU(46,"Pasien Reguler"),t.qZA(),t.TgZ(47,"th"),t._uU(48,"Penjualan"),t.qZA()()()()()()()()()()),2&e&&(t.xp6(3),t.Q6J("title","Laporan")("items",t.DdM(7,D))("active_item","Detail Pengeluaran Alat Kesehatan"),t.xp6(5),t.Q6J("routerLink",t.DdM(8,x)),t.xp6(11),t.hij(": ",a.alat,""),t.xp6(5),t.hij(": ",a.periode,""),t.xp6(5),t.Q6J("dtOptions",a.dtOptions))},directives:[Z.L,u.rH,d.G],styles:[""]}),r})()}];let y=(()=>{class r{}return r.\u0275fac=function(e){return new(e||r)},r.\u0275mod=t.oAB({type:r}),r.\u0275inj=t.cJS({imports:[[u.Bz.forChild(k)],u.Bz]}),r})();var Y=o(60795);let C=(()=>{class r{}return r.\u0275fac=function(e){return new(e||r)},r.\u0275mod=t.oAB({type:r}),r.\u0275inj=t.cJS({imports:[[f.ez,d.T,p.ef,s.u5,s.UX,y,Y.K,m.kn.forRoot()]]}),r})()}}]);