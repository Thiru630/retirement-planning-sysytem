import { Component, EventEmitter, Output } from '@angular/core';
import { Event, Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserData } from '../user.interface'; // ✅ Correct Import
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,UserDashboardComponent], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginSuccess: string = ''; // ✅ Now properly included for user feedback
  userData: UserData | null = null; // ✅ Supports clearing data

  @Output() userLoggedIn = new EventEmitter<any>(); // ✅ Emit typed user data

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

        if (response?.id) { // ✅ Ensure user data contains valid info
          this.userData = response;
          this.loginSuccess = '✅ Login successful! Redirecting...';
          console.log(this.userData);
          this.userLoggedIn.emit(response); // ✅ Emit user data correctly
          setTimeout(() => this.router.navigate(['/user-dashboard']), 500); // ✅ Delay for smoother transition
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
    this.userData = null; // ✅ Clear user data
    this.userLoggedIn.emit(null); // ✅ Emit null to parent component
    this.loginSuccess = '🔵 Logged out successfully!';
    this.router.navigate(['/login']); 
  }
}
