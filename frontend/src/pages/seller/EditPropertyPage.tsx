import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PropertyForm from '@/components/properties/PropertyForm';
import { getProperty, updateProperty } from '@/api/listings';
import type { PropertyListing } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditPropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: property, isLoading: isLoadingProperty, isError, error } = useQuery<PropertyListing, Error>(
    ['property', propertyId],
    () => getProperty(propertyId),
    {
      enabled: !!propertyId, // Only fetch if ID is valid
    }
  );

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation(
    (formData: FormData) => updateProperty(propertyId, formData),
    {
      onSuccess: (data) => {
        toast({
          title: 'Property Updated',
          description: `"${data.title}" has been successfully updated.`,
        });
        queryClient.invalidateQueries(['property', propertyId]);
        queryClient.invalidateQueries(['allListingsForSellerDashboard']);
        queryClient.invalidateQueries(['listings']);
        navigate(`/seller`); // Or to `/properties/${propertyId}` or back to list
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Failed to Update Property',
          description: error.message || 'An unexpected error occurred.',
        });
      },
    }
  );

  const handleSubmit = async (formData: FormData) => {
    if (!propertyId) return;
    updateMutate(formData);
  };

  if (isLoadingProperty) {
    return (
      <DashboardLayout requiredRole="seller">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-estate-600" />
          <p className="ml-2">Loading property details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !property) {
    return (
      <DashboardLayout requiredRole="seller">
        <div className="p-4 md:p-6 text-center">
          <p className="text-red-500">Error loading property: {error?.message || 'Property not found.'}</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/seller')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="seller">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <PropertyForm 
          initialData={property}
          onSubmit={handleSubmit} 
          isLoading={isUpdating}
          submitButtonText="Save Changes"
        />
      </div>
    </DashboardLayout>
  );
};

export default EditPropertyPage;
