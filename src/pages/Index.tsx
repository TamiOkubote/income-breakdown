import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAnalytics } from "@/hooks/useAnalytics";
import IncomeForm from "@/components/IncomeForm";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import FinancialSummary from "@/components/FinancialSummary";
import InvestmentStrategies from "@/components/InvestmentStrategies";

interface TaxLoophole {
  id: string;
  title: string;
  description: string;
  savings: number;
  applicableExpenses: string[];
  requirements: string[];
  risks: string[];
  icon: React.ReactNode;
  category: 'pensions' | 'isa' | 'business' | 'property' | 'education' | 'other';
}

interface FormData {
  postcode: string;
  city: string;
  workplacePostcode: string;
  workplaceCity: string;
  income: number;
  hasHousing: boolean;
  knowsRent: boolean;
  customRent: number;
  hasRoommates: boolean;
  numRoommates: number;
  hasCar: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackPageView, activeUsers, totalVisitors } = useAnalytics();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [appliedLoopholes, setAppliedLoopholes] = useState<TaxLoophole[]>([]);

  // Check if we're returning from countdown with results
  useEffect(() => {
    if (location.state?.formData && location.state?.showResults) {
      processFormData(location.state.formData);
      // Clear the state
      navigate("/", { replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

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

  const getCityMultiplier = (city: string) => {
    const cityLower = city.toLowerCase();
    
    // Major expensive cities
    if (cityLower.includes('london')) return 1.5;
    if (cityLower.includes('cambridge') || cityLower.includes('oxford')) return 1.3;
    if (cityLower.includes('brighton') || cityLower.includes('bath')) return 1.25;
    
    // Medium-cost cities
    if (cityLower.includes('bristol') || cityLower.includes('manchester') || 
        cityLower.includes('birmingham') || cityLower.includes('edinburgh')) return 1.15;
    
    // Lower-cost areas
    if (cityLower.includes('reading') || cityLower.includes('leeds') || 
        cityLower.includes('sheffield') || cityLower.includes('liverpool')) return 1.0;
    
    // Default for other areas
    return 0.9;
  };

  const handleFormSubmit = (data: FormData) => {
    // Navigate to countdown page instead of processing immediately
    navigate("/countdown", { state: { formData: data } });
  };

  const processFormData = (data: FormData) => {
    setFormData(data);
    
    const cityMultiplier = getCityMultiplier(data.city);
    const workplaceCityMultiplier = getCityMultiplier(data.workplaceCity);
    const distanceMultiplier = calculateDistanceMultiplier(data.postcode, data.workplacePostcode);
    
    // Enhanced location-based expense calculations with workplace consideration
    const avgCityMultiplier = (cityMultiplier + workplaceCityMultiplier) / 2;
    
    // Tax calculations (UK tax bands for 2024/25)
    const annualIncome = data.income * 12;
    let annualTax = 0;
    if (annualIncome > 12570) {
      const basicRateIncome = Math.min(annualIncome - 12570, 37700);
      annualTax += basicRateIncome * 0.2;
      if (annualIncome > 50270) {
        const higherRateIncome = Math.min(annualIncome - 50270, 75000);
        annualTax += higherRateIncome * 0.4;
        if (annualIncome > 125270) {
          annualTax += (annualIncome - 125270) * 0.45;
        }
      }
    }
    const monthlyTax = annualTax / 12;
    
    // National Insurance calculations
    const monthlyNI = data.income > 1048 ? (Math.min(data.income, 4189) - 1048) * 0.12 + 
                     (data.income > 4189 ? (data.income - 4189) * 0.02 : 0) : 0;
    
    // Housing calculations
    let baseHousing = 0;
    if (data.hasHousing) {
      const housingCost = Math.min(data.income * 0.35 * cityMultiplier, cityMultiplier > 1.3 ? 1200 : 800);
      const totalRoommates = data.hasRoommates ? data.numRoommates + 1 : 1;
      baseHousing = housingCost / totalRoommates;
    }
    
    const baseTransport = Math.min(data.income * 0.15 * distanceMultiplier, 350);
    const baseCar = Math.min(data.income * 0.12 * avgCityMultiplier, 280);
    const baseSubscriptions = Math.min(data.income * 0.08, 85); // Cap at £85
    const baseShopping = Math.min(data.income * 0.18 * cityMultiplier, Math.max(data.income * 0.12, 180));
    const baseOutings = Math.min(data.income * 0.12 * avgCityMultiplier, avgCityMultiplier > 1.3 ? 300 : 180);
    const baseVacations = Math.min(data.income * 0.06, 160); // Cap at £160
    const baseMaintenance = Math.min(data.income * 0.04, 120); // Cap at £120
    
    const totalExpenses = monthlyTax + monthlyNI + baseHousing + baseTransport + baseCar + baseSubscriptions + baseShopping + baseOutings + baseVacations + baseMaintenance;
    setTotalExpenses(Math.round(totalExpenses));
  };

  const remainingIncome = formData ? formData.income - totalExpenses : 0;

  const handleApplyLoopholes = (selectedLoopholes: TaxLoophole[]) => {
    setAppliedLoopholes(selectedLoopholes);
  };

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
                Based on £{formData.income} monthly income • {formData.city}, {formData.postcode} • Work: {formData.workplaceCity}, {formData.workplacePostcode}
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <FinancialSummary 
                  income={formData.income}
                  totalExpenses={totalExpenses}
                  remainingIncome={remainingIncome}
                  onApplyLoopholes={handleApplyLoopholes}
                  appliedLoopholes={appliedLoopholes}
                />
                <ExpenseBreakdown 
                  income={formData.income} 
                  postcode={formData.postcode}
                  city={formData.city}
                  workplacePostcode={formData.workplacePostcode}
                  hasHousing={formData.hasHousing}
                  knowsRent={formData.knowsRent}
                  customRent={formData.customRent}
                  hasRoommates={formData.hasRoommates}
                  numRoommates={formData.numRoommates}
                  hasCar={formData.hasCar}
                  appliedLoopholes={appliedLoopholes}
                />
              </div>
              
              <InvestmentStrategies remainingIncome={remainingIncome} />
              
              <div className="text-center">
                <Button 
                  onClick={() => navigate('/investments', { 
                    state: { remainingIncome, formData } 
                  })}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <TrendingUp className="h-5 w-5" />
                  View Detailed Investment Options
                </Button>
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
