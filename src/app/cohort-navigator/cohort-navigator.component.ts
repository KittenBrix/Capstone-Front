import { Component, OnInit } from '@angular/core';
import { userRole } from 'app/common/types';

@Component({
  selector: 'app-cohort-navigator',
  templateUrl: './cohort-navigator.component.html',
  styleUrls: ['./cohort-navigator.component.scss']
})
export class CohortNavigatorComponent implements OnInit {

  currentContent: string = 'Dashboard';
  contentSelectors: string[] = [
    'Dashboard',
    'People',
    'Schedule',
    'Attendance',
    'Recordings',
    'gClass'
  ];
  constructor() { }

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
  goTo(value:string){
    // if (value == 'gClass'){
    //   // open new tab and navigate to current cohort's view.
    // }
    if (this.contentSelectors.includes(value)){
      this.currentContent = value;
    }
  }

  getClass(location:string){
    console.log(location)
    const content: any = {    };
    content[`${(location === this.currentContent) ? 'link-primary' : 'link-light'}`] = true;
    return content;
  }

}
