import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  BarChart3,
  ExternalLink,
  DollarSign
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface InvestmentStrategiesProps {
  remainingIncome: number;
}

const InvestmentStrategies = ({ remainingIncome }: InvestmentStrategiesProps) => {
  const [selectedPhase, setSelectedPhase] = useState(0);

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
          allocation: [
            { category: "Emergency Fund ISA", percentage: 60, amount: Math.round(remainingIncome * 12 * 0.6), color: "#22c55e" },
            { category: "Government Bonds", percentage: 25, amount: Math.round(remainingIncome * 12 * 0.25), color: "#3b82f6" },
            { category: "Premium Bonds", percentage: 10, amount: Math.round(remainingIncome * 12 * 0.1), color: "#f59e0b" },
            { category: "Workplace Pension", percentage: 5, amount: Math.round(remainingIncome * 12 * 0.05), color: "#8b5cf6" }
          ],
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
          ],
          industryLinks: [
            { industry: "Banking", url: "https://www.ft.com/companies/banks", description: "Conservative banking sector analysis" },
            { industry: "Utilities", url: "https://www.investopedia.com/utilities-sector-stocks-4689799", description: "Defensive utility stocks guide" },
            { industry: "Consumer Staples", url: "https://www.morningstar.com/sectors/consumer-defensive", description: "Stable consumer defensive investments" }
          ]
        },
        {
          phase: "Phase 2 (Years 2-5)",
          timeframe: "1-5 years", 
          allocation: [
            { category: "Emergency Fund ISA", percentage: 40, amount: Math.round(remainingIncome * 12 * 4 * 0.4), color: "#22c55e" },
            { category: "Government Bonds", percentage: 30, amount: Math.round(remainingIncome * 12 * 4 * 0.3), color: "#3b82f6" },
            { category: "Corporate Bonds", percentage: 15, amount: Math.round(remainingIncome * 12 * 4 * 0.15), color: "#f59e0b" },
            { category: "FTSE 100 Index", percentage: 10, amount: Math.round(remainingIncome * 12 * 4 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 5, amount: Math.round(remainingIncome * 12 * 4 * 0.05), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Healthcare", url: "https://www.fool.com/investing/healthcare-stocks/", description: "Defensive healthcare investments" },
            { industry: "Technology", url: "https://www.nasdaq.com/market-activity/stocks/screener?exchange=nasdaq&sector=technology", description: "Conservative tech stock picks" },
            { industry: "Real Estate", url: "https://www.reit.com/", description: "REIT investment opportunities" }
          ]
        },
        {
          phase: "Phase 3 (Years 6-10)",
          timeframe: "6-10 years",
          allocation: [
            { category: "Emergency Fund ISA", percentage: 25, amount: Math.round(remainingIncome * 12 * 5 * 0.25), color: "#22c55e" },
            { category: "Bonds Portfolio", percentage: 35, amount: Math.round(remainingIncome * 12 * 5 * 0.35), color: "#3b82f6" },
            { category: "FTSE 100 Index", percentage: 20, amount: Math.round(remainingIncome * 12 * 5 * 0.2), color: "#f59e0b" },
            { category: "Global Bonds", percentage: 10, amount: Math.round(remainingIncome * 12 * 5 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 10, amount: Math.round(remainingIncome * 12 * 5 * 0.1), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Consumer Goods", url: "https://www.marketwatch.com/investing/stock/pg", description: "Stable consumer goods companies" },
            { industry: "Telecommunications", url: "https://finance.yahoo.com/sector/ms_communication_services", description: "Dividend-paying telecom stocks" },
            { industry: "Energy", url: "https://www.investopedia.com/articles/investing/021316/energy-sector-breakdown-e.asp", description: "Conservative energy investments" }
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
          allocation: [
            { category: "Emergency Fund ISA", percentage: 40, amount: Math.round(remainingIncome * 12 * 0.4), color: "#22c55e" },
            { category: "S&P 500 Index", percentage: 25, amount: Math.round(remainingIncome * 12 * 0.25), color: "#3b82f6" },
            { category: "FTSE 100 Index", percentage: 20, amount: Math.round(remainingIncome * 12 * 0.2), color: "#f59e0b" },
            { category: "Corporate Bonds", percentage: 10, amount: Math.round(remainingIncome * 12 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 5, amount: Math.round(remainingIncome * 12 * 0.05), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Technology", url: "https://www.nasdaq.com/market-activity/stocks/screener?exchange=nasdaq&sector=technology", description: "Growth technology stocks" },
            { industry: "Finance", url: "https://finance.yahoo.com/sector/ms_financial_services", description: "Financial sector opportunities" },
            { industry: "Healthcare", url: "https://www.fool.com/investing/healthcare-stocks/", description: "Healthcare investment guide" }
          ]
        },
        {
          phase: "Phase 2 (Years 2-5)",
          timeframe: "1-5 years",
          allocation: [
            { category: "Emergency Fund ISA", percentage: 25, amount: Math.round(remainingIncome * 12 * 4 * 0.25), color: "#22c55e" },
            { category: "S&P 500 Index", percentage: 30, amount: Math.round(remainingIncome * 12 * 4 * 0.3), color: "#3b82f6" },
            { category: "FTSE 100/250 Index", percentage: 25, amount: Math.round(remainingIncome * 12 * 4 * 0.25), color: "#f59e0b" },
            { category: "Corporate Bonds", percentage: 10, amount: Math.round(remainingIncome * 12 * 4 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 10, amount: Math.round(remainingIncome * 12 * 4 * 0.1), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Engineering", url: "https://www.investopedia.com/articles/investing/051515/top-engineering-stocks.asp", description: "Engineering sector stocks" },
            { industry: "Retail", url: "https://www.marketwatch.com/story/retail-stocks-to-watch", description: "Retail industry analysis" },
            { industry: "Manufacturing", url: "https://finance.yahoo.com/sector/ms_industrials", description: "Industrial manufacturing opportunities" }
          ]
        },
        {
          phase: "Phase 3 (Years 6-10)",
          timeframe: "6-10 years",
          allocation: [
            { category: "Emergency Fund ISA", percentage: 20, amount: Math.round(remainingIncome * 12 * 5 * 0.2), color: "#22c55e" },
            { category: "S&P 500 Index", percentage: 35, amount: Math.round(remainingIncome * 12 * 5 * 0.35), color: "#3b82f6" },
            { category: "FTSE/European Index", percentage: 25, amount: Math.round(remainingIncome * 12 * 5 * 0.25), color: "#f59e0b" },
            { category: "Bonds Portfolio", percentage: 10, amount: Math.round(remainingIncome * 12 * 5 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 10, amount: Math.round(remainingIncome * 12 * 5 * 0.1), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Food & Beverage", url: "https://www.investopedia.com/articles/investing/082015/top-food-beverage-stocks.asp", description: "Food industry investments" },
            { industry: "Legal Services", url: "https://finance.yahoo.com/news/legal-services-industry-outlook", description: "Legal sector opportunities" },
            { industry: "Mining", url: "https://www.fool.com/investing/stock-market/market-sectors/materials/mining-stocks/", description: "Mining sector analysis" }
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
          allocation: [
            { category: "Emergency Fund ISA", percentage: 30, amount: Math.round(remainingIncome * 12 * 0.3), color: "#22c55e" },
            { category: "S&P 500 Index", percentage: 35, amount: Math.round(remainingIncome * 12 * 0.35), color: "#3b82f6" },
            { category: "Technology ETF", percentage: 20, amount: Math.round(remainingIncome * 12 * 0.2), color: "#f59e0b" },
            { category: "Individual Stocks", percentage: 10, amount: Math.round(remainingIncome * 12 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 5, amount: Math.round(remainingIncome * 12 * 0.05), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Technology", url: "https://www.nasdaq.com/market-activity/stocks/screener?exchange=nasdaq&sector=technology", description: "High-growth tech stocks" },
            { industry: "Biotech", url: "https://www.fool.com/investing/stock-market/market-sectors/healthcare/biotechnology-stocks/", description: "Biotechnology opportunities" },
            { industry: "Clean Energy", url: "https://www.investopedia.com/investing/renewable-energy-stocks/", description: "Renewable energy investments" }
          ]
        },
        {
          phase: "Phase 2 (Years 2-5)",
          timeframe: "1-5 years",
          allocation: [
            { category: "Emergency Fund ISA", percentage: 20, amount: Math.round(remainingIncome * 12 * 4 * 0.2), color: "#22c55e" },
            { category: "S&P 500 Index", percentage: 30, amount: Math.round(remainingIncome * 12 * 4 * 0.3), color: "#3b82f6" },
            { category: "Technology ETF", percentage: 25, amount: Math.round(remainingIncome * 12 * 4 * 0.25), color: "#f59e0b" },
            { category: "Growth Stocks", percentage: 15, amount: Math.round(remainingIncome * 12 * 4 * 0.15), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 10, amount: Math.round(remainingIncome * 12 * 4 * 0.1), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Artificial Intelligence", url: "https://www.fool.com/investing/stock-market/market-sectors/technology/artificial-intelligence-stocks/", description: "AI and machine learning stocks" },
            { industry: "Electric Vehicles", url: "https://www.investopedia.com/electric-vehicle-stocks-5203189", description: "EV industry analysis" },
            { industry: "Cybersecurity", url: "https://www.marketwatch.com/story/cybersecurity-stocks-to-watch", description: "Cybersecurity investment guide" }
          ]
        },
        {
          phase: "Phase 3 (Years 6-10)",
          timeframe: "6-10 years",
          allocation: [
            { category: "Emergency Fund ISA", percentage: 15, amount: Math.round(remainingIncome * 12 * 5 * 0.15), color: "#22c55e" },
            { category: "Global Growth Index", percentage: 40, amount: Math.round(remainingIncome * 12 * 5 * 0.4), color: "#3b82f6" },
            { category: "Technology/Innovation", percentage: 25, amount: Math.round(remainingIncome * 12 * 5 * 0.25), color: "#f59e0b" },
            { category: "Emerging Markets", percentage: 10, amount: Math.round(remainingIncome * 12 * 5 * 0.1), color: "#8b5cf6" },
            { category: "Workplace Pension", percentage: 10, amount: Math.round(remainingIncome * 12 * 5 * 0.1), color: "#ec4899" }
          ],
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
          ],
          industryLinks: [
            { industry: "Space Technology", url: "https://www.fool.com/investing/2021/02/11/3-space-stocks-that-could-launch-your-portfolio/", description: "Space industry investments" },
            { industry: "Quantum Computing", url: "https://www.investopedia.com/quantum-computing-stocks-5220349", description: "Quantum computing opportunities" },
            { industry: "Green Technology", url: "https://www.marketwatch.com/story/green-technology-stocks", description: "Environmental technology stocks" }
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
                    <CardContent className="space-y-6">
                      {/* Interactive Charts */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-1">
                            <PiggyBank className="h-4 w-4" />
                            Allocation Distribution
                          </h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={phase.allocation}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ category, percentage }) => `${category}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="percentage"
                              >
                                {phase.allocation.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            Investment Amounts (£)
                          </h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={phase.allocation} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={10} />
                              <YAxis />
                              <Tooltip formatter={(value) => [`£${value}`, 'Amount']} />
                              <Bar dataKey="amount" fill="#8884d8">
                                {phase.allocation.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Allocation Table */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <PiggyBank className="h-4 w-4" />
                          Detailed Allocation
                        </h4>
                        <div className="space-y-2">
                          {phase.allocation.map((asset, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded bg-muted/50 border">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: asset.color }}
                                />
                                <span className="text-sm font-medium">{asset.category}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">{asset.percentage}%</Badge>
                                <span className="text-sm font-semibold text-primary">£{asset.amount.toLocaleString()}</span>
                              </div>
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

                      {/* Industry Investment Links */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          Industry Investment Resources
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {phase.industryLinks.map((link, i) => (
                            <Button 
                              key={i}
                              variant="outline" 
                              size="sm"
                              className="justify-start h-auto p-3"
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              <div className="text-left">
                                <div className="font-medium text-sm">{link.industry}</div>
                                <div className="text-xs text-muted-foreground">{link.description}</div>
                              </div>
                              <ExternalLink className="h-3 w-3 ml-auto" />
                            </Button>
                          ))}
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
                  <li>• These calculations are based on your current available income of £{remainingIncome}/month</li>
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