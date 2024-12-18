import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/_modal';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {

  tabPane : Array<boolean> = [true, false]

  constructor(
    public modalService : ModalService
  ) { }

  ngOnInit(): void {
  }

  ShowTabPane(nomor : number) {
    this.tabPane.forEach((el, index) => {
      this.tabPane[index] = false
    });
    this.tabPane[nomor] = true
  }

  btnOpenModal() {
    this.modalService.open("modalFormContent");
  }
  btnCloseModal() {
    this.modalService.close("modalFormContent");
  }

}
