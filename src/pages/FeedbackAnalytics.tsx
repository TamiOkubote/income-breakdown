import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, MessageSquare, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

interface FeedbackPoint {
  id: string;
  text: string;
  timestamp: number;
}

interface WordFrequency {
  word: string;
  count: number;
  size: number;
}

const FeedbackAnalytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we should return to investments page
  const getReferrer = () => {
    const from = location.state?.from;
    if (from === '/investments') {
      const savedState = localStorage.getItem('investmentState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return { pathname: '/investments', state: parsed };
      }
    }
    return from || '/feedback';
  };
  
  const referrer = getReferrer();
  const [allFeedback, setAllFeedback] = useState<FeedbackPoint[]>([]);
  const [wordCloud, setWordCloud] = useState<WordFrequency[]>([]);

  useEffect(() => {
    // Load all feedback from localStorage
    const storedFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    setAllFeedback(storedFeedback);

    // Process word frequency
    if (storedFeedback.length > 0) {
      processWordFrequency(storedFeedback);
    }
  }, []);

  const processWordFrequency = (feedback: FeedbackPoint[]) => {
    const wordCounts: { [key: string]: number } = {};
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);

    feedback.forEach(point => {
      const words = point.text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.has(word));

      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });

    // Convert to array and calculate sizes
    const wordArray = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count, size: 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50); // Top 50 words

    // Calculate relative sizes (12px to 48px)
    const maxCount = wordArray[0]?.count || 1;
    const minCount = Math.min(...wordArray.map(w => w.count));
    
    wordArray.forEach(item => {
      const ratio = (item.count - minCount) / (maxCount - minCount);
      item.size = 12 + (ratio * 36); // Size between 12px and 48px
    });

    setWordCloud(wordArray);
  };

  const getRandomColor = (index: number) => {
    const colors = [
      'text-primary',
      'text-investment-purple',
      'text-finance-green',
      'text-expense-red',
      'text-warning',
      'text-accent',
      'text-secondary',
      'text-muted-foreground'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (typeof referrer === 'object') {
                      navigate(referrer.pathname, { state: referrer.state });
                    } else {
                      navigate(referrer);
                    }
                  }}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Community Feedback Analytics
              </h1>
              <p className="text-muted-foreground">
                Discover popular themes and trending ideas from user feedback
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Statistics */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Feedback Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">{allFeedback.length}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-investment-purple/10">
                    <div className="text-2xl font-bold text-investment-purple">{wordCloud.length}</div>
                    <div className="text-sm text-muted-foreground">Unique Words</div>
                  </div>
                </div>
                
                {wordCloud.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Top Keywords</h4>
                    <div className="space-y-1">
                      {wordCloud.slice(0, 5).map((item, index) => (
                        <div key={item.word} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{item.word}</span>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Word Cloud */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Popular Keywords Word Cloud
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Larger words appear more frequently in user feedback
                </p>
              </CardHeader>
              <CardContent>
                {wordCloud.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No feedback data available</p>
                    <p className="text-sm">Start by adding some feedback points!</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center items-center gap-2 p-8 min-h-80">
                    {wordCloud.map((item, index) => (
                      <span
                        key={item.word}
                        className={`cursor-pointer hover:opacity-70 transition-opacity capitalize font-semibold ${getRandomColor(index)}`}
                        style={{
                          fontSize: `${item.size}px`,
                          lineHeight: '1.2',
                        }}
                        title={`Mentioned ${item.count} times`}
                      >
                        {item.word}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Feedback */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Recent Community Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allFeedback.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No feedback submissions yet</p>
                  <Button 
                    onClick={() => navigate('/feedback')}
                    className="mt-4"
                  >
                    Be the first to provide feedback
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allFeedback
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 20)
                    .map((point, index) => (
                      <div
                        key={point.id}
                        className="p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(point.timestamp).toLocaleDateString()} {new Date(point.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{point.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FeedbackAnalytics;