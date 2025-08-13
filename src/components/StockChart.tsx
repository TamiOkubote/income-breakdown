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

  // Mock S&P 500 historical data
  const sp500Data: StockData[] = [
    { date: '2014', price: 2000 },
    { date: '2015', price: 2050 },
    { date: '2016', price: 2240 },
    { date: '2017', price: 2670 },
    { date: '2018', price: 2510 },
    { date: '2019', price: 3230 },
    { date: '2020', price: 3740 },
    { date: '2021', price: 4770 },
    { date: '2022', price: 3840 },
    { date: '2023', price: 4770 },
    { date: '2024', price: 5200 },
  ];

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

  // Generate mock chart data combining S&P 500 and selected stocks
  const generateChartData = () => {
    return sp500Data.map(dataPoint => {
      const chartPoint: any = {
        date: dataPoint.date,
        'S&P 500': dataPoint.price,
      };

      selectedStocks.forEach(stock => {
        // Mock historical data for selected stocks based on their performance
        const basePrice = 100;
        const yearIndex = sp500Data.findIndex(d => d.date === dataPoint.date);
        const performance = getPerformanceByPeriod(stock, activePeriod) / 100;
        chartPoint[stock.symbol] = Math.round(basePrice * Math.pow(1 + performance, yearIndex + 1));
      });

      return chartPoint;
    });
  };

  const chartData = generateChartData();

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1Y">1 Year</TabsTrigger>
            <TabsTrigger value="5Y">5 Years</TabsTrigger>
            <TabsTrigger value="10Y">10 Years</TabsTrigger>
          </TabsList>

          <TabsContent value={activePeriod} className="space-y-6">
            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="S&P 500"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb' }}
                  />
                  {selectedStocks.map((stock, index) => (
                    <Line
                      key={stock.symbol}
                      type="monotone"
                      dataKey={stock.symbol}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ fill: colors[index % colors.length] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Selected Stocks */}
            {selectedStocks.length > 0 && (
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

            {/* Stock Search and Selection */}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockChart;