import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CongressMemberProfile from "@/components/CongressMemberProfile";

// Mock data for congress members
const congressMembers = [
  {
    id: 1,
    name: "Nancy Pelosi",
    party: "Democratic",
    state: "California",
    position: "Former Speaker of the House",
    totalTrades: 156,
    totalValue: 25400000,
    averageReturn: 14.2,
    avatar: "https://upload.wikimedia.org/wikipedia/commons/5/54/Nancy_Pelosi_official_photo.jpg",
    recentTrades: [
      { symbol: "NVDA", action: "BUY", amount: 5000000, date: "2024-01-15", price: 850, currentPrice: 920, return: 8.2 },
      { symbol: "AAPL", action: "SELL", amount: 2500000, date: "2024-01-10", price: 185, currentPrice: 175, return: -5.4 },
      { symbol: "MSFT", action: "BUY", amount: 3200000, date: "2024-01-08", price: 420, currentPrice: 445, return: 5.9 },
      { symbol: "GOOGL", action: "BUY", amount: 1800000, date: "2024-01-05", price: 140, currentPrice: 155, return: 10.7 },
      { symbol: "TSLA", action: "SELL", amount: 4100000, date: "2024-01-03", price: 250, currentPrice: 230, return: -8.0 }
    ]
  },
  {
    id: 2,
    name: "Dan Crenshaw",
    party: "Republican",
    state: "Texas",
    position: "Representative",
    totalTrades: 89,
    totalValue: 12300000,
    averageReturn: 11.8,
    avatar: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Dan_Crenshaw%2C_official_portrait%2C_116th_Congress.jpg",
    recentTrades: [
      { symbol: "XOM", action: "BUY", amount: 1500000, date: "2024-01-12", price: 110, currentPrice: 118, return: 7.3 },
      { symbol: "CVX", action: "BUY", amount: 2200000, date: "2024-01-09", price: 155, currentPrice: 162, return: 4.5 },
      { symbol: "LMT", action: "BUY", amount: 1800000, date: "2024-01-07", price: 480, currentPrice: 495, return: 3.1 }
    ]
  },
  {
    id: 3,
    name: "Josh Gottheimer",
    party: "Democratic",
    state: "New Jersey",
    position: "Representative",
    totalTrades: 124,
    totalValue: 18700000,
    averageReturn: 9.6,
    avatar: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Josh_Gottheimer%2C_official_portrait%2C_115th_Congress.jpg",
    recentTrades: [
      { symbol: "JPM", action: "BUY", amount: 2800000, date: "2024-01-14", price: 165, currentPrice: 172, return: 4.2 },
      { symbol: "BAC", action: "BUY", amount: 1900000, date: "2024-01-11", price: 34, currentPrice: 36, return: 5.9 },
      { symbol: "GS", action: "SELL", amount: 3400000, date: "2024-01-06", price: 380, currentPrice: 375, return: -1.3 }
    ]
  },
  {
    id: 4,
    name: "Austin Scott",
    party: "Republican",
    state: "Georgia",
    position: "Representative",
    totalTrades: 67,
    totalValue: 8900000,
    averageReturn: 7.3,
    avatar: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Austin_Scott%2C_official_portrait%2C_116th_Congress.jpg",
    recentTrades: [
      { symbol: "KO", action: "BUY", amount: 1200000, date: "2024-01-13", price: 58, currentPrice: 61, return: 5.2 },
      { symbol: "PG", action: "BUY", amount: 1500000, date: "2024-01-08", price: 150, currentPrice: 155, return: 3.3 }
    ]
  }
];

const CongressTrades = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<typeof congressMembers[0] | null>(null);

  const totalTradesValue = congressMembers.reduce((sum, member) => sum + member.totalValue, 0);
  const totalTrades = congressMembers.reduce((sum, member) => sum + member.totalTrades, 0);
  const averageReturn = congressMembers.reduce((sum, member) => sum + member.averageReturn, 0) / congressMembers.length;

  if (selectedMember) {
    return <CongressMemberProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Main
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Users className="h-8 w-8" />
                Congress Trading Analysis
              </h1>
              <p className="text-muted-foreground">
                Track and analyze stock trades made by US Congress members
              </p>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold text-primary">{totalTrades.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-primary">${(totalTradesValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-finance-green" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Return</p>
                    <p className="text-2xl font-bold text-finance-green">+{averageReturn.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-finance-green" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* External Resources */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle>External Trading Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="https://www.capitoltrades.com/trades" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors border"
                >
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Capitol Trades</h4>
                    <p className="text-sm text-muted-foreground">Real-time congress trading data</p>
                  </div>
                </a>
                
                <a 
                  href="https://www.quiverquant.com/congresstrading/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors border"
                >
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Quiver Quantitative</h4>
                    <p className="text-sm text-muted-foreground">Advanced trading analytics</p>
                  </div>
                </a>
                
                <a 
                  href="https://www.insiderfinance.io/congress-trades" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors border"
                >
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Insider Finance</h4>
                    <p className="text-sm text-muted-foreground">Congress trading insights</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Congress Members List */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle>Top Trading Congress Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {congressMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow border bg-background/50"
                    onClick={() => setSelectedMember(member)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <Badge variant={member.party === 'Democratic' ? 'default' : 'secondary'}>
                              {member.party === 'Democratic' ? 'D' : 'R'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{member.position}</p>
                          <p className="text-sm text-muted-foreground mb-3">{member.state}</p>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Trades</p>
                              <p className="font-semibold">{member.totalTrades}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Value</p>
                              <p className="font-semibold">${(member.totalValue / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Return</p>
                              <p className={`font-semibold ${member.averageReturn > 0 ? 'text-finance-green' : 'text-expense-red'}`}>
                                {member.averageReturn > 0 ? '+' : ''}{member.averageReturn.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CongressTrades;