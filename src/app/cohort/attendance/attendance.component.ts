import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';
import { environment } from 'environments/environment';
import {MatDatepickerInput, MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  selectedDays: moment.Moment[] = [null,null];
  selectedCohort: string ='';
  selectedPerson: string = '';
  timeEntries: any[] = [];
  cohorts: any[] = [];
  persons: any[] = [];
  loading: any[] = [];

  constructor(
    public homeService: HomeViewService,
    public restService: RestService,
    public authService: Auth) {
    this.load();
  }

  ngOnInit(): void {
  }

  async load(){
    // load all your cohorts.
    // get all the individual data for your cohorts.
    this.loading.push(true);
    await this.getAvailableCohorts();
    this.selectedCohort = this.cohorts[0].name;
    await this.getCohortData();
    this.loading.pop();
  }

  async getCohortData(){
    this.loading.push(true);
    let id = this.selectedCohort;
    if (id){
      const proms = await Promise.all([
        await this.restService.req('get',`${environment.apiUrl}/cohorts/${id}/people`),
        await this.restService.req('get',`${environment.apiUrl}/cohorts/${id}/timeEntries`)]);
      this.persons = proms[0];
      this.timeEntries = proms[1];
      this.selectedPerson = this.persons[0].id;
    }
    this.loading.pop();
  }

  async getAvailableCohorts(){
    this.loading.push(true);
    this.cohorts = await this.restService.req('get',`${environment.apiUrl}/user/${this.authService.user.id}/roles`);
    this.loading.pop();
  }

  getUserTimes(id:any){
    const data = this.timeEntries.filter((entry)=>{return (entry.userid == id);});
    return data;
  }

  // reporting feature.
  downloadTimes(){
    this.loading.push(true);
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: `Time Log`,
      Subject: `${this.selectedCohort} time entries`,
      Author: "Generic Company Web App",
      CreatedDate: new Date()
    };
    wb.SheetNames.push("Cohort Hours");

    const day1 = this.selectedDays[0];
    const day2 = this.selectedDays[1];
    const ws_data = [];
    if (day1 && day2){
      const start = (day1.isBefore(day2)) ? day1: day2;
      const end = (day1.isBefore(day2))? day2: day1;
      
      ws_data.push([`Log For period ${start.format("M/D")} to ${end.format("M/D")}`],['User id','Name','Hours During Period','Activity Count This Period']);
      // userid, first+last, hours for entries within period, number of qualifying entries
      for (const user of this.persons){
        const times = this.getUserTimes(user.id);
        const data = times.filter((entry)=>{
          const s = moment(entry.start);
          const e = moment(entry.end);
          return ((s.isSameOrAfter(start)&&s.isSameOrBefore(end)) ||(e.isSameOrAfter(start)&&e.isSameOrBefore(end)));
        });
        const minutes = data.reduce((prev,entry)=>{
          const s = moment(entry.start);
          const e = moment(entry.end);
          const diff = Math.abs(s.diff(e,'minutes'));
          return prev + diff;
        });
        const count = data.length;
        ws_data.push([user.id, `${user.firstname} ${user.lastname}`,minutes/60.0,count]);
      }
    } else {
      ws_data.push([`Complete Time Log`],['User id','Name','Total Hours','Total Activity Count']);
      for (const user of this.persons){
        const times = this.getUserTimes(user.id);
        const minutes = times.reduce((prev,entry)=>{
          const s = moment(entry.start);
          const e = moment(entry.end);
          const diff = Math.abs(s.diff(e,'minutes'));
          return prev + diff;
        });
        const count = times.length;
        ws_data.push([user.id, `${user.firstname} ${user.lastname}`,minutes/60.0,count]);
      }
    }
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Cohort Hours"] = ws;
    this.downloadFile(wb,`CohortHours.xlsx`);
    this.loading.pop();
  }

  downloadUser(){
    this.loading.push(true);
    const user = this.persons.find((person)=>{
      return (person.id == this.selectedPerson);
    })
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: `Time Log For User ${user.firstname} ${user.lastname}`,
      Subject: ``,
      Author: "Generic Company Web App",
      CreatedDate: new Date()
    };
    wb.SheetNames.push("User Hours");

    const day1 = this.selectedDays[0];
    const day2 = this.selectedDays[1];
    const ws_data = [];
    if (day1 && day2){
      const start = (day1.isBefore(day2)) ? day1: day2;
      const end = (day1.isBefore(day2))? day2: day1;
      
      ws_data.push([`Log For period ${start.format("M/D")} to ${end.format("M/D")}`],['StartTime','EndTime','Hours','Source or Description']);
      // userid, first+last, hours for entries within period, number of qualifying entries
      const times = this.getUserTimes(user.id);
      const data = times.filter((entry)=>{
        const s = moment(entry.start);
        const e = moment(entry.end);
        return ((s.isSameOrAfter(start)&&s.isSameOrBefore(end)) ||(e.isSameOrAfter(start)&&e.isSameOrBefore(end)));
      });
      let minutes = 0;
      for (const entry of data){
        const s = moment(entry.start);
        const e = moment(entry.end);
        const diff = Math.abs(s.diff(e,'minutes'));
        minutes += diff;
        ws_data.push([s.format('llll'),e.format('llll'),diff/60.0,entry.source]);
      }
      const count = data.length;
      ws_data.push([`${user.firstname} ${user.lastname}`,`hours: ${minutes/60.0}`,`Activity Count: ${count}`]);      
    } else {      
      ws_data.push([`${user.firstname} ${user.lastname} hour totals`],['StartTime','EndTime','Hours','Source or Description']);
      // userid, first+last, hours for entries within period, number of qualifying entries
      const times = this.getUserTimes(user.id);
      let minutes = 0;
      for (const entry of times){
        const s = moment(entry.start);
        const e = moment(entry.end);
        const diff = Math.abs(s.diff(e,'minutes'));
        minutes += diff;
        ws_data.push([s.format('llll'),e.format('llll'),diff/60.0,entry.source]);
      }
      const count = times.length;
      ws_data.push([`${user.firstname} ${user.lastname}`,`total hours: ${minutes/60.0}`,`Total Activity Count: ${count}`]); 
    }
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["User Hours"] = ws;
    this.downloadFile(wb,`${user.firstname}-${user.lastname}-hours.xlsx`);
    this.loading.pop();
  }

  // xlsx download using tutorial from https://redstapler.co/sheetjs-tutorial-create-xlsx/
  downloadFile(data: XLSX.WorkBook, name:string) {
    var wbout = XLSX.write(data, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([AttendanceComponent.s2ab(wbout)],{type:"application/octet-stream"}), name);
  }
  static s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
  }


  setDate(index: number, event: any){
    console.log(event, index);
    this.selectedDays[index] = moment(event.value);
  }
}
