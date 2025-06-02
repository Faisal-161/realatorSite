import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { users, properties, serviceOffers, contactRequests, aiContents, stats } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  User, Users, Building, List, Sparkles, MessageSquare, CreditCard, 
  ArrowUp, ArrowDown, BarChart2, PieChart as PieChartIcon, TrendingUp,
  LineChart as LineChartIcon
} from "lucide-react";
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
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get latest users, properties and service offers
  const latestUsers = [...users].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const latestProperties = [...properties].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  const latestServiceOffers = [...serviceOffers].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  // Get AI usage by user
  const aiUsageByUser = users
    .map(user => {
      const userAiContents = aiContents.filter(content => content.userId === user.id);
      return {
        user,
        count: userAiContents.length,
        lastUsed: userAiContents.length > 0 
          ? new Date(Math.max(...userAiContents.map(c => new Date(c.createdAt).getTime())))
          : null
      };
    })
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  // Calculate simple analytics
  const totalPropertyValue = properties.reduce((sum, property) => sum + property.price, 0);

  // Enhanced Analytics Data
  const totalSales = 28;
  const totalProfit = 12500000;
  const avgDealSize = totalProfit / totalSales;
  const conversionRate = 16.5;

  // Chart data for user roles
  const userRolesChartData = createChartData(
    ['Buyers', 'Sellers', 'Partners', 'Admins'],
    [{
      label: 'User Count',
      data: [
        stats.usersByRole.buyer, 
        stats.usersByRole.seller, 
        stats.usersByRole.partner, 
        stats.usersByRole.admin
      ],
      backgroundColor: chartColors.palette,
    }]
  );

  // Chart data for property types
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
                      <div className="text-3xl font-bold text-estate-600">{users.length}</div>
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
                      <div className="text-3xl font-bold text-estate-600">{properties.length}</div>
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
                      <div className="text-3xl font-bold text-estate-600">{serviceOffers.length}</div>
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
                      <div className="text-3xl font-bold text-estate-600">{formatCurrency(totalPropertyValue)}</div>
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
                      <BarChart data={userRolesChartData} />
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
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className="capitalize">{user.role}</Badge>
                              <div className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</div>
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
                              <img 
                                src={property.images[0]} 
                                alt={property.title}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{property.title}</p>
                                <p className="font-bold text-estate-600">{formatCurrency(property.price)}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{property.location}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Added on {formatDate(property.createdAt)}
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
                                <p className="font-bold text-estate-600">{formatCurrency(service.price)}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">By {service.partnerName}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <Badge variant="outline" className="text-xs capitalize mr-2">{service.category}</Badge>
                                Added on {formatDate(service.createdAt)}
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
