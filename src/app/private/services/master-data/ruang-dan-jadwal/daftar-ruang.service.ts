import { Injectable } from '@angular/core';
import { GeneralService } from '../../general.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, tap, mergeMap } from 'rxjs';
import { Constant } from 'src/app/config/constant'
import { ResponseApi } from 'src/app/core/models/response-api'

@Injectable({
  providedIn: 'root'
})
export class DaftarRuangService {

  constructor(
    private generalService : GeneralService,
    private http: HttpClient
  ) {
    this.URL_MODULE = this.generalService.getUrlModule(Constant.url_module.master)
  }
  URL_MODULE : string
  urlBaseName : string = 'data-ruang'

  getDataTables(param : any) {
    const url = this.URL_MODULE + '/' + this.urlBaseName + '/get-datatables'
    return this.http.post<ResponseApi>(url, param)
  }
  getAll(){
    const url = this.URL_MODULE + '/' + this.urlBaseName + '/get-all'
    return this.http.get<ResponseApi>(url)
  }
  insert(param : any) : Observable<ResponseApi> {
    const url = this.URL_MODULE + '/' + this.urlBaseName
    return this.http.post<ResponseApi>(url, param)
  }
  update(id: any, param : any) : Observable<ResponseApi> {
    const url = this.URL_MODULE + '/' + this.urlBaseName + '/' + id
    return this.http.put<ResponseApi>(url, param)
  }
  show(id: any) : Observable<ResponseApi> {
    const url = this.URL_MODULE + '/' + this.urlBaseName + '/get-byid/' + id
    return this.http.get<ResponseApi>(url)
  }
  delete(id: any) : Observable<ResponseApi> {
    const url = this.URL_MODULE + '/' + this.urlBaseName + '/' + id
    return this.http.delete<ResponseApi>(url)
  }

  getSelectOption(param : any) : Observable<ResponseApi> {
    const url = this.URL_MODULE + '/' + this.urlBaseName +  '/get-select-option'
    return this.http.post<ResponseApi>(url, param)
  }

  prosesSelectDaftarRuang(param : ParamSelectOption, action : string) : Observable<ResponseApi> {
    if (action == 'open') {
      param.search = ""
      param.get_data = 10
    } else if (action == 'last_page') {
      param.get_data = param.get_data + 10
    } else if (action == 'search') {
      param.get_data = 10
    }
    return this.getSelectOption(param)
  }

}

export interface ParamSelectOption {
  search : string | null | undefined
  last_data : 0 | number
  get_data : 10 | number
}
