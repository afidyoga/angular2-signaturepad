"use strict";(self.webpackChunkangularlight=self.webpackChunkangularlight||[]).push([[6359],{89955:(O,_,e)=>{e.d(_,{s:()=>n});const n={url_module:{auth:"module_auth",official:"module_official",master:"module_master",resepsionis:"module_resepsionis",perawat:"module_perawat",dokter:"module_dokter",rekamMedis:"module_rekam_medis",export:"module_export",master_node:"module_master_node",gudangTransaksi:"modul_gudang_transaksi",modulImportFile:"modul_import_file",modulLaporan:"modul_laporan"}}},86307:(O,_,e)=>{e.d(_,{m:()=>u});var n=e(5e3),m=e(95305);let u=(()=>{class c{constructor(o){this.authService=o}getUrlModule(o){return this.authService.currentUserValue.repo.find(l=>l.key_repo==o).url_repo}}return c.\u0275fac=function(o){return new(o||c)(n.LFG(m.e))},c.\u0275prov=n.Yz7({token:c,factory:c.\u0275fac,providedIn:"root"}),c})()},6359:(O,_,e)=>{e.r(_),e.d(_,{LogTransaksiModule:()=>P});var n=e(69808),m=e(23007),u=e(65415),c=e(2454),d=e.n(c),o=e(29548),r=e(91047),t=e(5e3),l=e(44151),g=e(89955),h=e(86307),T=e(40520);let k=(()=>{class s{constructor(a,i){this.generalService=a,this.http=i,this.urlBase="log-transaksi",this.urlModule=this.generalService.getUrlModule(g.s.url_module.gudangTransaksi)}getObat(a){return this.http.post(this.urlModule+"/"+this.urlBase+"/obat",a)}getAlat(a){return this.http.post(this.urlModule+"/"+this.urlBase+"/alat_kesehatan",a)}}return s.\u0275fac=function(a){return new(a||s)(t.LFG(h.m),t.LFG(T.eN))},s.\u0275prov=t.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})();var v=e(50072),Z=e(65620),y=e(33399);const A=function(){return[]},C=function(){return[]},w=[{path:"",redirectTo:"obat",pathMatch:"full"},{path:"obat",component:(()=>{class s{constructor(a,i,p,f,U){this.modalService=a,this.ModulLogService=i,this.router=p,this.spinner=f,this.store=U,this.datatableElement=u.G,this.dtOptions={},this.dataObat=new r.u,this.btnCsv=!1,this.btnBpom=!1,this.btnEdit=!1,this.btnSetting=!1,this.btnAdd=!1,this.view=!1,this.getState=this.store.select("masterData_dataObat")}ngOnInit(){let a=JSON.parse(localStorage.getItem("currentUser"));a=a.menu_right,this.btnAdd=-1!=a.findIndex(i=>"IVKLOB5"==i.kode),this.btnBpom=-1!=a.findIndex(i=>"IVKLOB3"==i.kode),this.btnCsv=-1!=a.findIndex(i=>"IVKLOB2"==i.kode),this.view=-1!=a.findIndex(i=>"IVKLOB1"==i.kode),this.view||d().fire("Warning","Anda tidak mempunyai akses halaman ini","warning").then(()=>{window.location.href="/"}),this.btnEdit=this.btnAdd||this.btnBpom||this.btnCsv,this.dtOptions=this.showDataTables(this.btnEdit),this.getState.subscribe(i=>{this.reloadTable=i.reloadTable,!0===this.reloadTable&&this.reLoadData()})}editData(a){this.router.navigate(["katalog-obat","katalog","edit-buat-baru",a.id_obat])}nonAktif(a){d().fire({title:"Apakah anda yakin akan menghapus data ini ?",icon:"warning",showCancelButton:!0,allowOutsideClick:!1,confirmButtonText:"Ya, hapus saja!",cancelButtonText:"Tidak, Batalkan"}).then(i=>{i.value&&(this.spinner.show("spinner1"),this.store.dispatch(o.Fi({payload:{id:a.id_obat}})),setTimeout(()=>{this.spinner.hide("spinner1")},400))})}reLoadData(){this.datatableElement.dtInstance.then(a=>{a.ajax.reload()})}showDataTables(a){return this.spinner.show("spinner1"),{pageLength:10,serverSide:!0,processing:!0,scrollX:!0,scrollCollapse:!0,fixedColumns:{left:4},order:[],ajax:(i,p)=>{this.ModulLogService.getObat(i).subscribe(f=>{p({draw:f.response.draw,recordsTotal:f.response.recordsTotal,recordsFiltered:f.response.recordsFiltered,data:f.response.data}),this.spinner.hide("spinner1")})},columns:[{orderable:!1,searchable:!1,render:(i,p,f,U)=>U.row+1+U.settings._iDisplayStart},{data:"kode_invoice"},{data:"kode_invoice_des"},{data:"kode_invoice_referensi"},{data:"created_at"},{data:"created_at_unix"},{data:"harga_beli"},{data:"harga_jual"},{data:"id_akun_create"},{data:"id_akun_update"},{data:"id_barang"},{data:"id_klinik"},{data:"id_log_transaksi_obat"},{data:"id_transaksi_referensi"},{data:"id_transaksi_referensi_parent"},{data:"kegiatan"},{data:"keterangan"},{data:"kode_invoice_referensi_tujuan"},{data:"nama_barang"},{data:"nama_lengkap_admin"},{data:"no_batch"},{data:"no_urut_tujuan"},{data:"stok_akhir"},{data:"stok_awal"},{data:"stok_keluar"},{data:"stok_masuk"},{data:"tanggal_ed"},{data:"tanggal_ed_unix"},{data:"tanggal_invoice"},{data:"tanggal_invoice_unix"},{data:"transaksi_jenis"},{data:"transaksi_kategori"},{data:"transaksi_status"},{data:"uang_keluar"},{data:"uang_masuk"},{data:"updated_at"},{data:"updated_at_unix"}]}}ngOnDestroy(){document.body.classList.remove("jw-modal-open")}btnOpenModal(){this.modalService.open("modalFormContent")}modalClose(){this.modalService.close("modalFormContent")}}return s.\u0275fac=function(a){return new(a||s)(t.Y36(l.Z),t.Y36(k),t.Y36(m.F0),t.Y36(v.t2),t.Y36(Z.yh))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-view"]],viewQuery:function(a,i){if(1&a&&t.Gf(u.G,5),2&a){let p;t.iGM(p=t.CRH())&&(i.datatableElement=p.first)}},decls:92,vars:7,consts:[[1,"content"],[1,"content-block"],[1,"block-header"],[3,"title","items","active_item"],[1,"text-center"],[1,"row","clearfix"],[1,"col-xs-12","col-sm-12","col-md-12","col-lg-12"],[1,"card"],[1,"header"],[1,"body"],["width","100%","datatable","",1,"table","tabl-sm","table-striped","table-bordered","table-sm",3,"dtOptions"],["width","30"],["bdColor","rgba(0, 0, 0, 0.8)","size","medium","color","#fff","type","ball-clip-rotate-multiple",3,"name","fullScreen"],[2,"color","white"]],template:function(a,i){1&a&&(t.TgZ(0,"section",0)(1,"div",1)(2,"div",2),t._UZ(3,"app-breadcrumb",3),t.qZA(),t.TgZ(4,"h3",4),t._uU(5,"Log Obat"),t.qZA(),t.TgZ(6,"div",5)(7,"div",6)(8,"div",7),t._UZ(9,"div",8),t.TgZ(10,"div",9)(11,"table",10)(12,"thead")(13,"tr")(14,"th",11),t._uU(15,"No"),t.qZA(),t.TgZ(16,"th"),t._uU(17,"Kode invoice"),t.qZA(),t.TgZ(18,"th"),t._uU(19,"kode invoice des"),t.qZA(),t.TgZ(20,"th"),t._uU(21,"Kode invoice referensi"),t.qZA(),t.TgZ(22,"th"),t._uU(23,"Created At"),t.qZA(),t.TgZ(24,"th"),t._uU(25,"Created At Unix"),t.qZA(),t.TgZ(26,"th"),t._uU(27,"Harga beli"),t.qZA(),t.TgZ(28,"th"),t._uU(29,"Harga Jual"),t.qZA(),t.TgZ(30,"th"),t._uU(31,"id akun create"),t.qZA(),t.TgZ(32,"th"),t._uU(33,"id akun update"),t.qZA(),t.TgZ(34,"th"),t._uU(35,"id barang"),t.qZA(),t.TgZ(36,"th"),t._uU(37,"id klinik"),t.qZA(),t.TgZ(38,"th"),t._uU(39,"id log transaksi obat"),t.qZA(),t.TgZ(40,"th"),t._uU(41,"id transaksi referensi"),t.qZA(),t.TgZ(42,"th"),t._uU(43,"id transaksi referensi parent"),t.qZA(),t.TgZ(44,"th"),t._uU(45,"kegiatan"),t.qZA(),t.TgZ(46,"th"),t._uU(47,"keterangan"),t.qZA(),t.TgZ(48,"th"),t._uU(49,"kode invoice referensi tujuan"),t.qZA(),t.TgZ(50,"th"),t._uU(51,"nama barang"),t.qZA(),t.TgZ(52,"th"),t._uU(53,"nama lengkap admin"),t.qZA(),t.TgZ(54,"th"),t._uU(55,"no batch"),t.qZA(),t.TgZ(56,"th"),t._uU(57,"no urut tujuan"),t.qZA(),t.TgZ(58,"th"),t._uU(59,"stok akhir"),t.qZA(),t.TgZ(60,"th"),t._uU(61,"stok awal"),t.qZA(),t.TgZ(62,"th"),t._uU(63,"stok keluar"),t.qZA(),t.TgZ(64,"th"),t._uU(65,"stok masuk"),t.qZA(),t.TgZ(66,"th"),t._uU(67,"tanggal ed"),t.qZA(),t.TgZ(68,"th"),t._uU(69,"tanggal ed unix"),t.qZA(),t.TgZ(70,"th"),t._uU(71,"tanggal invoice"),t.qZA(),t.TgZ(72,"th"),t._uU(73,"tanggal invoice unix"),t.qZA(),t.TgZ(74,"th"),t._uU(75,"transaksi jenis"),t.qZA(),t.TgZ(76,"th"),t._uU(77,"transaksi kategori"),t.qZA(),t.TgZ(78,"th"),t._uU(79,"transaksi status"),t.qZA(),t.TgZ(80,"th"),t._uU(81,"uang keluar"),t.qZA(),t.TgZ(82,"th"),t._uU(83,"uang masuk"),t.qZA(),t.TgZ(84,"th"),t._uU(85,"updated at"),t.qZA(),t.TgZ(86,"th"),t._uU(87,"updated at unix"),t.qZA()()(),t._UZ(88,"tbody"),t.qZA()()()()()(),t.TgZ(89,"ngx-spinner",12)(90,"p",13),t._uU(91," Loading... "),t.qZA()()()),2&a&&(t.xp6(3),t.Q6J("title","Log Obat")("items",t.DdM(6,A))("active_item","Log Obat"),t.xp6(8),t.Q6J("dtOptions",i.dtOptions),t.xp6(78),t.Q6J("name","spinner1")("fullScreen",!0))},directives:[y.L,u.G,v.Ro],styles:[""]}),s})()},{path:"alat",component:(()=>{class s{constructor(a,i,p,f,U){this.modalService=a,this.ModulLogService=i,this.router=p,this.spinner=f,this.store=U,this.datatableElement=u.G,this.dtOptions={},this.dataObat=new r.u,this.btnCsv=!1,this.btnBpom=!1,this.btnEdit=!1,this.btnSetting=!1,this.btnAdd=!1,this.view=!1,this.getState=this.store.select("masterData_dataObat")}ngOnInit(){let a=JSON.parse(localStorage.getItem("currentUser"));a=a.menu_right,this.btnAdd=-1!=a.findIndex(i=>"IVKLOB5"==i.kode),this.btnBpom=-1!=a.findIndex(i=>"IVKLOB3"==i.kode),this.btnCsv=-1!=a.findIndex(i=>"IVKLOB2"==i.kode),this.view=-1!=a.findIndex(i=>"IVKLOB1"==i.kode),this.view||d().fire("Warning","Anda tidak mempunyai akses halaman ini","warning").then(()=>{window.location.href="/"}),this.btnEdit=this.btnAdd||this.btnBpom||this.btnCsv,this.dtOptions=this.showDataTables(this.btnEdit),this.getState.subscribe(i=>{this.reloadTable=i.reloadTable,!0===this.reloadTable&&this.reLoadData()})}editData(a){this.router.navigate(["katalog-obat","katalog","edit-buat-baru",a.id_obat])}nonAktif(a){d().fire({title:"Apakah anda yakin akan menghapus data ini ?",icon:"warning",showCancelButton:!0,allowOutsideClick:!1,confirmButtonText:"Ya, hapus saja!",cancelButtonText:"Tidak, Batalkan"}).then(i=>{i.value&&(this.spinner.show("spinner1"),this.store.dispatch(o.Fi({payload:{id:a.id_obat}})),setTimeout(()=>{this.spinner.hide("spinner1")},400))})}reLoadData(){this.datatableElement.dtInstance.then(a=>{a.ajax.reload()})}showDataTables(a){return this.spinner.show("spinner1"),{pageLength:10,serverSide:!0,processing:!0,order:[],ajax:(i,p)=>{this.ModulLogService.getAlat(i).subscribe(f=>{p({draw:f.response.draw,recordsTotal:f.response.recordsTotal,recordsFiltered:f.response.recordsFiltered,data:f.response.data}),this.spinner.hide("spinner1")})},columns:[{orderable:!1,searchable:!1,render:(i,p,f,U)=>U.row+1+U.settings._iDisplayStart},{data:"kode_invoice"},{data:"kode_invoice_des"},{data:"kode_invoice_referensi"},{data:"created_at"},{data:"created_at_unix"},{data:"harga_beli"},{data:"harga_jual"},{data:"id_akun_create"},{data:"id_akun_update"},{data:"id_barang"},{data:"id_klinik"},{data:"id_log_transaksi_obat"},{data:"id_transaksi_referensi"},{data:"id_transaksi_referensi_parent"},{data:"kegiatan"},{data:"keterangan"},{data:"kode_invoice_referensi_tujuan"},{data:"nama_barang"},{data:"nama_lengkap_admin"},{data:"no_batch"},{data:"no_urut_tujuan"},{data:"stok_akhir"},{data:"stok_awal"},{data:"stok_keluar"},{data:"stok_masuk"},{data:"tanggal_ed"},{data:"tanggal_ed_unix"},{data:"tanggal_invoice"},{data:"tanggal_invoice_unix"},{data:"transaksi_jenis"},{data:"transaksi_kategori"},{data:"transaksi_status"},{data:"uang_keluar"},{data:"uang_masuk"},{data:"updated_at"},{data:"updated_at_unix"}]}}ngOnDestroy(){document.body.classList.remove("jw-modal-open")}btnOpenModal(){this.modalService.open("modalFormContent")}modalClose(){this.modalService.close("modalFormContent")}}return s.\u0275fac=function(a){return new(a||s)(t.Y36(l.Z),t.Y36(k),t.Y36(m.F0),t.Y36(v.t2),t.Y36(Z.yh))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-view"]],viewQuery:function(a,i){if(1&a&&t.Gf(u.G,5),2&a){let p;t.iGM(p=t.CRH())&&(i.datatableElement=p.first)}},decls:92,vars:7,consts:[[1,"content"],[1,"content-block"],[1,"block-header"],[3,"title","items","active_item"],[1,"text-center"],[1,"row","clearfix"],[1,"col-xs-12","col-sm-12","col-md-12","col-lg-12"],[1,"card"],[1,"header"],[1,"body"],["width","100%","datatable","",1,"table","tabl-sm","table-striped","table-bordered","table-sm",3,"dtOptions"],["width","30"],["bdColor","rgba(0, 0, 0, 0.8)","size","medium","color","#fff","type","ball-clip-rotate-multiple",3,"name","fullScreen"],[2,"color","white"]],template:function(a,i){1&a&&(t.TgZ(0,"section",0)(1,"div",1)(2,"div",2),t._UZ(3,"app-breadcrumb",3),t.qZA(),t.TgZ(4,"h3",4),t._uU(5,"Log Alat Kesehatan"),t.qZA(),t.TgZ(6,"div",5)(7,"div",6)(8,"div",7),t._UZ(9,"div",8),t.TgZ(10,"div",9)(11,"table",10)(12,"thead")(13,"tr")(14,"th",11),t._uU(15,"No"),t.qZA(),t.TgZ(16,"th"),t._uU(17,"Kode invoice"),t.qZA(),t.TgZ(18,"th"),t._uU(19,"kode invoice des"),t.qZA(),t.TgZ(20,"th"),t._uU(21,"Kode invoice referensi"),t.qZA(),t.TgZ(22,"th"),t._uU(23,"Created At"),t.qZA(),t.TgZ(24,"th"),t._uU(25,"Created At Unix"),t.qZA(),t.TgZ(26,"th"),t._uU(27,"Harga beli"),t.qZA(),t.TgZ(28,"th"),t._uU(29,"Harga Jual"),t.qZA(),t.TgZ(30,"th"),t._uU(31,"id akun create"),t.qZA(),t.TgZ(32,"th"),t._uU(33,"id akun update"),t.qZA(),t.TgZ(34,"th"),t._uU(35,"id barang"),t.qZA(),t.TgZ(36,"th"),t._uU(37,"id klinik"),t.qZA(),t.TgZ(38,"th"),t._uU(39,"id log transaksi obat"),t.qZA(),t.TgZ(40,"th"),t._uU(41,"id transaksi referensi"),t.qZA(),t.TgZ(42,"th"),t._uU(43,"id transaksi referensi parent"),t.qZA(),t.TgZ(44,"th"),t._uU(45,"kegiatan"),t.qZA(),t.TgZ(46,"th"),t._uU(47,"keterangan"),t.qZA(),t.TgZ(48,"th"),t._uU(49,"kode invoice referensi tujuan"),t.qZA(),t.TgZ(50,"th"),t._uU(51,"nama barang"),t.qZA(),t.TgZ(52,"th"),t._uU(53,"nama lengkap admin"),t.qZA(),t.TgZ(54,"th"),t._uU(55,"no batch"),t.qZA(),t.TgZ(56,"th"),t._uU(57,"no urut tujuan"),t.qZA(),t.TgZ(58,"th"),t._uU(59,"stok akhir"),t.qZA(),t.TgZ(60,"th"),t._uU(61,"stok awal"),t.qZA(),t.TgZ(62,"th"),t._uU(63,"stok keluar"),t.qZA(),t.TgZ(64,"th"),t._uU(65,"stok masuk"),t.qZA(),t.TgZ(66,"th"),t._uU(67,"tanggal ed"),t.qZA(),t.TgZ(68,"th"),t._uU(69,"tanggal ed unix"),t.qZA(),t.TgZ(70,"th"),t._uU(71,"tanggal invoice"),t.qZA(),t.TgZ(72,"th"),t._uU(73,"tanggal invoice unix"),t.qZA(),t.TgZ(74,"th"),t._uU(75,"transaksi jenis"),t.qZA(),t.TgZ(76,"th"),t._uU(77,"transaksi kategori"),t.qZA(),t.TgZ(78,"th"),t._uU(79,"transaksi status"),t.qZA(),t.TgZ(80,"th"),t._uU(81,"uang keluar"),t.qZA(),t.TgZ(82,"th"),t._uU(83,"uang masuk"),t.qZA(),t.TgZ(84,"th"),t._uU(85,"updated at"),t.qZA(),t.TgZ(86,"th"),t._uU(87,"updated at unix"),t.qZA()()(),t._UZ(88,"tbody"),t.qZA()()()()()(),t.TgZ(89,"ngx-spinner",12)(90,"p",13),t._uU(91," Loading... "),t.qZA()()()),2&a&&(t.xp6(3),t.Q6J("title","Log Alat Kesehatan")("items",t.DdM(6,C))("active_item","Log Alat Kesehatan"),t.xp6(8),t.Q6J("dtOptions",i.dtOptions),t.xp6(78),t.Q6J("name","spinner1")("fullScreen",!0))},directives:[y.L,u.G,v.Ro],styles:[""]}),s})()}];let D=(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[[m.Bz.forChild(w)],m.Bz]}),s})();var E=e(60795),L=e(93075),q=e(16270),B=e(8202),S=e(36642),I=e(87046),F=e(7039);let P=(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[[n.ez,D,E.K,u.T,v.ef,L.u5,L.UX,q.z,B.Ud,Z.Aw.forFeature("masterData_dataObat",I.E),S.sQ.forFeature([F.R])]]}),s})()},16270:(O,_,e)=>{e.d(_,{z:()=>u});var n=e(69808),m=e(5e3);let u=(()=>{class c{}return c.\u0275fac=function(o){return new(o||c)},c.\u0275mod=m.oAB({type:c}),c.\u0275inj=m.cJS({imports:[[n.ez]]}),c})()},44151:(O,_,e)=>{e.d(_,{Z:()=>m});var n=e(5e3);let m=(()=>{class u{constructor(){this.modals=[]}add(d){this.modals.push(d)}remove(d){this.modals=this.modals.filter(o=>o.id!==d)}open(d){this.modals.find(r=>r.id===d).open()}close(d){this.modals.find(r=>r.id===d).close()}}return u.\u0275fac=function(d){return new(d||u)},u.\u0275prov=n.Yz7({token:u,factory:u.\u0275fac,providedIn:"root"}),u})()},33399:(O,_,e)=>{e.d(_,{L:()=>o});var n=e(5e3),m=e(23007),u=e(66541),c=e(69808);function d(r,t){if(1&r&&(n.TgZ(0,"li",9),n._uU(1),n.qZA()),2&r){const l=t.$implicit;n.xp6(1),n.Oqu(l)}}let o=(()=>{class r{constructor(){}ngOnInit(){}}return r.\u0275fac=function(l){return new(l||r)},r.\u0275cmp=n.Xpm({type:r,selectors:[["app-breadcrumb"]],inputs:{title:"title",items:"items",active_item:"active_item"},decls:12,vars:4,consts:[[1,"row"],[1,"col-xs-12","col-sm-12","col-md-12","col-lg-12"],[1,"breadcrumb"],[1,"page-title"],[1,"breadcrumb-item","bcrumb-1"],[3,"routerLink"],["name","home",1,"breadcrumb-icon"],["class","breadcrumb-item",4,"ngFor","ngForOf"],[1,"breadcrumb-item","active"],[1,"breadcrumb-item"]],template:function(l,g){1&l&&(n.TgZ(0,"div",0)(1,"div",1)(2,"ul",2)(3,"li")(4,"h4",3),n._uU(5),n.qZA()(),n.TgZ(6,"li",4)(7,"a",5),n._UZ(8,"i-feather",6),n.qZA()(),n.YNc(9,d,2,1,"li",7),n.TgZ(10,"li",8),n._uU(11),n.qZA()()()()),2&l&&(n.xp6(5),n.Oqu(g.title),n.xp6(2),n.Q6J("routerLink","/admin/welcome"),n.xp6(2),n.Q6J("ngForOf",g.items),n.xp6(2),n.Oqu(g.active_item))},directives:[m.yS,u.uy,c.sg],styles:[""]}),r})()},60795:(O,_,e)=>{e.d(_,{K:()=>c});var n=e(32471),m=e(65415),u=e(5e3);let c=(()=>{class d{}return d.\u0275fac=function(r){return new(r||d)},d.\u0275mod=u.oAB({type:d}),d.\u0275inj=u.cJS({imports:[[n.m,m.T]]}),d})()},65415:(O,_,e)=>{e.d(_,{G:()=>u,T:()=>d});var n=e(5e3),u=function(){function o(r,t,l){this.el=r,this.vcr=t,this.renderer=l,this.dtOptions={}}return o.prototype.ngOnInit=function(){var r=this;this.dtTrigger?this.dtTrigger.subscribe(function(t){r.displayTable(t)}):this.displayTable(null)},o.prototype.ngOnDestroy=function(){this.dtTrigger&&this.dtTrigger.unsubscribe(),this.dt&&this.dt.destroy(!0)},o.prototype.displayTable=function(r){var t=this;r&&(this.dtOptions=r),this.dtInstance=new Promise(function(l,g){Promise.resolve(t.dtOptions).then(function(h){0===Object.keys(h).length&&0===$("tbody tr",t.el.nativeElement).length?g("Both the table and dtOptions cannot be empty"):setTimeout(function(){var k={rowCallback:function(v,Z,y){if(h.columns){var A=h.columns;t.applyNgPipeTransform(v,A),t.applyNgRefTemplate(v,A,Z)}h.rowCallback&&h.rowCallback(v,Z,y)}};k=Object.assign({},h,k),t.dt=$(t.el.nativeElement).DataTable(k),l(t.dt)})})})},o.prototype.applyNgPipeTransform=function(r,t){t.filter(function(g){return g.ngPipeInstance&&!g.ngTemplateRef}).forEach(function(g){var h=g.ngPipeInstance,T=g.ngPipeArgs||[],k=t.findIndex(function(A){return A.data===g.data}),v=r.childNodes.item(k),Z=$(v).text(),y=h.transform.apply(h,function(o,r,t){if(t||2===arguments.length)for(var h,l=0,g=r.length;l<g;l++)(h||!(l in r))&&(h||(h=Array.prototype.slice.call(r,0,l)),h[l]=r[l]);return o.concat(h||Array.prototype.slice.call(r))}([Z],T,!1));$(v).text(y)})},o.prototype.applyNgRefTemplate=function(r,t,l){var g=this;t.filter(function(T){return T.ngTemplateRef&&!T.ngPipeInstance}).forEach(function(T){var k=T.ngTemplateRef,v=k.ref,Z=k.context,y=t.findIndex(function(x){return x.data===T.data}),A=r.childNodes.item(y);$(A).html("");var M=Object.assign({},Z,null==Z?void 0:Z.userData,{adtData:l}),C=g.vcr.createEmbeddedView(v,M);g.renderer.appendChild(A,C.rootNodes[0])})},o.\u0275fac=function(t){return new(t||o)(n.Y36(n.SBq),n.Y36(n.s_b),n.Y36(n.Qsj))},o.\u0275dir=n.lG2({type:o,selectors:[["","datatable",""]],inputs:{dtOptions:"dtOptions",dtTrigger:"dtTrigger"}}),o}(),c=e(69808),d=function(){function o(){}return o.forRoot=function(){return{ngModule:o}},o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=n.oAB({type:o}),o.\u0275inj=n.cJS({imports:[[c.ez]]}),o}()}}]);