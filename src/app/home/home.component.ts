import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentContent:string = "Dashboard"; //use service to retrieve in future. TODO 
  constructor() {
    
  }

  ngOnInit(): void {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    // this.innerWidth = window.innerWidth;
    console.log(`event: ${window.innerWidth}`);
  }

  expanded(){
    console.log(`expand: ${window.innerWidth}`);
    return window.innerWidth >= 768;
  }
  getClasses(){
    const content: any = {};
    content['col-md-2'] = this.expanded();
    content['as-menu expandW d-flex flex-row-reverse'] = !this.expanded();
    return content;
  }

  
}
