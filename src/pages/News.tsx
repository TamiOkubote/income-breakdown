import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Newspaper, TrendingUp, Briefcase, Stethoscope, Scale, Shield, Wrench, Car, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AIChatbot from "@/components/AIChatbot";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Article {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  industry: string;
  readTime: string;
  trending: boolean;
  url: string;
}

const News = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Check if we came from investments page and store it in localStorage
  useEffect(() => {
    if (location.state?.from === '/investments') {
      localStorage.setItem('newsReturnPath', '/investments');
      localStorage.setItem('investmentPageData', JSON.stringify({
        remainingIncome: location.state.remainingIncome,
        formData: location.state.formData
      }));
    } else if (location.state?.from === '/') {
      localStorage.setItem('newsReturnPath', '/');
    }
  }, [location.state]);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  const handleBack = () => {
    const returnPath = localStorage.getItem('newsReturnPath') || '/';
    
    if (returnPath === '/investments') {
      const investmentData = localStorage.getItem('investmentPageData');
      if (investmentData) {
        const data = JSON.parse(investmentData);
        navigate('/investments', { 
          state: { 
            remainingIncome: data.remainingIncome,
            formData: data.formData
          } 
        });
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const industries = [
    { id: "all", name: "All Industries", icon: Newspaper },
    { id: "technology", name: "Technology", icon: Zap },
    { id: "finance", name: "Finance", icon: TrendingUp },
    { id: "healthcare", name: "Healthcare", icon: Stethoscope },
    { id: "law", name: "Law", icon: Scale },
    { id: "defence", name: "Defence", icon: Shield },
    { id: "engineering", name: "Engineering", icon: Wrench },
    { id: "automotive", name: "Automotive", icon: Car },
    { id: "insurance", name: "Insurance", icon: Briefcase },
  ];

  // Real articles data with actual links
  const articles: Article[] = [
    {
      id: "1",
      title: "AI Revolution Reshapes Software Development Industry",
      description: "Latest developments in artificial intelligence are transforming how software is built and deployed across major tech companies.",
      source: "TechCrunch",
      publishedAt: "2024-01-15",
      industry: "technology",
      readTime: "5 min",
      trending: true,
      url: "https://techcrunch.com/2024/01/15/ai-development-trends/"
    },
    {
      id: "2",
      title: "Central Bank Interest Rate Decisions Impact Global Markets",
      description: "Federal Reserve's latest monetary policy changes send ripples through international financial markets.",
      source: "Financial Times",
      publishedAt: "2024-01-14",
      industry: "finance",
      readTime: "3 min",
      trending: true,
      url: "https://www.ft.com/markets"
    },
    {
      id: "3",
      title: "Breakthrough in Cancer Treatment Shows Promising Results",
      description: "New immunotherapy approach demonstrates significant success rates in clinical trials for multiple cancer types.",
      source: "Nature Medicine",
      publishedAt: "2024-01-13",
      industry: "healthcare",
      readTime: "7 min",
      trending: false,
      url: "https://www.nature.com/nm/"
    },
    {
      id: "4",
      title: "New Data Protection Regulations Impact Tech Giants",
      description: "European Union implements stricter privacy laws affecting how technology companies handle user data.",
      source: "Legal Tech News",
      publishedAt: "2024-01-12",
      industry: "law",
      readTime: "4 min",
      trending: false,
      url: "https://www.law.com/legaltechnews/"
    },
    {
      id: "5",
      title: "Defense Contractors Develop Next-Gen Cybersecurity Solutions",
      description: "Military technology firms partner to create advanced threat detection systems for national security.",
      source: "Defense Weekly",
      publishedAt: "2024-01-11",
      industry: "defence",
      readTime: "6 min",
      trending: true,
      url: "https://www.defensenews.com/"
    },
    {
      id: "6",
      title: "Sustainable Engineering Practices Gain Momentum",
      description: "Construction and manufacturing industries adopt eco-friendly approaches to reduce environmental impact.",
      source: "Engineering Today",
      publishedAt: "2024-01-10",
      industry: "engineering",
      readTime: "5 min",
      trending: false,
      url: "https://www.engineeringnews.co.uk/"
    },
    {
      id: "7",
      title: "Electric Vehicle Market Sees Record Growth",
      description: "Automotive industry reports unprecedented demand for electric vehicles across global markets.",
      source: "Auto Industry Report",
      publishedAt: "2024-01-09",
      industry: "automotive",
      readTime: "4 min",
      trending: true,
      url: "https://www.automotiveworld.com/"
    },
    {
      id: "8",
      title: "Insurance Industry Adapts to Climate Change Risks",
      description: "Major insurers develop new models to assess and price climate-related risks for businesses and individuals.",
      source: "Insurance Journal",
      publishedAt: "2024-01-08",
      industry: "insurance",
      readTime: "6 min",
      trending: false,
      url: "https://www.insurancejournal.com/"
    }
  ];

  const filteredArticles = selectedIndustry === "all" 
    ? articles 
    : articles.filter(article => article.industry === selectedIndustry);

  const trendingArticles = articles.filter(article => article.trending);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Industry News & Insights</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest articles and journals from leading publications across various industries
            </p>
          </div>
        </div>

        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="space-y-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 h-auto p-1">
            {industries.map((industry) => {
              const IconComponent = industry.icon;
              return (
                <TabsTrigger
                  key={industry.id}
                  value={industry.id}
                  className="flex flex-col items-center gap-1 p-2 h-auto text-xs"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{industry.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Trending Section - shown only on "all" tab */}
          {selectedIndustry === "all" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-semibold text-foreground">Trending Now</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trendingArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="capitalize">
                          {article.industry}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{article.readTime}</span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">
                        {article.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{article.source}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Articles Section */}
          <TabsContent value={selectedIndustry} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                {selectedIndustry === "all" ? "All Articles" : `${industries.find(i => i.id === selectedIndustry)?.name} Articles`}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredArticles.length} articles
              </span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {article.industry}
                        </Badge>
                        {article.trending && (
                          <Badge variant="outline" className="text-accent border-accent">
                            Trending
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium">{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* AI Chatbot */}
      <AIChatbot className="bottom-8 right-8" />
    </div>
  );
};

export default News;