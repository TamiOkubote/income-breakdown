
import { Calculator, Settings as SettingsIcon, MessageSquare, BarChart3, ExternalLink, Github, Linkedin, Users, Newspaper, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, updateLanguage } = useTranslation();

  useEffect(() => {
    // Listen for language changes from settings
    const handleLanguageChange = (event: CustomEvent) => {
      updateLanguage(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [updateLanguage]);

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {t('header.title').split(' ').map((word, index, array) => (
                  index === array.length - 1 ? (
                    <span key={word} className="text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse">
                      {word}
                    </span>
                  ) : (
                    `${word} `
                  )
                ))}
              </h1>
              <p className="text-sm opacity-90">{t('header.tagline')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <a 
                  href="https://portfolio-t-6hn.pages.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/tami-okubote-8b3087281/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://github.com/TamiOkubote" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
              <span className="text-sm font-medium">
                Brought to fruition by{" "}
                <a 
                  href="https://www.linkedin.com/in/tami-okubote-8b3087281/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-purple-300 transition-colors"
                >
                  Tami Okubote
                </a>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/news', { state: { from: location.pathname } })}
                className="text-primary-foreground hover:bg-white/10"
              >
                <Newspaper className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('header.news')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/feedback', { state: { from: location.pathname } })}
                className="text-primary-foreground hover:bg-white/10"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('header.feedback')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/analytics', { state: { from: location.pathname } })}
                className="text-primary-foreground hover:bg-white/10"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('header.analytics')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/congress-trades', { state: { from: location.pathname } })}
                className="text-primary-foreground hover:bg-white/10"
              >
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('header.congress')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/scholarships', { state: { from: location.pathname } })}
                className="text-primary-foreground hover:bg-white/10"
              >
                <GraduationCap className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('header.scholarships')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings', { state: { from: location.pathname } })}
                className="text-primary-foreground hover:bg-white/10"
              >
                <SettingsIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('header.settings')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
