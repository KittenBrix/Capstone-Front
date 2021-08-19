import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  items: any[] = ["Hello","world","I","live","here",'blah','stuff','things',true,1,2,3];
  constructor() { }

  ngOnInit(): void {
  }


  log(arg:any){
    console.log(arg);
  }

  myCol(value:number){
    // return (r,g,b)
    const data = [(value * 60 + 130) % 255,(value * 170 + 20) % 255,(value * 93 + 200) % 255];
    return `rgb(${data[0]},${data[1]},${data[2]})`;
  }
}
