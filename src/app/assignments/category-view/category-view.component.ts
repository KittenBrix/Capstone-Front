import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';
import { HomeViewService } from 'app/services/home-view.service';
import { RestService } from 'app/services/rest.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnChanges {

  @Input()
  category: any = {
    id: 0,
    name: '',
    description: ''
  };
  _cat: number = 0;

  _assignments: any[] = [];


  constructor(public rest: RestService, public auth: Auth, public homeView: HomeViewService) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.category.id != this._cat ){
      setTimeout(async () => {
        await this.getContent(this.category.id);
      }, 0);
    }
    this._cat = this.category.id;
  }

  async getContent(id:number){
    this._assignments = await this.rest.req('get',`categories/${id}/assignments/`);
    

  }



}
