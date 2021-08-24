import { Component, OnInit } from '@angular/core';
import { convertKeysToStringArray, getKeyNamesFromDropDownEntryList } from 'app/common/algorithms';
import { DataChangeEvent, DropDownEntry, userRole, userRoleEnum } from 'app/common/types';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  rolesArray: userRole[] = []; //roleId => enum , cohort
  rolesFields: string[] = ['cohort'];
  rolesDropDowns: DropDownEntry[] = [
    {name:'roleId',options:convertKeysToStringArray(userRoleEnum)}
  ];
  constructor() { }

  ngOnInit(): void {
  }

  describeRoles():string[]{
    const data = [...this.rolesFields];
    data.push(...getKeyNamesFromDropDownEntryList(this.rolesDropDowns));
    return data;
  }

  async add(data: userRole, arr: any[]): Promise<void> {
    const event: DataChangeEvent = {
      type: 'add',
      content: data,
      index: arr.length
    };
    await RolesComponent.changeArray(arr,event);
  }

  async change(arr: any[],arg: DataChangeEvent){
    await RolesComponent.changeArray(arr, arg);
  }
  
  private static async changeArray(arr:any[], event:DataChangeEvent){
    if (event.type == 'add'){ // add an item. by default put it at end.
      arr.push(event.content)
    } else if (event.type == 'delete'){ //delete an item.
      const element = arr[event.index];
      if (element == event.content){
        arr.splice(event.index,1);
      } else {
        const index = arr.indexOf(event.content);
        if (index >= 0){
          arr.splice(index,1);
        }
        else{
          console.log("cant find that item.");
        }
      }
    } else {  //edit item
      console.log("can't handle edits yet.");
    }
  }
}
