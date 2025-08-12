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
  Hammer,
  TrendingUp
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
  city: string;
  workplacePostcode: string;
  hasHousing: boolean;
  knowsRent: boolean;
  customRent: number;
  hasRoommates: boolean;
  numRoommates: number;
}

const ExpenseBreakdown = ({ income, postcode, city, workplacePostcode, hasHousing, knowsRent, customRent, hasRoommates, numRoommates }: ExpenseBreakdownProps) => {
  // Calculate city-based multipliers
  const getCityMultiplier = (city: string) => {
    const cityLower = city.toLowerCase();
    
    if (cityLower.includes('london')) return 1.5;
    if (cityLower.includes('cambridge') || cityLower.includes('oxford')) return 1.3;
    if (cityLower.includes('brighton') || cityLower.includes('bath')) return 1.25;
    if (cityLower.includes('bristol') || cityLower.includes('manchester') || 
        cityLower.includes('birmingham') || cityLower.includes('edinburgh')) return 1.15;
    if (cityLower.includes('reading') || cityLower.includes('leeds') || 
        cityLower.includes('sheffield') || cityLower.includes('liverpool')) return 1.0;
    
    return 0.9;
  };

  const cityMultiplier = getCityMultiplier(city);
  
  // Distance-based transport multiplier
  const calculateDistanceMultiplier = (homePostcode: string, workPostcode: string) => {
    const getPostcodeArea = (postcode: string) => postcode.replace(/\d.*/, '');
    const homeArea = getPostcodeArea(homePostcode);
    const workArea = getPostcodeArea(workPostcode);
    
    const londonAreas = ['SW', 'SE', 'E', 'W', 'N', 'NW', 'EC', 'WC'];
    const isHomeLondon = londonAreas.some(area => homeArea.startsWith(area));
    const isWorkLondon = londonAreas.some(area => workArea.startsWith(area));
    
    if (isHomeLondon && isWorkLondon) return 1.0;
    if (isHomeLondon || isWorkLondon) return 1.4;
    if (homeArea === workArea) return 0.8;
    return 1.2;
  };
  
  const distanceMultiplier = calculateDistanceMultiplier(postcode, workplacePostcode);

  // Inflation adjustments (UK inflation rate ~2.5% annually)
  const annualInflationRate = 0.025;
  const monthlyInflationRate = annualInflationRate / 12;
  
  // Track which expenses are affected by inflation
  const inflationAffectedExpenses = [
    'Housing', 'Transport', 'Car Costs', 'Shopping', 'Outings & Social', 'Vacations'
  ];
  
  const applyInflation = (amount: number, isAffected: boolean = true) => {
    return isAffected ? amount * (1 + annualInflationRate) : amount;
  };

  // Tax calculations (UK tax bands for 2024/25)
  const annualIncome = income * 12;
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
  const monthlyNI = income > 1048 ? (Math.min(income, 4189) - 1048) * 0.12 + 
                   (income > 4189 ? (income - 4189) * 0.02 : 0) : 0;
  
  // Housing calculations
  let housingAmount = 0;
  if (hasHousing) {
    let housingCost;
    if (knowsRent && customRent > 0) {
      housingCost = customRent;
    } else {
      housingCost = Math.min(income * 0.35 * cityMultiplier, cityMultiplier > 1.3 ? 1200 : 800);
    }
    const totalRoommates = hasRoommates ? numRoommates + 1 : 1;
    housingAmount = housingCost / totalRoommates;
  }

  const expenses: ExpenseItem[] = [
    ...(monthlyTax > 0 || monthlyNI > 0 ? [{
      category: "Taxes & National Insurance",
      amount: Math.round(monthlyTax + monthlyNI),
      percentage: Math.round(((monthlyTax + monthlyNI) / income) * 100),
      icon: <Building className="h-5 w-5 text-destructive" />,
      description: "UK income tax and National Insurance contributions",
      subExpenses: [
        ...(monthlyTax > 0 ? [{
          name: "Income Tax",
          amount: Math.round(monthlyTax),
          description: "UK income tax based on current tax bands",
          icon: "💷"
        }] : []),
        ...(monthlyNI > 0 ? [{
          name: "National Insurance",
          amount: Math.round(monthlyNI),
          description: "Class 1 National Insurance contributions",
          icon: "🛡️"
        }] : [])
      ]
    }] : []),
    ...(hasHousing ? [{
      category: "Housing",
      amount: Math.round(housingAmount),
      percentage: Math.round((housingAmount / income) * 100),
      icon: <Home className="h-5 w-5 text-accent" />,
      description: hasRoommates ? `Rent split between ${numRoommates + 1} people` : "Monthly rent and housing costs",
      subExpenses: [
        {
          name: hasRoommates ? `Rent (split ${numRoommates + 1} ways)` : "Monthly Rent",
          amount: Math.round(housingAmount * 0.85),
          description: hasRoommates ? `Your share of £${Math.round(housingAmount * (numRoommates + 1) * 0.85)} total rent` : "Monthly rent payment",
          icon: "🏠"
        },
        {
          name: "Utilities & Bills",
          amount: Math.round(housingAmount * 0.15),
          description: hasRoommates ? "Your share of electricity, gas, water, internet" : "Electricity, gas, water, internet",
          icon: "⚡"
        }
      ]
    }] : []),
    {
      category: "Transport",
      amount: Math.round(applyInflation(Math.min(income * 0.15 * distanceMultiplier, 350))),
      percentage: Math.min(15 * distanceMultiplier, 25),
      icon: <MapPin className="h-5 w-5 text-primary" />,
      description: "Public transport, cycling, occasional taxi (affected by inflation)",
      subExpenses: [
        {
          name: "Monthly Oyster Card",
          amount: Math.round(Math.min(income * 0.08 * distanceMultiplier, 180)),
          description: "Zones 1-3 unlimited travel (£156/month)",
          icon: <Train className="h-4 w-4 text-primary" />
        },
        {
          name: "Bus Travel",
          amount: Math.round(Math.min(income * 0.04 * distanceMultiplier, 80)),
          description: "Daily bus fares (£1.75 per journey)",
          icon: <Bus className="h-4 w-4 text-primary" />
        },
        {
          name: "Taxi/Uber",
          amount: Math.round(Math.min(income * 0.03, 60)),
          description: "Occasional rides and late-night transport",
          icon: <Car className="h-4 w-4 text-primary" />
        }
      ]
    },
    {
      category: "Car Costs",
      amount: Math.round(applyInflation(Math.min(income * 0.12 * cityMultiplier, 280))),
      percentage: Math.min(12 * cityMultiplier, 28),
      icon: <Car className="h-5 w-5 text-expense-red" />,
      description: "Fuel, insurance, maintenance, parking (affected by inflation)",
      subExpenses: [
        {
          name: "Fuel",
          amount: Math.round(income * 0.05 * cityMultiplier),
          description: "Petrol at £1.50/litre (£80-120/month)",
          icon: <Fuel className="h-4 w-4 text-expense-red" />
        },
        {
          name: "Insurance",
          amount: Math.round(income * 0.04 * cityMultiplier),
          description: "Young driver insurance (£80-150/month)",
          icon: <Shield className="h-4 w-4 text-expense-red" />
        },
        {
          name: "Parking",
          amount: Math.round(income * 0.02 * cityMultiplier),
          description: "Daily parking fees and permits",
          icon: <Building className="h-4 w-4 text-expense-red" />
        },
        {
          name: "Maintenance",
          amount: Math.round(income * 0.01 * cityMultiplier),
          description: "Servicing, MOT, repairs (£30-50/month)",
          icon: <Wrench className="h-4 w-4 text-expense-red" />
        }
      ]
    },
    {
      category: "Subscriptions",
      amount: Math.round(Math.min(income * 0.08, 80)),
      percentage: Math.min((Math.min(income * 0.08, 80) / income) * 100, 8),
      icon: <Smartphone className="h-5 w-5 text-warning" />,
      description: "Streaming, music, apps, cloud storage",
      subExpenses: [
        {
          name: "Streaming Services",
          amount: Math.round(Math.min(income * 0.04, 40)),
          description: "Netflix, Disney+, Prime Video (£30-40/month)",
          icon: <Tv className="h-4 w-4 text-warning" />
        },
        {
          name: "Music & Audio",
          amount: Math.round(Math.min(income * 0.02, 20)),
          description: "Spotify, Apple Music (£10-15/month)",
          icon: <Music className="h-4 w-4 text-warning" />
        },
        {
          name: "Cloud Storage",
          amount: Math.round(Math.min(income * 0.01, 10)),
          description: "Google Drive, iCloud (£3-8/month)",
          icon: <Cloud className="h-4 w-4 text-warning" />
        },
        {
          name: "Apps & Software",
          amount: Math.round(Math.min(income * 0.01, 10)),
          description: "Adobe, productivity apps (£5-15/month)",
          icon: <Smartphone className="h-4 w-4 text-warning" />
        }
      ]
    },
    {
      category: "Shopping",
      amount: Math.round(applyInflation(Math.min(income * 0.18 * cityMultiplier, Math.max(income * 0.12, 180)))),
      percentage: Math.min(18 * cityMultiplier, 25),
      icon: <ShoppingCart className="h-5 w-5 text-finance-green" />,
      description: "Groceries, clothing, personal items (affected by inflation)",
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
      amount: Math.round(applyInflation(Math.min(income * 0.12 * cityMultiplier, cityMultiplier > 1.3 ? 300 : 180))),
      percentage: Math.min(12 * cityMultiplier, cityMultiplier > 1.3 ? 20 : 15),
      icon: <Coffee className="h-5 w-5 text-investment-purple" />,
      description: "Restaurants, bars, events, socializing (affected by inflation)",
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
      amount: Math.round(applyInflation(Math.min(income * 0.05, 150))),
      percentage: Math.min((Math.min(income * 0.05, 150) / income) * 100, 5),
      icon: <Plane className="h-5 w-5 text-accent" />,
      description: "Holidays, weekend trips, travel (affected by inflation)",
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
      amount: Math.round(Math.min(income * 0.03, 100)),
      percentage: Math.min((Math.min(income * 0.03, 100) / income) * 100, 3),
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

  // Sort expenses by amount in descending order (largest to smallest)
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
  
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
            Estimated costs based on {city}, {postcode} and work: {workplacePostcode}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedExpenses.map((expense, index) => (
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
          
          {/* Inflation Impact Summary */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Inflation Impact Summary
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              The following expenses are affected by UK inflation (~2.5% annually):
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {inflationAffectedExpenses.map((expense, index) => (
                <Badge key={index} variant="secondary" className="text-orange-700 bg-orange-100">
                  {expense}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-orange-600 mt-3">
              These costs typically increase annually, so budget accordingly for future years.
            </p>
          </div>

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