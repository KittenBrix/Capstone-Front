import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-weeklytimeview',
  templateUrl: './weeklytimeview.component.html',
  styleUrls: ['./weeklytimeview.component.scss']
})
export class WeeklytimeviewComponent implements OnInit, AfterViewInit {
  static daysOfWeek = ['Su','M','Tu','W','Th','F','Sa'];
  targetDay = moment(); // the current day is focussed by default. 
  ready: boolean = false;
  scheduleSize: number = 1;

  timeEntries: any[] = [];
  @Input() set scheduleData(data: any[]) {
    this.timeEntries = data;
    console.log(data);
  }

  constructor() {
    for (let i = 0; i < 3; i++){
      const entry = {
        start: moment(),
        end: moment()
      };
      entry.start.add(18*i,'hours');
      entry.end.add(18*i + 8,'hours')
      // this.timeEntries.push(entry);
    }
  }

  @ViewChild('schedule')
  scheduleFrame!: ElementRef;
  @ViewChildren('canvas')
  canvases!: QueryList<HTMLCanvasElement>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    // whatever, this doesn't work, we need to alter displaycount and render after data is retrieved.
    this.scheduleSize = this.displayCount();
    setTimeout(() => {
      this.ready = true;
      this.render();
    }, 10);
  }

  minus():void{
    this.targetDay.add(-this.scheduleSize,'days');
    setTimeout(async () => {
      await this.render();      
    }, 50);

  }
  add():void{
    this.targetDay.add(this.scheduleSize,'days');
    setTimeout(() => {
      this.render();      
    }, 50);
  }

  getDays():string[]{
    if (!this.ready) return [];
    // return X day titles, ending on targetDay
    const result: moment.Moment[] = [];
    const size = this.scheduleSize;
    for (let i = 1; i <= size; i++){
      const X = moment(this.targetDay);
      X.add(i-size,'days');
      result.push(X);
    }
    return result.map(day => {
      return day.format(`ddd - M/D`);
    })
  }

  displayCount():number{
    console.log("evaluating...", !!this.scheduleFrame);
    if (this.scheduleFrame){
      const total = Math.floor(this.scheduleFrame.nativeElement.offsetWidth / 160);
      const result = Math.max(Math.min(7, total),1);
      console.log(total, result, this.scheduleFrame.nativeElement.offsetWidth);
      return result;
    }
    return 1;
  }

  async render(){
    const data = this.canvases.toArray();
    for (const index in data){    
      const canvas: HTMLCanvasElement = <HTMLCanvasElement>((<any>data[index]).nativeElement);

      const rect = (<Element>canvas.parentNode).getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const day = moment(this.targetDay);
      day.add(+index - this.scheduleSize + 1, 'days');
      const drawables: any[] = this.timeEntries.filter(entry => {
        return sameDay(entry.start, day) || sameDay(entry.end,day);
      });
      const context: CanvasRenderingContext2D = <any>canvas.getContext('2d');
      context.fillStyle=`#22222200`;
      // fill color
      context.fillRect(0,0,canvas.width,canvas.height);
      // hour markers
      const delineation = 24;
      for (let m = 0; m < delineation; m++){
        context.beginPath();
        const Y = Math.floor(canvas.height * (m/delineation))
        context.moveTo(0,Y);
        let p = 1;
        if ([1,3,5,7,9,11,13,15,17,19,21,23].includes(m)) p=0.05;
        if ([0,2,4,6,8,10,12,14,16,18,20,22].includes(m)) p=0.1;
        if ([0,4,8,12,16,20].includes(m)) p=0.25;
        context.lineTo(canvas.width * p, Y);
        context.stroke();
      }
      // time entries
      drawables.forEach(timeEntry => {
        const S = <moment.Moment>timeEntry.start;
        const E = <moment.Moment>timeEntry.end;
        const start = (sameDay(day,S) ? (-S.clone().startOf('day').diff(S,'minutes')): 0)/ (60*24);
        const end = (sameDay(day,E) ? (-E.clone().startOf('day').diff(E,'minutes')) : (60*24))/ (60*24);
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = "#DDD";
        context.fillRect(canvas.width/8,start*canvas.height,canvas.width,(end-start)*canvas.height);
      });


    }
    return;
  }

  onResize(event:any){
    this.scheduleSize = this.displayCount();
  }

}

function sameDay(d1:moment.Moment, d2:moment.Moment) {
  return d1.isSame(d2,'day');
}

