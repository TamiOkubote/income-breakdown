import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Eye, Clock, TrendingUp, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

interface AnalyticsData {
  totalSessions: number;
  activeSessions: number;
  totalPageViews: number;
  averageSessionTime: number;
  topPages: { page: string; views: number }[];
  dailyStats: { date: string; sessions: number; pageviews: number }[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const referrer = location.state?.from || '/';
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSessions: 0,
    activeSessions: 0,
    totalPageViews: 0,
    averageSessionTime: 0,
    topPages: [],
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Get total sessions
      const { count: totalSessions } = await supabase
        .from('analytics_sessions')
        .select('*', { count: 'exact', head: true });

      // Get active sessions (active in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: activeSessions } = await supabase
        .from('analytics_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('last_activity', fiveMinutesAgo);

      // Get total page views
      const { count: totalPageViews } = await supabase
        .from('analytics_page_views')
        .select('*', { count: 'exact', head: true });

      // Get top pages
      const { data: pageViewsData } = await supabase
        .from('analytics_page_views')
        .select('page_path')
        .order('viewed_at', { ascending: false })
        .limit(1000);

      const pageStats = pageViewsData?.reduce((acc, view) => {
        acc[view.page_path] = (acc[view.page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topPages = Object.entries(pageStats)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Get daily stats for the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { data: sessionsData } = await supabase
        .from('analytics_sessions')
        .select('started_at')
        .gte('started_at', sevenDaysAgo.toISOString());

      const { data: pageViewsDaily } = await supabase
        .from('analytics_page_views')
        .select('viewed_at')
        .gte('viewed_at', sevenDaysAgo.toISOString());

      const dailySessionStats = (sessionsData || []).reduce((acc, session) => {
        const date = new Date(session.started_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dailyPageViewStats = (pageViewsDaily || []).reduce((acc, view) => {
        const date = new Date(view.viewed_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dailyStats = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sessions: dailySessionStats[date] || 0,
          pageviews: dailyPageViewStats[date] || 0
        };
      }).reverse();

      setAnalyticsData({
        totalSessions: totalSessions || 0,
        activeSessions: activeSessions || 0,
        totalPageViews: totalPageViews || 0,
        averageSessionTime: 0, // Placeholder for now
        topPages,
        dailyStats
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(referrer)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Real-time insights into your application usage</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Data
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
                <p className="text-xs text-muted-foreground">All time sessions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.activeSessions}</div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalPageViews}</div>
                <p className="text-xs text-muted-foreground">Total interactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.dailyStats.length > 1 
                    ? `+${Math.round(((analyticsData.dailyStats[analyticsData.dailyStats.length - 1]?.sessions || 0) / Math.max(analyticsData.dailyStats[analyticsData.dailyStats.length - 2]?.sessions || 1, 1) - 1) * 100)}%`
                    : '+0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">Daily growth rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Sessions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pageviews" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Page Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.topPages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{page.page === '/' ? 'Home' : page.page}</p>
                      <p className="text-sm text-muted-foreground">{page.page}</p>
                    </div>
                  </div>
                  <Badge>{page.views} views</Badge>
                </div>
              ))}
              {analyticsData.topPages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No page views recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;