
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TaxLoopholes from "@/components/TaxLoopholes";
import { useState } from "react";
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
  Calendar,
  Calculator
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

interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  description: string;
}

interface FinancialSummaryProps {
  income: number;
  totalExpenses: number;
  remainingIncome: number;
  onApplyLoopholes: (selectedLoopholes: TaxLoophole[]) => void;
  appliedLoopholes: TaxLoophole[];
  expenseBreakdown?: ExpenseItem[];
}

const FinancialSummary = ({ income, totalExpenses, remainingIncome, onApplyLoopholes, appliedLoopholes, expenseBreakdown = [] }: FinancialSummaryProps) => {
  const [hasOverspent, setHasOverspent] = useState<string>('');
  const [actualSpending, setActualSpending] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Weekly budget calculations
  const getWeeklyBudgets = () => {
    return expenseBreakdown
      .filter(expense => !expense.category.includes('Taxes') && !expense.category.includes('Housing'))
      .map(expense => ({
        category: expense.category,
        weeklyBudget: Math.round(expense.amount / 4.33), // Convert monthly to weekly
        monthlyAmount: expense.amount,
        icon: expense.icon
      }));
  };

  const weeklyBudgets = getWeeklyBudgets();
  const totalWeeklyBudget = weeklyBudgets.reduce((sum, budget) => sum + budget.weeklyBudget, 0);

  const handleSubmitSpending = () => {
    if (hasOverspent && actualSpending) {
      setShowSuggestions(true);
    }
  };

  const calculateSavingsOrOverspend = () => {
    const spentAmount = parseFloat(actualSpending) || 0;
    if (hasOverspent === 'no') {
      return totalWeeklyBudget - spentAmount;
    } else {
      return spentAmount - totalWeeklyBudget;
    }
  };

  const getSuggestions = () => {
    const amount = calculateSavingsOrOverspend();
    
    if (hasOverspent === 'no') {
      return [
        `Increase next week's budget by £${Math.round(amount * 0.7)} for more flexibility`,
        `Add £${Math.round(amount * 0.3)} to your savings account`,
        `Set aside £${amount} as an emergency buffer for unexpected expenses`
      ];
    } else {
      return [
        'Cut discretionary spending like dining out and entertainment',
        'Use public transport instead of taxis/rideshares',
        'Prepare meals at home instead of ordering takeout',
        'Review and cancel unused subscriptions temporarily',
        `Reduce available savings by £${Math.round(amount)} to cover overspend`
      ];
    }
  };

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

        {/* Weekly Budget Tracker */}
        {weeklyBudgets.length > 0 && (
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Budget Tracker
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your weekly spending based on your monthly budget
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weekly Budget Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Weekly Budget Allocation</h4>
                {weeklyBudgets.map((budget, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-md">
                    <div className="flex items-center gap-2">
                      {budget.icon}
                      <span className="text-sm font-medium">{budget.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">£{budget.weeklyBudget}</div>
                      <div className="text-xs text-muted-foreground">(£{budget.monthlyAmount}/month)</div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Total Weekly Budget
                    </span>
                    <span className="text-primary">£{totalWeeklyBudget}</span>
                  </div>
                </div>
              </div>

              {/* Spending Questions */}
              <div className="space-y-4 p-4 bg-white/30 rounded-lg">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Did you overspend this week?</Label>
                  <RadioGroup value={hasOverspent} onValueChange={setHasOverspent} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {hasOverspent && (
                  <div className="space-y-2">
                    <Label htmlFor="actual-spending" className="text-sm font-medium">
                      How much did you actually spend this week?
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="actual-spending"
                        type="number"
                        placeholder="Enter amount"
                        value={actualSpending}
                        onChange={(e) => setActualSpending(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSubmitSpending} disabled={!actualSpending}>
                        Calculate
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {showSuggestions && actualSpending && (
                <div className={`p-4 rounded-lg border ${
                  hasOverspent === 'no' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    hasOverspent === 'no' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {hasOverspent === 'no' 
                      ? `Great! You saved £${calculateSavingsOrOverspend()} this week` 
                      : `You overspent by £${calculateSavingsOrOverspend()} this week`
                    }
                  </h4>
                  <div className="space-y-1">
                    {getSuggestions().map((suggestion, index) => (
                      <p key={index} className={`text-sm ${
                        hasOverspent === 'no' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        • {suggestion}
                      </p>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => {
                      setHasOverspent('');
                      setActualSpending('');
                      setShowSuggestions(false);
                    }}
                  >
                    Track Another Week
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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
