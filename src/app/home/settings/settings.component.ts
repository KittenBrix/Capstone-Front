import { Component, OnInit } from '@angular/core';
import { canDeleteDefaultCallback, canEditDefaultCallback } from 'app/common/algorithms';
import { userPhone, userEmail, DataChangeEvent, DropDownEntry } from 'app/common/types';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  nameForm: FormGroup;
  defaultsForm: FormGroup;
  submittedName: boolean = false;
  submittedDefaults: boolean = false;
  phones: userPhone[] = [];
  phoneFields: string[] = ['phone'];
  phoneDropDowns: DropDownEntry[] = [
    {name:'type',options:['home','cell','work','alt']}
  ];
  emails: userEmail[] = [];
  emailFields: string[] = ['email'];
  emailDropDowns: DropDownEntry[] = [
    {name:'type',options:['primary','secondary','recovery','google classroom','github','freecodecamp','clockify']}
  ];

  constructor(private formBuilder: FormBuilder) {
    this.nameForm = this.formBuilder.group({
      'firstName':[null,[Validators.required]],
      'lastName':[null,[Validators.required]],
    });
    this.defaultsForm = this.formBuilder.group({
      'email':[null,[]],
      'phone':[null,[]],
      'discord':['',[]],
      'clockify':['',[]],
      'google':['',[]]
    });
   }

  ngOnInit(): void {
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

  async add(data: userPhone, arr: any[]): Promise<void> {
    const event: DataChangeEvent = {
      type: 'add',
      content: data,
      index: arr.length
    };
    await SettingsComponent.changeArray(arr,event);
  }

  async change(arr: any[],arg: DataChangeEvent){
    await SettingsComponent.changeArray(arr, arg);
  }
  
  private static async changeArray(arr:any[], event:DataChangeEvent){
    if (event.type == 'add'){ // add an item. by default put it at end.
      arr.push(event.content)
    } else if (event.type == 'delete'){ //delete an item.
      const element = arr[event.index];
      if (element == event.content){
        arr.splice(event.index,1);
      } else {
        const index = arr.indexOf(event.content);
        if (index >= 0){
          arr.splice(index,1);
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



  // form controls for the account settings
  get nf(): { [key: string]: AbstractControl } {
    return this.nameForm.controls;
  }
  get df(): {[key:string]: AbstractControl} {
    return this.defaultsForm.controls;
  }

  submitNameForm(): void {
    console.log("OOF")
    this.submittedName = true;
    if (this.nameForm.invalid) return;
    console.log(JSON.stringify(this.nameForm.value, null, 2));
  }

  resetNameForm(): void {
    this.submittedName = false;
    this.nameForm.reset();
  }

  submitDefaultsForm(): void {
    this.submittedDefaults = true;
    if (this.defaultsForm.invalid) return;
    console.log(JSON.stringify(this.defaultsForm.value, null, 2));
  }

  resetDefaultsForm(): void {
    this.submittedDefaults = false;
    this.defaultsForm.reset();
  }
}
