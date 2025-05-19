import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contribution-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contributionform.component.html',
  styleUrls: ['./contributionform.component.css']
})
export class ContributionFormComponent {
  @Input() goalId!: number; // Receiving GoalId from UserDashboardComponent
  @Output() contributionAdded = new EventEmitter<any>();

  month!: number;
  year!: number;
  monthlyInvestment!: number; // Changed from bigint to number for form compatibility

  submitContribution() {
    if (!this.validateContribution()) return;

    const contribution = {
      goalId: this.goalId,
      month: this.month,
      year: this.year,
      monthlyInvestment: this.monthlyInvestment
    };

    console.log("Contribution Submitted:", contribution);
    this.contributionAdded.emit(contribution); // Emitting the data to the parent component
  }

  validateContribution(): boolean {
    if (!this.month || !this.year || !this.monthlyInvestment) {
      console.warn("Missing contribution details. Please complete the form.");
      return false;
    }

    if (this.month < 1 || this.month > 12) {
      console.warn("Month must be between 1 and 12.");
      return false;
    }

    if (this.year < new Date().getFullYear()) {
      console.warn("Year must be the current year or later.");
      return false;
    }

    if (this.monthlyInvestment <= 0) {
      console.warn("Investment must be greater than zero.");
      return false;
    }

    return true;
  }
}
