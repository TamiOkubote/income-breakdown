import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, PoundSterling } from "lucide-react";

interface IncomeFormProps {
  onSubmit: (data: { 
    postcode: string; 
    city: string; 
    workplacePostcode: string; 
    workplaceCity: string; 
    income: number;
    hasHousing: boolean;
    hasRoommates: boolean;
    numRoommates: number;
  }) => void;
}

const IncomeForm = ({ onSubmit }: IncomeFormProps) => {
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [workplacePostcode, setWorkplacePostcode] = useState("");
  const [workplaceCity, setWorkplaceCity] = useState("");
  const [income, setIncome] = useState("");
  const [hasHousing, setHasHousing] = useState<boolean | null>(null);
  const [hasRoommates, setHasRoommates] = useState<boolean | null>(null);
  const [numRoommates, setNumRoommates] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = postcode && city && workplacePostcode && workplaceCity && income && 
                       hasHousing !== null && 
                       (hasHousing === false || (hasRoommates !== null && 
                       (hasRoommates === false || numRoommates)));
    
    if (isFormValid) {
      onSubmit({ 
        postcode, 
        city, 
        workplacePostcode, 
        workplaceCity, 
        income: parseFloat(income),
        hasHousing: hasHousing!,
        hasRoommates: hasRoommates || false,
        numRoommates: parseInt(numRoommates) || 0
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl text-primary">Get Started</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details to receive personalized financial guidance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="postcode" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Home Postcode
            </Label>
            <Input
              id="postcode"
              type="text"
              placeholder="e.g., SW1A 1AA"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              className="h-12 text-center font-mono tracking-wider"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              City/Town/Village
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="e.g., London, Reading, Manchester"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 text-center"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workplace-postcode" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Workplace Postcode
            </Label>
            <Input
              id="workplace-postcode"
              type="text"
              placeholder="e.g., EC2A 4DP"
              value={workplacePostcode}
              onChange={(e) => setWorkplacePostcode(e.target.value.toUpperCase())}
              className="h-12 text-center font-mono tracking-wider"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workplace-city" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Workplace City/Town/Village
            </Label>
            <Input
              id="workplace-city"
              type="text"
              placeholder="e.g., London, Birmingham, Leeds"
              value={workplaceCity}
              onChange={(e) => setWorkplaceCity(e.target.value)}
              className="h-12 text-center"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="income" className="text-sm font-medium flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-primary" />
              Monthly Income
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                id="income"
                type="number"
                placeholder="1500"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="h-12 pl-8 text-lg font-semibold"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Will you be paying for housing?</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setHasHousing(true);
                    setHasRoommates(null);
                    setNumRoommates("");
                  }}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    hasHousing === true 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasHousing(false);
                    setHasRoommates(null);
                    setNumRoommates("");
                  }}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    hasHousing === false 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {hasHousing && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Will you have roommates?</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setHasRoommates(true);
                      setNumRoommates("");
                    }}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      hasRoommates === true 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasRoommates(false);
                      setNumRoommates("");
                    }}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      hasRoommates === false 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {hasHousing && hasRoommates && (
              <div className="space-y-2">
                <Label htmlFor="num-roommates" className="text-sm font-medium">
                  How many roommates?
                </Label>
                <Input
                  id="num-roommates"
                  type="number"
                  placeholder="2"
                  value={numRoommates}
                  onChange={(e) => setNumRoommates(e.target.value)}
                  className="h-12 text-center"
                  min="1"
                  max="10"
                  required
                />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            disabled={!postcode || !city || !workplacePostcode || !workplaceCity || !income || 
                     hasHousing === null || (hasHousing && hasRoommates === null) || 
                     (hasHousing && hasRoommates && !numRoommates)}
          >
            Analyze My Finances
          </Button>
          
          <div className="text-xs text-muted-foreground text-center mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <strong>Disclaimer:</strong> This is just advice, do not take the investment literally, and expenses may change due to the climate of the economy. Invest at your own risk.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomeForm;