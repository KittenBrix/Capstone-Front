import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';

@Component({
  selector: 'app-submission-view',
  templateUrl: './submission-view.component.html',
  styleUrls: ['./submission-view.component.scss']
})
export class SubmissionViewComponent implements OnInit {
  constructor(public homeView: HomeViewService, public rest: RestService, public auth: Auth) { }
  subData: any = null; //userid, submissionid, assignmentid, or null. if null, kick home
  assignment:any = null;
  submission:any = null;
  isGrader:boolean = false;
  message: string = '';
  ngOnInit(): void {
    this.getData();
  }

  data(){
    return JSON.stringify(this.homeView.submissionData);
  }

  private vals = [false, null, true];

  public move(amt: number){
    let P = this.vals.indexOf(this.submission.pass) + amt;
    while (P < 0){
      P += this.vals.length;
    }
    while (P >= this.vals.length){
      P -= this.vals.length;
    }
    this.submission.pass = this.vals[P];
  }

  async getData(){
    this.subData = this.homeView.submissionData;
    if (!this.subData || (!this.subData.assignmentid && !this.subData.submissionid)){
      setTimeout(async () => {
        if (!this.homeView.submissionData){
          this.homeView.navigate('Dashboard');
        } else {
          await this.getData();
        }
      }, 2000);
    } else {
      this.subData.userid = this.subData.userid ?? this.auth.user.id;
      try {
        // at least either sub or assn id is given. pref sub id over assn id.
        const data = (await this.rest.req('get',`user/${this.subData.userid}/submissions/`))[0];
        const submission = data.find((el:any)=>{
          // check if any submissions match the submissionId. 
          if (this.subData.submissionid){
            return (el.id == this.subData.submissionid);
          } else if (this.subData.submissionid){
            return (el.assignmentid == this.subData.assignmentid);
          }
          (this.subData.assignmentid && el.id == this.subData.assignmentid);
        });
        if (submission){
          // we have a real submission to grade, or edit, depending on ownership. If I am teacher
          this.assignment = (await this.rest.req('get',`assignments/${submission.assignmentid}`))[0];
          this.submission = submission;
        } else {
          if (this.subData.assignmentid){
            // pull the assignment, we will make a new submission instead.
            this.assignment = (await this.rest.req('get',`assignments/${this.subData.assignmentid}`))[0];
            this.submission = {userid: this.subData.userid, assignmentid: this.subData.assignmentid, text:'', grade:null, pass:null};
          } else {
            // you dont have a submission to pull under this user, nor do you have an assignment to submit for, so you are going to reset and go home.
            // reset homeView submission, recall getData
            this.homeView.setSubmissionData(null);
            await this.getData();
          }
        }
      } catch (err){
        console.log(err);
      }
      if (!this.submission && !this.assignment){
        this.homeView.setSubmissionData(null);
        await this.getData();
      }
      // guaranteed submission and assignment now.
      // new sub if !sub.id. edit/grade sub if sub.id
      console.log("asn->",this.assignment, "sub->", this.submission);
      this.isGrader = (this.auth.user.roleid >= 3 && this.auth.user.id != this.subData.userid);
    }
  }

  async grade(subtext: string, grade:string){
    // admin grade item
    this.submission.text = subtext;
    this.submission.grade = (grade.length) ? +grade : null;
    const data = await this.rest.req('post',`user/${this.submission.userid}/submissions/`,this.submission);
    console.log("SAVE DATA", data);
    this.message = data.msg;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  async save(subtext: string){
    // student save item
    this.submission.text = subtext;
    this.submission.grade = null;
    this.submission.pass = null;
    const data = await this.rest.req('post',`user/${this.submission.userid}/submissions/`,this.submission);
    console.log("SAVE DATA", data);
    this.message = data.msg;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }


}
