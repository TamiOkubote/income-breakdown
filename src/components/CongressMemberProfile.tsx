import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import Header from "@/components/Header";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, Area, AreaChart } from 'recharts';

interface Trade {
  symbol: string;
  action: string;
  amount: number;
  date: string;
  price: number;
  currentPrice: number;
  return: number;
}

interface CongressMember {
  id: number;
  name: string;
  party: string;
  state: string;
  position: string;
  totalTrades: number;
  totalValue: number;
  averageReturn: number;
  avatar: string;
  recentTrades: Trade[];
}

interface CongressMemberProfileProps {
  member: CongressMember;
  onBack: () => void;
}

const CongressMemberProfile: React.FC<CongressMemberProfileProps> = ({ member, onBack }) => {
  // Generate time series data for performance chart
  const performanceData = [
    { month: 'Jan', return: 12.5, portfolio: 100000 },
    { month: 'Feb', return: 8.3, portfolio: 108300 },
    { month: 'Mar', return: 15.7, portfolio: 125342 },
    { month: 'Apr', return: -3.2, portfolio: 121331 },
    { month: 'May', return: 9.8, portfolio: 133225 },
    { month: 'Jun', return: 6.4, portfolio: 141740 },
    { month: 'Jul', return: 11.2, portfolio: 157616 },
    { month: 'Aug', return: -1.5, portfolio: 155241 },
    { month: 'Sep', return: 7.9, portfolio: 167505 },
    { month: 'Oct', return: 4.3, portfolio: 174712 },
    { month: 'Nov', return: 13.8, portfolio: 198822 },
    { month: 'Dec', return: member.averageReturn, portfolio: member.totalValue / 1000 }
  ];

  // Generate sector allocation data
  const sectorData = [
    { name: 'Technology', value: 35, fill: '#8884d8' },
    { name: 'Finance', value: 25, fill: '#82ca9d' },
    { name: 'Healthcare', value: 20, fill: '#ffc658' },
    { name: 'Energy', value: 12, fill: '#ff7c7c' },
    { name: 'Consumer', value: 8, fill: '#8dd1e1' }
  ];

  // Generate trade frequency data
  const tradeFrequencyData = [
    { month: 'Jan', trades: 12 },
    { month: 'Feb', trades: 8 },
    { month: 'Mar', trades: 15 },
    { month: 'Apr', trades: 6 },
    { month: 'May', trades: 11 },
    { month: 'Jun', trades: 9 },
    { month: 'Jul', trades: 14 },
    { month: 'Aug', trades: 7 },
    { month: 'Sep', trades: 13 },
    { month: 'Oct', trades: 10 },
    { month: 'Nov', trades: 16 },
    { month: 'Dec', trades: 18 }
  ];

  // Generate risk vs return scatter data
  const riskReturnData = member.recentTrades.map((trade, index) => ({
    risk: Math.abs(trade.return) * (Math.random() * 2 + 0.5),
    return: trade.return,
    symbol: trade.symbol,
    amount: trade.amount / 1000000
  }));

  // Generate normal distribution data for returns
  const generateNormalDistribution = () => {
    const data = [];
    for (let i = -20; i <= 20; i += 2) {
      const x = i;
      const y = Math.exp(-0.5 * Math.pow((x - member.averageReturn) / 5, 2)) / (5 * Math.sqrt(2 * Math.PI));
      data.push({ return: x, probability: y * 100 });
    }
    return data;
  };

  const distributionData = generateNormalDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Congress Trades
              </Button>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-primary">{member.name}</h1>
                  <p className="text-muted-foreground">{member.position} • {member.state}</p>
                  <Badge variant={member.party === 'Democratic' ? 'default' : 'secondary'} className="mt-1">
                    {member.party}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold text-primary">{member.totalTrades}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                    <p className="text-2xl font-bold text-primary">${(member.totalValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-finance-green" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Return</p>
                    <p className={`text-2xl font-bold ${member.averageReturn > 0 ? 'text-finance-green' : 'text-expense-red'}`}>
                      {member.averageReturn > 0 ? '+' : ''}{member.averageReturn.toFixed(1)}%
                    </p>
                  </div>
                  {member.averageReturn > 0 ? 
                    <TrendingUp className="h-8 w-8 text-finance-green" /> : 
                    <TrendingDown className="h-8 w-8 text-expense-red" />
                  }
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recent Trades</p>
                    <p className="text-2xl font-bold text-primary">{member.recentTrades.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Portfolio Performance Line Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Portfolio Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="return" stroke="#8884d8" strokeWidth={2} name="Monthly Return %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sector Allocation Pie Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trade Frequency Bar Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Monthly Trade Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tradeFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trades" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk vs Return Scatter Plot */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Risk vs Return Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={riskReturnData}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="risk" name="Risk" />
                    <YAxis type="number" dataKey="return" name="Return" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background p-2 border rounded shadow">
                              <p className="font-semibold">{data.symbol}</p>
                              <p>Return: {data.return.toFixed(1)}%</p>
                              <p>Risk: {data.risk.toFixed(1)}</p>
                              <p>Amount: ${data.amount.toFixed(1)}M</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="return" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Portfolio Value Area Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Portfolio Value Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${(Number(value) / 1000).toFixed(0)}K`, 'Portfolio Value']} />
                    <Area type="monotone" dataKey="portfolio" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Return Distribution */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Return Distribution (Normal Curve)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="return" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${Number(value).toFixed(3)}`, 'Probability']} />
                    <Area type="monotone" dataKey="probability" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Trades Table */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Action</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Entry Price</th>
                      <th className="text-left p-2">Current Price</th>
                      <th className="text-left p-2">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.recentTrades.map((trade, index) => (
                      <tr key={index} className="border-b hover:bg-muted/20">
                        <td className="p-2 font-semibold">{trade.symbol}</td>
                        <td className="p-2">
                          <Badge variant={trade.action === 'BUY' ? 'default' : 'secondary'}>
                            {trade.action}
                          </Badge>
                        </td>
                        <td className="p-2">${(trade.amount / 1000000).toFixed(1)}M</td>
                        <td className="p-2">{new Date(trade.date).toLocaleDateString()}</td>
                        <td className="p-2">${trade.price}</td>
                        <td className="p-2">${trade.currentPrice}</td>
                        <td className="p-2">
                          <span className={trade.return > 0 ? 'text-finance-green' : 'text-expense-red'}>
                            {trade.return > 0 ? '+' : ''}{trade.return.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CongressMemberProfile;