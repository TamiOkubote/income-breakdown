import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Plus, Trash2 } from "lucide-react";
import Header from "@/components/Header";

interface FeedbackPoint {
  id: string;
  text: string;
  timestamp: number;
}

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedbackPoints, setFeedbackPoints] = useState<FeedbackPoint[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState('');

  const addFeedbackPoint = () => {
    if (currentFeedback.trim()) {
      const newPoint: FeedbackPoint = {
        id: Date.now().toString(),
        text: currentFeedback.trim(),
        timestamp: Date.now(),
      };
      setFeedbackPoints([...feedbackPoints, newPoint]);
      setCurrentFeedback('');
      
      // Save to localStorage to persist across sessions
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      localStorage.setItem('userFeedback', JSON.stringify([...existingFeedback, newPoint]));
    }
  };

  const removeFeedbackPoint = (id: string) => {
    const updatedPoints = feedbackPoints.filter(point => point.id !== id);
    setFeedbackPoints(updatedPoints);
    
    // Update localStorage
    const allFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    const filteredFeedback = allFeedback.filter((point: FeedbackPoint) => point.id !== id);
    localStorage.setItem('userFeedback', JSON.stringify(filteredFeedback));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addFeedbackPoint();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    const from = location.state?.from || '/';
                    navigate(from);
                  }}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                Any improvements/things you want added?
              </h1>
              <p className="text-muted-foreground">
                Share your ideas and suggestions to help us improve the platform
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Feedback Input */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add Your Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your ideas, suggestions, or improvements you'd like to see..."
                  value={currentFeedback}
                  onChange={(e) => setCurrentFeedback(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-32 resize-none"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Press Enter to add • Shift+Enter for new line
                  </div>
                  <Button 
                    onClick={addFeedbackPoint}
                    disabled={!currentFeedback.trim()}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Point
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Session Feedback */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Your Feedback Points ({feedbackPoints.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackPoints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No feedback points added yet</p>
                    <p className="text-sm">Start sharing your ideas!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {feedbackPoints.map((point, index) => (
                      <div
                        key={point.id}
                        className="p-3 rounded-lg border bg-background/50 group hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(point.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{point.text}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFeedbackPoint(point.id)}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation to Feedback Analytics */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/feedback-analytics')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              View Community Feedback Analytics
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;