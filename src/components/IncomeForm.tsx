import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, PoundSterling } from "lucide-react";

interface IncomeFormProps {
  onSubmit: (data: { postcode: string; city: string; workplacePostcode: string; income: number }) => void;
}

const IncomeForm = ({ onSubmit }: IncomeFormProps) => {
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [workplacePostcode, setWorkplacePostcode] = useState("");
  const [income, setIncome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode && city && workplacePostcode && income) {
      onSubmit({ postcode, city, workplacePostcode, income: parseFloat(income) });
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

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            disabled={!postcode || !city || !workplacePostcode || !income}
          >
            Analyze My Finances
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomeForm;