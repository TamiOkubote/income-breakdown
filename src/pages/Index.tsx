import { useState } from "react";
import Header from "@/components/Header";
import IncomeForm from "@/components/IncomeForm";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import InvestmentStrategies from "@/components/InvestmentStrategies";
import FinancialSummary from "@/components/FinancialSummary";

interface FormData {
  postcode: string;
  workplacePostcode: string;
  income: number;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const calculateDistanceMultiplier = (homePostcode: string, workPostcode: string) => {
    // Simplified distance calculation based on postcode areas
    const getPostcodeArea = (postcode: string) => postcode.replace(/\d.*/, '');
    const homeArea = getPostcodeArea(homePostcode);
    const workArea = getPostcodeArea(workPostcode);
    
    // London areas
    const londonAreas = ['SW', 'SE', 'E', 'W', 'N', 'NW', 'EC', 'WC'];
    const isHomeLondon = londonAreas.some(area => homeArea.startsWith(area));
    const isWorkLondon = londonAreas.some(area => workArea.startsWith(area));
    
    if (isHomeLondon && isWorkLondon) return 1.0; // Both in London
    if (isHomeLondon || isWorkLondon) return 1.4; // One in London, one outside
    if (homeArea === workArea) return 0.8; // Same area
    return 1.2; // Different areas outside London
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    
    // Calculate realistic capped expenses
    const locationMultiplier = data.postcode.startsWith('SW') || data.postcode.startsWith('W') ? 1.3 : 
                              data.postcode.startsWith('E') || data.postcode.startsWith('SE') ? 1.1 : 1.0;
    
    const distanceMultiplier = calculateDistanceMultiplier(data.postcode, data.workplacePostcode);
    
    // Realistic expense caps (not percentage-based for all categories)
    const baseTransport = Math.min(data.income * 0.15 * locationMultiplier * distanceMultiplier, 300);
    const baseCar = Math.min(data.income * 0.12 * locationMultiplier, 250);
    const baseSubscriptions = Math.min(data.income * 0.08, 80); // Cap at £80
    const baseShopping = Math.min(data.income * 0.20, Math.max(data.income * 0.15, 200)); // Minimum £200
    const baseOutings = Math.min(data.income * 0.12, 200); // Cap at £200
    const baseVacations = Math.min(data.income * 0.05, 150); // Cap at £150
    const baseMaintenance = Math.min(data.income * 0.03, 100); // Cap at £100
    
    const totalExpenses = baseTransport + baseCar + baseSubscriptions + baseShopping + baseOutings + baseVacations + baseMaintenance;
    setTotalExpenses(Math.round(totalExpenses));
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
                Based on £{formData.income} monthly income • Home: {formData.postcode} • Work: {formData.workplacePostcode}
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
                  workplacePostcode={formData.workplacePostcode}
                />
              </div>
              
              <div>
                <InvestmentStrategies remainingIncome={remainingIncome} />
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
