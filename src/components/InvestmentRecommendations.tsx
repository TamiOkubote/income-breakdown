import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  TrendingUp, 
  PiggyBank, 
  Shield, 
  Globe, 
  Target,
  Zap,
  Building,
  Award,
  ChevronDown,
  ExternalLink,
  Star,
  TrendingDown,
  BarChart3,
  Percent,
  Calendar,
  AlertTriangle
} from "lucide-react";
import StockChart from "./StockChart";

interface SubInvestment {
  name: string;
  description: string;
  projection1Y: string;
  projection2Y: string;
  projection5Y: string;
  projection10Y: string;
  securityRating?: string;
  provider: string;
  link: string;
  icon: React.ReactNode;
}

interface InvestmentOption {
  name: string;
  allocation: number;
  amount: number;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  icon: React.ReactNode;
  timeHorizon: string;
  expectedReturn: string;
  subInvestments: SubInvestment[];
  monitoringLinks: { name: string; url: string; description: string }[];
}

interface InvestmentRecommendationsProps {
  remainingIncome: number;
}

const InvestmentRecommendations = ({ remainingIncome }: InvestmentRecommendationsProps) => {
  // Conservative allocation for young professionals
  const investments: InvestmentOption[] = [
    {
      name: "Emergency Fund (ISA)",
      allocation: 25,
      amount: Math.round(remainingIncome * 0.25),
      risk: 'Low',
      description: "High-yield savings account for emergencies",
      icon: <Shield className="h-5 w-5 text-finance-green" />,
      timeHorizon: "Immediate access",
      expectedReturn: "2-4% annually",
      subInvestments: [
        {
          name: "Marcus by Goldman Sachs",
          description: "Premium savings account with competitive rates",
          projection1Y: "4.50%",
          projection2Y: "4.25%",
          projection5Y: "3.80%",
          projection10Y: "3.50%",
          securityRating: "FSCS Protected",
          provider: "Goldman Sachs",
          link: "https://www.marcus.co.uk",
          icon: <Shield className="h-4 w-4 text-finance-green" />
        },
        {
          name: "Chase Saver Account",
          description: "High-yield savings with instant access",
          projection1Y: "4.10%",
          projection2Y: "3.90%",
          projection5Y: "3.60%",
          projection10Y: "3.30%",
          securityRating: "FSCS Protected",
          provider: "JPMorgan Chase",
          link: "https://www.chase.co.uk",
          icon: <Shield className="h-4 w-4 text-finance-green" />
        }
      ],
      monitoringLinks: [
        { name: "Savings Champion", url: "https://www.savingschampion.co.uk", description: "Compare UK savings rates" },
        { name: "MoneySavingExpert", url: "https://www.moneysavingexpert.com/savings", description: "Best savings accounts guide" }
      ]
    },
    {
      name: "S&P 500 Index Fund",
      allocation: 30,
      amount: Math.round(remainingIncome * 0.30),
      risk: 'Medium',
      description: "Diversified US stock market exposure",
      icon: <Globe className="h-5 w-5 text-primary" />,
      timeHorizon: "5+ years",
      expectedReturn: "7-10% annually",
      subInvestments: [
        {
          name: "Vanguard S&P 500 UCITS ETF",
          description: "Low-cost tracking of S&P 500 index",
          projection1Y: "8-12%",
          projection2Y: "7-11%",
          projection5Y: "9-13%",
          projection10Y: "8-12%",
          provider: "Vanguard",
          link: "https://www.vanguard.co.uk",
          icon: <Globe className="h-4 w-4 text-primary" />
        },
        {
          name: "FTSE 100 Index Fund",
          description: "UK's largest 100 companies tracker",
          projection1Y: "6-10%",
          projection2Y: "5-9%",
          projection5Y: "7-11%",
          projection10Y: "6-10%",
          provider: "Multiple",
          link: "https://www.londonstockexchange.com",
          icon: <Globe className="h-4 w-4 text-primary" />
        },
        {
          name: "FTSE 250 Index Fund",
          description: "Mid-cap UK companies with growth potential",
          projection1Y: "7-12%",
          projection2Y: "6-11%",
          projection5Y: "8-13%",
          projection10Y: "7-12%",
          provider: "Multiple",
          link: "https://www.londonstockexchange.com",
          icon: <Globe className="h-4 w-4 text-primary" />
        }
      ],
      monitoringLinks: [
        { name: "Yahoo Finance", url: "https://finance.yahoo.com", description: "Real-time market data and analysis" },
        { name: "Morningstar", url: "https://www.morningstar.co.uk", description: "Fund performance and ratings" },
        { name: "Financial Times", url: "https://www.ft.com/markets", description: "Market news and analysis" }
      ]
    },
    {
      name: "Stocks & ETFs",
      allocation: 20,
      amount: Math.round(remainingIncome * 0.20),
      risk: 'High',
      description: "Individual stocks and sector ETFs",
      icon: <TrendingUp className="h-5 w-5 text-investment-purple" />,
      timeHorizon: "3+ years",
      expectedReturn: "5-15% annually",
      subInvestments: [
        {
          name: "Apple Inc. (AAPL)",
          description: "Technology giant with strong fundamentals",
          projection1Y: "10-15%",
          projection2Y: "12-18%",
          projection5Y: "15-25%",
          projection10Y: "20-35%",
          provider: "NASDAQ",
          link: "https://investor.apple.com",
          icon: <TrendingUp className="h-4 w-4 text-investment-purple" />
        },
        {
          name: "Microsoft Corp. (MSFT)",
          description: "Cloud computing and AI leader",
          projection1Y: "8-14%",
          projection2Y: "10-16%",
          projection5Y: "12-22%",
          projection10Y: "18-32%",
          provider: "NASDAQ",
          link: "https://www.microsoft.com/en-us/investor",
          icon: <TrendingUp className="h-4 w-4 text-investment-purple" />
        },
        {
          name: "Technology SPDR ETF (XLK)",
          description: "Diversified technology sector exposure",
          projection1Y: "9-13%",
          projection2Y: "11-17%",
          projection5Y: "13-23%",
          projection10Y: "16-28%",
          provider: "State Street",
          link: "https://www.ssga.com",
          icon: <BarChart3 className="h-4 w-4 text-investment-purple" />
        }
      ],
      monitoringLinks: [
        { name: "MarketWatch", url: "https://www.marketwatch.com", description: "Stock analysis and news" },
        { name: "Seeking Alpha", url: "https://seekingalpha.com", description: "Investment research and analysis" },
        { name: "TradingView", url: "https://www.tradingview.com", description: "Advanced charting and technical analysis" }
      ]
    },
    {
      name: "Pension Contribution",
      allocation: 15,
      amount: Math.round(remainingIncome * 0.15),
      risk: 'Low',
      description: "Workplace pension with employer matching",
      icon: <PiggyBank className="h-5 w-5 text-accent" />,
      timeHorizon: "Retirement",
      expectedReturn: "6-8% annually",
      subInvestments: [
        {
          name: "NEST Pension Scheme",
          description: "Government-backed workplace pension",
          projection1Y: "6-8%",
          projection2Y: "6-9%",
          projection5Y: "7-10%",
          projection10Y: "6-9%",
          provider: "NEST Corporation",
          link: "https://www.nestpensions.org.uk",
          icon: <PiggyBank className="h-4 w-4 text-accent" />
        },
        {
          name: "NOW: Pensions",
          description: "Low-cost workplace pension provider",
          projection1Y: "5-7%",
          projection2Y: "6-8%",
          projection5Y: "6-9%",
          projection10Y: "5-8%",
          provider: "NOW: Pensions",
          link: "https://www.nowpensions.com",
          icon: <PiggyBank className="h-4 w-4 text-accent" />
        }
      ],
      monitoringLinks: [
        { name: "The Pensions Regulator", url: "https://www.thepensionsregulator.gov.uk", description: "Official pension guidance" },
        { name: "MoneyHelper", url: "https://www.moneyhelper.org.uk/en/pensions-and-retirement", description: "Free pension advice" }
      ]
    },
    {
      name: "Bonds & Fixed Income",
      allocation: 10,
      amount: Math.round(remainingIncome * 0.10),
      risk: 'Low',
      description: "Government and corporate bonds",
      icon: <Building className="h-5 w-5 text-warning" />,
      timeHorizon: "1-5 years",
      expectedReturn: "3-6% annually",
      subInvestments: [
        {
          name: "UK Government Gilts",
          description: "10-year UK government bonds",
          projection1Y: "4.2%",
          projection2Y: "4.0%",
          projection5Y: "3.8%",
          projection10Y: "3.5%",
          securityRating: "AAA (Sovereign)",
          provider: "UK Treasury",
          link: "https://www.dmo.gov.uk",
          icon: <Building className="h-4 w-4 text-warning" />
        },
        {
          name: "Corporate Bond ETF",
          description: "Diversified investment-grade corporate bonds",
          projection1Y: "5.1%",
          projection2Y: "4.8%",
          projection5Y: "4.5%",
          projection10Y: "4.2%",
          securityRating: "BBB+ Average",
          provider: "iShares",
          link: "https://www.ishares.com",
          icon: <Building className="h-4 w-4 text-warning" />
        }
      ],
      monitoringLinks: [
        { name: "Debt Management Office", url: "https://www.dmo.gov.uk", description: "UK government bond information" },
        { name: "Bond Radar", url: "https://www.bondradar.com", description: "Corporate bond analysis" },
        { name: "FT Bond Centre", url: "https://markets.ft.com/data/bonds", description: "Bond market data and analysis" }
      ]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-finance-green';
      case 'Medium': return 'bg-warning';
      case 'High': return 'bg-expense-red';
      default: return 'bg-muted';
    }
  };

  const getSecurityIcon = (rating?: string) => {
    if (!rating) return null;
    if (rating.includes('AAA') || rating.includes('FSCS')) return <Star className="h-3 w-3 text-finance-green" />;
    if (rating.includes('BBB')) return <Shield className="h-3 w-3 text-warning" />;
    return <AlertTriangle className="h-3 w-3 text-expense-red" />;
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-6 w-6 text-investment-purple" />
          Investment Strategy
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recommended allocation for £{remainingIncome} monthly surplus
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {investments.map((investment, index) => (
          <Collapsible key={index} className="space-y-3 p-4 rounded-lg bg-muted/30">
            <CollapsibleTrigger className="w-full hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {investment.icon}
                  <div className="text-left">
                    <h3 className="font-semibold flex items-center gap-1">
                      {investment.name}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground">{investment.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">£{investment.amount}</div>
                  <Badge className={getRiskColor(investment.risk)}>
                    {investment.risk} Risk
                  </Badge>
                </div>
              </div>
              
              <Progress value={investment.allocation} className="h-2 mt-2" />
              
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <span className="text-muted-foreground">Time Horizon: </span>
                  <span className="font-medium">{investment.timeHorizon}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Return: </span>
                  <span className="font-medium text-finance-green">{investment.expectedReturn}</span>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 ml-4 border-l-2 border-muted pl-4">
              {/* Stock Chart for S&P 500 and Stocks & ETFs */}
              {(investment.name === "S&P 500 Index Fund" || investment.name === "Stocks & ETFs") && (
                <StockChart investment={investment} />
              )}
              
              {/* Sub-investments */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Recommended Options
                </h4>
                {investment.subInvestments.map((subInvestment, subIndex) => (
                  <div key={subIndex} className="p-3 rounded bg-background/50 border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {subInvestment.icon}
                        <div>
                          <h5 className="font-medium text-sm flex items-center gap-1">
                            {subInvestment.name}
                            {subInvestment.securityRating && getSecurityIcon(subInvestment.securityRating)}
                          </h5>
                          <p className="text-xs text-muted-foreground">{subInvestment.description}</p>
                          {subInvestment.securityRating && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {subInvestment.securityRating}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <a 
                        href={subInvestment.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center p-1 rounded bg-muted/50">
                        <div className="text-muted-foreground">1Y</div>
                        <div className="font-medium">{subInvestment.projection1Y}</div>
                      </div>
                      <div className="text-center p-1 rounded bg-muted/50">
                        <div className="text-muted-foreground">2Y</div>
                        <div className="font-medium">{subInvestment.projection2Y}</div>
                      </div>
                      <div className="text-center p-1 rounded bg-muted/50">
                        <div className="text-muted-foreground">5Y</div>
                        <div className="font-medium">{subInvestment.projection5Y}</div>
                      </div>
                      <div className="text-center p-1 rounded bg-muted/50">
                        <div className="text-muted-foreground">10Y</div>
                        <div className="font-medium">{subInvestment.projection10Y}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monitoring Links */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Market Monitoring
                </h4>
                <div className="grid gap-2">
                  {investment.monitoringLinks.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded bg-background/30 hover:bg-background/60 transition-colors text-sm"
                    >
                      <div>
                        <div className="font-medium">{link.name}</div>
                        <div className="text-xs text-muted-foreground">{link.description}</div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Investment Tips for Young Professionals</h3>
          </div>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Start with low-cost index funds for instant diversification</li>
            <li>• Maximize employer pension matching - it's free money!</li>
            <li>• Build 3-6 months expenses as emergency fund first</li>
            <li>• Consider Stocks & Shares ISA for tax-free growth</li>
            <li>• Time in market beats timing the market</li>
            <li>• Diversify across asset classes and geographical regions</li>
            <li>• Review and rebalance your portfolio annually</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentRecommendations;