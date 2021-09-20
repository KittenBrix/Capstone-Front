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

  public timeEntries: any[] = [];

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
      const total = Math.floor(this.scheduleFrame.nativeElement.offsetWidth / 100);
      const result = Math.max(Math.min(7, total),1);
      console.log(total, result, this.scheduleFrame.nativeElement.offsetWidth);
      return result;
    }
    return 1;
  }

  public async render(){
    const data = this.canvases.toArray();
    for (const index in data){    
      const canvas: HTMLCanvasElement = <HTMLCanvasElement>((<any>data[index]).nativeElement);

      const rect = (<Element>canvas.parentNode).getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height - 10;
      const day = moment(this.targetDay);
      day.add(+index - this.scheduleSize + 1, 'days');
      const drawables: any[] = this.timeEntries.filter(entry => {
        return sameDay(moment(entry.start), day) || sameDay(moment(entry.end),day);
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
        let p = 0.025;
        if ([1,3,5,7,9,11,13,15,17,19,21,23].includes(m)) p=0.05;
        if ([2,4,6,8,10,12,14,16,18,20,22].includes(m)) p=0.25;
        if ([6,12,18,24].includes(m)) p=0.45;
        if ([12].includes(m)) p=0.75;
        const start = (canvas.width*(1-p))/2;
        const end = canvas.width * p + start;
        context.moveTo(start,Y);
        context.lineTo(end, Y);
        context.stroke();
      }
      // time entries
      drawables.forEach(timeEntry => {
        const S = moment(timeEntry.start);
        const E = moment(timeEntry.end);
        const start = (sameDay(day,S) ? (-S.clone().startOf('day').diff(S,'minutes')): 0)/ (60*24);
        const end = (sameDay(day,E) ? (-E.clone().startOf('day').diff(E,'minutes')) : (60*24))/ (60*24);
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = "#DDD";
        context.fillRect(0,start*canvas.height,canvas.width,(end-start)*canvas.height);
        const oldfill = context.fillStyle;
        context.fillStyle = `#000`;
        context.fillText(`${S.format('hh:mmA')} - ${E.format('hh:mmA')}`,1,(start)*canvas.height+11,canvas.width);
        context.fillText(timeEntry.source,1,(start)*canvas.height+21,canvas.width);
        context.fillStyle = oldfill;
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

