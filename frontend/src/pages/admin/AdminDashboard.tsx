import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { getUsers } from "@/api/users";
import { getListings } from "@/api/listings";
import { getServices } from "@/api/services";
import type { User, PropertyListing, ServiceOffer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  User as UserIcon, Users, Building, List, Sparkles, MessageSquare, CreditCard, 
  ArrowUp, ArrowDown, BarChart2, PieChart as PieChartIcon, TrendingUp,
  LineChart as LineChartIcon, Loader2
} from "lucide-react"; // Aliased User import
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  DoughnutChart, 
  createChartData, 
  chartColors 
} from "@/components/ui/chart-components";
import { CrmPanel } from "@/components/crm/CrmPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("monthly"); // For mock analytics
  const [activeTab, setActiveTab] = useState("overview");

  const { data: usersData, isLoading: isLoadingUsers } = useQuery<User[], Error>({
    queryKey: ['usersAdmin'],
    queryFn: getUsers,
  });
  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery<PropertyListing[], Error>({
    queryKey: ['listingsAdmin'],
    queryFn: getListings,
  });
  const { data: servicesData, isLoading: isLoadingServices } = useQuery<ServiceOffer[], Error>({
    queryKey: ['servicesAdmin'],
    queryFn: getServices,
  });

  // Memoized calculations for derived data
  const latestUsers = useMemo(() => {
    if (!usersData) return [];
    // Sort by ID descending as a proxy for "latest" since createdAt is not in User model
    return [...usersData].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [usersData]);

  const latestProperties = useMemo(() => {
    if (!propertiesData) return [];
    return [...propertiesData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
  }, [propertiesData]);

  const latestServiceOffers = useMemo(() => {
    if (!servicesData) return [];
    return [...servicesData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
  }, [servicesData]);
  
  const totalPropertyValue = useMemo(() => {
    if (!propertiesData) return 0;
    return propertiesData.reduce((sum, property) => sum + parseFloat(property.price), 0);
  }, [propertiesData]);

  // AI Usage and Contact Requests related mock data removed or will be marked as mock
  const aiContents: any[] = []; // Mock data for sections not being updated
  const contactRequests: any[] = []; // Mock data
  const stats: any = { usersByRole: { buyer: 0, seller: 0, partner: 0, admin: 0 }}; // Mock stats

  const aiUsageByUser = useMemo(() => { // Still uses mock aiContents
    if (!usersData || aiContents.length === 0) return [];
    return usersData
      .map(user => {
        const userAiContents = aiContents.filter(content => content.userId === user.id);
        return {
          user, // This should be user.username or similar from your actual User type for display
          name: user.username, // Assuming username for display
          role: user.role, // Assuming role for display
          createdAt: 'N/A', // Mock or remove if not available
          count: userAiContents.length,
          lastUsed: userAiContents.length > 0 
            ? new Date(Math.max(...userAiContents.map(c => new Date(c.createdAt).getTime())))
            : null
        };
      })
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [usersData]);


  // Enhanced Analytics Data (remains mock)
  const totalSales = 28; 
  const totalProfit = 12500000;
  const avgDealSize = totalProfit / totalSales;
  const conversionRate = 16.5;

  // Chart data for user roles
  const userRolesChartData = useMemo(() => {
    if (!usersData) { // Fallback if usersData is not loaded
      return createChartData(['Buyers', 'Sellers', 'Partners', 'Admins'], [{ label: 'User Count', data: [0,0,0,0], backgroundColor: chartColors.palette }]);
    }
    const rolesCount = usersData.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const labels = ['buyer', 'seller', 'service_provider', 'admin']; // Match UserRole type
    const data = labels.map(role => rolesCount[role] || 0);

    return createChartData(
      labels.map(l => l.charAt(0).toUpperCase() + l.slice(1).replace('_', ' ')), // Prettify labels
      [{ label: 'User Count', data, backgroundColor: chartColors.palette }]
    );
  }, [usersData]);

  // Chart data for property types (remains mock - as property type is not in model)
  const propertyTypesChartData = createChartData( 
    ['House', 'Apartment', 'Condo', 'Land', 'Commercial'],
    [{
      label: 'Property Count',
      data: [12, 8, 6, 3, 2],
      backgroundColor: [
        chartColors.primary.base,
        chartColors.secondary.base,
        chartColors.success.base,
        chartColors.warning.base,
        chartColors.danger.base,
      ],
    }]
  );

  // Chart data for sales performance
  const salesPerformanceData = createChartData(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [
      {
        label: 'Sales Volume',
        data: [2100000, 2300000, 1900000, 2500000, 2600000, 3000000],
        backgroundColor: chartColors.primary.base,
      },
      {
        label: 'Profit',
        data: [450000, 520000, 380000, 580000, 620000, 750000],
        backgroundColor: chartColors.success.base,
      }
    ]
  );

  // Chart data for platform usage 
  const platformUsageData = createChartData(
    ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    [
      {
        label: 'Active Users',
        data: [120, 145, 160, 175],
        borderColor: chartColors.primary.base,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
      },
      {
        label: 'Listings Created',
        data: [25, 30, 28, 42],
        borderColor: chartColors.secondary.base,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
      },
      {
        label: 'Service Offers',
        data: [15, 18, 22, 28],
        borderColor: chartColors.success.base,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
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
    <DashboardLayout requiredRole="admin">
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management tools.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-8"
          >
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto">
              <TabsTrigger value="overview" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="crm" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                CRM
              </TabsTrigger>
              <TabsTrigger value="ai" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                AI Usage
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-estate-600" />
                      </div>
                      <CardDescription>Platform users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingUsers ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{usersData?.length || 0}</div>}
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-green-600 font-medium">12%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Properties</CardTitle>
                        <Building className="h-4 w-4 text-estate-600" />
                      </div>
                      <CardDescription>Listed on platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingProperties ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{propertiesData?.length || 0}</div>}
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-green-600 font-medium">8%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Services</CardTitle>
                        <List className="h-4 w-4 text-estate-600" />
                      </div>
                      <CardDescription>Partner offerings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingServices ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{servicesData?.length || 0}</div>}
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-green-600 font-medium">15%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Property Value</CardTitle>
                        <BarChart2 className="h-4 w-4 text-estate-600" />
                      </div>
                      <CardDescription>Total listed value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingProperties ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{formatCurrency(totalPropertyValue)}</div>}
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <ArrowDown className="h-4 w-4 mr-1 text-amber-600" />
                        <span className="text-amber-600 font-medium">3%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-2" variants={itemVariants}>
                  <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>User Distribution</CardTitle>
                      <CardDescription>Breakdown by role type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      {isLoadingUsers ? <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-estate-600" /></div> : <BarChart data={userRolesChartData} />}
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Latest Users</CardTitle>
                        <Link to="/admin/users">
                          <Button variant="outline" size="sm">View All</Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {latestUsers.map(user => (
                          <motion.div 
                            key={user.id} 
                            className="flex items-center justify-between p-2 border-b last:border-0"
                            variants={itemVariants}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{user.username}</p> {/* Changed to username */}
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className="capitalize">{user.role.replace('_', ' ')}</Badge>
                              {/* formatDate(user.createdAt) removed as createdAt is not in User model */}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-md transition-all h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Latest Properties</CardTitle>
                        <Link to="/admin/properties">
                          <Button variant="outline" size="sm">View All</Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {latestProperties.map(property => (
                          <motion.div 
                            key={property.id} 
                            className="flex items-start gap-3 p-3 border rounded-lg"
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.01)" }}
                          >
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                {property.image ? (
                                  <img 
                                    src={property.image} 
                                    alt={property.title}
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{property.title}</p>
                                  <p className="font-bold text-estate-600">{formatCurrency(parseFloat(property.price))}</p>
                              </div>
                                <p className="text-xs text-muted-foreground">{property.address}</p> {/* Changed to address */}
                              <p className="text-xs text-muted-foreground mt-1">
                                  Added on {formatDate(property.created_at)} {/* Changed to created_at */}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-md transition-all h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Latest Services</CardTitle>
                        <Link to="/admin/services">
                          <Button variant="outline" size="sm">View All</Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {latestServiceOffers.map(service => (
                          <motion.div 
                            key={service.id} 
                            className="flex items-start gap-3 p-3 border rounded-lg"
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.01)" }}
                          >
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <List className="h-5 w-5 text-estate-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{service.title}</p>
                                {/* formatCurrency(service.price) removed */}
                              </div>
                              <p className="text-xs text-muted-foreground">By {service.service_provider.username}</p> {/* Changed to service_provider.username */}
                              <p className="text-xs text-muted-foreground mt-1">
                                {/* Badge for category removed */}
                                Added on {formatDate(service.created_at)} {/* Changed to created_at */}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <motion.div 
                className="space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Total Sales</CardTitle>
                          <TrendingUp className="h-4 w-4 text-estate-600" />
                        </div>
                        <CardDescription>Completed transactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-estate-600">{totalSales}</div>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                          <span className="text-green-600 font-medium">14%</span> from last quarter
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Total Profit</CardTitle>
                          <BarChart2 className="h-4 w-4 text-estate-600" />
                        </div>
                        <CardDescription>Gross platform revenue</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-estate-600">{formatCurrency(totalProfit)}</div>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                          <span className="text-green-600 font-medium">18%</span> from last quarter
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Avg. Deal</CardTitle>
                          <LineChartIcon className="h-4 w-4 text-estate-600" />
                        </div>
                        <CardDescription>Per transaction</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-estate-600">{formatCurrency(avgDealSize)}</div>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                          <span className="text-green-600 font-medium">4%</span> from last quarter
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Conversion</CardTitle>
                          <PieChartIcon className="h-4 w-4 text-estate-600" />
                        </div>
                        <CardDescription>Lead to sale rate</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-estate-600">{conversionRate}%</div>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                          <span className="text-green-600 font-medium">2.3%</span> from last quarter
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Sales Performance</CardTitle>
                            <CardDescription>Monthly performance data</CardDescription>
                          </div>
                          <Select
                            value={timeRange}
                            onValueChange={setTimeRange}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="h-[350px]">
                        <BarChart data={salesPerformanceData} />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-md transition-all">
                      <CardHeader>
                        <CardTitle>Property Distribution</CardTitle>
                        <CardDescription>By property type</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[350px]">
                        <DoughnutChart data={propertyTypesChartData} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Platform Usage Trends</CardTitle>
                      <CardDescription>Active users, listings and service offers</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <LineChart data={platformUsageData} />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="crm">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <CrmPanel />
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="ai">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>AI Usage</CardTitle>
                        <Link to="/admin/ai-usage">
                          <Button variant="outline" size="sm">Details</Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                            <Sparkles className="h-8 w-8 text-estate-600 mb-2" />
                            <p className="text-2xl font-bold">{aiContents.length}</p>
                            <p className="text-sm text-muted-foreground">Total AI Interactions</p>
                          </div>
                          
                          <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                            <MessageSquare className="h-8 w-8 text-estate-600 mb-2" />
                            <p className="text-2xl font-bold">{aiContents.filter(c => c.contentType === 'chatbot').length}</p>
                            <p className="text-sm text-muted-foreground">Chatbot Usage</p>
                          </div>
                          
                          <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                            <List className="h-8 w-8 text-estate-600 mb-2" />
                            <p className="text-2xl font-bold">{aiContents.filter(c => c.contentType === 'marketing').length}</p>
                            <p className="text-sm text-muted-foreground">Marketing Content</p>
                          </div>
                          
                          <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                            <Users className="h-8 w-8 text-estate-600 mb-2" />
                            <p className="text-2xl font-bold">{aiUsageByUser.length}</p>
                            <p className="text-sm text-muted-foreground">Active AI Users</p>
                          </div>
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Top AI Users</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <motion.div 
                              className="divide-y"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {aiUsageByUser.slice(0, 5).map(({ user, count, lastUsed }) => (
                                <motion.div
                                  key={user.id}
                                  variants={itemVariants}
                                  className="flex items-start gap-3 py-3"
                                >
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-4 w-4 text-estate-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className="font-medium text-sm">{user.name}</p>
                                      <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Used {count} times</p>
                                    {lastUsed && <p className="text-xs text-muted-foreground">Last: {formatDate(lastUsed)}</p>}
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">AI Usage by Role</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                              <PieChart 
                                data={createChartData(
                                  ["Buyers", "Sellers", "Partners", "Admins"],
                                  [{
                                    label: "AI Usage Count",
                                    data: [15, 45, 25, 15],
                                    backgroundColor: chartColors.palette,
                                  }]
                                )}
                              />
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">AI Usage Growth</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                              <LineChart 
                                data={createChartData(
                                  ["Jan", "Feb", "Mar", "Apr", "May"],
                                  [{
                                    label: "Chatbot Usage",
                                    data: [10, 25, 35, 50, 65],
                                    borderColor: chartColors.primary.base,
                                    backgroundColor: "rgba(14, 165, 233, 0.1)",
                                    fill: true,
                                  },
                                  {
                                    label: "Marketing Content",
                                    data: [5, 15, 20, 30, 45],
                                    borderColor: chartColors.secondary.base,
                                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                                    fill: true,
                                  }]
                                )}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
