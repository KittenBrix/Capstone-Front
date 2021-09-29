import { ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { Injectable, ViewContainerRef } from '@angular/core';
import { AssignmentsComponent } from 'app/assignments/assignments.component';
import { SubmissionViewComponent } from 'app/assignments/submission-view/submission-view.component';
import { AttendanceComponent } from 'app/cohort/attendance/attendance.component';
import { GoogleclassroomComponent } from 'app/cohort/googleclassroom/googleclassroom.component';
import { PeopleComponent } from 'app/cohort/people/people.component';
import { RecordingsComponent } from 'app/cohort/recordings/recordings.component';
import { SchedulerComponent } from 'app/cohort/scheduler/scheduler.component';
import { ViewComponent } from 'app/cohort/view/view.component';
import { userRole } from 'app/common/types';
import { Auth } from './auth.service';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class HomeViewService {
  private static contentTerms = [
    'Dashboard',
    'People',
    'Schedule',
    'Attendance',
    'Recordings',
    'gClass',
    'Assignments',
    'Submissions'
  ];
  private static componentList = [
    ViewComponent,
    PeopleComponent,
    SchedulerComponent,
    AttendanceComponent,
    RecordingsComponent,
    GoogleclassroomComponent,
    AssignmentsComponent,
    SubmissionViewComponent
  ];
  // shows roles for each cohort they might be part of.
  private _roles: any[] = [];
  private cohorts: number[] = [];
  public _activeCohort: number = null;
  public submissionData: any = null;

  public set activeCohort(v : number) {
    this._activeCohort = v;
    this.activeCohortChange.emit(this._activeCohort);
  }
  public get activeCohort() : number {
    return this._activeCohort;
  }
  
  
  private currentPage: string = '';
  private currentComponentRef: any;
  private containerRef: ViewContainerRef | null = null;

  public activeCohortChange: EventEmitter<number> = new EventEmitter<number>(true);

  constructor( 
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: Auth,
    private restService: RestService) {
      this.refreshRoles();

  }

  
  private set roles(v : userRole[]) {
    this._roles = v;
  };

  public get roles() : userRole[] {
    return this._roles;
  }

  public async refreshRoles(): Promise<void>{
    const data = (await this.restService.req('get',`user/${this.authService.user.id}/roles/`))[0];
    console.log('refreshroles',data);
    this.roles = data as userRole[];
    const values = this.roles.map(E=>{return E.cohortid;});
    console.log('vals',values);
    this.cohorts.splice(0,this.cohorts.length);
    for (const I of values){
      if (!this.cohorts.includes(+I)){
        this.cohorts.push(+I);
      }
    }
  }
  // public async refreshCohorts(): Promise<void>{
  //   const data = await this.restService.req('get','cohorts/');
  //   if (data && data.length){
  //     this.cohorts = data.map(item=>{return item.id;});
  //   }
  // }
  
  public getRoles(): userRole[]{
    return this._roles;
  }

  public getCohorts(): number[]{
    return this.cohorts;
  }

  public getNavigationOptions(){
    return HomeViewService.contentTerms;
  }

  public getComponentClass(term:string){
    const index = HomeViewService.contentTerms.indexOf(term);
    if (index >= 0){
      return HomeViewService.componentList[index];
    }

    throw new Error(`Can't produce a component from the value provided (${JSON.stringify(term)})`);
  }

  public showOn(handle: ViewContainerRef){
    if (this.containerRef){
      this.containerRef.clear();
    }
    this.containerRef = handle;
  }

  public navigate(value:string){
    if (this.currentPage == value){
      return;
    }
    try{
      const newComponent: any = this.getComponentClass(value);
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(newComponent);
      if (this.containerRef){
        this.containerRef.clear();
        this.currentComponentRef = this.containerRef.createComponent(componentFactory);
        this.currentPage = value;
      } else {
        console.log('contentref',this.containerRef,'endcontentref');
      }
    } catch (err){
      console.log('home-render-err-start',err,'home-render-err-end');
    }
  }

  public getCurrentComponentReference(){
    return this.currentComponentRef;
  }

  public getCurrentComponentTitle(){
    return this.currentPage;
  }

  public setSubmissionData(arg:any){
    this.submissionData = arg;
  }

}
