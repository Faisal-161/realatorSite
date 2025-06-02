import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { properties, contactRequests, aiContents } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Building, MessageSquare, Sparkles, Plus, TrendingUp, Users, BarChart2, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, chartColors, createChartData } from "@/components/ui/chart-components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SellerDashboard = () => {
  // Filter properties to only show those owned by the current user (user-3)
  const myProperties = properties.filter(property => property.sellerId === "user-3");
  
  // Filter contact requests for my properties
  const myRequests = contactRequests.filter(request => 
    myProperties.some(property => property.id === request.propertyId)
  );

  // Filter AI content to only show those created by the current user
  const myAiContent = aiContents.filter(content => 
    content.userId === "user-3" && content.contentType === "marketing"
  );

  // Analytics data (mocked for demo)
  const [timeRange, setTimeRange] = useState("monthly");
  const totalSales = 4;
  const totalProfit = 1250000;
  const totalLeads = myRequests.length + 12; // Adding some mock data
  const avgDealSize = totalProfit / totalSales;
  const conversionRate = (totalSales / totalLeads) * 100;
  
  // Chart data for property types
  const propertyTypesData = createChartData(
    ["House", "Apartment", "Condo", "Land", "Commercial"],
    [
      {
        label: "Listed Properties by Type",
        data: [3, 2, 1, 1, 0],
        backgroundColor: chartColors.palette,
      },
    ]
  );

  // Chart data for monthly performance
  const monthlyPerformanceData = createChartData(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    [
      {
        label: "Property Views",
        data: [65, 80, 91, 110, 120, 150],
        backgroundColor: chartColors.primary.base,
      },
      {
        label: "Inquiries",
        data: [28, 32, 39, 41, 44, 50],
        backgroundColor: chartColors.success.base,
      }
    ]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  return (
    <DashboardLayout requiredRole="seller">
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Dashboard header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your property listings and inquiries.</p>
        </motion.div>

        {/* Stats cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Properties</CardTitle>
                  <Building className="h-4 w-4 text-estate-600" />
                </div>
                <CardDescription>Total active listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-estate-600">{myProperties.length}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2
                  </span> from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Inquiries</CardTitle>
                  <MessageSquare className="h-4 w-4 text-estate-600" />
                </div>
                <CardDescription>Contact requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-estate-600">{myRequests.length}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3
                  </span> from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Total Profit</CardTitle>
                  <BarChart2 className="h-4 w-4 text-estate-600" />
                </div>
                <CardDescription>From sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-estate-600">{formatCurrency(totalProfit)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </span> from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Avg. Deal</CardTitle>
                  <LineChart className="h-4 w-4 text-estate-600" />
                </div>
                <CardDescription>Average sale price</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-estate-600">{formatCurrency(avgDealSize)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5%
                  </span> from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversion</CardTitle>
                  <Users className="h-4 w-4 text-estate-600" />
                </div>
                <CardDescription>Lead to sale rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-estate-600">{conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +1.2%
                  </span> from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="hover:shadow-md transition-all h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Analytics</CardTitle>
                  <Select
                    value={timeRange}
                    onValueChange={value => setTimeRange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Property views and inquiries overview</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <BarChart data={monthlyPerformanceData} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="hover:shadow-md transition-all h-full">
              <CardHeader>
                <CardTitle>Property Distribution</CardTitle>
                <CardDescription>By property type</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <PieChart data={propertyTypesData} />
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Properties</CardTitle>
                    <div className="flex gap-2">
                      <Link to="/seller/add-property">
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                      <Link to="/seller/properties">
                        <Button variant="outline" size="sm">View All</Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {myProperties.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {myProperties.slice(0, 4).map(property => (
                        <motion.div 
                          key={property.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          className="transition-all"
                        >
                          <PropertyCard key={property.id} property={property} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-6">
                      <Building className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium mb-1">No properties yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add your first property listing to get started.
                      </p>
                      <Link to="/seller/add-property">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inquiries">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Inquiries</CardTitle>
                    <Link to="/seller/requests">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {myRequests.length > 0 ? (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {myRequests.slice(0, 5).map(request => {
                        const property = properties.find(p => p.id === request.propertyId);
                        return (
                          <motion.div 
                            key={request.id} 
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.01)" }}
                            className="flex items-start gap-3 p-3 border rounded-lg transition-all"
                          >
                            <div className="w-10 h-10 bg-estate-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-5 w-5 text-estate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">From: {request.buyerName}</p>
                                <Badge variant={
                                  request.status === "pending" ? "default" : 
                                  request.status === "contacted" ? "secondary" : "outline"
                                }>
                                  {request.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Re: {property?.title || "Unknown Property"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{formatDate(request.createdAt)}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No inquiries yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Marketing Content</CardTitle>
                    <Link to="/seller/marketing">
                      <Button variant="outline" size="sm">Create More</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {myAiContent.length > 0 ? (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {myAiContent.slice(0, 3).map(content => (
                        <motion.div 
                          key={content.id} 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.01)" }}
                          className="p-3 border rounded-lg transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-estate-600" />
                            <span className="text-sm font-medium">AI Generated</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatDate(content.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{content.content.substring(0, 100)}...</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No marketing content yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
