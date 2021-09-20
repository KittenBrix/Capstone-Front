import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  people: any[] = [];
  _cohort:number;
  cohortChangeListener: any;
  constructor(public homeService:HomeViewService, public restService: RestService, public router: Router) {
    this.cohortChangeListener = homeService.activeCohortChange.subscribe(async (val)=>{
      this.cohort = val;
    });
    this.cohort = homeService.activeCohort;
  }

  
  public set cohort(v : number) {
    this._cohort = v;
    setTimeout(async () => {
      await this.getPeople();
    }, 0);
  }
  

  public get cohort() : number {
    return this._cohort;
  }
  

  ngOnInit(): void {
  }

  async getPeople(){
    const data: any =  await this.restService.req('get',`cohorts/${this.cohort}/people/`);
    this.people = data;
  }

  showPerson(id:number){
    // display content of person's record.
  }

  show(item:any){
    return JSON.stringify(item);
  }


  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, person: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': person };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  viewPerson(person:any, req: string){
    if (req == 'details'){
      this.router.navigate([`/settings/${person.id}`]);
    } else if (req == "submissions"){
      this.router.navigate([`/settings/${person.id}`]);
    }
  }

  peopleByRole(role:string){
    return this.people.filter((person)=>{
      return role.includes(person.cohortrole);
    });
  }
}
