
import React from "react";
import { ServiceOffer } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceOffer;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function ServiceCard({ service, onSelect, isSelected }: ServiceCardProps) {
  return (
    <Card className={`service-card ${isSelected ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {service.category}
          </Badge>
          <span className="font-bold text-estate-600">{formatCurrency(service.price)}</span>
        </div>
        <h3 className="font-semibold">{service.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        <div className="mt-3 text-xs text-muted-foreground">
          Provided by {service.partnerName}
        </div>
      </CardContent>
      {onSelect && (
        <CardFooter className="p-4 pt-0">
          <button
            onClick={onSelect}
            className={`inline-flex h-9 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
              ${isSelected 
                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'}`
            }
          >
            {isSelected ? 'Selected' : 'Select Service'}
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
