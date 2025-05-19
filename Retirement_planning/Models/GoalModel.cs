namespace Retirement_planning.Models
{
    public class GoalModel
    {
        public int GoalId { get; set; }
        public int ProfileId { get; set; }
        public int CurrentAge { get; set; }
        public int RetirementAge { get; set; }
        public long TargetSavings { get; set; }
        public float MonthlyContribution { get; set; }
        public long CurrentSavings { get; set; }
    }
}