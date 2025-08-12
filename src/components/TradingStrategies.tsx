import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Info, Activity, Target, AlertTriangle, CheckCircle } from "lucide-react";

interface TradingStrategiesProps {
  remainingIncome: number;
}

const TradingStrategies = ({ remainingIncome }: TradingStrategiesProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState("momentum");

  const strategies = [
    {
      id: "momentum",
      name: "Momentum Strategy",
      category: "Technical Analysis",
      riskLevel: "Medium",
      expectedReturn: "8-15%",
      timeHorizon: "3-6 months",
      complexity: "Beginner",
      description: "Buy stocks showing positive price momentum and sell when momentum reverses",
      detailDescription: "A momentum-based strategy that identifies stocks with strong upward price movement. The signal is generated when today's price is higher than yesterday's price, indicating positive momentum.",
      implementation: {
        signal: "signal(t+1) = 1 if P(t) > P(t-1), else 0",
        entry: "Buy when price > previous day's price",
        exit: "Sell when price < previous day's price or at day end",
        positionSize: "Equal weight across selected stocks"
      },
      advantages: [
        "Simple to understand and implement",
        "Works well in trending markets",
        "Quick to identify price movements",
        "Low computational requirements"
      ],
      disadvantages: [
        "Prone to whipsaws in sideways markets",
        "High transaction costs due to frequent trading",
        "May enter positions late in trends",
        "Sensitive to market noise"
      ],
      improvements: [
        "Add volatility filters to reduce noise",
        "Implement position sizing based on momentum strength",
        "Use multiple timeframes for confirmation",
        "Add stop-loss and take-profit levels"
      ],
      metrics: {
        sharpeRatio: 0.85,
        maxDrawdown: 15,
        winRate: 52,
        avgReturn: 12
      }
    },
    {
      id: "nday",
      name: "N-Day Return Strategy",
      category: "Mean Reversion",
      riskLevel: "Low-Medium",
      expectedReturn: "6-12%",
      timeHorizon: "1-4 weeks",
      complexity: "Beginner",
      description: "Trade based on price changes over N days, capturing short-term reversions",
      detailDescription: "This strategy looks for significant price changes over a specified number of days and trades on the assumption that large moves may reverse in the short term.",
      implementation: {
        signal: "return(t) = (P(t) - P(t-n)) / P(t-n), signal(t+1) = 1 if return(t) > θ, 0 if return(t) < -θ",
        entry: "Buy when N-day return exceeds positive threshold",
        exit: "Sell when N-day return falls below negative threshold",
        positionSize: "Risk-weighted based on volatility"
      },
      advantages: [
        "Captures mean reversion opportunities",
        "Flexible timeframe adjustment",
        "Less sensitive to daily noise",
        "Good for range-bound markets"
      ],
      disadvantages: [
        "May miss strong trending moves",
        "Requires careful threshold calibration",
        "Performance varies with market regime",
        "Lookback period optimization needed"
      ],
      improvements: [
        "Dynamic threshold adjustment based on volatility",
        "Multiple N-day periods for robustness",
        "Market regime detection filters",
        "Risk-adjusted position sizing"
      ],
      metrics: {
        sharpeRatio: 0.72,
        maxDrawdown: 12,
        winRate: 58,
        avgReturn: 9
      }
    },
    {
      id: "crossover",
      name: "Moving Average Crossover",
      category: "Trend Following",
      riskLevel: "Medium",
      expectedReturn: "10-18%",
      timeHorizon: "2-12 months",
      complexity: "Intermediate",
      description: "Buy when short-term MA crosses above long-term MA, sell on reverse crossover",
      detailDescription: "A classic trend-following strategy that uses two moving averages of different periods. Signals are generated when the faster MA crosses above or below the slower MA.",
      implementation: {
        signal: "MA_fast(t) = avg(P(t), ..., P(t-nf+1)), MA_slow(t) = avg(P(t), ..., P(t-ns+1)), signal(t+1) = 1 if MA_fast(t) > MA_slow(t), else 0",
        entry: "Buy when fast MA > slow MA",
        exit: "Sell when fast MA < slow MA",
        positionSize: "Fixed percentage of portfolio"
      },
      advantages: [
        "Excellent for capturing trends",
        "Reduces market noise",
        "Self-adjusting to market conditions",
        "Clear entry and exit signals"
      ],
      disadvantages: [
        "Lagging indicator - late entries/exits",
        "Poor performance in sideways markets",
        "Frequent whipsaws during consolidation",
        "Parameter sensitivity"
      ],
      improvements: [
        "Adaptive moving average periods",
        "Volume-weighted moving averages",
        "Multiple timeframe confirmation",
        "Momentum filters for crossover validation"
      ],
      metrics: {
        sharpeRatio: 0.91,
        maxDrawdown: 18,
        winRate: 48,
        avgReturn: 14
      }
    },
    {
      id: "volatility",
      name: "Volatility Filter Strategy",
      category: "Risk Management",
      riskLevel: "Low",
      expectedReturn: "5-10%",
      timeHorizon: "Variable",
      complexity: "Advanced",
      description: "Trade only when volatility conditions are favorable, avoiding high-risk periods",
      detailDescription: "This strategy incorporates volatility analysis to determine when market conditions are suitable for trading. It uses True Range and Average True Range to measure volatility.",
      implementation: {
        signal: "TR(t) = max(High-Low, |High-Close_prev|, |Low-Close_prev|), ATR(t) = rolling mean of TR over n days, signal(t+1) = 1 if P(t) > P(t-1) and ATR(t)/P(t) > threshold",
        entry: "Trade only when volatility exceeds threshold",
        exit: "Exit when volatility falls below threshold",
        positionSize: "Inverse volatility weighting"
      },
      advantages: [
        "Reduces risk during volatile periods",
        "Improves risk-adjusted returns",
        "Adapts to changing market conditions",
        "Protects capital during uncertainty"
      ],
      disadvantages: [
        "May miss opportunities in low volatility",
        "Complex threshold determination",
        "Requires sophisticated risk models",
        "Lower overall market exposure"
      ],
      improvements: [
        "Multi-asset volatility correlation",
        "Regime-dependent thresholds",
        "Forward-looking volatility measures",
        "Integration with fundamental analysis"
      ],
      metrics: {
        sharpeRatio: 1.12,
        maxDrawdown: 8,
        winRate: 62,
        avgReturn: 7.5
      }
    }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];

  // Generate sample performance data for visualization
  const generatePerformanceData = (strategy: typeof strategies[0]) => {
    const data = [];
    let portfolioValue = remainingIncome * 12; // Annual investment
    const months = 12;
    
    for (let i = 0; i <= months; i++) {
      const volatility = strategy.metrics.maxDrawdown / 100;
      const expectedReturn = strategy.metrics.avgReturn / 100 / 12;
      
      // Simulate monthly returns with some randomness
      const randomFactor = (Math.random() - 0.5) * volatility * 2;
      const monthlyReturn = expectedReturn + randomFactor;
      
      if (i > 0) {
        portfolioValue *= (1 + monthlyReturn);
      }
      
      data.push({
        month: i,
        value: Math.round(portfolioValue),
        benchmark: Math.round((remainingIncome * 12) * Math.pow(1.07, i/12)) // 7% annual benchmark
      });
    }
    
    return data;
  };

  const performanceData = generatePerformanceData(currentStrategy);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Advanced Trading Strategies
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Professional trading strategies with detailed implementation guides and performance metrics
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedStrategy} onValueChange={setSelectedStrategy} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {strategies.map((strategy) => (
              <TabsTrigger key={strategy.id} value={strategy.id} className="text-xs">
                {strategy.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {strategies.map((strategy) => (
            <TabsContent key={strategy.id} value={strategy.id} className="space-y-6">
              {/* Strategy Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{strategy.category}</Badge>
                      <Badge variant={strategy.riskLevel === 'Low' ? 'default' : strategy.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                        {strategy.riskLevel} Risk
                      </Badge>
                      <Badge variant="outline">{strategy.complexity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{strategy.detailDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Expected Return:</span>
                        <p className="text-muted-foreground">{strategy.expectedReturn}</p>
                      </div>
                      <div>
                        <span className="font-medium">Time Horizon:</span>
                        <p className="text-muted-foreground">{strategy.timeHorizon}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{strategy.metrics.sharpeRatio}</div>
                        <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                      </div>
                      <div className="text-center p-3 bg-destructive/10 rounded-lg">
                        <div className="text-2xl font-bold text-destructive">{strategy.metrics.maxDrawdown}%</div>
                        <div className="text-xs text-muted-foreground">Max Drawdown</div>
                      </div>
                      <div className="text-center p-3 bg-green-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{strategy.metrics.winRate}%</div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{strategy.metrics.avgReturn}%</div>
                        <div className="text-xs text-muted-foreground">Avg Return</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Simulated Performance vs Benchmark</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    12-month projection with £{remainingIncome * 12} annual investment
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                          label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `£${value.toLocaleString()}`, 
                            name === 'value' ? 'Strategy' : 'Benchmark (7%)'
                          ]}
                          labelFormatter={(month) => `Month ${month}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          dot={false}
                          name="Strategy Performance"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="benchmark" 
                          stroke="#9333ea" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Market Benchmark"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Implementation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Signal Generation</h4>
                      <code className="text-xs bg-muted p-2 rounded block">
                        {strategy.implementation.signal}
                      </code>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Entry Condition</h4>
                      <p className="text-sm text-muted-foreground">{strategy.implementation.entry}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Exit Condition</h4>
                      <p className="text-sm text-muted-foreground">{strategy.implementation.exit}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Position Sizing</h4>
                      <p className="text-sm text-muted-foreground">{strategy.implementation.positionSize}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {strategy.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      Disadvantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {strategy.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Improvement Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Strategy Improvements
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Recommended enhancements to optimize performance and reduce risk
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {strategy.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Risk Management */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Management Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-orange-800">Position Size</h4>
                      <p className="text-orange-700">Never risk more than 2-3% of portfolio per trade</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800">Stop Loss</h4>
                      <p className="text-orange-700">Set stop losses at 5-8% below entry price</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800">Diversification</h4>
                      <p className="text-orange-700">Spread trades across multiple sectors/assets</p>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-4">
                    <strong>Disclaimer:</strong> Past performance does not guarantee future results. 
                    All trading involves risk and you should never invest more than you can afford to lose.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingStrategies;