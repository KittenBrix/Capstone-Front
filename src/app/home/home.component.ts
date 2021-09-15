import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeViewService } from 'app/services/home-view.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentContent:string = "Dashboard"; //use service to retrieve in future. TODO 
  @ViewChild("mainContent",{static: false, read: ViewContainerRef}) mainContentRef: any;

  // TODO : change dynamic component loading to nested router outlet with a module. use workoutcenter.
  // I don't want to :/ just wanna do a bad code thing and manually manage fake routes. I don't want ppl to be
  // able to hyperlink into the content served here.
  constructor(
    private homeViewService: HomeViewService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.homeViewService.showOn(this.mainContentRef);
    this.homeViewService.navigate(this.homeViewService.getNavigationOptions()[0]);
  }

  expanded(){
    return window.innerWidth >= 768;
  }
  getClasses(){
    const content: any = {};
    content['col-md-2 expandH bg-dark'] = this.expanded();
    content['as-menu expandW d-flex flex-row-reverse'] = !this.expanded();
    return content;
  }

  
}
