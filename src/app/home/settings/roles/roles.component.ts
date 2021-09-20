import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertKeysToStringArray, getKeyNamesFromDropDownEntryList } from 'app/common/algorithms';
import { DataChangeEvent, DropDownEntry, userRole, userRoleEnum } from 'app/common/types';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  rolesArray: userRole[] = []; //roleId => enum , cohort
  rolesFields: string[] = ['cohortid'];
  rolesDropDowns: DropDownEntry[] = [
    {name:'roleid',options:convertKeysToStringArray(userRoleEnum)}
  ];
  id: any = 0;
  sub: any = null;
  constructor(private restService: RestService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(async params => {
      this.id = +params['id'];
      await this.getData();
   });
  }

  describeRoles():string[]{
    const data = [...this.rolesFields];
    data.push(...getKeyNamesFromDropDownEntryList(this.rolesDropDowns));
    return data;
  }

  async add(data: userRole, arr: any[]): Promise<void> {
    data.roleid = Number(userRoleEnum[data.roleid]);
    const event: DataChangeEvent = {
      type: 'add',
      content: data,
      index: arr.length
    };
    await this.changeArray(arr,event);
  }

  async change(arr: any[],arg: DataChangeEvent){
    await this.changeArray(arr, arg);
  }
  
  private async changeArray(arr:any[], event:DataChangeEvent){
    if (event.type == 'add'){ // add an item. by default put it at end. 
      arr.push(event.content)
      event.content.userid = this.id;
      const data = await this.restService.req(`post`,`user/${this.id}/roles/`,event.content);
      if (data){
        arr.push(event.content);
      }

    } else if (event.type == 'delete'){ //delete an item.
      const element = arr[event.index];
      let item = element;
      if (element == event.content){
        arr.splice(event.index,1);
        const data = await this.restService.req('delete',`${event.field??'unknown'}/${item.id}`);
      } else {
        const index = arr.indexOf(event.content);
        if (index >= 0){
          item = arr.splice(index,1);
          const data = await this.restService.req('delete',`${event.field??'unknown'}/${item.id}`);
        }
        else{
          console.log("cant find that item.");
        }
      }
    } else {  //edit item
      console.log("can't handle edits yet.");
    }
    await this.getData();
  }

  async getData(){
    const data = (await this.restService.req('get',`user/${this.id}/roles/`))[0];
    console.log("role data ....", data);
    this.rolesArray = data;
  }
}
