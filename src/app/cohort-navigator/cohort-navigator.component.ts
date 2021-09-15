import { Component, OnInit } from '@angular/core';
import { userRole } from 'app/common/types';
import { HomeViewService } from 'app/services/home-view.service';

@Component({
  selector: 'app-cohort-navigator',
  templateUrl: './cohort-navigator.component.html',
  styleUrls: ['./cohort-navigator.component.scss']
})
export class CohortNavigatorComponent implements OnInit {
  private _cohort: any = null;


  constructor(
    public homeViewService: HomeViewService
  ) {
  }

  ngOnInit(): void {
    this.homeViewService.refreshRoles();
  }

  getCohorts(){
    return this.homeViewService.getCohorts();
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

  public set activeCohort(item : any) {
    this._cohort = item;
    this.homeViewService.activeCohort = item;
  }

  public get activeCohort() : any {
    return this.homeViewService.activeCohort;
  }
  
  

}
