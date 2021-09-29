import { Component, OnInit } from '@angular/core';
import { HomeViewService } from 'app/services/home-view.service';

@Component({
  selector: 'app-submission-view',
  templateUrl: './submission-view.component.html',
  styleUrls: ['./submission-view.component.scss']
})
export class SubmissionViewComponent implements OnInit {

  constructor(public homeView: HomeViewService) { }

  ngOnInit(): void {
  }

  data(){
    return JSON.stringify(this.homeView.submissionData);
  }
}
