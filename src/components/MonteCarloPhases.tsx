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
  strategy: string;
  phase: "1" | "2" | "3";
}

const MonteCarloPhases = ({
  initialAmount,
  monthlyContribution,
  expectedReturn,
  volatility,
  strategy,
  phase
}: MonteCarloSimulationProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Define phase parameters
  const phaseConfig = {
    "1": { years: 1, title: "Phase 1: Year 1" },
    "2": { years: 4, title: "Phase 2: Years 2-5", startYear: 1 },
    "3": { years: 5, title: "Phase 3: Years 6-10", startYear: 5 }
  };

  const currentConfig = phaseConfig[phase];
  const { years, title } = currentConfig;
  const startYear = 'startYear' in currentConfig ? currentConfig.startYear : 0;
  
  // Monte Carlo simulation function
  const runSimulation = (simulations = 1000) => {
    const results = [];
    const months = years * 12;
    
    const riskFreeRate = 0.04;
    const excessReturn = (expectedReturn / 100) - riskFreeRate;
    const standardDeviation = volatility / 100;
    const sharpeRatio = excessReturn / standardDeviation;
    const adjustedReturn = riskFreeRate + (sharpeRatio * standardDeviation);
    
    for (let sim = 0; sim < simulations; sim++) {
      let value = initialAmount;
      const yearlyValues = [{ year: startYear, value: initialAmount }];
      
      for (let month = 1; month <= months; month++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        const monthlyAdjustedReturn = adjustedReturn / 12;
        const monthlyVolatility = standardDeviation / Math.sqrt(12);
        const monthlyReturn = monthlyAdjustedReturn + (monthlyVolatility * z0);
        
        value = value * (1 + monthlyReturn) + monthlyContribution;
        
        if (month % 12 === 0) {
          yearlyValues.push({ year: startYear + (month / 12), value: Math.round(value) });
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
  
  // Prepare chart data
  const chartData = [];
  for (let year = startYear; year <= startYear + years; year++) {
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
          <span>{title} - {strategy}</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Understanding {title}</DialogTitle>
                <DialogDescription className="space-y-4">
                  <p>
                    This simulation shows the projected performance for {title.toLowerCase()} of your investment strategy.
                  </p>
                  <div className="space-y-2">
                    <p><strong>Phase Details:</strong></p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li><strong>Time Period:</strong> {years} year{years > 1 ? 's' : ''}</li>
                      <li><strong>Expected Return:</strong> {expectedReturn}% annually</li>
                      <li><strong>Volatility:</strong> {volatility}%</li>
                      <li><strong>Monthly Investment:</strong> £{monthlyContribution}</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Each phase represents a different time horizon to help you understand how your investment might grow over time.
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
        <div className="h-64">
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
              
              <Line type="monotone" dataKey="p10" stroke="#dc2626" strokeWidth={2} dot={false} name="10th percentile" />
              <Line type="monotone" dataKey="p25" stroke="#ea580c" strokeWidth={2} dot={false} name="25th percentile" />
              <Line type="monotone" dataKey="p50" stroke="#2563eb" strokeWidth={3} dot={false} name="Median" />
              <Line type="monotone" dataKey="p75" stroke="#16a34a" strokeWidth={2} dot={false} name="75th percentile" />
              <Line type="monotone" dataKey="p90" stroke="#15803d" strokeWidth={2} dot={false} name="90th percentile" />
              
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
            <h4 className="font-semibold mb-2">{title} Summary</h4>
            <div className="space-y-1 text-sm">
              <p>Period Contributions: <span className="font-medium">£{(monthlyContribution * years * 12).toLocaleString()}</span></p>
              <p>Expected Annual Return: <span className="font-medium">{expectedReturn}%</span></p>
              <p>Volatility: <span className="font-medium">{volatility}%</span></p>
              <p>Time Horizon: <span className="font-medium">{years} year{years > 1 ? 's' : ''}</span></p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Insights</h4>
            <div className="space-y-1 text-sm">
              <p>• 50% chance of reaching £{Math.round(percentile50).toLocaleString()} or more</p>
              <p>• 25% chance of reaching £{Math.round(percentile75).toLocaleString()} or more</p>
              <p>• 10% chance portfolio could be below £{Math.round(percentile10).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonteCarloPhases;