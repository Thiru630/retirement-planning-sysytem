import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal-form',
  standalone: true, 
  imports: [CommonModule, FormsModule], // Enables form handling
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css'] 
})
export class GoalFormComponent {
  @Input() profileId!: number;
  @Input() currentAge!: number;
  @Output() goalSet = new EventEmitter<any>(); // Sends goal data to parent

  retirementAge!: number;
  targetSavings!: number;
  currentSavings!: number;

  saveGoal() {
    if (!this.validateGoal()) return;

    const goal = {
      profileId: this.profileId,
      currentAge: this.currentAge,
      retirementAge: this.retirementAge,
      targetSavings: this.targetSavings,
      currentSavings: this.currentSavings
    };

    console.log("Goal Submitted:", goal);
    this.goalSet.emit(goal); // Emit goal data to parent component
  }

  validateGoal(): boolean {
    if (!this.retirementAge || !this.targetSavings || !this.currentSavings || !this.currentAge) {
      console.warn("Missing goal details. Please complete the form.");
      return false;
    }

    if (this.currentAge < 18) {
      console.warn("Current age must be greater than 18.");
      return false;
    }

    if (this.retirementAge <= this.currentAge) {
      console.warn("Retirement age must be greater than current age.");
      return false;
    }

    return true;
  }
}
