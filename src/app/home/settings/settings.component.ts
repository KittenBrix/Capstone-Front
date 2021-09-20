import { Component, OnInit } from '@angular/core';
import { canDeleteDefaultCallback, canEditDefaultCallback } from 'app/common/algorithms';
import { userPhone, userEmail, DataChangeEvent, DropDownEntry } from 'app/common/types';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'app/services/rest.service';
import { Auth } from 'app/services/auth.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  fname:string ='';
  lname:string = '';
  roleid:number = 0;
  nameError: string = '';
  defaultError: string = '';
  passError: string = '';

  primaryEmail: string = '';
  primaryPhone: string = '';
  clockifyEmail: string = '';
  googleEmail: string = '';
  discordInfo: string = '';

  newPassword: string= '';
  newPassword2: string= '';
  
  id: number;
  sub: any;

  loading: any[] =[];
  
  submittedName: boolean = false;
  submittedDefaults: boolean = false;

  phones: userPhone[] = [];
  phoneFields: string[] = ['phone'];
  phoneDropDowns: DropDownEntry[] = [
    {name:'typename',options:['home','cell','work','alt']}
  ];
  emails: userEmail[] = [];
  emailFields: string[] = ['email'];
  emailDropDowns: DropDownEntry[] = [
    {name:'typename',options:['primary','secondary','recovery','google classroom','github','freecodecamp','clockify']}
  ];

  constructor(private route: ActivatedRoute, public restService: RestService, public authService: Auth) {
   }
  

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(async params => {
      this.loading.push(true);
      this.id = +params['id'];
      await this.getData();
      this.loading.pop();

   });
  }

  describePhones(): string[]{
    const data = this.phoneFields.map(el=>{return el;});
    this.phoneDropDowns.forEach(entry =>{
      data.push(entry.name);
    });
    return data;
  }

  describeEmails():string[]{
    const data = this.emailFields.map(el=>{return el;});
    this.emailDropDowns.forEach(entry =>{
      data.push(entry.name);
    });
    return data;
  }

  
  public get getAccountTitle() : string {
    return this.canEdit() ? "Account Settings" : "User Details"; 
  }
  

  async add(data: userPhone | userEmail, typing:string ): Promise<void> {
    let arr = null;
    if (typing == 'emails'){
      arr = this.emails;
    } else if (typing == "phones"){
      arr = this.phones;
    }
    const event: DataChangeEvent = {
      type: 'add',
      field: typing,
      content: data,
      index: arr.length
    };
    await this.changeArray(arr,event);
    if (typing == 'emails'){
      await this.gEmails();
    }
    if (typing == 'phones'){
      await this.gPhones();
    }
  }

  async change(arr: any[],arg: DataChangeEvent){
    await this.changeArray(arr, arg);
  }
  
  private async changeArray(arr:any[], event:DataChangeEvent){
    if (event.type == 'add'){ // add an item. by default put it at end.
      event.content.userid = this.id;
      const data = await this.restService.req(`post`,`user/${this.id}/${event.field}/`,event.content);
      if (data){
        arr.push(event.content);
      }

    } else if (event.type == 'delete'){ //delete an item.
      const element = arr[event.index];
      let item = element;
      if (element == event.content){
        arr.splice(event.index,1);
        const data = await this.restService.req('delete',`${event.field??'unknown'}/${item.id}`);
      } else {
        const index = arr.indexOf(event.content);
        if (index >= 0){
          item = arr.splice(index,1);
          const data = await this.restService.req('delete',`${event.field??'unknown'}/${item.id}`);
        }
        else{
          console.log("cant find that item.");
        }
      }
    } else {  //edit item
      console.log("can't handle edits yet.");
    }
  }

  defaultDelete(arg:any): boolean{
    return canDeleteDefaultCallback(arg);
  }

  defaultEdit(arg:any): boolean{
    return canEditDefaultCallback(arg);
  }

  async getData(){
    // retrieve data.
    if (!this.id){
      this.id = this.authService.user.id;
    }
    await Promise.all([
      this.gSettings(),
      this.gEmails(),
      this.gPhones()
    ]);
  }

  submitNameForm(): void {
    console.log("OOF")
    if (this.fname && this.fname.length && this.lname && this.lname.length){
      this.nameError = '';
    } else {
      this.nameError = "Both first and last name must be populated before saving."
      return;
    }
    setTimeout(async () => {
      // save data on backend;
      this.submittedName = true;
      console.log(this.fname,this.lname);
      const data = await this.restService.req('post',`user/${this.id}/`,{firstname: this.fname,lastname:this.lname});
      console.log(data)
      if (data){
        this.nameError = "Saved name succesfully";
        setTimeout(() => {
          this.nameError = "";
        }, 2000);
      }
      await this.gSettings();
      this.submittedName = false;
    }, 0);
  }

  async resetNameForm(): Promise<void> {
    this.submittedName = false;
    await this.gSettings();
  }

  submitDefaultsForm(): void {
    setTimeout(async () => {
      // save data on backend;
      this.submittedDefaults = true;
      const payload = {
        id: this.id,
        primaryemail: this.primaryEmail,
        primaryphone: this.primaryPhone,
        clockifyemail: this.clockifyEmail,
        classroomemail: this.googleEmail,
        discordid: this.discordInfo
      };
      const data = await this.restService.req(`post`,`user/${this.id}/`,payload);
      if (data){
        this.defaultError = "Saved User's public contact information";
        setTimeout(() => {
          this.defaultError = '';
        }, 2000);
      }
      await this.gSettings();
      // TODO submit to rest
      this.submittedDefaults = false;
    }, 0);
  }

  async submitPassword(): Promise<void>{
    if (this.newPassword.length < 8){
      this.passError = "password must be 8 or more characters";
    } else if (this.newPassword != this.newPassword2){
      this.passError = "both the new password and confirmation must match";
    } else {
      const data = await this.restService.req(`post`,`user/${this.id}/`,{password:this.newPassword});
      if (data){
        this.passError = '';
        alert("Password successfully changed!");
      } else {
        this.passError = "Could not change password!";
      }
    }
    setTimeout(() => {
      this.passError = '';
    }, 2000);
  }

  async resetDefaultsForm(): Promise<void> {
    this.submittedDefaults = false;
    await this.gSettings();
  }



  async gPhones(){
    if (this.canEdit()){
      this.loading.push('phones');
      const data = (await this.restService.req('get',`user/${this.id}/phones/`))[0];
      console.log('phones retrieved...');
      this.phones = data;
      const X = this.loading.indexOf('phones');
      if (X >= 0){
        this.loading.splice(X,1);
      }
    }
  }

  async gEmails(){
    if (this.canEdit()){
      this.loading.push('emails');
      const data = (await this.restService.req('get',`user/${this.id}/emails/`))[0];
      console.log('emails retreived...');
      this.emails = data;
      const X = this.loading.indexOf('emails');
      if (X >= 0){
        this.loading.splice(X,1);
      }
    }
  }

  async gSettings(){
    this.loading.push('settings');
    const [data] = (await this.restService.req('get',`user/${this.id}/`))[0];
    console.log('userdata retrieved...');
    this.googleEmail = data.classroomemail;
    this.primaryEmail = data.primaryemail;
    this.primaryPhone = data.primaryphone;
    this.clockifyEmail = data.clockifyemail;
    this.fname = data.firstname;
    this.lname = data.lastname;
    this.discordInfo = data.discordid;
    const X = this.loading.indexOf('settings');
    if (X >= 0){
      this.loading.splice(X,1);
    }
  }


  canEdit(){
    const viewer = this.authService.user;
    if ([4,6,8].includes(viewer.roleid)){
      return true;
    }
    if (this.id == this.authService.user.id){
      return true;
    }
    console.log('cant edit: personid:',this.id,' viewer id:', viewer.id);
    return false;
  }
  canGiveRoles(){
    if ([4,6,8].includes(this.authService.siteRole)){
      return true;
    }
    return false;
  }
}
