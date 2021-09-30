import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnChanges {

  @Input()
  category: any = {
    id: 0,
    name: '',
    description: ''
  };
  _cat: number = 0;
  _cohort: number = 0;
  _assignments: any[] = [];
  _submissions: any[] = [];
  _studentGrades: any = {};
  studentData: any[] = [];

  isStudent: boolean = null;
  isTeacher: boolean = null;
  isAdmin: boolean = null;

  message: string = '';

  constructor(public rest: RestService, public auth: Auth, public homeView: HomeViewService) { }

  ngOnInit(): void {
    this._cohort = this.homeView._activeCohort;
    setTimeout(async () => {
      await this.setRoles()   
    }, 0);
    this.homeView.activeCohortChange.subscribe(async (val)=>{
      this._cohort = val;
      await this.setRoles();
      this.ngOnChanges();
    })
  }

  ngOnChanges(): void {
    if (this.category.id != this._cat ){
      setTimeout(async () => {
        await this.getContent(this.category.id);
      }, 0);
    }
    this._cat = this.category.id;
  }

  async getContent(id:number){
    this.studentData.splice(0,this.studentData.length);
    this._assignments = await this.rest.req('get',`categories/${id}/assignments/`);
    this._submissions = (await this.rest.req('get',`user/${this.auth.user.id}/submissions/`))[0] ?? [];
    console.log(this._submissions);
    for (const assn of this._assignments){
      const {id, name, description, rubric} = assn;
      const data = this._submissions.find(el =>{
        return el.assignmentid == id;
      }) ?? {grade: null, pass: null};
      this.studentData.push({id, name, description, rubric, sid:data.id ,grade: data.grade, pass: data.pass});
    }
  }

  async getStudentGrades(){
    if (!this.homeView._activeCohort){return;}
    this._studentGrades = await this.rest.req('get',`cohorts/${this._cohort}/category/${this._cat}/submissions/`);

    console.log(this._studentGrades);

  }


  async setRoles(){
    // set isstudent, isteacher, isadmin based on cohort selector and roles.
    const data = this.homeView.getRoles();
    let tempStudent = false;
    let tempTeacher = false;
    let tempAdmin = false;
    for (const role of data){
      if (+role.cohortid == +this.homeView._activeCohort){
        if (role.roleid >=5){tempAdmin = true;}
        else if (role.roleid >=3){tempTeacher = true;}
        else { tempStudent = true;}
      }
    }
    this.isAdmin = tempAdmin || this.auth.user.roleid >= 5;
    this.isStudent = tempStudent || this.auth.user.roleid < 3;
    this.isTeacher = tempTeacher;
    if (this.isTeacher || this.isAdmin){
      await this.getStudentGrades();
    }
  }

  public submission(uid?:number, aid?:number, sid?: number){
    const userid = uid ?? this.auth.user.id;
    const submissionid = (sid ?? null);
    const assignmentid = (aid ?? null);  
    this.homeView.submissionData = { userid, submissionid, assignmentid};
    this.homeView.navigate('Submissions');
  }

  public async makeEdit(id?:number, name?:string, description?:string, rubric?:string ){
    const payload = {id,name,description,rubric,moduleid:this._cat};
    console.log('makeedit',payload);
    const data = (id) ? await this.rest.req('post',`assignments/${id}`,payload) : await this.rest.req('post','assignments/',payload);
    console.log('makeedit',data);
    this.message = data.affectedRows ? (data.changedRows ? "Assignment updated." : (data.insertID ? "Assignment successfully added.":"No changes were made.")) : "Error saving or editing this assignment."
    setTimeout(async () => {
      await this.getContent(this._cat);
      this.message = '';
    }, 3000);
  }
  // "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ''name', 'description', 'rubric', 'moduleid') VALUES ('Python Gui Forms', 'Make a' at line 1"

  public async delete(assnid){
    const data = await this.rest.req('delete',`assignments/${assnid}`);
    console.log('DELETEEEEE0', data);
    this.message = data.err ? data.msg : JSON.stringify(data);
    setTimeout(async () => {
      await this.getContent(this._cat);
      this.message = '';
    }, 3000);
  }
}
