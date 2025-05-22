import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserData } from '../user.interface'; // ✅ Strict typing

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginSuccess: string = '';
  userData: UserData | null = null;

  constructor(private profileService: ProfileService, private router: Router) {}

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.loginSuccess = '⚠️ Please enter both email and password.';
      return;
    }

    console.log("Attempting login for:", this.email);

    this.profileService.login(this.email, this.password).subscribe({
      next: (response: UserData) => {
        console.log("✅ Login Success:", response);
        if (response?.id) {
          this.loginSuccess = '✅ Login successful! Redirecting...';

          // ✅ Navigate with queryParams
          this.router.navigate(['/user-dashboard'], {
            queryParams: {
              id: response.id,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              age: response.age
            }
          });
        } else {
          console.warn('⚠️ User data missing ID, login may have failed.');
          this.loginSuccess = '❌ Login failed. Please try again.';
        }
      },
      error: (error) => {
        console.error("❌ Login Error:", error);
        this.loginSuccess = '❌ Login failed. Please check your details.';
      }
    });
  }

  logout(): void {
    console.log("🚪 Logging out...");
    this.router.navigate(['/login']);
  }
}
