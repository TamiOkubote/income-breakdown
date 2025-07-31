import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  Calendar,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface InvestmentStrategiesProps {
  remainingIncome: number;
}

const InvestmentStrategies = ({ remainingIncome }: InvestmentStrategiesProps) => {
  const strategies = [
    {
      id: "conservative",
      name: "Conservative Approach",
      risk: "Low",
      description: "Safety-first strategy focusing on capital preservation and steady growth",
      icon: <Shield className="h-6 w-6 text-finance-green" />,
      color: "text-finance-green",
      phases: [
        {
          phase: "Phase 1 (Year 1)",
          timeframe: "0-12 months",
          allocation: {
            "Emergency Fund ISA": 60,
            "Government Bonds": 25,
            "Premium Bonds": 10,
            "Workplace Pension": 5
          },
          description: "Build emergency fund and establish safe foundation",
          expectedReturn: "2-4% annually",
          advantages: [
            "Capital protection guaranteed",
            "Immediate access to funds",
            "FSCS protection up to £85k",
            "Low volatility"
          ],
          disadvantages: [
            "Lower returns vs inflation",
            "Limited growth potential",
            "Opportunity cost"
          ]
        },
        {
          phase: "Phase 2 (Years 2-5)",
          timeframe: "1-5 years",
          allocation: {
            "Emergency Fund ISA": 40,
            "Government Bonds": 30,
            "Corporate Bonds": 15,
            "FTSE 100 Index": 10,
            "Workplace Pension": 5
          },
          description: "Gradual introduction of growth assets while maintaining safety",
          expectedReturn: "3-6% annually",
          advantages: [
            "Diversified bond portfolio",
            "Gradual equity exposure",
            "Regular income from bonds",
            "Lower volatility than stocks"
          ],
          disadvantages: [
            "Interest rate risk",
            "Still conservative returns",
            "Limited inflation protection"
          ]
        },
        {
          phase: "Phase 3 (Years 6-10)",
          timeframe: "6-10 years",
          allocation: {
            "Emergency Fund ISA": 25,
            "Bonds Portfolio": 35,
            "FTSE 100 Index": 20,
            "Global Bonds": 10,
            "Workplace Pension": 10
          },
          description: "Mature conservative portfolio with modest equity allocation",
          expectedReturn: "4-7% annually",
          advantages: [
            "Balanced risk/return",
            "International diversification",
            "Stable income stream",
            "Inflation protection"
          ],
          disadvantages: [
            "Limited growth potential",
            "Currency risk on global bonds",
            "Still below historical equity returns"
          ]
        }
      ]
    },
    {
      id: "balanced",
      name: "Balanced Growth",
      risk: "Medium",
      description: "Balanced approach combining growth and stability for moderate returns",
      icon: <Target className="h-6 w-6 text-primary" />,
      color: "text-primary",
      phases: [
        {
          phase: "Phase 1 (Year 1)",
          timeframe: "0-12 months",
          allocation: {
            "Emergency Fund ISA": 40,
            "S&P 500 Index": 25,
            "FTSE 100 Index": 20,
            "Corporate Bonds": 10,
            "Workplace Pension": 5
          },
          description: "Establish emergency fund while beginning equity investment",
          expectedReturn: "5-8% annually",
          advantages: [
            "Balanced risk/reward",
            "Diversified portfolio",
            "Global market exposure",
            "Professional management"
          ],
          disadvantages: [
            "Market volatility risk",
            "No guaranteed returns",
            "Requires regular monitoring"
          ]
        },
        {
          phase: "Phase 2 (Years 2-5)",
          timeframe: "1-5 years",
          allocation: {
            "Emergency Fund ISA": 25,
            "S&P 500 Index": 30,
            "FTSE 100/250 Index": 25,
            "Corporate Bonds": 10,
            "Workplace Pension": 10
          },
          description: "Increase equity allocation for growth while maintaining stability",
          expectedReturn: "6-9% annually",
          advantages: [
            "Higher growth potential",
            "International diversification",
            "Regular rebalancing",
            "Cost-effective index funds"
          ],
          disadvantages: [
            "Increased volatility",
            "Market timing risk",
            "Currency exposure"
          ]
        },
        {
          phase: "Phase 3 (Years 6-10)",
          timeframe: "6-10 years",
          allocation: {
            "Emergency Fund ISA": 20,
            "S&P 500 Index": 35,
            "FTSE/European Index": 25,
            "Bonds Portfolio": 10,
            "Workplace Pension": 10
          },
          description: "Mature balanced portfolio optimized for long-term growth",
          expectedReturn: "7-10% annually",
          advantages: [
            "Long-term growth focus",
            "Global diversification",
            "Compound growth benefits",
            "Reduced emergency fund reliance"
          ],
          disadvantages: [
            "Higher volatility periods",
            "Market cycle exposure",
            "Requires patience"
          ]
        }
      ]
    },
    {
      id: "aggressive",
      name: "Aggressive Growth",
      risk: "High",
      description: "High-growth strategy maximizing long-term wealth accumulation",
      icon: <TrendingUp className="h-6 w-6 text-investment-purple" />,
      color: "text-investment-purple",
      phases: [
        {
          phase: "Phase 1 (Year 1)",
          timeframe: "0-12 months",
          allocation: {
            "Emergency Fund ISA": 30,
            "S&P 500 Index": 35,
            "Technology ETF": 20,
            "Individual Stocks": 10,
            "Workplace Pension": 5
          },
          description: "Aggressive equity allocation with growth focus from start",
          expectedReturn: "8-12% annually",
          advantages: [
            "Maximum growth potential",
            "Early compound benefits",
            "Technology sector exposure",
            "Young investor advantage"
          ],
          disadvantages: [
            "High volatility risk",
            "Potential significant losses",
            "Emotional stress",
            "Requires discipline"
          ]
        },
        {
          phase: "Phase 2 (Years 2-5)",
          timeframe: "1-5 years",
          allocation: {
            "Emergency Fund ISA": 20,
            "S&P 500 Index": 30,
            "Technology ETF": 25,
            "Growth Stocks": 15,
            "Workplace Pension": 10
          },
          description: "Maintain aggressive allocation with increased individual stock exposure",
          expectedReturn: "10-15% annually",
          advantages: [
            "High compound growth",
            "Sector concentration benefits",
            "Individual stock upside",
            "Long investment horizon"
          ],
          disadvantages: [
            "Sector concentration risk",
            "Stock-specific risks",
            "High volatility periods",
            "Emotional decision pressure"
          ]
        },
        {
          phase: "Phase 3 (Years 6-10)",
          timeframe: "6-10 years",
          allocation: {
            "Emergency Fund ISA": 15,
            "Global Growth Index": 40,
            "Technology/Innovation": 25,
            "Emerging Markets": 10,
            "Workplace Pension": 10
          },
          description: "Diversified aggressive portfolio with global growth focus",
          expectedReturn: "12-18% annually",
          advantages: [
            "Maximum wealth accumulation",
            "Global growth exposure",
            "Innovation sector benefits",
            "Long-term wealth building"
          ],
          disadvantages: [
            "Extreme volatility",
            "Emerging market risks",
            "Currency fluctuations",
            "Requires strong conviction"
          ]
        }
      ]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-finance-green text-white';
      case 'Medium': return 'bg-primary text-white';
      case 'High': return 'bg-investment-purple text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="h-6 w-6 text-investment-purple" />
          Investment Strategy Options
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a strategy that matches your risk tolerance and goals (£{remainingIncome}/month available)
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conservative" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {strategies.map((strategy) => (
              <TabsTrigger key={strategy.id} value={strategy.id} className="flex items-center gap-2">
                {strategy.icon}
                <span className="hidden sm:inline">{strategy.name}</span>
                <span className="sm:hidden">{strategy.risk} Risk</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {strategies.map((strategy) => (
            <TabsContent key={strategy.id} value={strategy.id} className="space-y-6 mt-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  {strategy.icon}
                  <div>
                    <h3 className={`font-bold text-lg ${strategy.color}`}>{strategy.name}</h3>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </div>
                </div>
                <Badge className={getRiskColor(strategy.risk)}>
                  {strategy.risk} Risk
                </Badge>
              </div>

              <div className="space-y-6">
                {strategy.phases.map((phase, index) => (
                  <Card key={index} className="border border-muted">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          {phase.phase}
                        </CardTitle>
                        <Badge variant="outline">
                          {phase.timeframe}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Allocation */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <PiggyBank className="h-4 w-4" />
                          Allocation
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(phase.allocation).map(([asset, percentage]) => (
                            <div key={asset} className="flex justify-between items-center p-2 rounded bg-muted/50">
                              <span className="text-sm">{asset}</span>
                              <Badge variant="outline">{percentage as number}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Return */}
                      <div className="p-3 rounded bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <TrendingUp className="h-4 w-4" />
                          Expected Return: {phase.expectedReturn}
                        </div>
                      </div>

                      {/* Advantages & Disadvantages */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2 text-finance-green flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Advantages
                          </h5>
                          <ul className="space-y-1">
                            {phase.advantages.map((advantage, i) => (
                              <li key={i} className="text-sm flex items-start gap-1">
                                <span className="text-finance-green mt-1">•</span>
                                {advantage}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 text-expense-red flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            Disadvantages
                          </h5>
                          <ul className="space-y-1">
                            {phase.disadvantages.map((disadvantage, i) => (
                              <li key={i} className="text-sm flex items-start gap-1">
                                <span className="text-expense-red mt-1">•</span>
                                {disadvantage}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h3 className="font-semibold text-warning">Important Considerations</h3>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Past performance does not guarantee future results</li>
                  <li>• Consider your risk tolerance and investment timeline</li>
                  <li>• Regular portfolio reviews and rebalancing recommended</li>
                  <li>• Seek professional financial advice for large investments</li>
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvestmentStrategies;