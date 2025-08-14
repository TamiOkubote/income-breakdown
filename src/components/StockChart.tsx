
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, Star, X } from "lucide-react";

interface StockData {
  date: string;
  price: number;
  symbol?: string;
}

interface Stock {
  symbol: string;
  name: string;
  performance1Y: number;
  performance5Y: number;
  performance10Y: number;
  sector: string;
}

interface StockChartProps {
  investment: {
    name: string;
    amount: number;
  };
}

const StockChart = ({ investment }: StockChartProps) => {
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePeriod, setActivePeriod] = useState('1Y');
  
  // Determine chart behavior based on investment type
  const isIndexFund = investment.name === "S&P 500 Index Fund";
  const isStocksETFs = investment.name === "Stocks & ETFs";

  // Generate realistic date ranges based on the current date
  const generateDateRange = (period: string) => {
    const endDate = new Date();
    const dates = [];
    
    if (period === '1Y') {
      // Last 12 months with weekly data points for more detail
      for (let i = 51; i >= 0; i--) {
        const date = new Date(endDate.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (period === '5Y') {
      // Last 5 years with monthly data points
      for (let i = 59; i >= 0; i--) {
        const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
        dates.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
      }
    } else if (period === '10Y') {
      // Last 10 years with quarterly data points
      for (let i = 39; i >= 0; i--) {
        const date = new Date(endDate.getFullYear(), endDate.getMonth() - (i * 3), 1);
        dates.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
      }
    } else if (period === 'ALL') {
      // S&P 500 since inception (1957) with yearly data points
      const inceptionYear = 1957;
      const currentYear = endDate.getFullYear();
      for (let year = inceptionYear; year <= currentYear; year++) {
        dates.push(year.toString());
      }
    }
    
    return dates;
  };

  // Generate S&P 500 data with realistic volatility and historical accuracy
  const generateSP500Data = (period: string) => {
    const dates = generateDateRange(period);
    const data = [];
    
    if (period === 'ALL') {
      // Historical S&P 500 data simulation from 1957 to present
      const startPrice = 40; // Approximate 1957 level
      const currentPrice = 4200; // Current level
      const totalYears = dates.length;
      
      for (let i = 0; i < dates.length; i++) {
        const yearProgress = i / (totalYears - 1);
        // Apply compound growth with historical volatility and market crashes
        let price = startPrice * Math.pow(currentPrice / startPrice, yearProgress);
        
        // Add historical market events simulation
        const year = parseInt(dates[i]);
        if (year >= 1973 && year <= 1974) price *= 0.85; // Oil crisis
        if (year >= 1987 && year <= 1987) price *= 0.92; // Black Monday
        if (year >= 2000 && year <= 2002) price *= 0.88; // Dot-com crash
        if (year >= 2008 && year <= 2009) price *= 0.83; // Financial crisis
        if (year >= 2020 && year <= 2020) price *= 0.95; // COVID crash and recovery
        
        // Add some realistic volatility
        const randomFactor = 0.9 + (Math.random() * 0.2);
        price *= randomFactor;
        
        data.push({
          date: dates[i],
          price: Math.round(price)
        });
      }
    } else {
      // More detailed data for shorter periods
      const basePrice = 4200;
      const volatility = period === '1Y' ? 0.02 : period === '5Y' ? 0.08 : 0.12;
      const trend = period === '1Y' ? 0.08 : period === '5Y' ? 0.10 : 0.12;
      
      for (let i = 0; i < dates.length; i++) {
        const timeProgress = i / (dates.length - 1);
        const periodLength = period === '1Y' ? 1 : period === '5Y' ? 5 : 10;
        
        // More sophisticated price movement simulation
        const trendComponent = basePrice * Math.pow(1 + trend, timeProgress * periodLength);
        const volatilityComponent = (Math.sin(timeProgress * Math.PI * 8) + Math.cos(timeProgress * Math.PI * 12)) * volatility * basePrice;
        const randomWalk = (Math.random() - 0.5) * volatility * basePrice * 0.5;
        
        data.push({
          date: dates[i],
          price: Math.round(trendComponent + volatilityComponent + randomWalk)
        });
      }
    }
    
    return data;
  };

  const sp500Data = generateSP500Data(activePeriod);

  // Mock top performing stocks data
  const topStocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', performance1Y: 15.2, performance5Y: 18.5, performance10Y: 21.3, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', performance1Y: 12.8, performance5Y: 16.2, performance10Y: 19.8, sector: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', performance1Y: 45.6, performance5Y: 35.2, performance10Y: 28.7, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', performance1Y: 8.9, performance5Y: 14.7, performance10Y: 17.2, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', performance1Y: 6.5, performance5Y: 12.8, performance10Y: 18.9, sector: 'Consumer Discretionary' },
    { symbol: 'TSLA', name: 'Tesla Inc.', performance1Y: 25.3, performance5Y: 42.1, performance10Y: 35.6, sector: 'Consumer Discretionary' },
    { symbol: 'META', name: 'Meta Platforms', performance1Y: 18.7, performance5Y: 15.9, performance10Y: 22.4, sector: 'Technology' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway', performance1Y: 9.2, performance5Y: 11.8, performance10Y: 13.5, sector: 'Financial Services' },
    { symbol: 'LLY', name: 'Eli Lilly and Co.', performance1Y: 32.1, performance5Y: 28.9, performance10Y: 19.7, sector: 'Healthcare' },
    { symbol: 'V', name: 'Visa Inc.', performance1Y: 11.4, performance5Y: 13.6, performance10Y: 16.8, sector: 'Financial Services' },
    { symbol: 'UNH', name: 'UnitedHealth Group', performance1Y: 14.8, performance5Y: 17.2, performance10Y: 18.9, sector: 'Healthcare' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', performance1Y: 5.3, performance5Y: 8.7, performance10Y: 12.1, sector: 'Healthcare' },
    { symbol: 'JPM', name: 'JPMorgan Chase', performance1Y: 13.2, performance5Y: 9.8, performance10Y: 14.6, sector: 'Financial Services' },
    { symbol: 'PG', name: 'Procter & Gamble', performance1Y: 7.9, performance5Y: 9.4, performance10Y: 11.8, sector: 'Consumer Staples' },
    { symbol: 'XOM', name: 'Exxon Mobil Corp.', performance1Y: 18.5, performance5Y: 8.2, performance10Y: 4.7, sector: 'Energy' },
  ];

  const getPerformanceByPeriod = (stock: Stock, period: string) => {
    switch (period) {
      case '1Y': return stock.performance1Y;
      case '5Y': return stock.performance5Y;
      case '10Y': return stock.performance10Y;
      default: return stock.performance1Y;
    }
  };

  const getSortedStocks = (period: string) => {
    return [...topStocks]
      .sort((a, b) => getPerformanceByPeriod(b, period) - getPerformanceByPeriod(a, period))
      .slice(0, 50);
  };

  const filteredStocks = getSortedStocks(activePeriod).filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addStock = (stock: Stock) => {
    if (selectedStocks.length < 50 && !selectedStocks.find(s => s.symbol === stock.symbol)) {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
  };

  // Generate chart data combining S&P 500 and selected stocks
  const generateChartData = () => {
    return sp500Data.map((dataPoint, index) => {
      const chartPoint: any = {
        date: dataPoint.date,
        'S&P 500': dataPoint.price,
      };

      selectedStocks.forEach(stock => {
        // Generate realistic stock data based on performance
        const basePrice = 100;
        const performance = getPerformanceByPeriod(stock, activePeriod) / 100;
        const periodLength = activePeriod === '1Y' ? 1 : activePeriod === '5Y' ? 5 : 10;
        const timeProgress = index / (sp500Data.length - 1);
        
        // Add some stock-specific volatility
        const volatility = (Math.random() - 0.5) * 0.2 * basePrice;
        const trendComponent = basePrice * Math.pow(1 + performance, timeProgress * periodLength);
        
        chartPoint[stock.symbol] = Math.round(trendComponent + volatility);
      });

      return chartPoint;
    });
  };

  const chartData = generateChartData();

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  // Custom tooltip for better formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'S&P 500' ? 
                `${entry.dataKey}: ${entry.value}` : 
                `${entry.dataKey}: $${entry.value}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-investment-purple" />
          Stock Performance Analysis - {investment.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive charts showing S&P 500 performance and top-performing stocks
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activePeriod} onValueChange={setActivePeriod}>
          <TabsList className={`grid w-full ${isIndexFund ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="1Y">Last Year</TabsTrigger>
            <TabsTrigger value="5Y">Last 5 Years</TabsTrigger>
            <TabsTrigger value="10Y">Last 10 Years</TabsTrigger>
            {isIndexFund && <TabsTrigger value="ALL">Since Inception</TabsTrigger>}
          </TabsList>

          <TabsContent value={activePeriod} className="space-y-6">
            {/* Enhanced Chart with Google Finance-like styling */}
            <div className="h-96 p-4 bg-white rounded-lg border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="1 1" stroke="#f0f0f0" strokeWidth={0.5} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {/* Show S&P 500 only for Index Fund, hide for Stocks & ETFs */}
                  {!isStocksETFs && (
                    <Line
                      type="monotone"
                      dataKey="S&P 500"
                      stroke="#1a73e8"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4, stroke: '#1a73e8', strokeWidth: 2, fill: '#fff' }}
                    />
                  )}
                  {/* Show individual stocks only for Stocks & ETFs, hide for Index Fund */}
                  {!isIndexFund && selectedStocks.map((stock, index) => (
                    <Line
                      key={stock.symbol}
                      type="monotone"
                      dataKey={stock.symbol}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, stroke: colors[index % colors.length], strokeWidth: 2, fill: '#fff' }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Selected Stocks - only show for Stocks & ETFs */}
            {!isIndexFund && selectedStocks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Stocks ({selectedStocks.length}/50)</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStocks.map((stock, index) => (
                    <Badge
                      key={stock.symbol}
                      variant="secondary"
                      className="flex items-center gap-1"
                      style={{ backgroundColor: colors[index % colors.length] + '20' }}
                    >
                      {stock.symbol}
                      <span className="text-xs">
                        +{getPerformanceByPeriod(stock, activePeriod).toFixed(1)}%
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeStock(stock.symbol)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Search and Selection - only show for Stocks & ETFs */}
            {!isIndexFund && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stocks by name, symbol, or sector..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  <h4 className="font-medium sticky top-0 bg-background py-2">
                    Top Performing Stocks - {activePeriod} Period
                  </h4>
                  {filteredStocks.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground">#{index + 1}</div>
                        </div>
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {stock.sector}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-finance-green font-medium">
                          +{getPerformanceByPeriod(stock, activePeriod).toFixed(1)}%
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addStock(stock)}
                          disabled={selectedStocks.find(s => s.symbol === stock.symbol) !== undefined || selectedStocks.length >= 50}
                          className="mt-1"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* S&P 500 Info for Index Fund */}
            {isIndexFund && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">S&P 500 Index Fund Performance</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track the performance of the 500 largest U.S. companies by market capitalization.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Period: </span>
                      <span className="font-medium">{activePeriod === 'ALL' ? 'Since 1957' : activePeriod}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Historical Return: </span>
                      <span className="font-medium text-finance-green">~10% annually</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockChart;
