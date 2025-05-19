import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionFormComponent } from './contributionform.component';

describe('ContributionformComponent', () => {
  let component: ContributionFormComponent;
  let fixture: ComponentFixture<ContributionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
