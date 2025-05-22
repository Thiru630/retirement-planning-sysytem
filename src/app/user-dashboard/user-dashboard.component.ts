import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalService } from '../goalservice.service';
import { FinancialyeardataService } from '../financialyeardata.service';
import { ProgressService } from '../progress.service';
import { CommonModule } from '@angular/common';
import { GoalFormComponent } from '../goal-form/goal-form.component';
import { ContributionFormComponent } from '../contributionform/contributionform.component';
import { UserData } from '../user.interface';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, GoalFormComponent, ContributionFormComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userData: UserData | null = null;
  profileId: number = 0;
  goalExists: boolean = false;
  lcExists: boolean = false;
  goalData: any;
  latestContribution: any;
  userProgress: number=0;
  showGoalModal: boolean = false;
  showContributionModal: boolean = false;
  showProgressModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService,
    private financialYearService: FinancialyeardataService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.userData = {
          id: +params['id'],
          firstName: params['firstName'],
          lastName: params['lastName'],
          email: params['email'],
          age: +params['age'],
          gender: params['gender']
        };
        this.profileId = this.userData.id;
        console.log("✅ User Data from QueryParams:", this.userData);
        this.checkGoal();
      } else {
        console.warn('⚠️ No user data found. Redirecting to login...');
        this.router.navigate(['/login']);
      }
    });
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
        this.getUserProgress();
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

  handleGoalSet(goal: any): void {
    if (!goal?.targetSavings || goal.targetSavings <= 0) {
      console.warn('⚠️ Invalid goal data.');
      return;
    }
  
    console.log("✅ Goal Received:", goal);
  
    this.goalService.setGoal(goal).subscribe({
      next: (data) => {
        console.log('✅ Goal data saved:', data);
        this.goalData = data.goalDetails;
        this.goalExists = true;
        this.getUserProgress(); // Fetch updated progress once goal is set
      },
      error: (err) => console.error("❌ Error Saving Goal:", err)
    });
  
    this.showGoalModal = false;
  }
  
  getUserProgress(): void {
    if (!this.goalData?.goalId || !this.goalData?.targetSavings) {
      console.warn('⚠️ Goal ID or Target Savings is missing.');
      return;
    }
  
    this.progressService.getProgress(this.goalData.goalId).subscribe({
      next: (data) => {
        console.log('🔍 User progress fetched:', data);
  
        // Use targetSavings from goalData instead of API response
        if (data.totalSavings != null && this.goalData.targetSavings > 0) {
          this.userProgress = Math.round((data.totalSavings / this.goalData.targetSavings) * 100);
        } else {
          console.warn('⚠️ Invalid savings data detected.');
          this.userProgress = 0; // Default to 0% if data is incorrect
        }
      },
      error: (err) => console.error('❌ Error fetching progress:', err)
    });
  }
  
  
  handleContributionAdded(contribution: any): void {
    if (!contribution?.monthlyInvestment || contribution.monthlyInvestment <= 0) {
      console.warn('⚠️ Invalid contribution data.');
      return;
    }

    console.log("✅ Contribution Received:", contribution);

    this.financialYearService.addContribution(contribution).subscribe({
      next: (data) => {
        console.log("✅ Latest Contribution Saved:", data);
        this.latestContribution = data.data;
        this.lcExists = true;
        this.getUserProgress();
      },
      error: (err) => console.error("❌ Error Saving Contribution:", err)
    });

    this.showContributionModal = false;
  }

  openGoalDialog(): void {
    this.showGoalModal = true;
  }

  openContributionDialog(): void {
    this.showContributionModal = true;
  }

  openProgressDialog(): void {
    this.showProgressModal = true;
  }

  logout(): void {
    console.log("🚪 Logging out...");
    this.router.navigate(['/login']);
  }
}
