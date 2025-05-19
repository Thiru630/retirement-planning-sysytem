import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialyeardataService {

  private ContributionUrl = 'http://localhost:5028/api/FinancialData/setfinancialyear';

  constructor(private http:HttpClient, private router: Router) { }
  addContribution(contribute: any): Observable<any> {
      return this.http.post<any>(`${this.ContributionUrl}`, contribute);
    }
}