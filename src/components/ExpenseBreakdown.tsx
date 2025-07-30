import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Car, 
  ShoppingCart, 
  Smartphone, 
  MapPin, 
  Coffee, 
  Plane,
  Wrench,
  PoundSterling
} from "lucide-react";

interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  description: string;
}

interface ExpenseBreakdownProps {
  income: number;
  postcode: string;
}

const ExpenseBreakdown = ({ income, postcode }: ExpenseBreakdownProps) => {
  // Location-based multipliers (simplified)
  const locationMultiplier = postcode.startsWith('SW') || postcode.startsWith('W') ? 1.3 : 
                           postcode.startsWith('E') || postcode.startsWith('SE') ? 1.1 : 1.0;

  const expenses: ExpenseItem[] = [
    {
      category: "Transport",
      amount: Math.round(income * 0.15 * locationMultiplier),
      percentage: 15 * locationMultiplier,
      icon: <MapPin className="h-5 w-5 text-primary" />,
      description: "Public transport, cycling, occasional taxi"
    },
    {
      category: "Car Costs",
      amount: Math.round(income * 0.12 * locationMultiplier),
      percentage: 12 * locationMultiplier,
      icon: <Car className="h-5 w-5 text-expense-red" />,
      description: "Fuel, insurance, maintenance, parking"
    },
    {
      category: "Subscriptions",
      amount: Math.round(income * 0.08),
      percentage: 8,
      icon: <Smartphone className="h-5 w-5 text-warning" />,
      description: "Streaming, music, apps, cloud storage"
    },
    {
      category: "Shopping",
      amount: Math.round(income * 0.20),
      percentage: 20,
      icon: <ShoppingCart className="h-5 w-5 text-finance-green" />,
      description: "Groceries, clothing, personal items"
    },
    {
      category: "Outings & Social",
      amount: Math.round(income * 0.12),
      percentage: 12,
      icon: <Coffee className="h-5 w-5 text-investment-purple" />,
      description: "Restaurants, bars, events, socializing"
    },
    {
      category: "Vacations",
      amount: Math.round(income * 0.05),
      percentage: 5,
      icon: <Plane className="h-5 w-5 text-accent" />,
      description: "Holidays, weekend trips, travel"
    },
    {
      category: "Maintenance",
      amount: Math.round(income * 0.03),
      percentage: 3,
      icon: <Wrench className="h-5 w-5 text-muted-foreground" />,
      description: "Repairs, replacements, emergency fund"
    }
  ];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingIncome = income - totalExpenses;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <PoundSterling className="h-6 w-6 text-primary" />
            Monthly Expense Breakdown
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimated costs based on your location: {postcode}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {expense.icon}
                  <span className="font-medium">{expense.category}</span>
                </div>
                <span className="font-bold text-lg">£{expense.amount}</span>
              </div>
              <Progress value={expense.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{expense.description}</p>
            </div>
          ))}
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Expenses:</span>
              <span className="text-expense-red">£{totalExpenses}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold mt-2">
              <span>Remaining Income:</span>
              <span className="text-finance-green">£{remainingIncome}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseBreakdown;