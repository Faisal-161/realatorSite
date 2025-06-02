
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { serviceOffers, properties, aiContents } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ServiceCard } from "@/components/services/ServiceCard";
import { List, Building, BarChart2, MessageSquare, Plus } from "lucide-react";

const PartnerDashboard = () => {
  // Filter services to only show those created by the current user (user-5)
  const myServices = serviceOffers.filter(service => service.partnerId === "user-5");
  
  // Count how many properties have bundled offers from this partner
  const propertiesWithMyServices = properties.filter(property => 
    property.bundledOffers.some(offer => offer.partnerId === "user-5")
  );

  // Filter AI content to only show those created by the current user
  const myAiContent = aiContents.filter(content => 
    content.userId === "user-5" && content.contentType === "chatbot"
  );

  // Calculate total potential revenue (sum of my service prices used in properties)
  const totalPotentialRevenue = properties.reduce((total, property) => {
    const myOffersInProperty = property.bundledOffers.filter(
      offer => offer.partnerId === "user-5"
    );
    return total + myOffersInProperty.reduce((sum, offer) => sum + offer.price, 0);
  }, 0);

  return (
    <DashboardLayout requiredRole="partner">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your service offerings and track your performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Services</CardTitle>
              <CardDescription>Total service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-estate-600">{myServices.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Properties</CardTitle>
              <CardDescription>Using your services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-estate-600">{propertiesWithMyServices.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Potential Revenue</CardTitle>
              <CardDescription>From bundled offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-estate-600">{formatCurrency(totalPotentialRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chatbot Scripts</CardTitle>
              <CardDescription>AI generated scripts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-estate-600">{myAiContent.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Services</CardTitle>
                  <div className="flex gap-2">
                    <Link to="/partner/add-service">
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </Link>
                    <Link to="/partner/services">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {myServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myServices.slice(0, 4).map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <List className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium mb-1">No services yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your first service offering to get started.
                    </p>
                    <Link to="/partner/add-service">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Properties Using My Services</CardTitle>
                  <Link to="/partner/properties">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {propertiesWithMyServices.length > 0 ? (
                  <div className="space-y-4">
                    {propertiesWithMyServices.slice(0, 3).map(property => {
                      const myOffersCount = property.bundledOffers.filter(
                        offer => offer.partnerId === "user-5"
                      ).length;
                      
                      return (
                        <div key={property.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-10 h-10 bg-estate-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <Building className="h-5 w-5 text-estate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{property.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Using {myOffersCount} of your services
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{property.location}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No properties are using your services yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chatbot Script</CardTitle>
                  <Link to="/partner/chatbot">
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {myAiContent.length > 0 ? (
                  <div className="space-y-4">
                    {myAiContent.slice(0, 1).map(content => (
                      <div key={content.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-estate-600" />
                          <span className="text-sm font-medium">AI Generated</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDate(content.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{content.content.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No chatbot scripts created yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PartnerDashboard;
