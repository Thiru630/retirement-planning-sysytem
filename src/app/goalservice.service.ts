import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Ensure Observable is imported

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private getgoalUrl = 'http://localhost:5028/api/Goal/getgoal';
  private setgoalUrl = 'http://localhost:5028/api/Goal/SetGoal';

  constructor(private http: HttpClient) {}

  checkGoal(ProfileId: number): Observable<any> {
    return this.http.get<any>(`${this.getgoalUrl}/${ProfileId}`);
  }

  setGoal(goal: any): Observable<any> {
    return this.http.post<any>(`${this.setgoalUrl}`, goal);
  }
}
