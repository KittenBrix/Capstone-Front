import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DataChangeEvent } from 'app/common/types';



@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit, OnChanges {
  @Input()
  contentType: string = '';
  @Input()
  fields: string[] =[];
  @Input()
  datalist: any[] = [];
  @Input('canEditCallback')
  canEdit: (arg:any)=>boolean = (x:any)=>{return true;};
  @Input('canDeleteCallback')
  canDelete: (arg:any)=>boolean = (x:any)=>{return true;};
  
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
    this.displayedColumns = [...this.describeData(), 'action'];
    if (this.table){
      this.table.renderRows();
    }
  }

  remove(item: any): void{
    console.log(item);
    const index = this.datalist.indexOf(item);
    if (index >= 0){
      // remove item from datalist at given index.
      const value = this.datalist[index];
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
    if (this.fields.length){
      for (const item of this.fields){
        result.push(item);
      }
    } else if (this.datalist.length){
      for (const key of Object.keys(this.datalist[0])){
        try{
          (Number.isNaN(Number(key))) ? result.push(key): undefined; 
        } catch (err){
          result.push(key);
        }
      }
      this.fields = result;
    } 
    return result;
  }

  getDataList(){
    return this.datalist;
  }


  removable(element: any): boolean{
    return this.canDelete(element);
  }
}
