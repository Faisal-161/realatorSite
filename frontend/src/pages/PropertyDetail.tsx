
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { getProperty } from "@/api/listings";
import type { PropertyListing } from "@/lib/types";
// import { ServiceCard } from "@/components/services/ServiceCard"; // ServiceCard might be unused if bundledOffers are removed
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Bed, Bath, Clock, ArrowRight, MapPin } from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contactMessage, setContactMessage] = useState("");
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Removed as we now have single image

  const { data: property, isLoading, isError, error } = useQuery<PropertyListing, Error>({
    queryKey: ['property', id],
    queryFn: () => getProperty(Number(id)),
    enabled: !!id, // Only run query if id is available
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <p>Loading property details...</p>
        </div>
      </MainLayout>
    );
  }

  if (isError || !property) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-8">{error?.message || "The property you're looking for doesn't exist or could not be loaded."}</p>
          <Link to="/properties">
            <Button>View All Properties</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleContactRequest = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to contact the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (user.role !== "buyer") {
      toast({
        title: "Buyer Account Required",
        description: "Only buyers can send contact requests.",
        variant: "destructive",
      });
      return;
    }
    
    if (!contactMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to the seller.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request Sent",
      description: "Your contact request has been sent to the seller.",
    });
    
    setContactMessage("");
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/properties" className="text-estate-600 hover:underline flex items-center gap-1">
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span>Back to properties</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            {/* Image display - updated for single image */}
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                {property.image ? (
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p>No image available</p>
                  </div>
                )}
                {/* Badge for status removed as it's not in API data model
                <Badge className="absolute top-4 right-4">
                  {property.status === 'available' ? 'Available' : property.status === 'pending' ? 'Pending' : 'Sold'}
                </Badge> 
                */}
              </div>
              {/* Thumbnail gallery removed as we only have one image URL from backend */}
            </div>

            {/* Property details */}
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <p className="text-2xl font-bold text-estate-600">
                  {formatCurrency(parseFloat(property.price))} {/* Parse price */}
                </p>
              </div>
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <p>{property.address}</p> {/* Changed location to address */}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6"> {/* Adjusted grid for potentially 2 items */}
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Bed className="h-5 w-5 mb-1 text-estate-600" />
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <span className="font-medium">{property.num_bedrooms}</span> {/* Changed bedrooms to num_bedrooms */}
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Bath className="h-5 w-5 mb-1 text-estate-600" />
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <span className="font-medium">{property.num_bathrooms}</span> {/* Changed bathrooms to num_bathrooms */}
                </div>
                {/* Square Feet (area) removed as it's not in API data model 
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 mb-1 text-estate-600" />
                  <span className="text-sm text-muted-foreground">Square Feet</span>
                  <span className="font-medium">{property.area}</span>
                </div>
                */}
              </div>

              <Separator className="my-6" />

              {/* Tabs - Bundled Services tab content will be empty or removed */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {/* <TabsTrigger value="services">Bundled Services</TabsTrigger> */} {/* Bundled services tab removed */}
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {property.description}
                  </p>
                </TabsContent>
                {/* Bundled services content removed
                <TabsContent value="services" className="mt-4">
                  <h3 className="font-medium mb-4">Services included with this property:</h3>
                  <p className="text-muted-foreground">Currently, bundled service information is not available here. Please contact the seller for details.</p>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.bundledOffers.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                  
                  <p className="mt-6 text-sm text-muted-foreground">
                    These services are offered by our trusted partners and can be bundled with your property purchase for added convenience.
                  </p> * /
                </TabsContent>
                */}
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="I'm interested in this property and would like to know more details..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  onClick={handleContactRequest} 
                  className="w-full"
                  disabled={!user || user.role !== 'buyer'}
                >
                  Send Inquiry
                </Button>
                
                {!user && (
                  <p className="text-center text-sm text-muted-foreground">
                    <Link to="/login" className="text-estate-600 hover:underline">
                      Log in
                    </Link>{" "}
                    as a buyer to contact the seller.
                  </p>
                )}
                
                {user && user.role !== 'buyer' && (
                  <p className="text-center text-sm text-muted-foreground">
                    Only buyers can send contact requests.
                  </p>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Contact Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Seller Contact Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-center text-muted-foreground">
                        Contact information is only available after the seller approves your inquiry.
                      </p>
                      <div className="text-center">
                        <Button 
                          onClick={handleContactRequest}
                          disabled={!user || user.role !== 'buyer' || !contactMessage.trim()}
                        >
                          Send Inquiry Now
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;
