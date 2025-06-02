import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, UserPlus, CalendarClock, Mail, Phone, MapPin } from "lucide-react";

// Mock leads data
const mockLeads = [
  {
    id: "lead-1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1-555-123-4567",
    status: "hot", // hot, warm, cold
    location: "San Francisco, CA",
    source: "Website Inquiry",
    lastInteraction: new Date("2025-04-30"),
    notes: "Interested in downtown condos, budget around $750k.",
    propertyInterest: "Condos in Financial District",
    createdAt: new Date("2025-04-25"),
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "lead-2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1-555-987-6543",
    status: "warm",
    location: "New York, NY",
    source: "Referral",
    lastInteraction: new Date("2025-05-05"),
    notes: "Looking for family home in suburbs, 4-5 bedrooms.",
    propertyInterest: "Suburban family homes",
    createdAt: new Date("2025-04-20"),
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "lead-3",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "+1-555-456-7890",
    status: "cold",
    location: "Miami, FL",
    source: "Property Viewing",
    lastInteraction: new Date("2025-04-15"),
    notes: "Wanted beachfront property but budget might be too low.",
    propertyInterest: "Beachfront condos",
    createdAt: new Date("2025-04-10"),
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "lead-4",
    name: "James Miller",
    email: "james.m@example.com",
    phone: "+1-555-321-6547",
    status: "hot",
    location: "Austin, TX",
    source: "Open House",
    lastInteraction: new Date("2025-05-10"),
    notes: "Ready to make an offer on tech corridor property.",
    propertyInterest: "Modern homes near tech companies",
    createdAt: new Date("2025-04-15"),
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "lead-5",
    name: "Olivia Smith",
    email: "olivia.s@example.com",
    phone: "+1-555-789-0123",
    status: "warm",
    location: "Seattle, WA",
    source: "Facebook Ad",
    lastInteraction: new Date("2025-05-01"),
    notes: "Wants a modern loft with good walkability score.",
    propertyInterest: "Urban lofts",
    createdAt: new Date("2025-04-18"),
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "lead-6",
    name: "Robert Taylor",
    email: "robert.t@example.com",
    phone: "+1-555-234-5678",
    status: "cold",
    location: "Chicago, IL",
    source: "Property Listing",
    lastInteraction: new Date("2025-04-10"),
    notes: "Only looking passively, might be more interested in fall.",
    propertyInterest: "Historic properties",
    createdAt: new Date("2025-03-27"),
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];

// Mock communication logs
const mockCommunicationLogs = {
  "lead-1": [
    {
      id: "comm-1",
      type: "email",
      date: new Date("2025-04-30"),
      content: "Sent property listings for downtown condos."
    },
    {
      id: "comm-2",
      type: "call",
      date: new Date("2025-04-28"),
      content: "Discussed budget and preferences, scheduled viewing for next week."
    },
    {
      id: "comm-3",
      type: "meeting",
      date: new Date("2025-04-25"),
      content: "Initial consultation, gathered requirements."
    }
  ],
  "lead-2": [
    {
      id: "comm-4",
      type: "email",
      date: new Date("2025-05-05"),
      content: "Sent suburban home options within budget."
    },
    {
      id: "comm-5",
      type: "call",
      date: new Date("2025-04-22"),
      content: "Discussed school districts and commute preferences."
    }
  ],
  // Add other lead communications as needed
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut" 
    }
  }
};

export function CrmPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(mockLeads[0]);
  
  // Filter leads based on search query and filters
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesLocation = locationFilter === "all" || 
                           lead.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  // Get unique locations for the filter
  const uniqueLocations = Array.from(new Set(mockLeads.map(lead => 
    lead.location.split(',')[1].trim()
  )));

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Lead Management</CardTitle>
        <CardDescription>Track and manage your potential clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Leads list */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search leads..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  New Lead
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="hot">Hot Leads</SelectItem>
                    <SelectItem value="warm">Warm Leads</SelectItem>
                    <SelectItem value="cold">Cold Leads</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location, index) => (
                      <SelectItem key={index} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border rounded-md overflow-hidden max-h-[600px] overflow-y-auto">
                <motion.div 
                  className="divide-y"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        variants={itemVariants}
                        className={`p-3 cursor-pointer transition-all hover:bg-muted ${
                          selectedLead.id === lead.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={lead.avatar} alt={lead.name} />
                            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{lead.name}</p>
                              <Badge variant={
                                lead.status === "hot" ? "default" : 
                                lead.status === "warm" ? "secondary" : "outline"
                              }>
                                {lead.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {lead.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                          <span>Last contact: {formatDate(lead.lastInteraction)}</span>
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No leads found</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Right panel - Lead details */}
          <div className="lg:col-span-2">
            {selectedLead && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={selectedLead.id}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={selectedLead.avatar} alt={selectedLead.name} />
                    <AvatarFallback>{selectedLead.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h2 className="text-xl font-bold">{selectedLead.name}</h2>
                      <Badge variant={
                        selectedLead.status === "hot" ? "default" : 
                        selectedLead.status === "warm" ? "secondary" : "outline"
                      } className="inline-flex">
                        {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)} Lead
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedLead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedLead.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Client since {formatDate(selectedLead.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Lead Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Source</p>
                          <p className="text-sm text-muted-foreground">{selectedLead.source}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Property Interest</p>
                          <p className="text-sm text-muted-foreground">{selectedLead.propertyInterest}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Notes</p>
                          <p className="text-sm text-muted-foreground">{selectedLead.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Action Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3">
                        <Button size="sm" className="justify-start">
                          <Phone className="mr-2 h-4 w-4" />
                          Schedule Call
                        </Button>
                        <Button size="sm" variant="outline" className="justify-start">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                        <Button size="sm" variant="secondary" className="justify-start">
                          <CalendarClock className="mr-2 h-4 w-4" />
                          Schedule Property Viewing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="communication">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="communication">Communication History</TabsTrigger>
                    <TabsTrigger value="properties">Property Matches</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="communication" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                          {mockCommunicationLogs[selectedLead.id] ? (
                            mockCommunicationLogs[selectedLead.id].map((log) => (
                              <div key={log.id} className="border-l-2 border-estate-500 pl-4 py-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Badge variant="outline" className="mb-1 capitalize">{log.type}</Badge>
                                    <p className="text-sm">{log.content}</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {log.date.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-sm text-muted-foreground">No communication history</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex items-center gap-2">
                          <Input placeholder="Add a note..." className="flex-1" />
                          <Button>Add Note</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="properties" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-10">
                          <p className="text-sm text-muted-foreground">Property matching feature coming soon</p>
                          <Button variant="outline" className="mt-4">Find Matches</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
