
import { Calculator, TrendingUp, Settings as SettingsIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

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
                How to{" "}
                <span className="text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse">
                  Budget
                </span>
              </h1>
              <p className="text-sm opacity-90">Smart budgeting for interns, apprentices and graduates</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Build Your Financial Future</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/feedback')}
                className="text-primary-foreground hover:bg-white/10"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Feedback</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="text-primary-foreground hover:bg-white/10"
              >
                <SettingsIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
