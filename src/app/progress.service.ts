import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private getprogressUrl = 'http://localhost:5028/api/Progress/getprogress';
  constructor(private http: HttpClient) {}

  getProgress(goalId : number) : Observable<any> {
    return this.http.get<any>(`${this.getprogressUrl}/${goalId}`);
  }
 
}
