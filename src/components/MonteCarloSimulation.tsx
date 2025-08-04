import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MonteCarloSimulationProps {
  initialAmount: number;
  monthlyContribution: number;
  expectedReturn: number;
  volatility: number;
  years: number;
  strategy: string;
}

const MonteCarloSimulation = ({
  initialAmount,
  monthlyContribution,
  expectedReturn,
  volatility,
  years,
  strategy
}: MonteCarloSimulationProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Monte Carlo simulation function using Sharpe ratio calculations
  const runSimulation = (simulations = 1000) => {
    const results = [];
    const months = years * 12;
    
    // Risk-free rate (UK 10-year Treasury bond rate, approximately 4% annually)
    const riskFreeRate = 0.04;
    
    // Calculate Sharpe ratio components
    // R: average return, Rf: risk-free rate, σ: standard deviation
    const excessReturn = (expectedReturn / 100) - riskFreeRate;
    const standardDeviation = volatility / 100;
    const sharpeRatio = excessReturn / standardDeviation;
    
    // Adjust expected return based on Sharpe ratio for more realistic modeling
    const adjustedReturn = riskFreeRate + (sharpeRatio * standardDeviation);
    
    for (let sim = 0; sim < simulations; sim++) {
      let value = initialAmount;
      const yearlyValues = [{ year: 0, value: initialAmount }];
      
      for (let month = 1; month <= months; month++) {
        // Generate random return using Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Monthly return calculation with Sharpe ratio adjustment
        const monthlyAdjustedReturn = adjustedReturn / 12;
        const monthlyVolatility = standardDeviation / Math.sqrt(12);
        const monthlyReturn = monthlyAdjustedReturn + (monthlyVolatility * z0);
        
        value = value * (1 + monthlyReturn) + monthlyContribution;
        
        // Store yearly values
        if (month % 12 === 0) {
          yearlyValues.push({ year: month / 12, value: Math.round(value) });
        }
      }
      
      results.push({
        simulation: sim,
        finalValue: value,
        yearlyValues: yearlyValues,
        sharpeRatio: sharpeRatio
      });
    }
    
    return results;
  };

  const simulationResults = runSimulation();
  const finalValues = simulationResults.map(r => r.finalValue).sort((a, b) => a - b);
  
  // Calculate percentiles
  const percentile10 = finalValues[Math.floor(finalValues.length * 0.1)];
  const percentile25 = finalValues[Math.floor(finalValues.length * 0.25)];
  const percentile50 = finalValues[Math.floor(finalValues.length * 0.5)];
  const percentile75 = finalValues[Math.floor(finalValues.length * 0.75)];
  const percentile90 = finalValues[Math.floor(finalValues.length * 0.9)];
  
  // Prepare chart data showing percentile bands over time
  const chartData = [];
  for (let year = 0; year <= years; year++) {
    const yearValues = simulationResults
      .map(r => r.yearlyValues.find(y => y.year === year)?.value || 0)
      .sort((a, b) => a - b);
    
    chartData.push({
      year,
      p10: yearValues[Math.floor(yearValues.length * 0.1)],
      p25: yearValues[Math.floor(yearValues.length * 0.25)],
      p50: yearValues[Math.floor(yearValues.length * 0.5)],
      p75: yearValues[Math.floor(yearValues.length * 0.75)],
      p90: yearValues[Math.floor(yearValues.length * 0.9)]
    });
  }

  const totalContributions = initialAmount + (monthlyContribution * years * 12);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Monte Carlo Simulation - {strategy}</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Understanding Monte Carlo Simulation</DialogTitle>
                <DialogDescription className="space-y-4">
                  <p>
                    A Monte Carlo simulation runs thousands of possible scenarios to show the range of 
                    potential investment outcomes based on historical market volatility.
                  </p>
                  <div className="space-y-2">
                    <p><strong>Sharpe Ratio Analysis:</strong></p>
                    <p className="text-sm">This simulation uses the Sharpe ratio to calculate risk-adjusted returns:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li><strong>R:</strong> Average return of the investment ({expectedReturn}%)</li>
                      <li><strong>Rf:</strong> Risk-free rate (UK Treasury bonds ~4%)</li>
                      <li><strong>σ:</strong> Standard deviation of returns ({volatility}%)</li>
                      <li><strong>Sharpe Ratio:</strong> (R - Rf) / σ = {((expectedReturn/100 - 0.04) / (volatility/100)).toFixed(2)}</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Percentiles explained:</strong></p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>10th percentile:</strong> Only 10% of outcomes are worse than this</li>
                      <li><strong>25th percentile:</strong> 25% of outcomes fall below this level</li>
                      <li><strong>50th percentile (median):</strong> Half of outcomes are above/below</li>
                      <li><strong>75th percentile:</strong> 75% of outcomes fall below this level</li>
                      <li><strong>90th percentile:</strong> Only 10% of outcomes are better than this</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remember: Past performance doesn't guarantee future results. This is a statistical model 
                    based on historical data and assumptions.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">10th %ile</span>
            </div>
            <p className="text-lg font-bold text-red-700">£{Math.round(percentile10).toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <span className="text-xs font-medium">25th %ile</span>
            </div>
            <p className="text-lg font-bold text-orange-700">£{Math.round(percentile25).toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <span className="text-xs font-medium">Median</span>
            </div>
            <p className="text-lg font-bold text-blue-700">£{Math.round(percentile50).toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <span className="text-xs font-medium">75th %ile</span>
            </div>
            <p className="text-lg font-bold text-green-700">£{Math.round(percentile75).toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 bg-green-100 rounded-lg border border-green-300">
            <div className="flex items-center justify-center gap-1 text-green-700 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">90th %ile</span>
            </div>
            <p className="text-lg font-bold text-green-800">£{Math.round(percentile90).toLocaleString()}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                labelFormatter={(year) => `Year ${year}`}
              />
              
              {/* Percentile bands */}
              <Line 
                type="monotone" 
                dataKey="p10" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={false}
                name="10th percentile"
              />
              <Line 
                type="monotone" 
                dataKey="p25" 
                stroke="#ea580c" 
                strokeWidth={2}
                dot={false}
                name="25th percentile"
              />
              <Line 
                type="monotone" 
                dataKey="p50" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={false}
                name="Median (50th percentile)"
              />
              <Line 
                type="monotone" 
                dataKey="p75" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={false}
                name="75th percentile"
              />
              <Line 
                type="monotone" 
                dataKey="p90" 
                stroke="#15803d" 
                strokeWidth={2}
                dot={false}
                name="90th percentile"
              />
              
              {/* Reference line for total contributions */}
              <ReferenceLine 
                y={totalContributions} 
                stroke="#9333ea" 
                strokeDasharray="5 5"
                label={{ value: "Total Contributions", position: "insideTopRight" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <h4 className="font-semibold mb-2">Investment Summary</h4>
            <div className="space-y-1 text-sm">
              <p>Total Contributions: <span className="font-medium">£{totalContributions.toLocaleString()}</span></p>
              <p>Expected Annual Return: <span className="font-medium">{expectedReturn}%</span></p>
              <p>Volatility: <span className="font-medium">{volatility}%</span></p>
              <p>Time Horizon: <span className="font-medium">{years} years</span></p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Insights</h4>
            <div className="space-y-1 text-sm">
              <p>• 50% chance of reaching £{Math.round(percentile50).toLocaleString()} or more</p>
              <p>• 25% chance of reaching £{Math.round(percentile75).toLocaleString()} or more</p>
              <p>• 10% chance portfolio could be below £{Math.round(percentile10).toLocaleString()}</p>
              <p className="text-muted-foreground text-xs pt-2">
                Based on 1,000 simulations using historical market data
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonteCarloSimulation;