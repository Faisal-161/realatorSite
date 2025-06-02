
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getBookings } from "@/api/bookings";
import type { Booking } from "@/lib/types";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, CalendarDays, Clock } from "lucide-react"; // Added CalendarDays, Clock
import { formatDate, formatCurrency } from "@/lib/utils"; // Assuming formatCurrency is useful

const BuyerDashboard = () => {
  const { data: bookings, isLoading, isError, error } = useQuery<Booking[], Error>({
    queryKey: ['myBookings'],
    queryFn: getBookings,
  });

  return (
    <DashboardLayout requiredRole="buyer">
      <div className="grid grid-cols-1 gap-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>View and manage your property bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading your bookings...</p>}
            {isError && <p className="text-red-500">Error fetching bookings: {error?.message}</p>}
            {!isLoading && !isError && (
              bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="md:flex">
                        {booking.property.image && (
                          <div className="md:w-1/3">
                            <img 
                              src={booking.property.image} 
                              alt={booking.property.title} 
                              className="object-cover h-48 w-full md:h-full"
                            />
                          </div>
                        )}
                        <div className={`p-4 space-y-2 ${booking.property.image ? 'md:w-2/3' : 'w-full'}`}>
                          <h3 className="text-lg font-semibold hover:text-estate-600 transition-colors">
                            <Link to={`/properties/${booking.property.id}`}>
                              {booking.property.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">{booking.property.address}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Scheduled for: {formatDate(booking.scheduled_date)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            Time: {booking.scheduled_time}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Seller: {booking.property.seller.username} ({booking.property.seller.email})
                          </p>
                          <div className="flex justify-between items-center pt-2">
                            <p className="text-lg font-semibold text-estate-600">
                              {formatCurrency(parseFloat(booking.property.price))}
                            </p>
                            {/* Add actions like 'Cancel Booking' or 'Reschedule' here if needed */}
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/properties/${booking.property.id}`}>View Property</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>You have no bookings yet.</p>
              )
            )}
          </CardContent>
        </Card>
        
        {/* Placeholder for other buyer-specific sections if needed in future */}
        {/* Example: Saved Properties (would require new API/logic) */}
        {/*
        <Card>
          <CardHeader>
            <CardTitle>My Saved Properties</CardTitle>
            <CardDescription>Properties you've saved for later.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Feature coming soon.</p>
          </CardContent>
        </Card>
        */}
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
