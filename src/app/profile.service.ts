import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserData } from './user.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
  
})
export class ProfileService {
  private loginUrl='http://localhost:5028/api/Profile/login';
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<UserData> { 
    return this.http.post<UserData>(this.loginUrl, { email, password });
  }
}