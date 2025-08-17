import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvestmentStrategies from "@/components/InvestmentStrategies";
import InvestmentRecommendations from "@/components/InvestmentRecommendations";
import Header from "@/components/Header";

const Investments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { remainingIncome, formData } = location.state || {};

  // Store investment state in localStorage when available
  if (remainingIncome && formData) {
    localStorage.setItem('investmentState', JSON.stringify({ remainingIncome, formData }));
  }

  // Try to get from localStorage if not in location state
  let currentRemainingIncome = remainingIncome;
  let currentFormData = formData;
  
  if (!remainingIncome || !formData) {
    const savedState = localStorage.getItem('investmentState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      currentRemainingIncome = parsed.remainingIncome;
      currentFormData = parsed.formData;
    } else {
      navigate('/');
      return null;
    }
  }

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
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Financial Plan
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Investment Portfolio
              </h1>
              <p className="text-muted-foreground">
                £{currentRemainingIncome}/month available for investment • {currentFormData.city}, {currentFormData.postcode} • Work: {currentFormData.workplaceCity}, {currentFormData.workplacePostcode}
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <InvestmentStrategies remainingIncome={currentRemainingIncome} />
            <InvestmentRecommendations remainingIncome={currentRemainingIncome} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Investments;