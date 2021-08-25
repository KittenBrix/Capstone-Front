import { ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Injectable, ViewContainerRef } from '@angular/core';
import { AttendanceComponent } from 'app/cohort/attendance/attendance.component';
import { GoogleclassroomComponent } from 'app/cohort/googleclassroom/googleclassroom.component';
import { PeopleComponent } from 'app/cohort/people/people.component';
import { RecordingsComponent } from 'app/cohort/recordings/recordings.component';
import { SchedulerComponent } from 'app/cohort/scheduler/scheduler.component';
import { ViewComponent } from 'app/cohort/view/view.component';
import { Observable } from 'rxjs';

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
    'gClass'
  ];
  private static componentList = [
    ViewComponent,
    PeopleComponent,
    SchedulerComponent,
    AttendanceComponent,
    RecordingsComponent,
    GoogleclassroomComponent
  ];
  private currentPage: string = '';
  private currentComponentRef: any;
  private containerRef: ViewContainerRef | null = null;

  constructor( private componentFactoryResolver: ComponentFactoryResolver) { 
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
}
