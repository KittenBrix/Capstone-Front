import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {
  @Input()
  fields: string[] = [];
  _data: any = {};
  @Output()
  submit = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  create(){
    const data: any = {};
    for (const key of this.fields){
      data[key] = this._data[key];
    }
    this.submit.emit(data);
  }

}
