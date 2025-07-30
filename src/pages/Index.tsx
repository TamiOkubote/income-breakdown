import { useState } from "react";
import Header from "@/components/Header";
import IncomeForm from "@/components/IncomeForm";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import InvestmentRecommendations from "@/components/InvestmentRecommendations";
import FinancialSummary from "@/components/FinancialSummary";

interface FormData {
  postcode: string;
  income: number;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    
    // Calculate total expenses based on income and location
    const locationMultiplier = data.postcode.startsWith('SW') || data.postcode.startsWith('W') ? 1.3 : 
                              data.postcode.startsWith('E') || data.postcode.startsWith('SE') ? 1.1 : 1.0;
    
    const expenses = data.income * (0.75 * locationMultiplier); // Roughly 75% of income on expenses
    setTotalExpenses(Math.round(expenses));
  };

  const remainingIncome = formData ? formData.income - totalExpenses : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!formData ? (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-primary">
                Take Control of Your Finances
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Get personalized budgeting advice and investment recommendations 
                tailored to your income and location as an intern or apprentice.
              </p>
            </div>
            <IncomeForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-primary">
                Your Personalized Financial Plan
              </h2>
              <p className="text-muted-foreground">
                Based on £{formData.income} monthly income in {formData.postcode}
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <FinancialSummary 
                  income={formData.income}
                  totalExpenses={totalExpenses}
                  remainingIncome={remainingIncome}
                />
                <ExpenseBreakdown 
                  income={formData.income} 
                  postcode={formData.postcode} 
                />
              </div>
              
              <div>
                <InvestmentRecommendations remainingIncome={remainingIncome} />
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setFormData(null)}
                className="text-primary hover:text-primary/80 font-medium"
              >
                ← Start Over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
