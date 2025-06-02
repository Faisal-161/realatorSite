
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { getServices } from "@/api/services";
import type { ServiceOffer, PropertyListing } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils"; // formatCurrency might be unused if price is removed
import { ServiceCard } from "@/components/services/ServiceCard"; // Consider if ServiceCard needs Edit/Delete or if they are separate
import { List, Building, MessageSquare, Plus, Loader2, Edit, Trash2 } from "lucide-react"; // Added Edit, Trash2
import { useMutation, useQueryClient } from "@tanstack/react-query"; // For delete mutation
import { deleteService } from "@/api/services"; // For deleteService
import { useToast } from "@/components/ui/use-toast"; // For toasts

const PartnerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allServices, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useQuery<ServiceOffer[], Error>({
    queryKey: ['allServicesForPartnerDashboard'],
    queryFn: getServices,
  });

  const deleteServiceMutation = useMutation(deleteService, {
    onSuccess: () => {
      toast({ title: 'Service Offer Deleted', description: 'The service offer has been successfully deleted.' });
      queryClient.invalidateQueries(['allServicesForPartnerDashboard']);
      queryClient.invalidateQueries(['servicesAdmin']); // For admin dashboard
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete Service Offer',
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service offer?')) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  const myServices = useMemo(() => {
    if (!allServices || !user) return [];
    return allServices.filter(service => service.service_provider.id === user.id);
  }, [allServices, user]);

  const propertiesWithMyServices = useMemo(() => {
    if (!myServices) return [];
    const propertyMap = new Map<number, PropertyListing>();
    myServices.forEach(service => {
      if (service.property) { // Ensure property exists
        propertyMap.set(service.property.id, service.property);
      }
    });
    return Array.from(propertyMap.values());
  }, [myServices]);
  
  // AI Content and Potential Revenue are removed as per plan

  return (
    <DashboardLayout requiredRole="partner">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your service offerings and track your performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Adjusted grid from 4 to 3 cols */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Services</CardTitle>
              <CardDescription>Total service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{myServices.length}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Properties Served</CardTitle>
              <CardDescription>Unique properties using your services</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-3xl font-bold text-estate-600">{propertiesWithMyServices.length}</div>}
            </CardContent>
          </Card>
          {/* Potential Revenue card removed */}
          {/* Chatbot Scripts card removed */}
          <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approvals</CardTitle>
                <CardDescription>Services awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingServices ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                    <div className="text-3xl font-bold text-estate-600">
                        {myServices.filter(s => !s.approved).length}
                    </div>
                }
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
                    <Link to="/partner/services/new"> {/* Updated Link */}
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingServices && <div className="flex justify-center py-6"><Loader2 className="h-8 w-8 animate-spin text-estate-600" /></div>}
                {isErrorServices && <p className="text-red-500 text-center py-6">Error loading services: {servicesError?.message}</p>}
                {!isLoadingServices && !isErrorServices && myServices.length > 0 ? (
                  <div className="space-y-4">
                    {myServices.map(service => ( 
                      <Card key={service.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{service.title}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-xs sm:max-w-md">{service.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Property ID: {service.property.id} - {service.property.title}
                            </p>
                            <Badge variant={service.approved ? "default" : "secondary"} className="mt-1">
                              {service.approved ? "Approved" : "Pending Approval"}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                            <Link to={`/partner/service/${service.id}/edit`}>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center">
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full sm:w-auto flex items-center"
                              onClick={() => handleDeleteService(service.id)}
                              disabled={deleteServiceMutation.isLoading && deleteServiceMutation.variables === service.id}
                            >
                              {deleteServiceMutation.isLoading && deleteServiceMutation.variables === service.id ? 
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />
                              }
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (!isLoadingServices && !isErrorServices && (
                  <div className="text-center py-6">
                    <List className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium mb-1">No services yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your first service offering to get started.
                    </p>
                    <Link to="/partner/services/new"> {/* Updated Link */}
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Properties Using My Services</CardTitle>
                  {/* <Link to="/partner/properties"><Button variant="outline" size="sm">View All</Button></Link> */}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingServices && <div className="flex justify-center py-2"><Loader2 className="h-6 w-6 animate-spin text-estate-600" /></div>}
                {!isLoadingServices && !isErrorServices && propertiesWithMyServices.length > 0 ? (
                  <div className="space-y-4">
                    {propertiesWithMyServices.slice(0, 3).map(property => ( // Show first 3
                      <div key={property.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-estate-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Building className="h-5 w-5 text-estate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{property.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{property.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (!isLoadingServices && !isErrorServices && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No properties are using your services yet.</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chatbot Script Card Removed */}
          </div>
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
