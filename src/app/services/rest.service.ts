import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JWTService } from './jwt.service';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private jwt: JWTService) { }

  public async req(method: string, url: string, body = null): Promise<any>{
    return await this.generateHttpPromise(method, `${environment.apiUrl}/${url}`, body);
  }
  
  private generateHttpPromise(httpMethod: string, url: string, body = null): Promise<any> {
    let promise: Promise<any> = null;

    if (body) {
      promise = this.http[httpMethod](url, body, {
        headers: this.headers()
      })
        .toPromise()
        .catch(err => this.handleError(err));
    } else {
      promise = this.http[httpMethod](url, {
        headers: this.headers()
      })
        .toPromise()
        .catch(err => this.handleError(err));
    }

    if (!environment.production) {
      promise.then(res => {
        this.generateLogs(httpMethod, url, body, res);
      });
    }

    return promise;
  }

  public headers(){
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.jwt.checkToken()
    });
  }


  protected generateLogs(type: string, url: string, dataSent?: any, dataReturned?: any): void {
    console.log(`%c ${type.toUpperCase()} API CALL TO`, 'background-color: #333; color: #98bccd;');
    console.log(url);
    console.log(`%c DATA SENT`, 'background-color: #333; color: #fac5c5;');
    console.table(dataSent);
    console.log(`%c DATA RETURNED`, 'background-color: #333; color: #f5f5f5;');
    console.table(dataReturned);
  }

  private handleError(serverError: any): void {
    try {
      console.log('Caught try', serverError);
    } catch (e) {
      console.log('Caught catch', e);
    }
  }

}
