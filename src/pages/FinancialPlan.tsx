import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, TrendingUp, PieChart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import FinancialSummary from "@/components/FinancialSummary";
import InvestmentStrategies from "@/components/InvestmentStrategies";
import InvestmentRecommendations from "@/components/InvestmentRecommendations";
import Header from "@/components/Header";

const FinancialPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  if (!formData) {
    navigate('/');
    return null;
  }

  const monthlyIncome = formData.income;
  // Calculate expenses based on formData
  const calculateExpenses = () => {
    // This is a simplified calculation - the actual ExpenseBreakdown component does the real calculation
    const baseExpenses = monthlyIncome * 0.7; // Rough estimate
    return Math.round(baseExpenses);
  };

  const totalExpenses = calculateExpenses();
  const remainingIncome = monthlyIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Start
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Calculator className="h-8 w-8" />
                Your Personalised Financial Plan
              </h1>
              <p className="text-muted-foreground">
                Based on your information from {formData.city}, {formData.postcode} • Work: {formData.workplaceCity}, {formData.workplacePostcode}
              </p>
            </div>
            {remainingIncome > 0 && (
              <Button
                onClick={() => navigate('/investments', { state: { remainingIncome, formData } })}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Investment Options
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FinancialSummary 
              income={monthlyIncome}
              totalExpenses={totalExpenses}
              remainingIncome={remainingIncome}
              onApplyLoopholes={() => {}}
              appliedLoopholes={[]}
            />
            <ExpenseBreakdown 
              income={monthlyIncome}
              postcode={formData.postcode}
              city={formData.city}
              workplacePostcode={formData.workplacePostcode}
              hasHousing={formData.hasHousing}
              knowsRent={formData.knowsRent}
              customRent={formData.customRent}
              hasRoommates={formData.hasRoommates}
              numRoommates={formData.numRoommates}
              hasCar={formData.hasCar}
            />
          </div>
          
          {remainingIncome > 0 && (
            <div className="space-y-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Investment Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Great news! You have £{remainingIncome}/month available for investments. 
                    This puts you in an excellent position to build wealth for your future.
                  </p>
                  <Button
                    onClick={() => navigate('/investments', { state: { remainingIncome, formData } })}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    Explore Investment Strategies
                  </Button>
                </CardContent>
              </Card>
              
              <InvestmentStrategies remainingIncome={remainingIncome} />
              <InvestmentRecommendations remainingIncome={remainingIncome} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FinancialPlan;