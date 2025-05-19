import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GoalService } from '../goalservice.service';
import { FinancialyeardataService } from '../financialyeardata.service';
import { CommonModule } from '@angular/common';
import { GoalFormComponent } from '../goal-form/goal-form.component';
import { ContributionFormComponent } from '../contributionform/contributionform.component';
import { UserData } from '../user.interface'; // ✅ Import UserData for strict typing

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, GoalFormComponent, ContributionFormComponent], 
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})

export class UserDashboardComponent implements OnInit {
 // @Input() userData!: UserData | null; // ✅ Accepts both UserData and null
  @Input() goalData!: any; // ✅ Receives goal data from parent
  @Output() goalUpdated = new EventEmitter<any>(); // ✅ Sends updated goal data
  @Output() contributionAdded = new EventEmitter<any>(); // ✅ Sends latest contribution
  @Input() userData: any // ✅ Allows null values safely

  profileId?: number;
  goalExists: boolean = false;
  showGoalModal: boolean = false;
  showContributionModal: boolean = false;
  latestContribution: any = null;

  constructor(
    private router: Router, 
    private goalService: GoalService,
    private financialYearService: FinancialyeardataService, 
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("✅ User Data in Dashboard:", this.userData); // Debugging log
  
    // if (!this.userData || !this.userData.id) {
    //   console.warn('⚠️ No user data received. Redirecting to login...');
    //   this.router.navigate(['/login']);
    //   return;
    // }
  
    this.profileId = this.userData.id || 0;  // ✅ Assign fallback values
    this.checkGoal();
  }
  

  checkGoal(): void {
    if (!this.profileId) {
      console.warn('⚠️ Profile ID is missing.');
      return;
    }

    this.goalService.checkGoal(this.profileId).subscribe({
      next: (data) => {
        console.log('✅ Goal data from API:', data);

        this.goalData = data;
        this.goalExists = true;
        this.goalUpdated.emit(this.goalData); // ✅ Emit updated goal data
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn('⚠️ No goal found for the user.');
          this.goalExists = false;
        } else {
          console.error('❌ Error fetching goal:', err);
        }
      }
    });
  }

  openGoalDialog(): void {
    this.showGoalModal = true;
  }

  openContributionDialog(): void {
    this.showContributionModal = true;
  }

  handleGoalSet(goal: any): void {
    if (!goal || !goal.targetSavings || goal.targetSavings <= 0) {
      console.warn('⚠️ Invalid goal data.');
      return;
    }

    console.log("✅ Goal Received:", goal);

    this.goalService.setGoal(goal).subscribe({
      next: (data) => {
        console.log('✅ Goal data saved:', data);

        this.goalData = data.goalDetails;
        this.goalExists = true;
        this.goalUpdated.emit(this.goalData); // ✅ Emit updated goal data
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.error("❌ Error Saving Goal:", err)
    });

    this.showGoalModal = false;
  }

  handleContributionAdded(contribution: any): void {
    if (!contribution || contribution.monthlyInvestment <= 0) {
      console.warn('⚠️ Invalid contribution data.');
      return;
    }

    console.log("✅ Contribution Received:", contribution);

    this.financialYearService.addContribution(contribution).subscribe({
      next: (data) => {
        console.log("✅ Latest Contribution Saved:", data);

        this.latestContribution = data;
        this.contributionAdded.emit(this.latestContribution); // ✅ Emit latest contribution
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.error("❌ Error Saving Contribution:", err)
    });

    this.showContributionModal = false;
  }

  logout(): void {
    console.log("🚪 Logging out...");
    this.userData = null;
    this.goalData = null;
    this.latestContribution = null;
    this.router.navigate(['/login']);
  }
}
