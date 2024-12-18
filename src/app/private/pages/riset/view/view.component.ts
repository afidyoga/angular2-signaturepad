import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RisetService } from 'src/app/private/services/riset.service';
import { concat, Observable, of, Subject, switchMap } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {
  @ViewChild('inputText') inputText: ElementRef
  people$: Observable<any>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  selectedPersons: Array<any> = <any>[];
  searchListTxt = new Subject<string>()
  constructor(
    private risetService : RisetService
  ) { }

  ngOnInit(): void {
    // this.loadPeople()
    // console.log(this.searchList)
  }

  trackByFn(item: any) {
      return item.id;
  }
  searchList(event : any) {
    // console.log(event.term)
    this.searchListTxt.next(event.term)
    this.searchListTxt.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((term: string) =>
              this.risetService.getProvinsiSelectOption({ search : term, last_data : 0, get_data : 10 })
              .pipe(
                map(res => { return res.response })))
    ).subscribe(anu => console.log(anu))

    // console.log(anu)
    // .pipe(
    //   switchMap(term =>
    //     this.risetService.getProvinsiSelectOption({ search : term, last_data : 0, get_data : 10 })
    //     .pipe(
    //       map(res => { return res.response }),
    //     )
    //   )
    // )

  }
  private loadPeople() {
    this.people$ = concat(
        of([]), // default items
        this.peopleInput$.pipe(
          debounceTime(100),
            // distinctUntilChanged(),
            tap(() => this.peopleLoading = true),
            switchMap((term: string) =>
              this.risetService.getProvinsiSelectOption({ search : term, last_data : 0, get_data : 10 })
              .pipe(
                map(res => { return res.response }),
                catchError(() => of([])), // empty list on error
                tap(() => this.peopleLoading = false)

              // this.dataService.getPeople(term).pipe(
              //   catchError(() => of([])), // empty list on error
              //   tap(() => this.peopleLoading = false)
              )
            )
        )
    );
  }

  CheckBtn() {
    console.log(this.inputText)
    // console.log('people$', this.people$)
    // console.log("peopleInput", this.peopleInput$)
    // this.people$ = concat(of([]), 'mukidi' )
    // this.peopleInput$.pipe(distinctUntilChanged(), tap(term => console.log(term) ))
  }



}


export interface ParamSelectOption {
  search : string | null | undefined
  last_data : 0 | number
  get_data : 10 | number
}
