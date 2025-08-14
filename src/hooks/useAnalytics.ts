import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsSession {
  id?: string;
  session_id: string;
  user_agent: string;
  page_path: string;
  started_at: string;
  last_activity: string;
  is_active: boolean;
}

interface AnalyticsHook {
  sessionId: string;
  activeUsers: number;
  totalVisitors: number;
  trackPageView: (path: string) => void;
  updateActivity: () => void;
}

export const useAnalytics = (): AnalyticsHook => {
  const [sessionId, setSessionId] = useState<string>('');
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();

  // Generate or retrieve session ID
  useEffect(() => {
    let currentSessionId = sessionStorage.getItem('analytics_session_id');
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      sessionStorage.setItem('analytics_session_id', currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  // Initialize session and set up real-time subscriptions
  useEffect(() => {
    if (!sessionId) return;

    const initializeSession = async () => {
      try {
        // Create new session record
        const sessionData: Omit<AnalyticsSession, 'id'> = {
          session_id: sessionId,
          user_agent: navigator.userAgent,
          page_path: window.location.pathname,
          started_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          is_active: true
        };

        await supabase
          .from('analytics_sessions')
          .upsert(sessionData, { onConflict: 'session_id' });

        // Get total visitors count
        const { count } = await supabase
          .from('analytics_sessions')
          .select('*', { count: 'exact', head: true });
        
        if (count) setTotalVisitors(count);

        // Subscribe to active users count
        const subscription = supabase
          .channel('active_users')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'analytics_sessions' },
            async () => {
              const { count: activeCount } = await supabase
                .from('analytics_sessions')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)
                .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());
              
              if (activeCount !== null) setActiveUsers(activeCount);
            }
          )
          .subscribe();

        // Set up heartbeat to keep session active
        heartbeatIntervalRef.current = setInterval(updateActivity, 30000); // 30 seconds

        return () => {
          subscription.unsubscribe();
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
        };
      } catch (error) {
        console.error('Failed to initialize analytics session:', error);
      }
    };

    initializeSession();

    // Cleanup on unmount
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      markSessionInactive();
    };
  }, [sessionId]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        markSessionInactive();
      } else {
        updateActivity();
      }
    };

    const handleBeforeUnload = () => {
      markSessionInactive();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  const updateActivity = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('analytics_sessions')
        .update({ 
          last_activity: new Date().toISOString(),
          is_active: true 
        })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const markSessionInactive = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('analytics_sessions')
        .update({ is_active: false })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Failed to mark session inactive:', error);
    }
  };

  const trackPageView = async (path: string) => {
    if (!sessionId) return;

    try {
      // Update current session with new page
      await supabase
        .from('analytics_sessions')
        .update({ 
          page_path: path,
          last_activity: new Date().toISOString() 
        })
        .eq('session_id', sessionId);

      // Track individual page view
      await supabase
        .from('analytics_page_views')
        .insert({
          session_id: sessionId,
          page_path: path,
          viewed_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  return {
    sessionId,
    activeUsers,
    totalVisitors,
    trackPageView,
    updateActivity
  };
};
