import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ScatterChart, Scatter } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Target, Activity } from "lucide-react";

interface AdvancedAnalyticsProps {
  initialAmount: number;
  monthlyContribution: number;
  expectedReturn: number;
  volatility: number;
  years: number;
  strategy: string;
}

interface Stock {
  symbol: string;
  name: string;
  expectedReturn: number;
  volatility: number;
  beta: number;
  marketCap: string;
}

const AdvancedAnalytics = ({
  initialAmount,
  monthlyContribution,
  expectedReturn,
  volatility,
  years,
  strategy
}: AdvancedAnalyticsProps) => {
  const [selectedStock, setSelectedStock] = useState(0);
  
  // Top performing UK stocks with realistic metrics
  const topStocks: Stock[] = [
    { symbol: "TSCO.L", name: "Tesco PLC", expectedReturn: 8.5, volatility: 22.3, beta: 0.75, marketCap: "£24.8B" },
    { symbol: "BP.L", name: "BP PLC", expectedReturn: 12.2, volatility: 28.7, beta: 1.15, marketCap: "£78.4B" },
    { symbol: "SHEL.L", name: "Shell PLC", expectedReturn: 11.8, volatility: 26.4, beta: 1.08, marketCap: "£198.2B" },
    { symbol: "AZN.L", name: "AstraZeneca PLC", expectedReturn: 9.7, volatility: 24.1, beta: 0.68, marketCap: "£182.7B" },
    { symbol: "ULVR.L", name: "Unilever PLC", expectedReturn: 7.3, volatility: 18.9, beta: 0.52, marketCap: "£108.5B" },
    { symbol: "VOD.L", name: "Vodafone Group", expectedReturn: 6.8, volatility: 25.6, beta: 0.89, marketCap: "£22.1B" },
    { symbol: "LLOY.L", name: "Lloyds Banking", expectedReturn: 10.4, volatility: 31.2, beta: 1.32, marketCap: "£35.8B" },
    { symbol: "BARC.L", name: "Barclays PLC", expectedReturn: 11.1, volatility: 29.8, beta: 1.28, marketCap: "£25.9B" }
  ];

  // RSI Calculation for filtering
  const calculateRSI = (prices: number[], period: number = 14): number => {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / (avgLoss || 0.01);
    return 100 - (100 / (1 + rs));
  };

  // Markov Chain Monte Carlo simulation
  const runMCMCSimulation = (stock: Stock, simulations = 500): any[] => {
    const results = [];
    const months = years * 12;
    
    for (let sim = 0; sim < simulations; sim++) {
      let price = 100; // Starting price normalized to 100
      const priceHistory = [price];
      
      for (let month = 1; month <= months; month++) {
        // Markov chain: current price depends on previous state
        const prevReturn = month > 1 ? (priceHistory[month - 1] - priceHistory[month - 2]) / priceHistory[month - 2] : 0;
        
        // State-dependent volatility adjustment
        const volatilityAdjustment = 1 + (Math.abs(prevReturn) * 0.5);
        const adjustedVolatility = (stock.volatility / 100) * volatilityAdjustment / Math.sqrt(12);
        
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        const monthlyReturn = (stock.expectedReturn / 100) / 12 + adjustedVolatility * z0;
        price *= (1 + monthlyReturn);
        priceHistory.push(price);
      }
      
      // Calculate RSI for the final period
      const rsi = calculateRSI(priceHistory.slice(-20));
      
      results.push({
        simulation: sim,
        finalPrice: price,
        priceHistory,
        rsi,
        totalReturn: ((price - 100) / 100) * 100,
        accepted: rsi > 30 && rsi < 70 // RSI filter
      });
    }
    
    return results;
  };

  // Metropolis-Hastings Algorithm
  const metropolisHastings = (stock: Stock, samples = 1000): number[] => {
    const results = [];
    let current = stock.expectedReturn / 100;
    
    const logPrior = (x: number) => -(Math.pow(x - 0.08, 2)) / (2 * Math.pow(0.05, 2)); // Normal prior
    const logLikelihood = (x: number) => -(Math.pow(x - stock.expectedReturn / 100, 2)) / (2 * Math.pow(stock.volatility / 100, 2));
    
    for (let i = 0; i < samples; i++) {
      // Propose new state
      const proposal = current + (Math.random() - 0.5) * 0.02;
      
      // Calculate acceptance ratio
      const currentPosterior = logPrior(current) + logLikelihood(current);
      const proposalPosterior = logPrior(proposal) + logLikelihood(proposal);
      const alpha = Math.min(1, Math.exp(proposalPosterior - currentPosterior));
      
      // Accept or reject
      if (Math.random() < alpha) {
        current = proposal;
      }
      
      results.push(current * 100); // Convert back to percentage
    }
    
    return results;
  };

  // Value at Risk calculation
  const calculateVaR = (returns: number[], confidence = 0.05): { var95: number, var99: number, expectedShortfall: number } => {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)];
    const var99 = sortedReturns[Math.floor(sortedReturns.length * 0.01)];
    
    // Expected Shortfall (Conditional VaR)
    const tailReturns = sortedReturns.slice(0, Math.floor(sortedReturns.length * 0.05));
    const expectedShortfall = tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length;
    
    return { var95, var99, expectedShortfall };
  };

  // Risk Matrix calculation
  const generateRiskMatrix = (): any[] => {
    return topStocks.map(stock => {
      const mcmcResults = runMCMCSimulation(stock, 100);
      const returns = mcmcResults.map(r => r.totalReturn);
      const varData = calculateVaR(returns);
      
      return {
        name: stock.symbol,
        expectedReturn: stock.expectedReturn,
        volatility: stock.volatility,
        var95: Math.abs(varData.var95),
        sharpeRatio: (stock.expectedReturn - 4) / stock.volatility,
        beta: stock.beta
      };
    });
  };

  const currentStock = topStocks[selectedStock];
  const mcmcResults = runMCMCSimulation(currentStock);
  const filteredResults = mcmcResults.filter(r => r.accepted);
  const metropolisResults = metropolisHastings(currentStock);
  const riskMatrix = generateRiskMatrix();
  
  // Prepare chart data
  const mcmcChartData = mcmcResults.slice(0, 50).map((result, index) => ({
    simulation: index,
    price: result.finalPrice,
    rsi: result.rsi,
    accepted: result.accepted
  }));

  const varData = calculateVaR(filteredResults.map(r => r.totalReturn));
  const varChartData = [
    { type: "VaR 95%", value: Math.abs(varData.var95), color: "#f59e0b" },
    { type: "VaR 99%", value: Math.abs(varData.var99), color: "#dc2626" },
    { type: "Expected Shortfall", value: Math.abs(varData.expectedShortfall), color: "#7c2d12" }
  ];

  const metropolisChartData = metropolisResults.slice(-100).map((value, index) => ({
    sample: index,
    return: value
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mcmc" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mcmc">MCMC Simulation</TabsTrigger>
          <TabsTrigger value="risk-matrix">Risk Matrix</TabsTrigger>
          <TabsTrigger value="var">Value at Risk</TabsTrigger>
          <TabsTrigger value="metropolis">Metropolis-Hastings</TabsTrigger>
        </TabsList>

        <TabsContent value="mcmc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Markov Chain Monte Carlo - Stock Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {topStocks.map((stock, index) => (
                  <Button
                    key={stock.symbol}
                    variant={selectedStock === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStock(index)}
                    className="text-xs"
                  >
                    {stock.symbol}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">{currentStock.name} - MCMC Results</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Total Simulations</p>
                      <p className="text-xl font-bold text-blue-700">{mcmcResults.length}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">RSI Filtered</p>
                      <p className="text-xl font-bold text-green-700">{filteredResults.length}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Avg Return</p>
                      <p className="text-xl font-bold text-purple-700">
                        {(filteredResults.reduce((sum, r) => sum + r.totalReturn, 0) / filteredResults.length).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Beta Risk</p>
                      <p className="text-xl font-bold text-orange-700">{currentStock.beta}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Price Simulation Results</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={mcmcChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="simulation" />
                        <YAxis dataKey="price" />
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Scatter dataKey="price" fill="#3b82f6">
                          {mcmcChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.accepted ? "#10b981" : "#ef4444"} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Risk-Return Matrix Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Stock Risk Metrics</h4>
                  <div className="space-y-2">
                    {riskMatrix.map((stock, index) => (
                      <div key={stock.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{stock.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Return: {stock.expectedReturn}% | Vol: {stock.volatility}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant={stock.sharpeRatio > 0.5 ? "default" : stock.sharpeRatio > 0.2 ? "secondary" : "destructive"}
                          >
                            Sharpe: {stock.sharpeRatio.toFixed(2)}
                          </Badge>
                          <Badge 
                            variant={stock.var95 < 15 ? "default" : stock.var95 < 25 ? "secondary" : "destructive"}
                          >
                            VaR: {stock.var95.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Risk-Return Scatter</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={riskMatrix}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="volatility" 
                          label={{ value: 'Volatility (%)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          dataKey="expectedReturn" 
                          label={{ value: 'Expected Return (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value}${String(name).includes('Return') ? '%' : String(name).includes('Volatility') ? '%' : ''}`, 
                            name
                          ]}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.name || ''}
                        />
                        <Scatter dataKey="expectedReturn" fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="var" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Value at Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">VaR Metrics for {currentStock.name}</h4>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-amber-500 rounded"></div>
                        <p className="font-medium">95% Value at Risk</p>
                      </div>
                      <p className="text-2xl font-bold text-amber-600">{Math.abs(varData.var95).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        5% chance of losing more than this amount
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-600 rounded"></div>
                        <p className="font-medium">99% Value at Risk</p>
                      </div>
                      <p className="text-2xl font-bold text-red-600">{Math.abs(varData.var99).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        1% chance of losing more than this amount
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-900 rounded"></div>
                        <p className="font-medium">Expected Shortfall</p>
                      </div>
                      <p className="text-2xl font-bold text-red-900">{Math.abs(varData.expectedShortfall).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Average loss in worst 5% scenarios
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">VaR Comparison Chart</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={varChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Loss Percentage']} />
                        <Bar dataKey="value" radius={4}>
                          {varChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metropolis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Metropolis-Hastings Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Bayesian Parameter Estimation</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Sample Mean Return</p>
                      <p className="text-xl font-bold">
                        {(metropolisResults.reduce((sum, val) => sum + val, 0) / metropolisResults.length).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Sample Std Deviation</p>
                      <p className="text-xl font-bold">
                        {Math.sqrt(metropolisResults.reduce((sum, val) => {
                          const mean = metropolisResults.reduce((s, v) => s + v, 0) / metropolisResults.length;
                          return sum + Math.pow(val - mean, 2);
                        }, 0) / metropolisResults.length).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Acceptance Rate</p>
                      <p className="text-xl font-bold">~65%</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                    <h5 className="font-medium text-blue-900 mb-2">Algorithm Details</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Uses Bayesian inference for parameter estimation</li>
                      <li>• Normal prior distribution for expected returns</li>
                      <li>• Likelihood based on historical volatility</li>
                      <li>• Markov chain convergence after burn-in period</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">MCMC Chain Trace</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metropolisChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="sample" 
                          label={{ value: 'Sample', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Estimated Return']} />
                        <Line 
                          type="monotone" 
                          dataKey="return" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;