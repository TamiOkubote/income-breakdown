import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Car, 
  ShoppingCart, 
  Smartphone, 
  MapPin, 
  Coffee, 
  Plane,
  Wrench,
  PoundSterling,
  ChevronDown,
  Train,
  Bus,
  Fuel,
  CreditCard,
  Shield,
  Utensils,
  Shirt,
  Home,
  Music,
  Tv,
  Cloud,
  Users,
  Building,
  Bed,
  Hammer
} from "lucide-react";

interface SubExpense {
  name: string;
  amount: number;
  description: string;
  icon: React.ReactNode;
}

interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  description: string;
  subExpenses: SubExpense[];
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
      description: "Public transport, cycling, occasional taxi",
      subExpenses: [
        {
          name: "Monthly Oyster Card",
          amount: Math.round(income * 0.08 * locationMultiplier),
          description: "Zones 1-3 unlimited travel (£156/month)",
          icon: <Train className="h-4 w-4 text-primary" />
        },
        {
          name: "Bus Travel",
          amount: Math.round(income * 0.04 * locationMultiplier),
          description: "Daily bus fares (£1.75 per journey)",
          icon: <Bus className="h-4 w-4 text-primary" />
        },
        {
          name: "Taxi/Uber",
          amount: Math.round(income * 0.03 * locationMultiplier),
          description: "Occasional rides and late-night transport",
          icon: <Car className="h-4 w-4 text-primary" />
        }
      ]
    },
    {
      category: "Car Costs",
      amount: Math.round(income * 0.12 * locationMultiplier),
      percentage: 12 * locationMultiplier,
      icon: <Car className="h-5 w-5 text-expense-red" />,
      description: "Fuel, insurance, maintenance, parking",
      subExpenses: [
        {
          name: "Fuel",
          amount: Math.round(income * 0.05 * locationMultiplier),
          description: "Petrol at £1.50/litre (£80-120/month)",
          icon: <Fuel className="h-4 w-4 text-expense-red" />
        },
        {
          name: "Insurance",
          amount: Math.round(income * 0.04 * locationMultiplier),
          description: "Young driver insurance (£80-150/month)",
          icon: <Shield className="h-4 w-4 text-expense-red" />
        },
        {
          name: "Parking",
          amount: Math.round(income * 0.02 * locationMultiplier),
          description: "Daily parking fees and permits",
          icon: <Building className="h-4 w-4 text-expense-red" />
        },
        {
          name: "Maintenance",
          amount: Math.round(income * 0.01 * locationMultiplier),
          description: "Servicing, MOT, repairs (£30-50/month)",
          icon: <Wrench className="h-4 w-4 text-expense-red" />
        }
      ]
    },
    {
      category: "Subscriptions",
      amount: Math.round(income * 0.08),
      percentage: 8,
      icon: <Smartphone className="h-5 w-5 text-warning" />,
      description: "Streaming, music, apps, cloud storage",
      subExpenses: [
        {
          name: "Streaming Services",
          amount: Math.round(income * 0.04),
          description: "Netflix, Disney+, Prime Video (£30-40/month)",
          icon: <Tv className="h-4 w-4 text-warning" />
        },
        {
          name: "Music & Audio",
          amount: Math.round(income * 0.02),
          description: "Spotify, Apple Music (£10-15/month)",
          icon: <Music className="h-4 w-4 text-warning" />
        },
        {
          name: "Cloud Storage",
          amount: Math.round(income * 0.01),
          description: "Google Drive, iCloud (£3-8/month)",
          icon: <Cloud className="h-4 w-4 text-warning" />
        },
        {
          name: "Apps & Software",
          amount: Math.round(income * 0.01),
          description: "Adobe, productivity apps (£5-15/month)",
          icon: <Smartphone className="h-4 w-4 text-warning" />
        }
      ]
    },
    {
      category: "Shopping",
      amount: Math.round(income * 0.20),
      percentage: 20,
      icon: <ShoppingCart className="h-5 w-5 text-finance-green" />,
      description: "Groceries, clothing, personal items",
      subExpenses: [
        {
          name: "Groceries",
          amount: Math.round(income * 0.12),
          description: "Weekly food shopping (£60-80/week)",
          icon: <Utensils className="h-4 w-4 text-finance-green" />
        },
        {
          name: "Clothing",
          amount: Math.round(income * 0.05),
          description: "Work attire and casual wear",
          icon: <Shirt className="h-4 w-4 text-finance-green" />
        },
        {
          name: "Personal Care",
          amount: Math.round(income * 0.02),
          description: "Toiletries, haircuts, healthcare",
          icon: <Users className="h-4 w-4 text-finance-green" />
        },
        {
          name: "Household Items",
          amount: Math.round(income * 0.01),
          description: "Cleaning supplies, home essentials",
          icon: <Home className="h-4 w-4 text-finance-green" />
        }
      ]
    },
    {
      category: "Outings & Social",
      amount: Math.round(income * 0.12),
      percentage: 12,
      icon: <Coffee className="h-5 w-5 text-investment-purple" />,
      description: "Restaurants, bars, events, socializing",
      subExpenses: [
        {
          name: "Dining Out",
          amount: Math.round(income * 0.06),
          description: "Restaurants and takeaways (£15-25/meal)",
          icon: <Utensils className="h-4 w-4 text-investment-purple" />
        },
        {
          name: "Drinks & Bars",
          amount: Math.round(income * 0.04),
          description: "Social drinks and pub visits (£5-8/drink)",
          icon: <Coffee className="h-4 w-4 text-investment-purple" />
        },
        {
          name: "Events & Activities",
          amount: Math.round(income * 0.02),
          description: "Cinema, concerts, sports events",
          icon: <Users className="h-4 w-4 text-investment-purple" />
        }
      ]
    },
    {
      category: "Vacations",
      amount: Math.round(income * 0.05),
      percentage: 5,
      icon: <Plane className="h-5 w-5 text-accent" />,
      description: "Holidays, weekend trips, travel",
      subExpenses: [
        {
          name: "Annual Holiday",
          amount: Math.round(income * 0.03),
          description: "One week abroad (£500-800 saved monthly)",
          icon: <Plane className="h-4 w-4 text-accent" />
        },
        {
          name: "Weekend Trips",
          amount: Math.round(income * 0.015),
          description: "UK city breaks and short trips",
          icon: <Bed className="h-4 w-4 text-accent" />
        },
        {
          name: "Travel Insurance",
          amount: Math.round(income * 0.005),
          description: "Annual travel insurance coverage",
          icon: <Shield className="h-4 w-4 text-accent" />
        }
      ]
    },
    {
      category: "Maintenance",
      amount: Math.round(income * 0.03),
      percentage: 3,
      icon: <Wrench className="h-5 w-5 text-muted-foreground" />,
      description: "Repairs, replacements, emergency fund",
      subExpenses: [
        {
          name: "Emergency Fund",
          amount: Math.round(income * 0.02),
          description: "Unexpected expenses and repairs",
          icon: <Shield className="h-4 w-4 text-muted-foreground" />
        },
        {
          name: "Equipment Replacement",
          amount: Math.round(income * 0.008),
          description: "Phone, laptop, electronics replacement",
          icon: <Smartphone className="h-4 w-4 text-muted-foreground" />
        },
        {
          name: "General Repairs",
          amount: Math.round(income * 0.002),
          description: "Home repairs and maintenance",
          icon: <Hammer className="h-4 w-4 text-muted-foreground" />
        }
      ]
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
            <Collapsible key={index} className="space-y-2">
              <CollapsibleTrigger className="w-full hover:bg-muted/50 p-2 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {expense.icon}
                    <span className="font-medium">{expense.category}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-bold text-lg">£{expense.amount}</span>
                </div>
                <Progress value={expense.percentage} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground text-left mt-1">{expense.description}</p>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-2 ml-4 border-l-2 border-muted pl-4">
                {expense.subExpenses.map((subExpense, subIndex) => (
                  <div key={subIndex} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <div className="flex items-center gap-2">
                      {subExpense.icon}
                      <div>
                        <span className="text-sm font-medium">{subExpense.name}</span>
                        <p className="text-xs text-muted-foreground">{subExpense.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      £{subExpense.amount}
                    </Badge>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
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