import { 
  Car, 
  ShoppingCart, 
  Smartphone, 
  MapPin, 
  Coffee, 
  Plane,
  Wrench,
  Building,
  Home,
  Music,
  Tv,
  Cloud,
  Users,
  Utensils,
  Shirt,
  Shield
} from "lucide-react";
import { createElement } from "react";

export interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  description: string;
}

interface ExpenseCalculationParams {
  income: number;
  postcode: string;
  city: string;
  workplacePostcode: string;
  hasHousing: boolean;
  knowsRent: boolean;
  customRent: number;
  hasRoommates: boolean;
  numRoommates: number;
  hasCar: boolean;
}

export const calculateExpenseBreakdown = (params: ExpenseCalculationParams): ExpenseItem[] => {
  const { income, postcode, city, workplacePostcode, hasHousing, knowsRent, customRent, hasRoommates, numRoommates, hasCar } = params;

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
      icon: createElement(Building, { className: "h-5 w-5 text-destructive" }),
      description: "UK income tax and National Insurance contributions",
    }] : []),
    ...(hasHousing ? [{
      category: "Housing",
      amount: Math.round(housingAmount),
      percentage: Math.round((housingAmount / income) * 100),
      icon: createElement(Home, { className: "h-5 w-5 text-accent" }),
      description: hasRoommates ? `Rent split between ${numRoommates + 1} people` : "Monthly rent and housing costs",
    }] : []),
    {
      category: "Transport",
      amount: Math.round(applyInflation(Math.min(income * 0.15 * distanceMultiplier, 350))),
      percentage: Math.min(15 * distanceMultiplier, 25),
      icon: createElement(MapPin, { className: "h-5 w-5 text-primary" }),
      description: "Public transport, cycling, occasional taxi (affected by inflation)",
    },
    ...(hasCar ? [{
      category: "Car Costs",
      amount: Math.round(applyInflation(Math.min(income * 0.12 * cityMultiplier, 280))),
      percentage: Math.min(12 * cityMultiplier, 28),
      icon: createElement(Car, { className: "h-5 w-5 text-expense-red" }),
      description: "Fuel, insurance, maintenance, parking (affected by inflation)",
    }] : []),
    {
      category: "Subscriptions",
      amount: Math.round(Math.min(income * 0.08, 80)),
      percentage: Math.min((Math.min(income * 0.08, 80) / income) * 100, 8),
      icon: createElement(Smartphone, { className: "h-5 w-5 text-warning" }),
      description: "Streaming, music, apps, cloud storage",
    },
    {
      category: "Shopping",
      amount: Math.round(applyInflation(Math.min(income * 0.18 * cityMultiplier, Math.max(income * 0.12, 180)))),
      percentage: Math.min(18 * cityMultiplier, 25),
      icon: createElement(ShoppingCart, { className: "h-5 w-5 text-finance-green" }),
      description: "Groceries, clothing, personal items (affected by inflation)",
    },
    {
      category: "Outings & Social",
      amount: Math.round(applyInflation(Math.min(income * 0.12 * cityMultiplier, cityMultiplier > 1.3 ? 300 : 180))),
      percentage: Math.min(12 * cityMultiplier, cityMultiplier > 1.3 ? 20 : 15),
      icon: createElement(Coffee, { className: "h-5 w-5 text-investment-purple" }),
      description: "Restaurants, bars, events, socializing (affected by inflation)",
    },
    {
      category: "Vacations",
      amount: Math.round(applyInflation(Math.min(income * 0.05, 150))),
      percentage: Math.min((Math.min(income * 0.05, 150) / income) * 100, 5),
      icon: createElement(Plane, { className: "h-5 w-5 text-accent" }),
      description: "Holidays, weekend trips, travel (affected by inflation)",
    },
    {
      category: "Maintenance",
      amount: Math.round(Math.min(income * 0.03, 100)),
      percentage: Math.min((Math.min(income * 0.03, 100) / income) * 100, 3),
      icon: createElement(Wrench, { className: "h-5 w-5 text-muted-foreground" }),
      description: "Repairs, replacements, emergency fund",
    }
  ];

  return expenses;
};