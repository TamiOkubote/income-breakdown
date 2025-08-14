
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TaxLoopholes from "@/components/TaxLoopholes";
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";

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

interface FinancialSummaryProps {
  income: number;
  totalExpenses: number;
  remainingIncome: number;
  onApplyLoopholes: (selectedLoopholes: TaxLoophole[]) => void;
  appliedLoopholes: TaxLoophole[];
}

const FinancialSummary = ({ income, totalExpenses, remainingIncome, onApplyLoopholes, appliedLoopholes }: FinancialSummaryProps) => {
  const savingsRate = (remainingIncome / income) * 100;
  const expenseRate = (totalExpenses / income) * 100;

  // Calculate total loophole savings
  const totalLoopholeSavings = appliedLoopholes.reduce((sum, loophole) => sum + loophole.savings, 0);
  
  // Calculate inflation impact (approximate 2.5% annually)
  const inflationImpact = totalExpenses * 0.025;
  
  // Calculate adjusted figures
  const originalExpenses = totalExpenses + totalLoopholeSavings;
  const adjustedExpenses = totalExpenses;
  const adjustedRemainingIncome = income - adjustedExpenses;
  const adjustedSavingsRate = (adjustedRemainingIncome / income) * 100;

  const getHealthStatus = () => {
    if (adjustedSavingsRate >= 20) return { status: 'Excellent', color: 'bg-finance-green', icon: CheckCircle };
    if (adjustedSavingsRate >= 10) return { status: 'Good', color: 'bg-accent', icon: TrendingUp };
    if (adjustedSavingsRate >= 5) return { status: 'Fair', color: 'bg-warning', icon: AlertCircle };
    return { status: 'Needs Improvement', color: 'bg-expense-red', icon: TrendingDown };
  };

  const health = getHealthStatus();

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-6 w-6 text-primary" />
          Financial Health Summary
        </CardTitle>
        {(totalLoopholeSavings > 0 || inflationImpact > 0) && (
          <div className="text-sm text-muted-foreground space-y-1">
            {totalLoopholeSavings > 0 && (
              <p className="flex items-center gap-1 text-green-600">
                <Zap className="h-3 w-3" />
                Tax optimization saving you £{totalLoopholeSavings}/month
              </p>
            )}
            {inflationImpact > 0 && (
              <p className="flex items-center gap-1 text-orange-600">
                <TrendingUp className="h-3 w-3" />
                Annual inflation impact: ~£{Math.round(inflationImpact)}/month
              </p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <PoundSterling className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">£{income}</div>
            <div className="text-sm text-muted-foreground">Monthly Income</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg relative">
            <TrendingDown className="h-8 w-8 mx-auto mb-2 text-expense-red" />
            <div className="space-y-1">
              {totalLoopholeSavings > 0 && (
                <div className="text-sm line-through text-muted-foreground">£{originalExpenses}</div>
              )}
              <div className="text-2xl font-bold text-expense-red">£{adjustedExpenses}</div>
              {totalLoopholeSavings > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  -£{totalLoopholeSavings} saved
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-green" />
            <div className="text-2xl font-bold text-finance-green">£{adjustedRemainingIncome}</div>
            <div className="text-sm text-muted-foreground">Available to Save</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Expense Rate</span>
              <div className="flex items-center gap-2">
                {totalLoopholeSavings > 0 && (
                  <span className="text-xs line-through text-muted-foreground">
                    {((originalExpenses / income) * 100).toFixed(1)}%
                  </span>
                )}
                <span className="text-sm font-bold">{expenseRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative">
              <Progress value={expenseRate} className="h-3" />
              {totalLoopholeSavings > 0 && (
                <div className="absolute top-0 right-0 h-3 bg-green-200 rounded-r" 
                     style={{width: `${(totalLoopholeSavings / income) * 100}%`}} />
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Savings Rate</span>
              <span className="text-sm font-bold text-finance-green">{adjustedSavingsRate.toFixed(1)}%</span>
            </div>
            <Progress value={adjustedSavingsRate} className="h-3" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 p-4 bg-white/30 rounded-lg">
          <health.icon className="h-6 w-6" />
          <span className="font-medium">Financial Health:</span>
          <Badge className={health.color}>
            {health.status}
          </Badge>
        </div>

        {/* Impact Summary */}
        {(totalLoopholeSavings > 0 || inflationImpact > 0) && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Financial Impact Analysis</h4>
            <div className="space-y-2 text-sm">
              {totalLoopholeSavings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Monthly tax optimization savings:</span>
                  <span className="font-semibold text-green-700">+£{totalLoopholeSavings}</span>
                </div>
              )}
              {inflationImpact > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-orange-700">Annual inflation impact:</span>
                  <span className="font-semibold text-orange-700">-£{Math.round(inflationImpact)}</span>
                </div>
              )}
              {totalLoopholeSavings > inflationImpact && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-blue-700">Net monthly benefit:</span>
                  <span className="font-bold text-blue-700">+£{Math.round(totalLoopholeSavings - inflationImpact/12)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-3">
          <p className="font-medium">Recommendations:</p>
          <ul className="space-y-1">
            {adjustedSavingsRate < 20 && (
              <li>• Aim for 20% savings rate by reducing discretionary spending</li>
            )}
            {adjustedSavingsRate < 10 && (
              <li>• Review and cut unnecessary subscriptions</li>
            )}
            <li>• Consider increasing income through side projects or skills development</li>
            <li>• Track expenses monthly to identify savings opportunities</li>
            {totalLoopholeSavings === 0 && (
              <li>• Explore tax optimization strategies to reduce expenses</li>
            )}
          </ul>
          
          <div className="pt-2">
            <TaxLoopholes 
              onApplyLoopholes={onApplyLoopholes}
              appliedLoopholes={appliedLoopholes}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
