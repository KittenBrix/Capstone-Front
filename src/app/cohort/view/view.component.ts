import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';
import * as moment from 'moment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  constructor(private rest: RestService, private auth: Auth, public homeView: HomeViewService) {

  }

  ngOnInit(): void {
    setTimeout(async () => {
      await this.getAssignmentGradeData();
    }, 0);
  }
  _RecentData: any[] = [];
  _UpcomingData: any[] = [];
  _AssignmentData: any[] =[];
  _GradeData: any[] =[];
  describeRecentData: any[] = [];
  describeUpcomingData: any[] =[];
  describeAssignmentData: any[] =[];
  describeGradeData: any[] =[];
  _loading: boolean[] = [false,false,false];
  _loaded: boolean[] = [false,false,false];
  detailsOpen: boolean[] = [false,false,false,false];


  Grades: any = {};
  Submissions: any = {};



  public set RecentData(value:any[]){
    this._RecentData = value;
  }
  public get RecentData() : any[] {
    if (!this._loaded[0] && !this._loading[0]){
      this._loading[0] = true;
      setTimeout( async () => {
        console.log("And I oop~")
        await this.getRecents();
        this._loading[0] = false;
        this._loaded[0] = true;
      }, 0);
    }
    return this._RecentData;
  }


  private async getRecents(){
    // return the appLog content for the last two weeks
    const data = await this.rest.req(`get`,`user/${this.auth.user.id}/dashboard/`);
    this.RecentData = data ? data.slice(-10).map(el=>{
      return {message:el.message, date:moment(el.dateUpdated).format('llll')};
    }) : [];
    this.describeRecentData = Object.keys(this.RecentData[0]);
  }


  public set UpcomingData(value:any[]){
    this._UpcomingData = value;
  }
  public get UpcomingData() : any[] {
    if (!this._loaded[1] && !this._loading[1]){
      this._loading[1] = true;
      setTimeout( async () => {
        console.log("And I oop~")
        await this.getUpcoming();
        this._loading[1] = false;
        this._loaded[1] = true;
      }, 0);
    }
    return this._UpcomingData;
  }
  private async getUpcoming(){
    // return the appLog content for the last two weeks
    const data = await this.rest.req(`get`,`user/${this.auth.user.id}/dashboard/upcoming/`);
    this.UpcomingData = data;
    this.describeUpcomingData = Object.keys(this.UpcomingData[0]);
  }


  // describeAssignmentData: any[] =[];
  // describeGradeData: any[] =[];
  public set AssignmentData(value:any[]){
    this._AssignmentData = value;
  }
  public get AssignmentData() : any[] {
    if (!this._loaded[2] && !this._loading[2]){
      setTimeout( async () => {
        console.log("And I oop~")
        await this.getAssignmentGradeData();
      }, 0);
    }
    return this._AssignmentData;
  }

  public set GradeData(value:any[]){
    this._GradeData = value;
  }
  public get GradeData() : any[] {
    if (!this._loaded[2] && !this._loading[2]){
      setTimeout( async () => {
        console.log("And I oop~")
        await this.getAssignmentGradeData();
      }, 0);
    }
    return this._GradeData;
  }

  private async getAssignmentGradeData(){
    this._loading[2] = true;
    // return the appLog content for the last two weeks
    const data = await this.rest.req(`get`,`user/${this.auth.user.id}/dashboard/remaining/`);
    console.log(data);
    this.AssignmentData = data ? data['remaining'] : [] ;
    this.GradeData = data ? data['toGrade'] : [];
    this.describeAssignmentData =  this.AssignmentData.length ? Object.keys(this.AssignmentData[0]): [];
    this.describeGradeData = this.GradeData.length ? Object.keys(this.GradeData[0]) : [];
    await Promise.all([this.createGradeInfo(),this.createSubmissionsInfo()]);
    this._loading[2] = false;
    this._loaded[2] = true;
  }

  private async createGradeInfo(){
    this.Grades = {};
    let moduleTitle = '';
    let assignmentTitle = '';
    for (const grade of this._GradeData){
      if (moduleTitle != grade.modulename){
        moduleTitle = grade.modulename;
        this.Grades[moduleTitle] = {};
        assignmentTitle = '';
      }
      if (assignmentTitle != grade.assignmentname){
        assignmentTitle = grade.assignmentname;
        this.Grades[moduleTitle][assignmentTitle]=[];
      }
      const {submissionid, userid, username, assignmentid} = grade;
      this.Grades[moduleTitle][assignmentTitle].push({submissionid, userid, username, assignmentid});
    }
    console.log(this.Grades);
  }

  private async createSubmissionsInfo(){
    this.Submissions = {};
    let moduleTitle = '';
    for (const sub of this._AssignmentData){
      if (moduleTitle != sub.modulename){
        moduleTitle = sub.modulename;
        this.Submissions[moduleTitle] = [];
      }
      this.Submissions[moduleTitle].push(sub);
    }
    console.log(this.Submissions);
  }

  describe(item: any){
    const graded = (item.grade!=null && item.pass!=null);
    return [
      item.assignmentname,
      (item.submissionid) ? 'Yes': 'No',
      graded ? `${item.grade}/100` : '-',
      graded ? `${item.pass ? 'Yes': 'No'}` : '-'
    ];
  }
  totalSubmissions(arg: any[]){
    const data = arg.filter(el => {
      return el.submissionid;
    });
    return `${data.length}/${arg.length}`;
  }

  public print(item:any){
    return JSON.stringify(item);
  }

  public keys(arg:any){
    return Object.keys(arg);
  }

  public sum(key:string){
    const data = this.Grades[key];
    let total = 0;
    if (data){
      for (const key2 of this.keys(data)){
        total += this.Grades[key][key2].length;
      }
    }
    return total;
  }


  public submission(uid:number, aid:number, sid: number){
    this.homeView.submissionData = {
      userid: uid,
      submissionid: sid,
      assignmentid: aid
    };
    this.homeView.navigate('Submissions');
  }
}
