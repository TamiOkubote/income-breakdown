import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface FinancialSummaryProps {
  income: number;
  totalExpenses: number;
  remainingIncome: number;
}

const FinancialSummary = ({ income, totalExpenses, remainingIncome }: FinancialSummaryProps) => {
  const savingsRate = (remainingIncome / income) * 100;
  const expenseRate = (totalExpenses / income) * 100;

  const getHealthStatus = () => {
    if (savingsRate >= 20) return { status: 'Excellent', color: 'bg-finance-green', icon: CheckCircle };
    if (savingsRate >= 10) return { status: 'Good', color: 'bg-accent', icon: TrendingUp };
    if (savingsRate >= 5) return { status: 'Fair', color: 'bg-warning', icon: AlertCircle };
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
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <PoundSterling className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">£{income}</div>
            <div className="text-sm text-muted-foreground">Monthly Income</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <TrendingDown className="h-8 w-8 mx-auto mb-2 text-expense-red" />
            <div className="text-2xl font-bold text-expense-red">£{totalExpenses}</div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-green" />
            <div className="text-2xl font-bold text-finance-green">£{remainingIncome}</div>
            <div className="text-sm text-muted-foreground">Available to Save</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Expense Rate</span>
              <span className="text-sm font-bold">{expenseRate.toFixed(1)}%</span>
            </div>
            <Progress value={expenseRate} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Savings Rate</span>
              <span className="text-sm font-bold text-finance-green">{savingsRate.toFixed(1)}%</span>
            </div>
            <Progress value={savingsRate} className="h-3" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 p-4 bg-white/30 rounded-lg">
          <health.icon className="h-6 w-6" />
          <span className="font-medium">Financial Health:</span>
          <Badge className={health.color}>
            {health.status}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Recommendations:</p>
          <ul className="space-y-1">
            {savingsRate < 20 && (
              <li>• Aim for 20% savings rate by reducing discretionary spending</li>
            )}
            {savingsRate < 10 && (
              <li>• Review and cut unnecessary subscriptions</li>
            )}
            <li>• Consider increasing income through side projects or skills development</li>
            <li>• Track expenses monthly to identify savings opportunities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;