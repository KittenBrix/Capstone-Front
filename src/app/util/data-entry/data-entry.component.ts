import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {Form, FormControl, ValidatorFn, Validators} from '@angular/forms';
import { DropDownEntry } from 'app/common/types';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit, OnChanges{
  @Input()
  fields: string[] = [];
  @Input()
  dropdownfields: DropDownEntry[] = [];

  model: any = {};
  fieldControls: Map<string, FormControl> = new Map();

  @Output('creation')
  submit = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(){
  }

  ngOnChanges(){
  }

  create(){
    const data: any = {};
    for (const key of this.fields){
      data[key] = this.model[key];
    }
    for (const entry of this.dropdownfields){
      data[entry.name] = this.model[entry.name];
    }
    for (const key in data){
      const value = data[key];
      const controller = this.getFormControl(key);
      controller.setValue(value);
      controller.updateValueAndValidity({onlySelf:true});
      if (!controller.valid){
        return;
      }
    }
    this.submit.emit(data);
    for (const key in this.model){
      this.model[key] = '';
    }
    // for (const key in data){
    //   const control = this.getFormControl(key);
    //   control.reset();
    // }
  }

  valid():boolean{
    for (const key in this.model){
      const value = this.model[key];
      const controller = this.getFormControl(key);
      controller.setValue(value);
      controller.updateValueAndValidity({onlySelf:true});
      if (!controller.valid){
        return false;
      }
    }
    return Object.keys(this.model).length > 0;
  }

  typeOf(field:string){
    const data = field.toLowerCase();
    if (data.includes('search')) return 'search';
    if (data.includes('phone')) return 'tel';
    if (data.includes('email')) return 'email';
    if (data.includes('number')) return 'number';
    if (data.includes('text')) return 'text';
    if (data.includes('color')) return 'color';
    if (data.includes('datetime-local')) return 'datetime-local';
    if (data.includes('date') || data.includes('day')) return 'date';
    if (data.includes('month')) return 'month';
    if (data.includes('week')) return 'week';
    if (data.includes('time')) return 'time';
    if (data.includes('pass')) return 'password';
    if (data.includes('url')) return 'url';
    if (data.includes('#')) return 'number';
    return 'text';
  }

  getFormControl(key: string){
    const type = this.typeOf(key);
    const validators: ValidatorFn[] = [Validators.required];
    if (type == "email")  validators.push(Validators.email);
    if (type == 'tel')    validators.push(Validators.pattern('^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'));
    if (type == 'number') validators.push(Validators.pattern('^\\d$'));
    // minimum 8 characters, at least one letter, at least one number. max length 256
    if (type == 'password')validators.push(Validators.maxLength(256),Validators.pattern(`^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$`));
    return new FormControl('',validators);
  }

  getErrorMessage(key:string): string {
    const control: FormControl = <FormControl>this.fieldControls.get(key);
    if (!control) return '';
    if (control.hasError('required')) return 'You must enter a value';
    if (control.hasError('email'))    return 'Not a valid email';
    if (control.hasError('pattern')){
      const type = this.typeOf(key);
      if (key == 'tel') return 'Must be a valid phone number';
      if (key == 'number') return 'Must be a valid number';
      if (key == 'password') return 'Password must be between 8-256 characters, have at least 1 letter and 1 digit';
    }
    return '';
  }


  get(key:string): FormControl{
    try {
      const control = <FormControl>this.fieldControls.get(key);
      if (!control){
        throw new Error(`Control does not exist for key: ${key}`);
      }
      return control;
    } catch (error){
      try {
        const data = this.getFormControl(key)
        this.fieldControls.set(key, data);
        return data;
      } catch (err){
        throw err;
      }
    }
  }
}
