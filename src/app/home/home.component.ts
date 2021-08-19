import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stuff: any[] = [];
  constructor() {
    for (let i = 0; i < 10 ; i++){
      this.stuff.push(new randomClassName(11-i, `the element ${i}`,i));
    }
  }

  ngOnInit(): void {
  }

}

class randomClassName {
  value:number|null;
  name:string|null;
  index:number|null;
  constructor(value?:number, name?:string, index?:number){
    this.value = value ?? null;
    this.name = name ?? null;
    this.index = index ?? null;
  }
}
