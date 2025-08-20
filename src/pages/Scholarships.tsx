import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, GraduationCap, Search, Filter, Calendar, PoundSterling } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  sector: string;
  url: string;
  type: "Scholarship" | "Bursary" | "Grant";
}

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");

  const sectors = [
    { id: "all", name: "All Sectors", icon: GraduationCap },
    { id: "technology", name: "Technology & Engineering", icon: GraduationCap },
    { id: "healthcare", name: "Healthcare & Medicine", icon: GraduationCap },
    { id: "finance", name: "Finance & Business", icon: GraduationCap },
    { id: "education", name: "Education & Teaching", icon: GraduationCap },
    { id: "law", name: "Law & Legal", icon: GraduationCap },
    { id: "arts", name: "Arts & Creative", icon: GraduationCap },
    { id: "science", name: "Science & Research", icon: GraduationCap },
    { id: "general", name: "General Studies", icon: GraduationCap },
  ];

  const scholarships: Scholarship[] = [
    // Technology & Engineering
    {
      id: "1",
      name: "BT Young Engineer of the Year Award",
      provider: "BT Group",
      description: "Supporting young engineers to develop their technical skills and leadership potential",
      amount: "£2,000",
      deadline: "March 31, 2024",
      eligibility: ["Engineering students", "Under 25 years", "UK residents"],
      sector: "technology",
      url: "https://www.bt.com/bt-plc/purpose-and-sustainability/community/young-engineer-of-the-year",
      type: "Scholarship"
    },
    {
      id: "2",
      name: "ARM University Programme Scholarship",
      provider: "ARM Holdings",
      description: "Supporting computer science and electrical engineering students",
      amount: "£3,000",
      deadline: "April 15, 2024",
      eligibility: ["Computer Science students", "Electrical Engineering", "UK/EU students"],
      sector: "technology",
      url: "https://www.arm.com/company/corporate-responsibility/education",
      type: "Scholarship"
    },
    {
      id: "3",
      name: "Dyson Engineering Undergraduate Programme",
      provider: "Dyson",
      description: "Four-year engineering degree programme with paid placements",
      amount: "Full tuition + £20,000/year",
      deadline: "January 15, 2024",
      eligibility: ["A-level students", "Engineering interest", "UK residents"],
      sector: "technology",
      url: "https://careers.dyson.com/early-careers/apprenticeships/",
      type: "Bursary"
    },

    // Healthcare & Medicine
    {
      id: "4",
      name: "NHS Leadership Academy Scholarship",
      provider: "NHS England",
      description: "Leadership development for healthcare professionals",
      amount: "£5,000",
      deadline: "May 30, 2024",
      eligibility: ["Healthcare students", "Leadership potential", "NHS commitment"],
      sector: "healthcare",
      url: "https://www.leadershipacademy.nhs.uk/scholarships/",
      type: "Scholarship"
    },
    {
      id: "5",
      name: "Wellcome Trust PhD Studentships",
      provider: "Wellcome Trust",
      description: "PhD funding for biomedical research students",
      amount: "Full PhD funding",
      deadline: "Various deadlines",
      eligibility: ["PhD applicants", "Biomedical research", "International students welcome"],
      sector: "healthcare",
      url: "https://wellcome.org/grant-funding/schemes/four-year-phd-programmes-studentships-basic-science",
      type: "Grant"
    },
    {
      id: "6",
      name: "Royal College of Nursing Bursary",
      provider: "Royal College of Nursing",
      description: "Financial support for nursing students",
      amount: "£1,500 - £3,000",
      deadline: "September 1, 2024",
      eligibility: ["Nursing students", "RCN members", "Financial need"],
      sector: "healthcare",
      url: "https://www.rcn.org.uk/Get-Help/RCN-Foundation/Bursaries-and-scholarships",
      type: "Bursary"
    },

    // Finance & Business
    {
      id: "7",
      name: "ACCA Scholarship Programme",
      provider: "Association of Chartered Certified Accountants",
      description: "Supporting future accountants through their ACCA qualification",
      amount: "Up to £2,000",
      deadline: "Rolling applications",
      eligibility: ["ACCA students", "Academic excellence", "Financial need"],
      sector: "finance",
      url: "https://www.accaglobal.com/uk/en/help/scholarships-funding.html",
      type: "Scholarship"
    },
    {
      id: "8",
      name: "Goldman Sachs Scholarship",
      provider: "Goldman Sachs",
      description: "Supporting underrepresented groups in finance",
      amount: "£3,000",
      deadline: "February 28, 2024",
      eligibility: ["Finance/Economics students", "Underrepresented groups", "UK universities"],
      sector: "finance",
      url: "https://www.goldmansachs.com/careers/students/programs/emea/scholarships/",
      type: "Scholarship"
    },
    {
      id: "9",
      name: "Chartered Institute of Management Accountants Bursary",
      provider: "CIMA",
      description: "Financial support for management accounting students",
      amount: "£1,000 - £2,500",
      deadline: "June 30, 2024",
      eligibility: ["CIMA students", "Academic merit", "UK/Ireland residents"],
      sector: "finance",
      url: "https://www.cimaglobal.com/About-us/CIMA-Benevolent-Fund/",
      type: "Bursary"
    },

    // Education & Teaching
    {
      id: "10",
      name: "Teacher Training Scholarship",
      provider: "Department for Education",
      description: "Supporting trainee teachers in high-priority subjects",
      amount: "£24,000 - £28,000",
      deadline: "September 30, 2024",
      eligibility: ["PGCE students", "High-priority subjects", "2:1 degree minimum"],
      sector: "education",
      url: "https://getintoteaching.education.gov.uk/funding-and-support/scholarships-and-bursaries",
      type: "Scholarship"
    },

    // Law & Legal
    {
      id: "11",
      name: "Law Society Diversity Access Scheme",
      provider: "The Law Society",
      description: "Supporting diverse talent entering the legal profession",
      amount: "£2,500",
      deadline: "April 30, 2024",
      eligibility: ["Law students", "Underrepresented backgrounds", "UK residents"],
      sector: "law",
      url: "https://www.lawsociety.org.uk/career-advice/diversity-access-scheme/",
      type: "Bursary"
    },
    {
      id: "12",
      name: "Gray's Inn Scholarships",
      provider: "The Honourable Society of Gray's Inn",
      description: "Supporting aspiring barristers through their studies",
      amount: "£5,000 - £15,000",
      deadline: "May 1, 2024",
      eligibility: ["Bar students", "Academic excellence", "Financial need"],
      sector: "law",
      url: "https://www.graysinn.org.uk/education-and-scholarship/scholarships/",
      type: "Scholarship"
    },

    // Arts & Creative
    {
      id: "13",
      name: "Arts Council England Individual Artist Grant",
      provider: "Arts Council England",
      description: "Supporting individual artists to develop their practice",
      amount: "£1,000 - £15,000",
      deadline: "Rolling applications",
      eligibility: ["Individual artists", "England residents", "Artistic merit"],
      sector: "arts",
      url: "https://www.artscouncil.org.uk/funding/develop-your-creative-practice",
      type: "Grant"
    },
    {
      id: "14",
      name: "Royal Academy of Arts Scholarship",
      provider: "Royal Academy of Arts",
      description: "Supporting fine art students through their studies",
      amount: "£3,000",
      deadline: "March 15, 2024",
      eligibility: ["Fine Art students", "RA Schools applicants", "Artistic excellence"],
      sector: "arts",
      url: "https://www.royalacademy.org.uk/art-artists/ra-schools",
      type: "Scholarship"
    },

    // Science & Research
    {
      id: "15",
      name: "Royal Society Research Grant",
      provider: "The Royal Society",
      description: "Research grants for early career scientists",
      amount: "Up to £20,000",
      deadline: "Various deadlines",
      eligibility: ["Early career researchers", "Scientific research", "UK-based"],
      sector: "science",
      url: "https://royalsociety.org/grants-schemes-awards/grants/",
      type: "Grant"
    },
    {
      id: "16",
      name: "Leverhulme Trust Research Project Grant",
      provider: "The Leverhulme Trust",
      description: "Supporting original research across all disciplines",
      amount: "Up to £500,000",
      deadline: "November 10, 2024",
      eligibility: ["Academic researchers", "UK institutions", "Research excellence"],
      sector: "science",
      url: "https://www.leverhulme.ac.uk/research-project-grants",
      type: "Grant"
    },

    // General Studies
    {
      id: "17",
      name: "Rhodes Scholarship",
      provider: "Rhodes Trust",
      description: "Postgraduate study at the University of Oxford",
      amount: "Full funding",
      deadline: "October 6, 2024",
      eligibility: ["Undergraduate degree", "Leadership potential", "Various countries"],
      sector: "general",
      url: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/",
      type: "Scholarship"
    },
    {
      id: "18",
      name: "Gates Cambridge Scholarship",
      provider: "Bill & Melinda Gates Foundation",
      description: "Full funding for postgraduate study at Cambridge",
      amount: "Full funding + stipend",
      deadline: "December 3, 2024",
      eligibility: ["International students", "Academic excellence", "Leadership commitment"],
      sector: "general",
      url: "https://www.gatescambridge.org/",
      type: "Scholarship"
    },
    {
      id: "19",
      name: "Chevening Scholarships",
      provider: "UK Government",
      description: "UK government's global scholarship programme",
      amount: "Full funding",
      deadline: "November 2, 2024",
      eligibility: ["International students", "Leadership potential", "UK study"],
      sector: "general",
      url: "https://www.chevening.org/",
      type: "Scholarship"
    },
    {
      id: "20",
      name: "British Council GREAT Scholarships",
      provider: "British Council",
      description: "Supporting international students to study in the UK",
      amount: "£10,000 minimum",
      deadline: "Various deadlines",
      eligibility: ["International students", "Specific countries", "UK universities"],
      sector: "general",
      url: "https://study-uk.britishcouncil.org/scholarships-funding/great-scholarships",
      type: "Scholarship"
    }
  ];

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || scholarship.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Scholarship": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Bursary": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Grant": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              UK Scholarships & Bursaries
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover funding opportunities across various sectors and industries in the UK. 
            Find scholarships, bursaries, and grants to support your education and career goals.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card rounded-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search scholarships, providers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredScholarships.length} opportunities</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Scholarships</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>Bursaries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span>Grants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredScholarships.map((scholarship) => (
            <Card 
              key={scholarship.id} 
              className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => window.open(scholarship.url, '_blank', 'noopener,noreferrer')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getTypeColor(scholarship.type)}>
                    {scholarship.type}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {scholarship.name}
                </CardTitle>
                <CardDescription className="font-medium text-primary">
                  {scholarship.provider}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {scholarship.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <PoundSterling className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {scholarship.amount}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {scholarship.deadline}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Eligibility
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {scholarship.eligibility.slice(0, 2).map((criteria, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                    {scholarship.eligibility.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{scholarship.eligibility.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(scholarship.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No scholarships found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more opportunities.
            </p>
          </div>
        )}

        {/* Additional Resources */}
        <div className="bg-card rounded-lg p-6 mt-12">
          <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">UCAS Funding Hub</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive database of UK student funding options
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://www.ucas.com/finance', '_blank')}
              >
                Visit Site <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Turn2us Grant Search</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Find grants and charitable funds based on your circumstances
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://www.turn2us.org.uk/', '_blank')}
              >
                Visit Site <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Scholarship Hub</h3>
              <p className="text-sm text-muted-foreground mb-3">
                UK's largest scholarship database for students
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://www.scholarship-hub.org.uk/', '_blank')}
              >
                Visit Site <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scholarships;