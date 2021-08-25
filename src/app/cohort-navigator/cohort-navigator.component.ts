import { Component, OnInit } from '@angular/core';
import { userRole } from 'app/common/types';
import { HomeViewService } from 'app/util/home-view.service';

@Component({
  selector: 'app-cohort-navigator',
  templateUrl: './cohort-navigator.component.html',
  styleUrls: ['./cohort-navigator.component.scss']
})
export class CohortNavigatorComponent implements OnInit {

  constructor(
    public homeViewService: HomeViewService
  ) {
  }

  ngOnInit(): void {
  }

  getCohorts(){
    // get user's roles. extract cohorts from it.
    const roles: userRole[] = [
      {id:1,userId:1,roleId:1,cohort:'216'},
      {id:2,userId:1,roleId:1,cohort:'214'},
      {id:3,userId:1,roleId:5,cohort:'209'},
    ];
    // maps and filter out empty cohorts.
    return Array.from(new Set(roles.map(role => {return role.cohort;}).filter(el=>{return el?.length ?? false;})));
  }

  // tell service which dashboard we want to work with.
  async goTo(value:string){
    await this.homeViewService.navigate(value);
  }

  getClass(location:string){
    const content: any = {    };
    content[`${(location === this.homeViewService.getCurrentComponentTitle()) ? 'link-primary' : 'link-light'}`] = true;
    return content;
  }

}
