import { Component, OnInit } from '@angular/core';
import { RestService } from 'app/services/rest.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit {

  _categories: any[] = [];


  constructor(public rest: RestService) { }

  async ngOnInit(): Promise<void> {
    await this.refreshData();
  }



  async refreshData(){
    this._categories = await this.rest.req('get',`categories/`);
  }
}
