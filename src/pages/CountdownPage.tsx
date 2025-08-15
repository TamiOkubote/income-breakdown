import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";

const CountdownPage = () => {
  const [countdown, setCountdown] = useState(5);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;

  useEffect(() => {
    // Start first text animation immediately
    setShowFirstText(true);
    
    // Start second text animation after 1 second
    const secondTextTimer = setTimeout(() => {
      setShowSecondText(true);
    }, 1000);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Navigate back to index with form data to show results
          navigate("/", { state: { formData, showResults: true } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(secondTextTimer);
    };
  }, [navigate, formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <div className="text-center space-y-8 max-w-2xl">
          {/* First Text with Typing Animation */}
          <div className="h-12">
            {showFirstText && (
              <h1 className="text-3xl md:text-4xl font-bold text-white typing-animation">
                The portfolio was USP 1.
              </h1>
            )}
          </div>

          {/* Second Text with Typing Animation */}
          <div className="h-12 mt-8">
            {showSecondText && (
              <h2 className="text-2xl md:text-3xl font-semibold text-purple-200 typing-animation">
                Now, USP 2 is loading
              </h2>
            )}
          </div>

          {/* Countdown Display */}
          <div className="mt-12">
            <div className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse">
              {countdown}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownPage;