namespace Retirement_planning.Models
{   
    public class FinancialYearModel
    {
        public int FId { get; set; }  
        public int GoalId { get; set; }  
        public int Month { get; set; }  
        public int Year { get; set; }  
        public long MonthlyInvestment { get; set; }
        public string? FinancialYear { get; set; }  
    }
}