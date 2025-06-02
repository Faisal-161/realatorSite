
import React from "react";
import { Link } from "react-router-dom";
import { Property } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  showBundledOffers?: boolean;
}

export function PropertyCard({ property, showBundledOffers = true }: PropertyCardProps) {
  return (
    <Card className="property-card overflow-hidden">
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={property.status === 'available' ? 'default' : property.status === 'pending' ? 'secondary' : 'outline'}>
            {property.status === 'available' ? 'Available' : property.status === 'pending' ? 'Pending' : 'Sold'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold line-clamp-1">{property.title}</h3>
            <div className="text-lg font-bold text-estate-600">
              {formatCurrency(property.price)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {property.location}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.area} sq ft</span>
          </div>
          {showBundledOffers && property.bundledOffers.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Bundled services:</p>
              <div className="flex flex-wrap gap-1">
                {property.bundledOffers.slice(0, 3).map((offer) => (
                  <Badge key={offer.id} variant="outline" className="text-xs">
                    {offer.category}
                  </Badge>
                ))}
                {property.bundledOffers.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.bundledOffers.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          to={`/properties/${property.id}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
