import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  PiggyBank, 
  Building, 
  Car, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Shield,
  Calculator,
  TrendingDown,
  Info
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

interface TaxLoopholesProps {
  onApplyLoopholes: (selectedLoopholes: TaxLoophole[]) => void;
  appliedLoopholes: TaxLoophole[];
}

const TaxLoopholes = ({ onApplyLoopholes, appliedLoopholes }: TaxLoopholesProps) => {
  const [selectedLoopholes, setSelectedLoopholes] = useState<string[]>(
    appliedLoopholes.map(l => l.id)
  );
  const [isOpen, setIsOpen] = useState(false);

  const loopholes: TaxLoophole[] = [
    {
      id: 'pension-contributions',
      title: 'Maximum Pension Contributions',
      description: 'Contribute up to £40,000 annually (or 100% of income if lower) to workplace/personal pensions. Reduces taxable income pound-for-pound.',
      savings: 200,
      applicableExpenses: ['Taxes & National Insurance'],
      requirements: ['Must have earned income', 'Under annual allowance limit'],
      risks: ['Money locked until age 55/57', 'Potential future tax changes'],
      icon: <PiggyBank className="h-5 w-5" />,
      category: 'pensions'
    },
    {
      id: 'isa-allowance',
      title: 'ISA Allowance Optimization',
      description: 'Use full £20,000 ISA allowance (Stocks & Shares ISA for growth, Cash ISA for emergency fund). Tax-free growth and withdrawals.',
      savings: 150,
      applicableExpenses: ['Taxes & National Insurance'],
      requirements: ['UK resident', 'Under £20k annual limit'],
      risks: ['Investment risk in S&S ISA', 'Opportunity cost vs other investments'],
      icon: <Shield className="h-5 w-5" />,
      category: 'isa'
    },
    {
      id: 'salary-sacrifice',
      title: 'Salary Sacrifice Schemes',
      description: 'Exchange salary for benefits: cycle-to-work scheme, electric car lease, childcare vouchers. Reduces both income tax and NI.',
      savings: 120,
      applicableExpenses: ['Transport', 'Car Costs', 'Taxes & National Insurance'],
      requirements: ['Employer must offer schemes', 'Above minimum wage after sacrifice'],
      risks: ['Reduced pension contributions', 'Benefits in kind charges possible'],
      icon: <Car className="h-5 w-5" />,
      category: 'business'
    },
    {
      id: 'business-expenses',
      title: 'Freelance/Business Expenses',
      description: 'If self-employed or have side income: deduct home office costs, equipment, travel, training. Can reduce tax bill significantly.',
      savings: 180,
      applicableExpenses: ['Housing', 'Transport', 'Subscriptions', 'Maintenance'],
      requirements: ['Self-employed income', 'Expenses must be "wholly and exclusively" for business'],
      risks: ['HMRC scrutiny', 'Record-keeping requirements'],
      icon: <Briefcase className="h-5 w-5" />,
      category: 'business'
    },
    {
      id: 'rent-a-room',
      title: 'Rent-a-Room Scheme',
      description: 'Earn up to £7,500 tax-free annually by renting out a room in your home. No tax return needed if under threshold.',
      savings: 300,
      applicableExpenses: ['Housing'],
      requirements: ['Own or rent property with spare room', 'Live in the property'],
      risks: ['Loss of privacy', 'Potential property damage', 'Above £7.5k becomes taxable'],
      icon: <Home className="h-5 w-5" />,
      category: 'property'
    },
    {
      id: 'student-loan-optimization',
      title: 'Student Loan Repayment Strategy',
      description: 'For Plan 2 loans: if projected to pay more than borrowed, consider voluntary overpayments. Otherwise, treat as graduate tax.',
      savings: 100,
      applicableExpenses: ['Taxes & National Insurance'],
      requirements: ['Have student loan debt', 'Clear understanding of loan terms'],
      risks: ['Opportunity cost vs investing', 'Loan may be written off before full repayment'],
      icon: <GraduationCap className="h-5 w-5" />,
      category: 'education'
    },
    {
      id: 'marriage-allowance',
      title: 'Marriage Allowance Transfer',
      description: 'If married/civil partnership and one partner earns under £12,570, transfer £1,260 of personal allowance (saving £252/year).',
      savings: 21,
      applicableExpenses: ['Taxes & National Insurance'],
      requirements: ['Married/civil partnership', 'One partner basic rate taxpayer, other under threshold'],
      risks: ['Both partners must remain eligible'],
      icon: <Building className="h-5 w-5" />,
      category: 'other'
    },
    {
      id: 'capital-gains-allowance',
      title: 'Capital Gains Tax Allowance',
      description: 'Use annual CGT allowance (£6,000 for 2023/24). Harvest losses, bed & breakfast shares, gift to spouse to use both allowances.',
      savings: 80,
      applicableExpenses: ['Taxes & National Insurance'],
      requirements: ['Have investments with gains', 'Understanding of CGT rules'],
      risks: ['Timing risk', '30-day rule for loss harvesting'],
      icon: <Calculator className="h-5 w-5" />,
      category: 'other'
    }
  ];

  const handleLoopholeToggle = (loopholeId: string) => {
    setSelectedLoopholes(prev => 
      prev.includes(loopholeId) 
        ? prev.filter(id => id !== loopholeId)
        : [...prev, loopholeId]
    );
  };

  const handleApply = () => {
    const selected = loopholes.filter(l => selectedLoopholes.includes(l.id));
    onApplyLoopholes(selected);
    setIsOpen(false);
  };

  const totalSavings = loopholes
    .filter(l => selectedLoopholes.includes(l.id))
    .reduce((sum, l) => sum + l.savings, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pensions': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'isa': return 'bg-green-100 text-green-800 border-green-200';
      case 'business': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'property': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'education': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <TrendingDown className="h-4 w-4 mr-2" />
          Tax and legal loopholes...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tax Optimization Strategies
          </DialogTitle>
          <DialogDescription>
            Legal methods to reduce your tax burden and optimize expenses. Select strategies that apply to your situation.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {loopholes.map((loophole) => (
              <Card key={loophole.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedLoopholes.includes(loophole.id)}
                        onCheckedChange={() => handleLoopholeToggle(loophole.id)}
                      />
                      {loophole.icon}
                      <div>
                        <CardTitle className="text-lg">{loophole.title}</CardTitle>
                        <Badge className={getCategoryColor(loophole.category)} variant="outline">
                          {loophole.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      -£{loophole.savings}/month
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">
                    {loophole.description}
                  </CardDescription>
                  
                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-1">Applicable Expenses:</h5>
                      <ul className="space-y-1">
                        {loophole.applicableExpenses.map((expense, idx) => (
                          <li key={idx} className="text-green-600">• {expense}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-blue-700 mb-1">Requirements:</h5>
                      <ul className="space-y-1">
                        {loophole.requirements.map((req, idx) => (
                          <li key={idx} className="text-blue-600">• {req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-orange-700 mb-1">Considerations:</h5>
                      <ul className="space-y-1">
                        {loophole.risks.map((risk, idx) => (
                          <li key={idx} className="text-orange-600">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            Always consult a tax advisor for complex strategies
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Monthly Savings:</p>
              <p className="text-lg font-bold text-green-600">£{totalSavings}</p>
            </div>
            <Button onClick={handleApply} disabled={selectedLoopholes.length === 0}>
              Apply Selected ({selectedLoopholes.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxLoopholes;