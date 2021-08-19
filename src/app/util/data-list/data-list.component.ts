import { AfterViewInit } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';


export interface DataChangeEvent {
  type: 'add' | 'delete' | 'edit';
  content: any;
  index: number;
}



@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  contentType: string = '';
  @Input()
  datalist: any[] = [];
  
  @Output() 
  dataChanged = new EventEmitter<DataChangeEvent>();
  displayedColumns: string[] = [];
  @ViewChild(MatTable) table: MatTable<any> | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.datalist && this.datalist.length && !this.contentType){
      this.contentType = this.datalist[0].constructor.name;
    }
    this.displayedColumns = [...this.describeData(),'action'];
  }

  ngAfterViewInit(){
    // this.table = 
  }

  add(data:any): void {
    // add data to datalist
    this.dataChanged.emit({
      type: 'add',
      content: data,
      index: this.datalist.push(data)
    });
    if (this.table){
      this.table.renderRows();
    }
  }

  remove(item: any): void{
    console.log(item);
    const index = this.datalist.indexOf(item);
    if (index >= 0){
      // remove item from datalist at given index.
      const value = this.datalist.splice(index,1);
      this.dataChanged.emit({
        type: 'delete',
        content: value,
        index: index
      });
    }
    if (this.table){
      this.table.renderRows();
    } else {
      console.log('missing table');
    }
  }
  
  describeData(): string[] {
    const result: string[] = [];
    if (this.datalist.length){
      for (const key of Object.keys(this.datalist[0])){
        try{
          (Number.isNaN(Number(key))) ? result.push(key): undefined; 
        } catch (err){
          result.push(key);
        }
      }
    }
    return result;
  }

  getDataList(){
    return this.datalist;
  }

}
