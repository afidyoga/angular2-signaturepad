import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { WilayahService } from 'src/app/private/services/master-data/wilayah.service';
import { FormBuilder, FormGroup,  Validators, FormControl, FormArray } from "@angular/forms";
import { PasienPayload, AlamatDomisili, AlamatKtp, Alamat } from 'src/app/private/models/class-payload-api/pasien/pasien-payload';
import * as moment from 'moment';
import * as fromApp from 'src/app/private/states/private-app.states'
import { Store } from '@ngrx/store';
import * as PasienActions from 'src/app/private/states/pasien/data-pasien/pasien.actions'
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { AESService } from 'src/app/private/services/AES/aes'
import { AuthService } from 'src/app/authentication/core/services/auth.service'
import { ValidateService} from 'src/app/private/services/validate/validateService'
export enum TipeAlamat {
  KTP = 'ktp',
  DOMISILI = 'domisili'
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  paramProvinsiKtp  = { last_data : 0, get_data : 10, search : "" }
  paramKabupatenKtp = { last_data : 0, get_data : 10, search : "" }
  paramKecamatanKtp = { last_data : 0, get_data : 10, search : "" }
  paramDesaKtp      = { last_data : 0, get_data : 10, search : "" }

  paramProvinsiDomisili  = { last_data : 0, get_data : 10, search : "" }
  paramKabupatenDomisili = { last_data : 0, get_data : 10, search : "" }
  paramKecamatanDomisili = { last_data : 0, get_data : 10, search : "" }
  paramDesaDomisili      = { last_data : 0, get_data : 10, search : "" }

  listProvinsiKtp  : Array<any> = []
  listKabupatenKtp : Array<any> = []
  listKecamatanKtp : Array<any> = []
  listDesaKtp      : Array<any> = []

  listProvinsiDomisili  : Array<any> = []
  listKabupatenDomisili : Array<any> = []
  listKecamatanDomisili : Array<any> = []
  listDesaDomisili      : Array<any> = []

  idProvinsiKtp  : any = null
  idKabupatenKtp : any = null
  idKecamatanKtp : any = null
  idDesaKtp      : any = null

  idProvinsiDomisili  : any = null
  idKabupatenDomisili : any = null
  idKecamatanDomisili : any = null
  idDesaDomisili      : any = null

  tipeAlamat = TipeAlamat
  checkboxAlamatDomisili : boolean = false
  formTambah: FormGroup;
  submitted : boolean = false
  isEdit : boolean
  isLoadingButton : boolean
  reloadTable : boolean
  errorMessage : any | null
  submitButton : boolean
  getState : Observable<any>
  pasien :any
  listState = [{ "name": "Afghanistan", "dial_code": "+93", "code": "AF", "flag": "af" }, { "name": "Albania", "dial_code": "+355", "code": "AL", "flag": "al" }, { "name": "Algeria", "dial_code": "+213", "code": "DZ", "flag": "dz" }, { "name": "AmericanSamoa", "dial_code": "+1684", "code": "AS", "flag": "as" }, { "name": "Andorra", "dial_code": "+376", "code": "AD", "flag": "ad" }, { "name": "Angola", "dial_code": "+244", "code": "AO", "flag": "ao" }, { "name": "Anguilla", "dial_code": "+1264", "code": "AI", "flag": "ai" }, { "name": "Antarctica", "dial_code": "+672", "code": "AQ", "flag": "aq" }, { "name": "Antigua and Barbuda", "dial_code": "+1268", "code": "AG", "flag": "ag" }, { "name": "Argentina", "dial_code": "+54", "code": "AR", "flag": "ar" }, { "name": "Armenia", "dial_code": "+374", "code": "AM", "flag": "am" }, { "name": "Aruba", "dial_code": "+297", "code": "AW", "flag": "aw" }, { "name": "Australia", "dial_code": "+61", "code": "AU", "preferred": true, "flag": "au" }, { "name": "Austria", "dial_code": "+43", "code": "AT", "flag": "at" }, { "name": "Azerbaijan", "dial_code": "+994", "code": "AZ", "flag": "az" }, { "name": "Bahamas", "dial_code": "+1242", "code": "BS", "flag": "bs" }, { "name": "Bahrain", "dial_code": "+973", "code": "BH", "flag": "bh" }, { "name": "Bangladesh", "dial_code": "+880", "code": "BD", "flag": "bd" }, { "name": "Barbados", "dial_code": "+1246", "code": "BB", "flag": "bb" }, { "name": "Belarus", "dial_code": "+375", "code": "BY", "flag": "by" }, { "name": "Belgium", "dial_code": "+32", "code": "BE", "flag": "be" }, { "name": "Belize", "dial_code": "+501", "code": "BZ", "flag": "bz" }, { "name": "Benin", "dial_code": "+229", "code": "BJ", "flag": "bj" }, { "name": "Bermuda", "dial_code": "+1441", "code": "BM", "flag": "bm" }, { "name": "Bhutan", "dial_code": "+975", "code": "BT", "flag": "bt" }, { "name": "Bolivia, Plurinational State of", "dial_code": "+591", "code": "BO", "flag": "bo" }, { "name": "Bosnia and Herzegovina", "dial_code": "+387", "code": "BA", "flag": "ba" }, { "name": "Botswana", "dial_code": "+267", "code": "BW", "flag": "bw" }, { "name": "Brazil", "dial_code": "+55", "code": "BR", "flag": "br" }, { "name": "British Indian Ocean Territory", "dial_code": "+246", "code": "IO", "flag": "io" }, { "name": "Brunei Darussalam", "dial_code": "+673", "code": "BN", "flag": "bn" }, { "name": "Bulgaria", "dial_code": "+359", "code": "BG", "flag": "bg" }, { "name": "Burkina Faso", "dial_code": "+226", "code": "BF", "flag": "bf" }, { "name": "Burundi", "dial_code": "+257", "code": "BI", "flag": "bi" }, { "name": "Cambodia", "dial_code": "+855", "code": "KH", "flag": "kh" }, { "name": "Cameroon", "dial_code": "+237", "code": "CM", "flag": "cm" }, { "name": "Canada", "dial_code": "+1", "code": "CA", "flag": "ca" }, { "name": "Cape Verde", "dial_code": "+238", "code": "CV", "flag": "cv" }, { "name": "Cayman Islands", "dial_code": "+345", "code": "KY", "flag": "ky" }, { "name": "Central African Republic", "dial_code": "+236", "code": "CF", "flag": "cf" }, { "name": "Chad", "dial_code": "+235", "code": "TD", "flag": "td" }, { "name": "Chile", "dial_code": "+56", "code": "CL", "flag": "cl" }, { "name": "China", "dial_code": "+86", "code": "CN", "flag": "cn" }, { "name": "Christmas Island", "dial_code": "+61", "code": "CX", "flag": "cx" }, { "name": "Cocos (Keeling) Islands", "dial_code": "+61", "code": "CC", "flag": "cc" }, { "name": "Colombia", "dial_code": "+57", "code": "CO", "flag": "co" }, { "name": "Comoros", "dial_code": "+269", "code": "KM", "flag": "km" }, { "name": "Congo", "dial_code": "+242", "code": "CG", "flag": "cg" }, { "name": "Congo, The Democratic Republic of the", "dial_code": "+243", "code": "CD", "flag": "cd" }, { "name": "Cook Islands", "dial_code": "+682", "code": "CK", "flag": "ck" }, { "name": "Costa Rica", "dial_code": "+506", "code": "CR", "flag": "cr" }, { "name": "Cote d'Ivoire", "dial_code": "+225", "code": "CI", "flag": "ci" }, { "name": "Croatia", "dial_code": "+385", "code": "HR", "flag": "hr" }, { "name": "Cuba", "dial_code": "+53", "code": "CU", "flag": "cu" }, { "name": "Cyprus", "dial_code": "+357", "code": "CY", "flag": "cy" }, { "name": "Czech Republic", "dial_code": "+420", "code": "CZ", "flag": "cz" }, { "name": "Denmark", "dial_code": "+45", "code": "DK", "flag": "dk" }, { "name": "Djibouti", "dial_code": "+253", "code": "DJ", "flag": "dj" }, { "name": "Dominica", "dial_code": "+1767", "code": "DM", "flag": "dm" }, { "name": "Dominican Republic", "dial_code": "+1849", "code": "DO", "flag": "do" }, { "name": "Ecuador", "dial_code": "+593", "code": "EC", "flag": "ec" }, { "name": "Egypt", "dial_code": "+20", "code": "EG", "flag": "eg" }, { "name": "El Salvador", "dial_code": "+503", "code": "SV", "flag": "sv" }, { "name": "Equatorial Guinea", "dial_code": "+240", "code": "GQ", "flag": "gq" }, { "name": "Eritrea", "dial_code": "+291", "code": "ER", "flag": "er" }, { "name": "Estonia", "dial_code": "+372", "code": "EE", "flag": "ee" }, { "name": "Ethiopia", "dial_code": "+251", "code": "ET", "flag": "et" }, { "name": "Falkland Islands (Malvinas)", "dial_code": "+500", "code": "FK", "flag": "fk" }, { "name": "Faroe Islands", "dial_code": "+298", "code": "FO", "flag": "fo" }, { "name": "Fiji", "dial_code": "+679", "code": "FJ", "flag": "fj" }, { "name": "Finland", "dial_code": "+358", "code": "FI", "flag": "fi" }, { "name": "France", "dial_code": "+33", "code": "FR", "flag": "fr" }, { "name": "French Guiana", "dial_code": "+594", "code": "GF", "flag": "gf" }, { "name": "French Polynesia", "dial_code": "+689", "code": "PF", "flag": "pf" }, { "name": "Gabon", "dial_code": "+241", "code": "GA", "flag": "ga" }, { "name": "Gambia", "dial_code": "+220", "code": "GM", "flag": "gm" }, { "name": "Georgia", "dial_code": "+995", "code": "GE", "flag": "ge" }, { "name": "Germany", "dial_code": "+49", "code": "DE", "flag": "de" }, { "name": "Ghana", "dial_code": "+233", "code": "GH", "flag": "gh" }, { "name": "Gibraltar", "dial_code": "+350", "code": "GI", "flag": "gi" }, { "name": "Greece", "dial_code": "+30", "code": "GR", "flag": "gr" }, { "name": "Greenland", "dial_code": "+299", "code": "GL", "flag": "gl" }, { "name": "Grenada", "dial_code": "+1473", "code": "GD", "flag": "gd" }, { "name": "Guadeloupe", "dial_code": "+590", "code": "GP", "flag": "gp" }, { "name": "Guam", "dial_code": "+1671", "code": "GU", "flag": "gu" }, { "name": "Guatemala", "dial_code": "+502", "code": "GT", "flag": "gt" }, { "name": "Guernsey", "dial_code": "+44", "code": "GG", "flag": "gg" }, { "name": "Guinea", "dial_code": "+224", "code": "GN", "flag": "gn" }, { "name": "Guinea-Bissau", "dial_code": "+245", "code": "GW", "flag": "gw" }, { "name": "Guyana", "dial_code": "+595", "code": "GY", "flag": "gy" }, { "name": "Haiti", "dial_code": "+509", "code": "HT", "flag": "ht" }, { "name": "Holy See (Vatican City State)", "dial_code": "+379", "code": "VA", "flag": "va" }, { "name": "Honduras", "dial_code": "+504", "code": "HN", "flag": "hn" }, { "name": "Hong Kong", "dial_code": "+852", "code": "HK", "flag": "hk" }, { "name": "Hungary", "dial_code": "+36", "code": "HU", "flag": "hu" }, { "name": "Iceland", "dial_code": "+354", "code": "IS", "flag": "is" }, { "name": "India", "dial_code": "+91", "code": "IN", "preferred": true, "flag": "in" }, { "name": "Indonesia", "dial_code": "+62", "code": "ID", "flag": "id" }, { "name": "Iran, Islamic Republic of", "dial_code": "+98", "code": "IR", "flag": "ir" }, { "name": "Iraq", "dial_code": "+964", "code": "IQ", "flag": "iq" }, { "name": "Ireland", "dial_code": "+353", "code": "IE", "flag": "ie" }, { "name": "Isle of Man", "dial_code": "+44", "code": "IM", "flag": "im" }, { "name": "Israel", "dial_code": "+972", "code": "IL", "flag": "il" }, { "name": "Italy", "dial_code": "+39", "code": "IT", "flag": "it" }, { "name": "Jamaica", "dial_code": "+1876", "code": "JM", "flag": "jm" }, { "name": "Japan", "dial_code": "+81", "code": "JP", "flag": "jp" }, { "name": "Jersey", "dial_code": "+44", "code": "JE", "flag": "je" }, { "name": "Jordan", "dial_code": "+962", "code": "JO", "flag": "jo" }, { "name": "Kazakhstan", "dial_code": "+77", "code": "KZ", "flag": "kz" }, { "name": "Kenya", "dial_code": "+254", "code": "KE", "flag": "ke" }, { "name": "Kiribati", "dial_code": "+686", "code": "KI", "flag": "ki" }, { "name": "Korea, Democratic People's Republic of", "dial_code": "+850", "code": "KP", "flag": "kp" }, { "name": "Korea, Republic of", "dial_code": "+82", "code": "KR", "flag": "kr" }, { "name": "Kuwait", "dial_code": "+965", "code": "KW", "flag": "kw" }, { "name": "Kyrgyzstan", "dial_code": "+996", "code": "KG", "flag": "kg" }, { "name": "Lao People's Democratic Republic", "dial_code": "+856", "code": "LA", "flag": "la" }, { "name": "Latvia", "dial_code": "+371", "code": "LV", "flag": "lv" }, { "name": "Lebanon", "dial_code": "+961", "code": "LB", "flag": "lb" }, { "name": "Lesotho", "dial_code": "+266", "code": "LS", "flag": "ls" }, { "name": "Liberia", "dial_code": "+231", "code": "LR", "flag": "lr" }, { "name": "Libyan Arab Jamahiriya", "dial_code": "+218", "code": "LY", "flag": "ly" }, { "name": "Liechtenstein", "dial_code": "+423", "code": "LI", "flag": "li" }, { "name": "Lithuania", "dial_code": "+370", "code": "LT", "flag": "lt" }, { "name": "Luxembourg", "dial_code": "+352", "code": "LU", "flag": "lu" }, { "name": "Macao", "dial_code": "+853", "code": "MO", "flag": "mo" }, { "name": "Macedonia, The Former Yugoslav Republic of", "dial_code": "+389", "code": "MK", "flag": "mk" }, { "name": "Madagascar", "dial_code": "+261", "code": "MG", "flag": "mg" }, { "name": "Malawi", "dial_code": "+265", "code": "MW", "flag": "mw" }, { "name": "Malaysia", "dial_code": "+60", "code": "MY", "flag": "my" }, { "name": "Maldives", "dial_code": "+960", "code": "MV", "flag": "mv" }, { "name": "Mali", "dial_code": "+223", "code": "ML", "flag": "ml" }, { "name": "Malta", "dial_code": "+356", "code": "MT", "flag": "mt" }, { "name": "Marshall Islands", "dial_code": "+692", "code": "MH", "flag": "mh" }, { "name": "Martinique", "dial_code": "+596", "code": "MQ", "flag": "mq" }, { "name": "Mauritania", "dial_code": "+222", "code": "MR", "flag": "mr" }, { "name": "Mauritius", "dial_code": "+230", "code": "MU", "flag": "mu" }, { "name": "Mayotte", "dial_code": "+262", "code": "YT", "flag": "yt" }, { "name": "Mexico", "dial_code": "+52", "code": "MX", "flag": "mx" }, { "name": "Micronesia, Federated States of", "dial_code": "+691", "code": "FM", "flag": "fm" }, { "name": "Moldova, Republic of", "dial_code": "+373", "code": "MD", "flag": "md" }, { "name": "Monaco", "dial_code": "+377", "code": "MC", "flag": "mc" }, { "name": "Mongolia", "dial_code": "+976", "code": "MN", "flag": "mn" }, { "name": "Montenegro", "dial_code": "+382", "code": "ME", "flag": "me" }, { "name": "Montserrat", "dial_code": "+1664", "code": "MS", "flag": "ms" }, { "name": "Morocco", "dial_code": "+212", "code": "MA", "flag": "ma" }, { "name": "Mozambique", "dial_code": "+258", "code": "MZ", "flag": "mz" }, { "name": "Myanmar", "dial_code": "+95", "code": "MM", "flag": "mm" }, { "name": "Namibia", "dial_code": "+264", "code": "NA", "flag": "na" }, { "name": "Nauru", "dial_code": "+674", "code": "NR", "flag": "nr" }, { "name": "Nepal", "dial_code": "+977", "code": "NP", "flag": "np" }, { "name": "Netherlands", "dial_code": "+31", "code": "NL", "flag": "nl" }, { "name": "Netherlands Antilles", "dial_code": "+599", "code": "AN", "flag": "an" }, { "name": "New Caledonia", "dial_code": "+687", "code": "NC", "flag": "nc" }, { "name": "New Zealand", "dial_code": "+64", "code": "NZ", "flag": "nz" }, { "name": "Nicaragua", "dial_code": "+505", "code": "NI", "flag": "ni" }, { "name": "Niger", "dial_code": "+227", "code": "NE", "flag": "ne" }, { "name": "Nigeria", "dial_code": "+234", "code": "NG", "flag": "ng" }, { "name": "Niue", "dial_code": "+683", "code": "NU", "flag": "nu" }, { "name": "Norfolk Island", "dial_code": "+672", "code": "NF", "flag": "nf" }, { "name": "Northern Mariana Islands", "dial_code": "+1670", "code": "MP", "flag": "mp" }, { "name": "Norway", "dial_code": "+47", "code": "NO", "flag": "no" }, { "name": "Oman", "dial_code": "+968", "code": "OM", "flag": "om" }, { "name": "Pakistan", "dial_code": "+92", "code": "PK", "flag": "pk" }, { "name": "Palau", "dial_code": "+680", "code": "PW", "flag": "pw" }, { "name": "Palestinian Territory, Occupied", "dial_code": "+970", "code": "PS", "flag": "ps" }, { "name": "Panama", "dial_code": "+507", "code": "PA", "flag": "pa" }, { "name": "Papua New Guinea", "dial_code": "+675", "code": "PG", "flag": "pg" }, { "name": "Paraguay", "dial_code": "+595", "code": "PY", "flag": "py" }, { "name": "Peru", "dial_code": "+51", "code": "PE", "flag": "pe" }, { "name": "Philippines", "dial_code": "+63", "code": "PH", "flag": "ph" }, { "name": "Pitcairn", "dial_code": "+872", "code": "PN", "flag": "pn" }, { "name": "Poland", "dial_code": "+48", "code": "PL", "flag": "pl" }, { "name": "Portugal", "dial_code": "+351", "code": "PT", "flag": "pt" }, { "name": "Puerto Rico", "dial_code": "+1939", "code": "PR", "flag": "pr" }, { "name": "Qatar", "dial_code": "+974", "code": "QA", "flag": "qa" }, { "name": "Romania", "dial_code": "+40", "code": "RO", "flag": "ro" }, { "name": "Russia", "dial_code": "+7", "code": "RU", "flag": "ru" }, { "name": "Rwanda", "dial_code": "+250", "code": "RW", "flag": "rw" }, { "name": "Réunion", "dial_code": "+262", "code": "RE", "flag": "re" }, { "name": "Saint Barthélemy", "dial_code": "+590", "code": "BL", "flag": "bl" }, { "name": "Saint Helena, Ascension and Tristan Da Cunha", "dial_code": "+290", "code": "SH", "flag": "sh" }, { "name": "Saint Kitts and Nevis", "dial_code": "+1869", "code": "KN", "flag": "kn" }, { "name": "Saint Lucia", "dial_code": "+1758", "code": "LC", "flag": "lc" }, { "name": "Saint Martin", "dial_code": "+590", "code": "MF", "flag": "mf" }, { "name": "Saint Pierre and Miquelon", "dial_code": "+508", "code": "PM", "flag": "pm" }, { "name": "Saint Vincent and the Grenadines", "dial_code": "+1784", "code": "VC", "flag": "vc" }, { "name": "Samoa", "dial_code": "+685", "code": "WS", "flag": "ws" }, { "name": "San Marino", "dial_code": "+378", "code": "SM", "flag": "sm" }, { "name": "Sao Tome and Principe", "dial_code": "+239", "code": "ST", "flag": "st" }, { "name": "Saudi Arabia", "dial_code": "+966", "code": "SA", "flag": "sa" }, { "name": "Senegal", "dial_code": "+221", "code": "SN", "flag": "sn" }, { "name": "Serbia", "dial_code": "+381", "code": "RS", "flag": "rs" }, { "name": "Seychelles", "dial_code": "+248", "code": "SC", "flag": "sc" }, { "name": "Sierra Leone", "dial_code": "+232", "code": "SL", "flag": "sl" }, { "name": "Singapore", "dial_code": "+65", "code": "SG", "flag": "sg" }, { "name": "Slovakia", "dial_code": "+421", "code": "SK", "flag": "sk" }, { "name": "Slovenia", "dial_code": "+386", "code": "SI", "flag": "si" }, { "name": "Solomon Islands", "dial_code": "+677", "code": "SB", "flag": "sb" }, { "name": "Somalia", "dial_code": "+252", "code": "SO", "flag": "so" }, { "name": "South Africa", "dial_code": "+27", "code": "ZA", "flag": "za" }, { "name": "South Georgia and the South Sandwich Islands", "dial_code": "+500", "code": "GS", "flag": "gs" }, { "name": "Spain", "dial_code": "+34", "code": "ES", "flag": "es" }, { "name": "Sri Lanka", "dial_code": "+94", "code": "LK", "flag": "lk" }, { "name": "Sudan", "dial_code": "+249", "code": "SD", "flag": "sd" }, { "name": "Suriname", "dial_code": "+597", "code": "SR", "flag": "sr" }, { "name": "Svalbard and Jan Mayen", "dial_code": "+47", "code": "SJ", "flag": "sj" }, { "name": "Swaziland", "dial_code": "+268", "code": "SZ", "flag": "sz" }, { "name": "Sweden", "dial_code": "+46", "code": "SE", "flag": "se" }, { "name": "Switzerland", "dial_code": "+41", "code": "CH", "flag": "ch" }, { "name": "Syrian Arab Republic", "dial_code": "+963", "code": "SY", "flag": "sy" }, { "name": "Taiwan, Province of China", "dial_code": "+886", "code": "TW", "flag": "tw" }, { "name": "Tajikistan", "dial_code": "+992", "code": "TJ", "flag": "tj" }, { "name": "Tanzania, United Republic of", "dial_code": "+255", "code": "TZ", "flag": "tz" }, { "name": "Thailand", "dial_code": "+66", "code": "TH", "flag": "th" }, { "name": "Timor-Leste", "dial_code": "+670", "code": "TL", "flag": "tl" }, { "name": "Togo", "dial_code": "+228", "code": "TG", "flag": "tg" }, { "name": "Tokelau", "dial_code": "+690", "code": "TK", "flag": "tk" }, { "name": "Tonga", "dial_code": "+676", "code": "TO", "flag": "to" }, { "name": "Trinidad and Tobago", "dial_code": "+1868", "code": "TT", "flag": "tt" }, { "name": "Tunisia", "dial_code": "+216", "code": "TN", "flag": "tn" }, { "name": "Turkey", "dial_code": "+90", "code": "TR", "flag": "tr" }, { "name": "Turkmenistan", "dial_code": "+993", "code": "TM", "flag": "tm" }, { "name": "Turks and Caicos Islands", "dial_code": "+1649", "code": "TC", "flag": "tc" }, { "name": "Tuvalu", "dial_code": "+688", "code": "TV", "flag": "tv" }, { "name": "Uganda", "dial_code": "+258", "code": "UG", "flag": "ug" }, { "name": "Ukraine", "dial_code": "+380", "code": "UA", "flag": "ua" }, { "name": "United Arab Emirates", "dial_code": "+971", "code": "AE", "preferred": true, "flag": "ae" }, { "name": "United Kingdom", "dial_code": "+44", "code": "GB", "preferred": true, "flag": "gb" }, { "name": "United States", "dial_code": "+1", "code": "US", "preferred": true, "flag": "us" }, { "name": "Uruguay", "dial_code": "+598", "code": "UY", "flag": "uy" }, { "name": "Uzbekistan", "dial_code": "+998", "code": "UZ", "flag": "uz" }, { "name": "Vanuatu", "dial_code": "+678", "code": "VU", "flag": "vu" }, { "name": "Venezuela, Bolivarian Republic of", "dial_code": "+58", "code": "VE", "flag": "ve" }, { "name": "Viet Nam", "dial_code": "+84", "code": "VN", "flag": "vn" }, { "name": "Virgin Islands, British", "dial_code": "+1284", "code": "VG", "flag": "vg" }, { "name": "Virgin Islands, U.S.", "dial_code": "+1340", "code": "VI", "flag": "vi" }, { "name": "Wallis and Futuna", "dial_code": "+681", "code": "WF", "flag": "wf" }, { "name": "Yemen", "dial_code": "+967", "code": "YE", "flag": "ye" }, { "name": "Zambia", "dial_code": "+260", "code": "ZM", "flag": "zm" }, { "name": "Zimbabwe", "dial_code": "+263", "code": "ZW", "flag": "zw" }, { "name": "Åland Islands", "dial_code": "+358", "code": "AX", "flag": "ax" }]
  loadingState=false
  tgl_changed=false
  constructor(
    private wilayahService : WilayahService,
    private fb: FormBuilder,
    private el: ElementRef,
    private store : Store<fromApp.PrivateAppState>,
    private activatedRoute: ActivatedRoute,
    private spinner : NgxSpinnerService,
    private aes:AESService,
    private auth:AuthService,
    private ValidateService:ValidateService
  ) {
    this.getState = this.store.select('pasien_dataPasien')
  }
  keyGen:any
  ngOnInit(): void {
    let auth=localStorage.getItem('currentUser')?JSON.parse(localStorage.getItem('currentUser')):null
    this.keyGen=auth?this.aes.getKeyLogin(auth):''
    this.formTambah = this.fb.group({
      no_rm : ["", []],
      jenis_kelamin : ["", [Validators.required]],
      nik : ["", [Validators.required]],
      tgl_lahir : ["", [Validators.required]],
      tanggal_daftar:["", [Validators.required]],
      nama : ["", [Validators.required]],
      no_bpjs : ["", []],
      golongan_darah : ["", []],
      no_hp : ["", [Validators.required]],
      nama_panggilan : ["SDR", []],
      tempat_lahir : ["", []],
      agama : ["", []],
      status_perkawinan : ["", []],
      pekerjaan : ["", []],
      kewarganegaraan : ["", []],
      status_bpjs : ["0", []],
      jenis_alamat: ["ktp", []],
      alamat_ktp : ["", [Validators.required]],
      alamat_domisili : ["", []],
      dial_code:[null,[Validators.required]],
      isDomisili:[false, []],
    })
    this.activatedRoute.params.subscribe((params : Params) => {
      if(params) {
        this.spinner.show('spinner1')
        this.store.dispatch( PasienActions.getByIdInitial({ payload : { id : params.id } }) )
      }
    })
  
    this.getState.subscribe((state) => {
      this.pasien = state.pasien
      this.errorMessage = state.errorMessage
      this.submitButton = state.submitButton
      this.isLoadingButton = state.isLoadingButton
      this.isEdit = state.isEdit
      if(this.isEdit === true) {
        this.formTambah.patchValue({
          no_rm : this.pasien.full_rm,
          jenis_kelamin : this.pasien.jenis_kelamin,
          no_bpjs : this.pasien.no_bpjs,
          golongan_darah : this.pasien.golongan_darah ? this.pasien.golongan_darah : "",
          nik : this.aes.decrypt(this.pasien.nik,this.keyGen.key,this.keyGen.iv,256),
          no_hp :this.aes.decrypt(this.pasien.no_hp,this.keyGen.key,this.keyGen.iv,256),
          nama_panggilan : this.pasien.nama_panggilan,
          tempat_lahir : this.pasien.tempat_lahir,
          tgl_lahir :new Date(this.aes.decrypt(this.pasien.tgl_lahir,this.keyGen.key,this.keyGen.iv,256)),
          agama : this.pasien.agama ? this.pasien.agama : "",
          status_perkawinan : this.pasien.status_perkawinan ? this.pasien.status_perkawinan : "",
          pekerjaan : this.pasien.pekerjaan ? this.pasien.pekerjaan : "",
          kewarganegaraan : this.pasien.kewarganegaraan ? this.pasien.kewarganegaraan : "",
          nama : this.pasien.nama,
          status_bpjs : this.pasien.status_bpjs ? this.pasien.status_bpjs : "0",
          jenis_alamat : this.pasien.jenis_alamat,
          dial_code: this.pasien.kode_phone!=''?this.pasien.kode_phone:'+62',
          tanggal_daftar:moment(this.pasien.tanggal_daftar).format("DD-MM-YYYY")
        })
        this.tgl_changed=false
        if (this.pasien.alamat !== undefined ) {
          if(typeof this.pasien.alamat.ktp === 'object') {
            this.formTambah.patchValue({
              alamat_ktp : this.pasien.alamat.ktp.alamat ? this.aes.decrypt(this.pasien.alamat.ktp.alamat,this.keyGen.key,this.keyGen.iv,256) : "",
            })
            this.idProvinsiKtp = this.pasien.alamat.ktp.id_province;
            this.listProvinsiKtp = [ { id : this.idProvinsiKtp, name : this.pasien.alamat.ktp.province }]
            this.idKabupatenKtp = this.pasien.alamat.ktp.id_regency
            this.listKabupatenKtp = [ { id: this.idKabupatenKtp, name : this.pasien.alamat.ktp.regency } ]
            this.idKecamatanKtp = this.pasien.alamat.ktp.id_district
            this.listKecamatanKtp = [ { id : this.idKecamatanKtp, name : this.pasien.alamat.ktp.district } ]
            this.idDesaKtp = this.pasien.alamat.ktp.id_village
            this.listDesaKtp = [ { id : this.idDesaKtp, name : this.pasien.alamat.ktp.village } ]
          }
          if(typeof this.pasien.alamat.domisili === 'object') {
            this.formTambah.patchValue({
              alamat_domisili : this.pasien.alamat.domisili.alamat ? this.aes.decrypt(this.pasien.alamat.domisili.alamat,this.keyGen.key,this.keyGen.iv,256) : "",
              isDomisili:true
            })
            this.checkboxAlamatDomisili =true
            this.idProvinsiDomisili = this.pasien.alamat.domisili.id_province
            this.listProvinsiDomisili = [ { id : this.idProvinsiDomisili, name : this.pasien.alamat.domisili.province }]
            this.idKabupatenDomisili = this.pasien.alamat.domisili.id_regency
            this.listKabupatenDomisili = [ { id : this.idKabupatenDomisili, name : this.pasien.alamat.domisili.regency }]
            this.idKecamatanDomisili = this.pasien.alamat.domisili.id_district
            this.listKecamatanDomisili = [ { id : this.idKecamatanDomisili, name : this.pasien.alamat.domisili.district }]
            this.idDesaDomisili = this.pasien.alamat.domisili.id_village
            this.listDesaDomisili = [ { id : this.idDesaDomisili, name : this.pasien.alamat.domisili.village }]
          }

        }
        setTimeout(() => {
          this.spinner.hide('spinner1')
        }, 400);
        
      }
    })
  }
  isNumber(val){
    return this.ValidateService.Number(val)
  }
  setJenis(val){
    if (val=='domisili') {
      this.checkboxAlamatDomisili = true
    } else {
      this.checkboxAlamatDomisili = false
    }
  }
  prosesSelectState(event: any, aksi: string) {
    this.loadingState = true
 

    if (aksi == 'search') {
        let arr = []
        this.listState.map((val) => {
            if (val.name.search(event)) {
                arr.push(val)
            }
        })
        this.listState = arr
    }
    this.loadingState = false
  }
  onFocus(id){
    document.getElementById(id).click()
  }
  changeTglLahir(){
    this.tgl_changed=true
  }
  SubmitForm() {
    this.submitted = false
    setTimeout(() => { this.submitted = true }, 200)

    if (this.formTambah.invalid) {
      for (const key of Object.keys(this.formTambah.controls)) {
        if (this.formTambah.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus()
          break;
        }
      }
      return
    }
    this.spinner.show('spinner1')
    let payload=new PasienPayload;
    
    payload.id_pasien = this.pasien.id_pasien
    payload.no_rm =this.pasien.no_rm
    payload.no_bpjs =  this.formTambah.value.no_bpjs
    payload.status_bpjs = this.formTambah.value.status_bpjs
    payload.no_hp = this.formTambah.value.no_hp.toString().substr(0, 1) == '0' ? this.formTambah.value.no_hp.toString().substr(1, this.formTambah.value.no_hp.length) : this.formTambah.value.no_hp
    payload.no_hp=this.aes.encrypt(payload.no_hp,this.keyGen.key,this.keyGen.iv,256)
    payload.nik = this.aes.encrypt(this.formTambah.value.nik,this.keyGen.key,this.keyGen.iv,256)
    payload.nama = this.formTambah.value.nama
    payload.nama_panggilan = this.formTambah.value.nama_panggilan
    payload.tempat_lahir = this.formTambah.value.tempat_lahir
    payload.tgl_lahir =moment(new Date(this.formTambah.value.tgl_lahir)).format("YYYY-MM-DD")
    payload.tgl_lahir=this.aes.encrypt(payload.tgl_lahir,this.keyGen.key,this.keyGen.iv,256)
    payload.jenis_kelamin = this.formTambah.value.jenis_kelamin
    payload.golongan_darah = this.formTambah.value.golongan_darah
    payload.agama = this.formTambah.value.agama
    payload.status_perkawinan = this.formTambah.value.status_perkawinan
    payload.pekerjaan = this.formTambah.value.pekerjaan
    payload.kewarganegaraan = this.formTambah.value.kewarganegaraan
    payload.jenis_alamat = 'ktp'
    payload.alamat = new Alamat
    payload.alamat.ktp = new AlamatKtp
    payload.alamat.ktp.alamat = this.formTambah.value.alamat_ktp!=''?this.aes.encrypt(this.formTambah.value.alamat_ktp,this.keyGen.key,this.keyGen.iv,256):''
    payload.alamat.ktp.id_pasien_alamat = this.pasien.alamat.ktp.id_pasien_alamat?this.pasien.alamat.ktp.id_pasien_alamat:null
    payload.alamat.ktp.id_province = this.idProvinsiKtp
    payload.alamat.ktp.id_regency = this.idKabupatenKtp
    payload.alamat.ktp.id_district = this.idKecamatanKtp
    payload.alamat.ktp.id_village = this.idDesaKtp
    payload.alamat.ktp.jenis_alamat = 'ktp'
    payload.alamat.ktp.id_pasien = this.pasien.id_pasien
    payload.kode_phone=this.formTambah.value.dial_code
    payload.tanggal_daftar=this.formTambah.value.tanggal_daftar
    if(this.checkboxAlamatDomisili == true) {
      payload.alamat.domisili = new AlamatDomisili
      payload.alamat.domisili.alamat = this.formTambah.value.alamat_domisili!=''?this.aes.encrypt(this.formTambah.value.alamat_domisili,this.keyGen.key,this.keyGen.iv,256):''
      payload.alamat.domisili.id_pasien = this.pasien.id_pasien;
      payload.alamat.domisili.id_pasien_alamat = this.pasien.alamat.domisili.id_pasien_alamat?this.pasien.alamat.domisili.id_pasien_alamat:null;
      payload.alamat.domisili.id_province = this.idProvinsiDomisili
      payload.alamat.domisili.id_regency = this.idKabupatenDomisili
      payload.alamat.domisili.id_district = this.idKecamatanDomisili
      payload.alamat.domisili.id_village = this.idDesaDomisili
      payload.alamat.domisili.jenis_alamat = 'domisili'
      payload.jenis_alamat ='domisili'
    }

    this.store.dispatch( PasienActions.updateInitial({ payload : payload }) )
    setTimeout(() => {
      this.spinner.hide('spinner1')
    }, 400);
  }
  changeCheckboxAlamatDomisili(event : any) {
    if (event.target.checked) {
      this.checkboxAlamatDomisili = true
    } else {
      this.checkboxAlamatDomisili = false
    }
  }
  changeProvinsi(tipe : TipeAlamat) {
    if(tipe == this.tipeAlamat.KTP) {
      this.idKabupatenKtp = null
      this.idKecamatanKtp = null
      this.idDesaKtp = null
    } else {
      this.idKabupatenDomisili = null
      this.idKecamatanDomisili = null
      this.idDesaDomisili = null
    }
  }
  changeKabupaten(tipe : TipeAlamat) {
    if(tipe == this.tipeAlamat.KTP) {
      this.idKecamatanKtp = null
      this.idDesaKtp = null
    } else {
      this.idKecamatanDomisili = null
      this.idDesaDomisili = null
    }
  }
  changeKecamatan(tipe: TipeAlamat) {
    if(tipe == this.tipeAlamat.KTP) {
      this.idDesaKtp = null
    } else {
      this.idDesaDomisili = null
    }
  }

  paramSelectOption (event : any, aksi : string, tipe : TipeAlamat, wilayah : string) {
    let param

    if (wilayah == 'provinsi' && tipe == this.tipeAlamat.KTP) {
      param = this.paramProvinsiKtp
    } else if (wilayah == 'kabupaten' && tipe == this.tipeAlamat.KTP) {
      param = this.paramKabupatenKtp
    } else if (wilayah == 'kecamatan' && tipe == this.tipeAlamat.KTP) {
      param = this.paramKecamatanKtp
    } else if (wilayah == 'desa' && tipe == this.tipeAlamat.KTP) {
      param = this.paramDesaKtp
    } else if (wilayah == 'provinsi' && tipe == this.tipeAlamat.DOMISILI) {
      param = this.paramProvinsiDomisili
    } else if (wilayah == 'kabupaten' && tipe == this.tipeAlamat.DOMISILI) {
      param = this.paramKabupatenDomisili
    } else if (wilayah == 'kecamatan' && tipe == this.tipeAlamat.DOMISILI) {
      param = this.paramKecamatanDomisili
    } else if (wilayah == 'desa' && tipe == this.tipeAlamat.DOMISILI) {
      param = this.paramDesaDomisili
    }

    if (aksi == 'search')
		{
			this.listDesaDomisili,this.listDesaKtp,this.listKabupatenDomisili,this.listKabupatenKtp,this.listKecamatanDomisili
      ,this.listKecamatanKtp,this.listProvinsiDomisili,this.listProvinsiKtp=[]
			param.search = event.term
			param.last_data="0"
		}
		else
		{
			param.search = ""
		}
		
		if(aksi=="last_page"){
			let last=param.last_data+param.get_data
			param.last_data=last
		}else{
			param.last_data=0
		}
    return param
  }

  prosesSelectProvinsi(event : any, aksi : string, tipe : TipeAlamat) {
    let param = this.paramSelectOption(event, aksi, tipe, 'provinsi')
    this.wilayahService.prosesSelectOptionProvinsi(param, aksi)
    .subscribe(res =>{
      if(tipe == this.tipeAlamat.KTP) {
        this.listProvinsiKtp = res.response
      } else {
        this.listProvinsiDomisili = res.response
      }
    })
  }
  prosesSelectKabupaten(event : any, aksi : string, tipe : TipeAlamat) {
    let idProvinsi
    if(tipe == this.tipeAlamat.KTP) {
      idProvinsi = this.idProvinsiKtp
    } else {
      idProvinsi = this.idProvinsiDomisili
    }
    let param = this.paramSelectOption(event, aksi, tipe, 'kabupaten')
    this.wilayahService.prosesSelectOptionKabupaten(param, aksi, idProvinsi)
    .subscribe(res => {
      if(tipe == this.tipeAlamat.KTP) {
        this.listKabupatenKtp = res.response
      } else {
        this.listKabupatenDomisili = res.response
      }
    })
  }
  prosesSelectKecamatan(event : any, aksi : string, tipe : TipeAlamat) {
    let idKabupaten
    if(tipe == this.tipeAlamat.KTP) {
      idKabupaten = this.idKabupatenKtp
    } else {
      idKabupaten = this.idKabupatenDomisili
    }
    let param = this.paramSelectOption(event, aksi, tipe, 'kecamatan')
    this.wilayahService.prosesSelectOptionKecamatan(param, aksi, idKabupaten)
    .subscribe(res => {
      if (tipe == this.tipeAlamat.KTP) {
        this.listKecamatanKtp = res.response
      } else {
        this.listKecamatanDomisili = res.response
      }
    })
  }
  prosesSelectDesa(event : any, aksi : string, tipe : TipeAlamat) {
    let idKecamatan
    if(tipe == this.tipeAlamat.KTP) {
      idKecamatan = this.idKecamatanKtp
    } else {
      idKecamatan = this.idKecamatanDomisili
    }
    let param = this.paramSelectOption(event, aksi, tipe, 'desa')
    this.wilayahService.prosesSelectOptionDesa(param, aksi, idKecamatan)
    .subscribe(res => {
      if (tipe == this.tipeAlamat.KTP) {
        this.listDesaKtp = res.response
      } else {
        this.listDesaDomisili = res.response
      }
    })
  }

}

