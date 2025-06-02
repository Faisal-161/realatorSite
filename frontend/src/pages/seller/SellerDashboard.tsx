import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { getListings } from "@/api/listings";
import type { PropertyListing } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge"; // Badge might not be needed if inquiries are simplified
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard"; // Consider if PropertyCard needs Edit/Delete buttons or if they are separate
import { Building, MessageSquare, Sparkles, Plus, TrendingUp, Users, BarChart2, LineChart, Loader2, Edit, Trash2 } from "lucide-react"; // Added Edit, Trash2
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // For delete mutation
import { deleteProperty } from "@/api/listings"; // For deleteProperty
import { useToast } from "@/components/ui/use-toast"; // For toasts
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, chartColors, createChartData } from "@/components/ui/chart-components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SellerDashboard = () => {
  const { user } = useAuth(); 
  const { toast } = useToast(); 
  const queryClient = useQueryClient(); 

  const { data: allProperties, isLoading: isLoadingProperties, isError: isErrorProperties, error: propertiesError } = useQuery<PropertyListing[], Error>({
    queryKey: ['allListingsForSellerDashboard'], 
    queryFn: getListings,
  });

  const myProperties = useMemo(() => {
    if (!allProperties || !user) return [];
    return allProperties.filter(property => property.seller.id === user.id);
  }, [allProperties, user]);

  // Placeholder for inquiries - will be removed or refactored if API becomes available
  const myRequests: any[] = []; // Empty array for now

  // Placeholder for AI content - will be removed
  const myAiContent: any[] = []; // Empty array for now
  
  // Analytics data (mocked for demo - keeping this part as is for now)
  const [timeRange, setTimeRange] = useState("monthly");
  const totalSales = 4; // Mock
  const totalProfit = 1250000; // Mock
  const totalLeads = 12; // Mock, was myRequests.length + 12
  const avgDealSize = totalSales > 0 ? totalProfit / totalSales : 0; // Mock
  const conversionRate = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0; // Mock
  
  // Chart data for property types (using myProperties if available, else mock)
  const propertyTypesData = useMemo(() => {
    if (myProperties.length > 0) {
      // This is a simplified example. Real aggregation would be more complex.
      // For now, let's assume fixed categories for demo if no properties.
      const typesCount = myProperties.reduce((acc, property) => {
        // Assuming type can be inferred or is a field (not in current model)
        const type = property.title.includes("House") ? "House" : 
                     property.title.includes("Apartment") ? "Apartment" : "Other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return createChartData(
        Object.keys(typesCount),
        [{ label: "Listed Properties by Type", data: Object.values(typesCount), backgroundColor: chartColors.palette }]
      );
    }
    // Fallback mock data if no properties
    return createChartData(
      ["House", "Apartment", "Condo", "Land", "Commercial"],
      [{ label: "Listed Properties by Type", data: [0,0,0,0,0], backgroundColor: chartColors.palette }]
    );
  }, [myProperties]);
  
  // Chart data for monthly performance (remains mock, removed duplicate)
  // const monthlyPerformanceData = createChartData(
  //   ["House", "Apartment", "Condo", "Land", "Commercial"],
  //   [
  //     {
  //       label: "Listed Properties by Type",
  //       data: [3, 2, 1, 1, 0],
  //       backgroundColor: chartColors.palette,
  //     },
  //   ]
  // );

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

  const deleteMutation = useMutation(deleteProperty, {
    onSuccess: () => {
      toast({ title: 'Property Deleted', description: 'The property has been successfully deleted.' });
      queryClient.invalidateQueries(['allListingsForSellerDashboard']);
      queryClient.invalidateQueries(['listings']); // Invalidate public listings too
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete Property',
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const handleDeleteProperty = (propertyId: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate(propertyId);
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
                {isLoadingProperties ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{myProperties.length}</div>}
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
                {/* Inquiries data removed for now */}
                <div className="text-3xl font-bold text-estate-600">N/A</div>
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
                      <Link to="/seller/property/new"> {/* Updated link */}
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                      {/* Link to a page showing all seller's properties might be good */}
                      {/* <Link to="/seller/properties/all"><Button variant="outline" size="sm">View All</Button></Link> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingProperties && <div className="flex justify-center py-6"><Loader2 className="h-8 w-8 animate-spin text-estate-600" /></div>}
                  {isErrorProperties && <p className="text-red-500 text-center py-6">Error loading properties: {propertiesError?.message}</p>}
                  {!isLoadingProperties && !isErrorProperties && myProperties.length > 0 ? (
                    <div className="space-y-4">
                      {myProperties.map(property => ( 
                        <Card key={property.id} className="flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 sm:w-1/3">
                            <img 
                              src={property.image || '/placeholder-image.jpg'} // Placeholder if no image
                              alt={property.title} 
                              className="h-48 w-full object-cover sm:h-full rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                            />
                          </div>
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <h3 className="text-lg font-semibold hover:text-estate-600">
                                <Link to={`/properties/${property.id}`}>{property.title}</Link>
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">{property.address}</p>
                              <p className="text-lg font-semibold text-estate-700 mt-1">{formatCurrency(parseFloat(property.price))}</p>
                            </div>
                            <div className="flex gap-2 mt-3 justify-end">
                              <Link to={`/seller/property/${property.id}/edit`}>
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              </Link>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="flex items-center"
                                onClick={() => handleDeleteProperty(property.id)}
                                disabled={deleteMutation.isLoading && deleteMutation.variables === property.id}
                              >
                                {deleteMutation.isLoading && deleteMutation.variables === property.id ? 
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />
                                }
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (!isLoadingProperties && !isErrorProperties && ( 
                    <div className="text-center py-6">
                      <Building className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium mb-1">No properties yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add your first property listing to get started.
                      </p>
                      <Link to="/seller/property/new"> {/* Updated link */}
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inquiries">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Inquiries</CardTitle>
                    {/* Link to all inquiries page if available */}
                    {/* <Link to="/seller/requests"><Button variant="outline" size="sm">View All</Button></Link> */}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Inquiries data removed for now */}
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Inquiries feature under development.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Marketing Content</CardTitle>
                    {/* Link to marketing content creation if available */}
                    {/* <Link to="/seller/marketing"><Button variant="outline" size="sm">Create More</Button></Link> */}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* AI Marketing content removed for now */}
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Marketing content feature under development.</p>
                  </div>
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
