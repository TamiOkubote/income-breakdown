import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  PiggyBank, 
  Shield, 
  Globe, 
  Target,
  Zap,
  Building,
  Award
} from "lucide-react";

interface InvestmentOption {
  name: string;
  allocation: number;
  amount: number;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  icon: React.ReactNode;
  timeHorizon: string;
  expectedReturn: string;
}

interface InvestmentRecommendationsProps {
  remainingIncome: number;
}

const InvestmentRecommendations = ({ remainingIncome }: InvestmentRecommendationsProps) => {
  // Conservative allocation for young professionals
  const investments: InvestmentOption[] = [
    {
      name: "Emergency Fund (ISA)",
      allocation: 25,
      amount: Math.round(remainingIncome * 0.25),
      risk: 'Low',
      description: "High-yield savings account for emergencies",
      icon: <Shield className="h-5 w-5 text-finance-green" />,
      timeHorizon: "Immediate access",
      expectedReturn: "2-4% annually"
    },
    {
      name: "S&P 500 Index Fund",
      allocation: 30,
      amount: Math.round(remainingIncome * 0.30),
      risk: 'Medium',
      description: "Diversified US stock market exposure",
      icon: <Globe className="h-5 w-5 text-primary" />,
      timeHorizon: "5+ years",
      expectedReturn: "7-10% annually"
    },
    {
      name: "Stocks & ETFs",
      allocation: 20,
      amount: Math.round(remainingIncome * 0.20),
      risk: 'High',
      description: "Individual stocks and sector ETFs",
      icon: <TrendingUp className="h-5 w-5 text-investment-purple" />,
      timeHorizon: "3+ years",
      expectedReturn: "5-15% annually"
    },
    {
      name: "Pension Contribution",
      allocation: 15,
      amount: Math.round(remainingIncome * 0.15),
      risk: 'Low',
      description: "Workplace pension with employer matching",
      icon: <PiggyBank className="h-5 w-5 text-accent" />,
      timeHorizon: "Retirement",
      expectedReturn: "6-8% annually"
    },
    {
      name: "Bonds & Fixed Income",
      allocation: 10,
      amount: Math.round(remainingIncome * 0.10),
      risk: 'Low',
      description: "Government and corporate bonds",
      icon: <Building className="h-5 w-5 text-warning" />,
      timeHorizon: "1-5 years",
      expectedReturn: "3-6% annually"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-finance-green';
      case 'Medium': return 'bg-warning';
      case 'High': return 'bg-expense-red';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-6 w-6 text-investment-purple" />
          Investment Strategy
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recommended allocation for £{remainingIncome} monthly surplus
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {investments.map((investment, index) => (
          <div key={index} className="space-y-3 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {investment.icon}
                <div>
                  <h3 className="font-semibold">{investment.name}</h3>
                  <p className="text-sm text-muted-foreground">{investment.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">£{investment.amount}</div>
                <Badge className={getRiskColor(investment.risk)}>
                  {investment.risk} Risk
                </Badge>
              </div>
            </div>
            
            <Progress value={investment.allocation} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Time Horizon: </span>
                <span className="font-medium">{investment.timeHorizon}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expected Return: </span>
                <span className="font-medium text-finance-green">{investment.expectedReturn}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Investment Tips for Young Professionals</h3>
          </div>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Start with low-cost index funds for instant diversification</li>
            <li>• Maximize employer pension matching - it's free money!</li>
            <li>• Build 3-6 months expenses as emergency fund first</li>
            <li>• Consider Stocks & Shares ISA for tax-free growth</li>
            <li>• Time in market beats timing the market</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentRecommendations;