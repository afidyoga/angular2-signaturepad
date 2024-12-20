import { Component, OnInit, ViewChild } from '@angular/core';
import { AkunPayload } from 'src/app/private/models/class-payload-api/manajemen-akun/akun-payload'
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/private/states/private-app.states'
import * as AkunActions from 'src/app/private/states/manajemen-akun/akun/akun.actions'
import Validation from '../utils/validation'
import { RoleService } from 'src/app/private/services/role-and-rights/role.service'
import { DaftarKlinikService } from 'src/app/private/services/manajemen-klinik/daftar-klinik.service';
// import { event } from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import {ValidateService} from 'src/app/private/services/validate/validateService'
@Component({
  selector: "app-tambah",
  templateUrl: "./tambah.component.html",
  styleUrls: ["./tambah.component.sass"],
})
export class TambahComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.PrivateAppState>,
    private roleService: RoleService,
    private validate: ValidateService,
    private spinner: NgxSpinnerService,
    private daftarKlinikService: DaftarKlinikService
  ) {
    this.getState = this.store.select("managemenAkun_akun");
    this.errorMessage = null;
  }
  // tabPane : any = [true, false, false]
  @ViewChild("saveStatusAkunCheckbox") saveStatusAkunCheckbox: any;
  tabPane: any = {
    pane1: true,
    pane2: false,
    pane3: false,
  };
  listRoleAKun: any = [];
  levelRoleAkun: number = 0;
  dataMenu: any = [];
  akun: AkunPayload = new AkunPayload();
  getState: Observable<any>;
  public formTambah: FormGroup;
  labelStatusAkun: string = "Aktif";
  isLoadingButton: boolean;
  errorMessage: string = "";
  reloadTable: boolean;
  statusAkunValueCheckbox: boolean = true;
  listKlinik: Array<any> = [];
  submitted: boolean = false;
  loadingRole = false;
  loadingKlinik = false;
  loadingState = false;
  multi = false;
  hideKlinik = true;
  listState = [];
  paramSelect = {
    last_data: "0",
    get_data: "10",
    search: "",
  };
  nikVerified: boolean = false;
  // role_akun = new FormControl("")
  ngOnInit(): void {
    this.loadListKlinik();
    this.loadListNamaRole();
    this.formTambah = this.fb.group(
      {
        nameakun: ["", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirm_password: ["", [Validators.required]],
        nama_lengkap: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        no_hp: [""],
        level_akun: [""],
        role_akun: [null, [Validators.required]],
        status_akun: ["true"],
        id_klinik: [],
        dial_code: null,
        nik: ["", [Validators.required, this.nikValidator]],
      },
      {
        validators: [Validation.match("password", "confirm_password")],
      }
    );

    this.roleService.getRoleByAKun().subscribe((succ) => {
      this.listRoleAKun = succ.response;
    });

    this.daftarKlinikService.getSelect(this.paramSelect).subscribe((succ) => {
      this.listKlinik = succ.response;
    });

    this.formTambah.controls["role_akun"].valueChanges.subscribe((value) => {
      let level = this.listRoleAKun.find((op) => {
        return op.id_akun_role == value;
      });
      if (level) {
        this.levelRoleAkun = level.level_akun;
        // console.log('value_level' , this.levelRoleAkun);
        if (level.level_akun >= 3) {
          this.formTambah.get("id_klinik").setValidators([Validators.required]);
        } else {
          this.formTambah.get("id_klinik").clearValidators();
        }
        this.formTambah.get("id_klinik").updateValueAndValidity();
      }
    });

    // this.formTambah.addControl('levelRoleAkun', this.levelRoleAkun)
    // this.formTambah.levelRoleAkun.valueChanges.subscribe((value : any) => {
    //   console.log(value)
    // })
    /**
		if (this.levelRoleAkun. >= 3) {
		  this.formTambah.get('id_klinik').setValidators(Validators.required)
		} else {
		  this.formTambah.get('id_klinik').clearValidators()
		}
		*/

    this.store.dispatch(AkunActions.clearState());

    this.getState.subscribe((state) => {
      this.akun = state.akun;
      this.isLoadingButton = state.isLoadingButton;
      this.errorMessage = state.errorMessage;
      // console.log({
      //   "error": this.errorMessage,
      //   "dari_state" : state.errorMessage
      // })
    });
    // this.dataMenu = this.rightService.ShowData()
  }

  loadListKlinik() {
    // this.daftarKlinikService.getAll()
    // 	.subscribe(succ => {
    // 		this.listKlinik = succ.response
    // 	})
  }
  isNumber(e) {
    return this.validate.Number(e);
  }
  ngAfterContentInit() {}
  /**
	ChangeStatusAkun(event :any){
	  // console.log('change status', event.target.value)
	  if (this.formTambah.value.status_akun === true)  {
		console.log('isi true')
		this.labelStatusAkun = 'Aktif'
	  } else {
		console.log('isi false')
		this.labelStatusAkun = 'Tidak Aktif'
	  }
	}
	 */

  ChangeStatusAkun(status: any) {
    this.statusAkunValueCheckbox = status;
    if (status) {
      this.labelStatusAkun = "Aktif";
    } else {
      this.labelStatusAkun = "Tidak Aktif";
    }
  }
  ChangeKlinikAKun(event) {
    console.log(event);
    console.log(this.formTambah.value);
  }

  nikValidator(control: FormControl) {
    const value = control.value;
    if (value && !/^\d{16}$/.test(value)) {
      return { invalidNik: true };
    }
    return null;
  }

  verifyNIK() {
    const nik = this.formTambah.controls["nik"].value;
    if (this.formTambah.controls["nik"].valid) {
      this.spinner.show("spinner1");
      setTimeout(() => {
        this.nikVerified = true;
        this.spinner.hide("spinner1");
      }, 1000);
    }
  }

  submitForm() {
    this.submitted = false;
    setTimeout(() => {
      this.submitted = true;
    }, 300);
    if (this.formTambah.invalid) {
      return;
    }
    this.spinner.show("spinner1");
    let payload = new AkunPayload();
    payload.nameakun = this.formTambah.value.nameakun;
    payload.passakun = this.formTambah.value.password;
    payload.confirm_password = this.formTambah.value.confirm_password;
    payload.nama_lengkap = this.formTambah.value.nama_lengkap;
    payload.email = this.formTambah.value.email;

    let no_hp =
      this.formTambah.value.no_hp.toString().substr(0, 1) == "0"
        ? this.formTambah.value.no_hp
            .toString()
            .substr(1, this.formTambah.value.no_hp.length)
        : this.formTambah.value.no_hp;
    payload.no_hp = no_hp;
    payload.dial_code = this.formTambah.value.dial_code;
    payload.level_akun = this.levelRoleAkun;
    payload.id_klinik = this.formTambah.value.id_klinik;
    payload.role_akun = this.formTambah.value.role_akun;
    payload.id_klinik = Array.isArray(this.formTambah.value.id_klinik)
      ? this.formTambah.value.id_klinik
      : [this.formTambah.value.id_klinik];
    // payload.status_akun = this.formTambah.value.status_akun
    // if (this.formTambah.value.status_akun === true)  {
    //   payload.status_akun = 1
    // } else {
    //   payload.status_akun = 0
    //   // console.log('isi false')
    // }

    if (this.statusAkunValueCheckbox === true) {
      payload.status_akun = 1;
    } else {
      payload.status_akun = 0;
    }
    // payload.id_klinik

    this.store.dispatch(AkunActions.addAkun({ payload: payload }));
    setTimeout(() => {
      this.spinner.hide("spinner1");
    }, 400);
  }
  ShowTabPane(nomor: number) {
    if (nomor == 1) {
      this.tabPane.pane1 = true;
      this.tabPane.pane2 = false;
      this.tabPane.pane3 = false;
    } else if (nomor == 2) {
      this.tabPane.pane1 = false;
      this.tabPane.pane2 = true;
      this.tabPane.pane3 = false;
    } else {
      this.tabPane.pane1 = false;
      this.tabPane.pane2 = false;
      this.tabPane.pane3 = true;
    }
  }
  ChangeState($event: any) {}
  ChangeRoleAKun($event: any) {
    if ($event) {
      if ($event.plant == "all") {
        this.hideKlinik = true;
      } else if ($event.plant == "multi") {
        this.hideKlinik = false;
        this.multi = true;
      } else {
        this.hideKlinik = false;
        this.multi = false;
      }
      this.formTambah.patchValue({
        id_klinik: [],
      });
    }
  }

  ngAfterViewInit() {}
  loadListNamaRole() {
    this.roleService.getRoleByAKun().subscribe((succ) => {
      this.listRoleAKun = succ.response;
    });
  }
  prosesSelectState(event: any, aksi: string) {
    this.loadingState = true;
    this.listState = [
      { name: "Afghanistan", dial_code: "+93", code: "AF", flag: "af" },
      { name: "Albania", dial_code: "+355", code: "AL", flag: "al" },
      { name: "Algeria", dial_code: "+213", code: "DZ", flag: "dz" },
      { name: "AmericanSamoa", dial_code: "+1684", code: "AS", flag: "as" },
      { name: "Andorra", dial_code: "+376", code: "AD", flag: "ad" },
      { name: "Angola", dial_code: "+244", code: "AO", flag: "ao" },
      { name: "Anguilla", dial_code: "+1264", code: "AI", flag: "ai" },
      { name: "Antarctica", dial_code: "+672", code: "AQ", flag: "aq" },
      {
        name: "Antigua and Barbuda",
        dial_code: "+1268",
        code: "AG",
        flag: "ag",
      },
      { name: "Argentina", dial_code: "+54", code: "AR", flag: "ar" },
      { name: "Armenia", dial_code: "+374", code: "AM", flag: "am" },
      { name: "Aruba", dial_code: "+297", code: "AW", flag: "aw" },
      {
        name: "Australia",
        dial_code: "+61",
        code: "AU",
        preferred: true,
        flag: "au",
      },
      { name: "Austria", dial_code: "+43", code: "AT", flag: "at" },
      { name: "Azerbaijan", dial_code: "+994", code: "AZ", flag: "az" },
      { name: "Bahamas", dial_code: "+1242", code: "BS", flag: "bs" },
      { name: "Bahrain", dial_code: "+973", code: "BH", flag: "bh" },
      { name: "Bangladesh", dial_code: "+880", code: "BD", flag: "bd" },
      { name: "Barbados", dial_code: "+1246", code: "BB", flag: "bb" },
      { name: "Belarus", dial_code: "+375", code: "BY", flag: "by" },
      { name: "Belgium", dial_code: "+32", code: "BE", flag: "be" },
      { name: "Belize", dial_code: "+501", code: "BZ", flag: "bz" },
      { name: "Benin", dial_code: "+229", code: "BJ", flag: "bj" },
      { name: "Bermuda", dial_code: "+1441", code: "BM", flag: "bm" },
      { name: "Bhutan", dial_code: "+975", code: "BT", flag: "bt" },
      {
        name: "Bolivia, Plurinational State of",
        dial_code: "+591",
        code: "BO",
        flag: "bo",
      },
      {
        name: "Bosnia and Herzegovina",
        dial_code: "+387",
        code: "BA",
        flag: "ba",
      },
      { name: "Botswana", dial_code: "+267", code: "BW", flag: "bw" },
      { name: "Brazil", dial_code: "+55", code: "BR", flag: "br" },
      {
        name: "British Indian Ocean Territory",
        dial_code: "+246",
        code: "IO",
        flag: "io",
      },
      { name: "Brunei Darussalam", dial_code: "+673", code: "BN", flag: "bn" },
      { name: "Bulgaria", dial_code: "+359", code: "BG", flag: "bg" },
      { name: "Burkina Faso", dial_code: "+226", code: "BF", flag: "bf" },
      { name: "Burundi", dial_code: "+257", code: "BI", flag: "bi" },
      { name: "Cambodia", dial_code: "+855", code: "KH", flag: "kh" },
      { name: "Cameroon", dial_code: "+237", code: "CM", flag: "cm" },
      { name: "Canada", dial_code: "+1", code: "CA", flag: "ca" },
      { name: "Cape Verde", dial_code: "+238", code: "CV", flag: "cv" },
      { name: "Cayman Islands", dial_code: "+345", code: "KY", flag: "ky" },
      {
        name: "Central African Republic",
        dial_code: "+236",
        code: "CF",
        flag: "cf",
      },
      { name: "Chad", dial_code: "+235", code: "TD", flag: "td" },
      { name: "Chile", dial_code: "+56", code: "CL", flag: "cl" },
      { name: "China", dial_code: "+86", code: "CN", flag: "cn" },
      { name: "Christmas Island", dial_code: "+61", code: "CX", flag: "cx" },
      {
        name: "Cocos (Keeling) Islands",
        dial_code: "+61",
        code: "CC",
        flag: "cc",
      },
      { name: "Colombia", dial_code: "+57", code: "CO", flag: "co" },
      { name: "Comoros", dial_code: "+269", code: "KM", flag: "km" },
      { name: "Congo", dial_code: "+242", code: "CG", flag: "cg" },
      {
        name: "Congo, The Democratic Republic of the",
        dial_code: "+243",
        code: "CD",
        flag: "cd",
      },
      { name: "Cook Islands", dial_code: "+682", code: "CK", flag: "ck" },
      { name: "Costa Rica", dial_code: "+506", code: "CR", flag: "cr" },
      { name: "Cote d'Ivoire", dial_code: "+225", code: "CI", flag: "ci" },
      { name: "Croatia", dial_code: "+385", code: "HR", flag: "hr" },
      { name: "Cuba", dial_code: "+53", code: "CU", flag: "cu" },
      { name: "Cyprus", dial_code: "+357", code: "CY", flag: "cy" },
      { name: "Czech Republic", dial_code: "+420", code: "CZ", flag: "cz" },
      { name: "Denmark", dial_code: "+45", code: "DK", flag: "dk" },
      { name: "Djibouti", dial_code: "+253", code: "DJ", flag: "dj" },
      { name: "Dominica", dial_code: "+1767", code: "DM", flag: "dm" },
      {
        name: "Dominican Republic",
        dial_code: "+1849",
        code: "DO",
        flag: "do",
      },
      { name: "Ecuador", dial_code: "+593", code: "EC", flag: "ec" },
      { name: "Egypt", dial_code: "+20", code: "EG", flag: "eg" },
      { name: "El Salvador", dial_code: "+503", code: "SV", flag: "sv" },
      { name: "Equatorial Guinea", dial_code: "+240", code: "GQ", flag: "gq" },
      { name: "Eritrea", dial_code: "+291", code: "ER", flag: "er" },
      { name: "Estonia", dial_code: "+372", code: "EE", flag: "ee" },
      { name: "Ethiopia", dial_code: "+251", code: "ET", flag: "et" },
      {
        name: "Falkland Islands (Malvinas)",
        dial_code: "+500",
        code: "FK",
        flag: "fk",
      },
      { name: "Faroe Islands", dial_code: "+298", code: "FO", flag: "fo" },
      { name: "Fiji", dial_code: "+679", code: "FJ", flag: "fj" },
      { name: "Finland", dial_code: "+358", code: "FI", flag: "fi" },
      { name: "France", dial_code: "+33", code: "FR", flag: "fr" },
      { name: "French Guiana", dial_code: "+594", code: "GF", flag: "gf" },
      { name: "French Polynesia", dial_code: "+689", code: "PF", flag: "pf" },
      { name: "Gabon", dial_code: "+241", code: "GA", flag: "ga" },
      { name: "Gambia", dial_code: "+220", code: "GM", flag: "gm" },
      { name: "Georgia", dial_code: "+995", code: "GE", flag: "ge" },
      { name: "Germany", dial_code: "+49", code: "DE", flag: "de" },
      { name: "Ghana", dial_code: "+233", code: "GH", flag: "gh" },
      { name: "Gibraltar", dial_code: "+350", code: "GI", flag: "gi" },
      { name: "Greece", dial_code: "+30", code: "GR", flag: "gr" },
      { name: "Greenland", dial_code: "+299", code: "GL", flag: "gl" },
      { name: "Grenada", dial_code: "+1473", code: "GD", flag: "gd" },
      { name: "Guadeloupe", dial_code: "+590", code: "GP", flag: "gp" },
      { name: "Guam", dial_code: "+1671", code: "GU", flag: "gu" },
      { name: "Guatemala", dial_code: "+502", code: "GT", flag: "gt" },
      { name: "Guernsey", dial_code: "+44", code: "GG", flag: "gg" },
      { name: "Guinea", dial_code: "+224", code: "GN", flag: "gn" },
      { name: "Guinea-Bissau", dial_code: "+245", code: "GW", flag: "gw" },
      { name: "Guyana", dial_code: "+595", code: "GY", flag: "gy" },
      { name: "Haiti", dial_code: "+509", code: "HT", flag: "ht" },
      {
        name: "Holy See (Vatican City State)",
        dial_code: "+379",
        code: "VA",
        flag: "va",
      },
      { name: "Honduras", dial_code: "+504", code: "HN", flag: "hn" },
      { name: "Hong Kong", dial_code: "+852", code: "HK", flag: "hk" },
      { name: "Hungary", dial_code: "+36", code: "HU", flag: "hu" },
      { name: "Iceland", dial_code: "+354", code: "IS", flag: "is" },
      {
        name: "India",
        dial_code: "+91",
        code: "IN",
        preferred: true,
        flag: "in",
      },
      { name: "Indonesia", dial_code: "+62", code: "ID", flag: "id" },
      {
        name: "Iran, Islamic Republic of",
        dial_code: "+98",
        code: "IR",
        flag: "ir",
      },
      { name: "Iraq", dial_code: "+964", code: "IQ", flag: "iq" },
      { name: "Ireland", dial_code: "+353", code: "IE", flag: "ie" },
      { name: "Isle of Man", dial_code: "+44", code: "IM", flag: "im" },
      { name: "Israel", dial_code: "+972", code: "IL", flag: "il" },
      { name: "Italy", dial_code: "+39", code: "IT", flag: "it" },
      { name: "Jamaica", dial_code: "+1876", code: "JM", flag: "jm" },
      { name: "Japan", dial_code: "+81", code: "JP", flag: "jp" },
      { name: "Jersey", dial_code: "+44", code: "JE", flag: "je" },
      { name: "Jordan", dial_code: "+962", code: "JO", flag: "jo" },
      { name: "Kazakhstan", dial_code: "+77", code: "KZ", flag: "kz" },
      { name: "Kenya", dial_code: "+254", code: "KE", flag: "ke" },
      { name: "Kiribati", dial_code: "+686", code: "KI", flag: "ki" },
      {
        name: "Korea, Democratic People's Republic of",
        dial_code: "+850",
        code: "KP",
        flag: "kp",
      },
      { name: "Korea, Republic of", dial_code: "+82", code: "KR", flag: "kr" },
      { name: "Kuwait", dial_code: "+965", code: "KW", flag: "kw" },
      { name: "Kyrgyzstan", dial_code: "+996", code: "KG", flag: "kg" },
      {
        name: "Lao People's Democratic Republic",
        dial_code: "+856",
        code: "LA",
        flag: "la",
      },
      { name: "Latvia", dial_code: "+371", code: "LV", flag: "lv" },
      { name: "Lebanon", dial_code: "+961", code: "LB", flag: "lb" },
      { name: "Lesotho", dial_code: "+266", code: "LS", flag: "ls" },
      { name: "Liberia", dial_code: "+231", code: "LR", flag: "lr" },
      {
        name: "Libyan Arab Jamahiriya",
        dial_code: "+218",
        code: "LY",
        flag: "ly",
      },
      { name: "Liechtenstein", dial_code: "+423", code: "LI", flag: "li" },
      { name: "Lithuania", dial_code: "+370", code: "LT", flag: "lt" },
      { name: "Luxembourg", dial_code: "+352", code: "LU", flag: "lu" },
      { name: "Macao", dial_code: "+853", code: "MO", flag: "mo" },
      {
        name: "Macedonia, The Former Yugoslav Republic of",
        dial_code: "+389",
        code: "MK",
        flag: "mk",
      },
      { name: "Madagascar", dial_code: "+261", code: "MG", flag: "mg" },
      { name: "Malawi", dial_code: "+265", code: "MW", flag: "mw" },
      { name: "Malaysia", dial_code: "+60", code: "MY", flag: "my" },
      { name: "Maldives", dial_code: "+960", code: "MV", flag: "mv" },
      { name: "Mali", dial_code: "+223", code: "ML", flag: "ml" },
      { name: "Malta", dial_code: "+356", code: "MT", flag: "mt" },
      { name: "Marshall Islands", dial_code: "+692", code: "MH", flag: "mh" },
      { name: "Martinique", dial_code: "+596", code: "MQ", flag: "mq" },
      { name: "Mauritania", dial_code: "+222", code: "MR", flag: "mr" },
      { name: "Mauritius", dial_code: "+230", code: "MU", flag: "mu" },
      { name: "Mayotte", dial_code: "+262", code: "YT", flag: "yt" },
      { name: "Mexico", dial_code: "+52", code: "MX", flag: "mx" },
      {
        name: "Micronesia, Federated States of",
        dial_code: "+691",
        code: "FM",
        flag: "fm",
      },
      {
        name: "Moldova, Republic of",
        dial_code: "+373",
        code: "MD",
        flag: "md",
      },
      { name: "Monaco", dial_code: "+377", code: "MC", flag: "mc" },
      { name: "Mongolia", dial_code: "+976", code: "MN", flag: "mn" },
      { name: "Montenegro", dial_code: "+382", code: "ME", flag: "me" },
      { name: "Montserrat", dial_code: "+1664", code: "MS", flag: "ms" },
      { name: "Morocco", dial_code: "+212", code: "MA", flag: "ma" },
      { name: "Mozambique", dial_code: "+258", code: "MZ", flag: "mz" },
      { name: "Myanmar", dial_code: "+95", code: "MM", flag: "mm" },
      { name: "Namibia", dial_code: "+264", code: "NA", flag: "na" },
      { name: "Nauru", dial_code: "+674", code: "NR", flag: "nr" },
      { name: "Nepal", dial_code: "+977", code: "NP", flag: "np" },
      { name: "Netherlands", dial_code: "+31", code: "NL", flag: "nl" },
      {
        name: "Netherlands Antilles",
        dial_code: "+599",
        code: "AN",
        flag: "an",
      },
      { name: "New Caledonia", dial_code: "+687", code: "NC", flag: "nc" },
      { name: "New Zealand", dial_code: "+64", code: "NZ", flag: "nz" },
      { name: "Nicaragua", dial_code: "+505", code: "NI", flag: "ni" },
      { name: "Niger", dial_code: "+227", code: "NE", flag: "ne" },
      { name: "Nigeria", dial_code: "+234", code: "NG", flag: "ng" },
      { name: "Niue", dial_code: "+683", code: "NU", flag: "nu" },
      { name: "Norfolk Island", dial_code: "+672", code: "NF", flag: "nf" },
      {
        name: "Northern Mariana Islands",
        dial_code: "+1670",
        code: "MP",
        flag: "mp",
      },
      { name: "Norway", dial_code: "+47", code: "NO", flag: "no" },
      { name: "Oman", dial_code: "+968", code: "OM", flag: "om" },
      { name: "Pakistan", dial_code: "+92", code: "PK", flag: "pk" },
      { name: "Palau", dial_code: "+680", code: "PW", flag: "pw" },
      {
        name: "Palestinian Territory, Occupied",
        dial_code: "+970",
        code: "PS",
        flag: "ps",
      },
      { name: "Panama", dial_code: "+507", code: "PA", flag: "pa" },
      { name: "Papua New Guinea", dial_code: "+675", code: "PG", flag: "pg" },
      { name: "Paraguay", dial_code: "+595", code: "PY", flag: "py" },
      { name: "Peru", dial_code: "+51", code: "PE", flag: "pe" },
      { name: "Philippines", dial_code: "+63", code: "PH", flag: "ph" },
      { name: "Pitcairn", dial_code: "+872", code: "PN", flag: "pn" },
      { name: "Poland", dial_code: "+48", code: "PL", flag: "pl" },
      { name: "Portugal", dial_code: "+351", code: "PT", flag: "pt" },
      { name: "Puerto Rico", dial_code: "+1939", code: "PR", flag: "pr" },
      { name: "Qatar", dial_code: "+974", code: "QA", flag: "qa" },
      { name: "Romania", dial_code: "+40", code: "RO", flag: "ro" },
      { name: "Russia", dial_code: "+7", code: "RU", flag: "ru" },
      { name: "Rwanda", dial_code: "+250", code: "RW", flag: "rw" },
      { name: "Réunion", dial_code: "+262", code: "RE", flag: "re" },
      { name: "Saint Barthélemy", dial_code: "+590", code: "BL", flag: "bl" },
      {
        name: "Saint Helena, Ascension and Tristan Da Cunha",
        dial_code: "+290",
        code: "SH",
        flag: "sh",
      },
      {
        name: "Saint Kitts and Nevis",
        dial_code: "+1869",
        code: "KN",
        flag: "kn",
      },
      { name: "Saint Lucia", dial_code: "+1758", code: "LC", flag: "lc" },
      { name: "Saint Martin", dial_code: "+590", code: "MF", flag: "mf" },
      {
        name: "Saint Pierre and Miquelon",
        dial_code: "+508",
        code: "PM",
        flag: "pm",
      },
      {
        name: "Saint Vincent and the Grenadines",
        dial_code: "+1784",
        code: "VC",
        flag: "vc",
      },
      { name: "Samoa", dial_code: "+685", code: "WS", flag: "ws" },
      { name: "San Marino", dial_code: "+378", code: "SM", flag: "sm" },
      {
        name: "Sao Tome and Principe",
        dial_code: "+239",
        code: "ST",
        flag: "st",
      },
      { name: "Saudi Arabia", dial_code: "+966", code: "SA", flag: "sa" },
      { name: "Senegal", dial_code: "+221", code: "SN", flag: "sn" },
      { name: "Serbia", dial_code: "+381", code: "RS", flag: "rs" },
      { name: "Seychelles", dial_code: "+248", code: "SC", flag: "sc" },
      { name: "Sierra Leone", dial_code: "+232", code: "SL", flag: "sl" },
      { name: "Singapore", dial_code: "+65", code: "SG", flag: "sg" },
      { name: "Slovakia", dial_code: "+421", code: "SK", flag: "sk" },
      { name: "Slovenia", dial_code: "+386", code: "SI", flag: "si" },
      { name: "Solomon Islands", dial_code: "+677", code: "SB", flag: "sb" },
      { name: "Somalia", dial_code: "+252", code: "SO", flag: "so" },
      { name: "South Africa", dial_code: "+27", code: "ZA", flag: "za" },
      {
        name: "South Georgia and the South Sandwich Islands",
        dial_code: "+500",
        code: "GS",
        flag: "gs",
      },
      { name: "Spain", dial_code: "+34", code: "ES", flag: "es" },
      { name: "Sri Lanka", dial_code: "+94", code: "LK", flag: "lk" },
      { name: "Sudan", dial_code: "+249", code: "SD", flag: "sd" },
      { name: "Suriname", dial_code: "+597", code: "SR", flag: "sr" },
      {
        name: "Svalbard and Jan Mayen",
        dial_code: "+47",
        code: "SJ",
        flag: "sj",
      },
      { name: "Swaziland", dial_code: "+268", code: "SZ", flag: "sz" },
      { name: "Sweden", dial_code: "+46", code: "SE", flag: "se" },
      { name: "Switzerland", dial_code: "+41", code: "CH", flag: "ch" },
      {
        name: "Syrian Arab Republic",
        dial_code: "+963",
        code: "SY",
        flag: "sy",
      },
      {
        name: "Taiwan, Province of China",
        dial_code: "+886",
        code: "TW",
        flag: "tw",
      },
      { name: "Tajikistan", dial_code: "+992", code: "TJ", flag: "tj" },
      {
        name: "Tanzania, United Republic of",
        dial_code: "+255",
        code: "TZ",
        flag: "tz",
      },
      { name: "Thailand", dial_code: "+66", code: "TH", flag: "th" },
      { name: "Timor-Leste", dial_code: "+670", code: "TL", flag: "tl" },
      { name: "Togo", dial_code: "+228", code: "TG", flag: "tg" },
      { name: "Tokelau", dial_code: "+690", code: "TK", flag: "tk" },
      { name: "Tonga", dial_code: "+676", code: "TO", flag: "to" },
      {
        name: "Trinidad and Tobago",
        dial_code: "+1868",
        code: "TT",
        flag: "tt",
      },
      { name: "Tunisia", dial_code: "+216", code: "TN", flag: "tn" },
      { name: "Turkey", dial_code: "+90", code: "TR", flag: "tr" },
      { name: "Turkmenistan", dial_code: "+993", code: "TM", flag: "tm" },
      {
        name: "Turks and Caicos Islands",
        dial_code: "+1649",
        code: "TC",
        flag: "tc",
      },
      { name: "Tuvalu", dial_code: "+688", code: "TV", flag: "tv" },
      { name: "Uganda", dial_code: "+256", code: "UG", flag: "ug" },
      { name: "Ukraine", dial_code: "+380", code: "UA", flag: "ua" },
      {
        name: "United Arab Emirates",
        dial_code: "+971",
        code: "AE",
        preferred: true,
        flag: "ae",
      },
      {
        name: "United Kingdom",
        dial_code: "+44",
        code: "GB",
        preferred: true,
        flag: "gb",
      },
      {
        name: "United States",
        dial_code: "+1",
        code: "US",
        preferred: true,
        flag: "us",
      },
      { name: "Uruguay", dial_code: "+598", code: "UY", flag: "uy" },
      { name: "Uzbekistan", dial_code: "+998", code: "UZ", flag: "uz" },
      { name: "Vanuatu", dial_code: "+678", code: "VU", flag: "vu" },
      {
        name: "Venezuela, Bolivarian Republic of",
        dial_code: "+58",
        code: "VE",
        flag: "ve",
      },
      { name: "Viet Nam", dial_code: "+84", code: "VN", flag: "vn" },
      {
        name: "Virgin Islands, British",
        dial_code: "+1284",
        code: "VG",
        flag: "vg",
      },
      {
        name: "Virgin Islands, U.S.",
        dial_code: "+1340",
        code: "VI",
        flag: "vi",
      },
      { name: "Wallis and Futuna", dial_code: "+681", code: "WF", flag: "wf" },
      { name: "Yemen", dial_code: "+967", code: "YE", flag: "ye" },
      { name: "Zambia", dial_code: "+260", code: "ZM", flag: "zm" },
      { name: "Zimbabwe", dial_code: "+263", code: "ZW", flag: "zw" },
      { name: "Åland Islands", dial_code: "+358", code: "AX", flag: "ax" },
    ];

    if (aksi == "search") {
      let arr = [];
      this.listState.map((val) => {
        if (val.name.search(event)) {
          arr.push(val);
        }
      });
      this.listState = arr;
    }
    this.loadingState = false;
  }
  prosesSelectRole(event: any, aksi: string) {
    this.listRoleAKun = this.searchProses(
      this.listRoleAKun,
      "nama_role",
      event
    );
  }
  prosesSelectKlinik(event: any, aksi: string) {
    this.listKlinik = this.searchProses(this.listKlinik, "nama_klinik", event);
  }
  searchProses(data, key, search) {
    let res = [];
    data.map((val, index) => {
      if (val[key].search(search) != -1) {
        res.push(val);
      }
    });
    return res;
  }
  fieldsChange($event: any, index: any) {
    this.dataMenu[index].value_checkbox = $event.target.checked;
    this.loop_pertama($event.target.checked, index);
  }

  loop_pertama(value: boolean, index: number) {
    this.dataMenu[index].child.forEach((el, ind) => {
      el.value_checkbox = value;
      if (el.child.length > 0) {
        el.child.forEach((ele) => {
          ele.value_checkbox = value;
          if (ele.child.length > 0) {
            ele.child.forEach((elem) => {
              elem.value_checkbox = value;
              if (elem.child.length > 0) {
                elem.child.forEach((elemen) => {
                  elemen.value_checkbox = value;
                });
              }
            });
          }
        });
      }
    });
  }

  fieldsChange_kedua($event: any, simbah: any, ayah: any) {
    this.dataMenu[simbah].child[ayah].value_checkbox = $event.target.checked;
    this.loop_kedua($event.target.checked, simbah, ayah);

    let data_false = this.dataMenu[simbah].child.find((o) => {
      return o.value_checkbox === false;
    });

    if (data_false === undefined) {
      /**nek diisi kabeh */
      this.dataMenu[simbah].value_checkbox = true;
      this.dataMenu[simbah].indeterminate = false;
    } else {
      this.dataMenu[simbah].value_checkbox = false;
      this.dataMenu[simbah].indeterminate = true;
    }
  }

  loop_kedua(value: boolean, simbah: number, ayah: number) {
    this.dataMenu[simbah].child[ayah].child.forEach((el) => {
      el.value_checkbox = value;
      if (el.child.length > 0) {
        el.child.forEach((ele) => {
          ele.value_checkbox = value;
          if (ele.child.length > 0) {
            ele.child.forEach((elem) => {
              elem.value_checkbox = value;
            });
          }
        });
      }
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}



