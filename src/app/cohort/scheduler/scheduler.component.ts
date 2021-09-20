import { Component, OnInit } from '@angular/core';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';
import * as moment from 'moment';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  cohortChangeListener: any;
  _cohort: number;
  schedules: any[] = [];
  events: any[] = [];
  scheduleTitle: string = 'Schedule';
  constructor( public homeService: HomeViewService, public restService: RestService ) { 
    this.cohortChangeListener = homeService.activeCohortChange.subscribe(async (cohortid)=>{
      this.cohort = cohortid;
    });
    this.cohort = homeService.activeCohort;
  }

  ngOnInit(): void {

  }

  
  public set cohort(v : number) {
    const old = this._cohort;
    this._cohort = v;
    setTimeout(async (old,cur) => {
      if (old != cur){
        this.schedules = (await this.restService.req(`get`,`cohorts/${this._cohort}/schedule/`));
        await this.updateContent();
        this.scheduleTitle = `Schedule surrounding ${moment().format('MM/DD/YY')} for cohort ${this._cohort}`;
        console.log('events',this.events);
      }
      // console.log(this.schedules);
    },0,[old,v]);
  }
  
  public get cohort() : number {
    return this._cohort;
  }
  

  private updateContent(){
    // take schedules, and utilizing repeat data, determine if we have an event today, or within a week of today in the future.
    // 
    const data: any[] = [];
    const now = moment();
    const lastWeek = moment().add(-1,'weeks').startOf('day');
    const nextWeek = moment().add(1,'weeks').endOf('day');
    for (const schedule of this.schedules){
      const {description, duration} = schedule;
      const start = moment(schedule.start);
      const hours = start.format('hh:mmA');
      const reps = Number(schedule.repeats ?? '0');
      if (reps){
        // propogate repeats
        const daysbetween = Math.abs(lastWeek.diff(start.startOf('day'),'days'));
        const numberPrevious = Math.floor(daysbetween/reps);
        let check = moment(start).add(numberPrevious*reps,'days');
        console.log('HEY',daysbetween,numberPrevious,start,check,lastWeek,description);
        while (nextWeek.isSameOrAfter(check,'days')){
          if (lastWeek.isSameOrBefore(check,'days')){
            data.push({
              time2: moment(check.utc(true)),
              time: `${check.format('MM/DD')} - ${hours}`,
              description,
              duration: `${duration} hours`
            });
          }
          check = check.add(reps,'days');
        }
      }
    }
    this.events = data.sort((f,s)=>{
      const before = f.time2.isSameOrBefore(s.time2, 'seconds');
      const after = f.time2.isSameOrAfter(s.time2,'seconds');
      return Number(after) - Number(before);
    });
  }

  no() {
    return false;
  }
}
