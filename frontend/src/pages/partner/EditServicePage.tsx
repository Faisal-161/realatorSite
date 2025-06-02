import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ServiceForm, { ServiceFormValues } from '@/components/services/ServiceForm';
import { getService, updateService, ServiceOfferUpdateData } from '@/api/services';
import type { ServiceOffer } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const serviceId = Number(id);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: service, isLoading: isLoadingService, isError, error } = useQuery<ServiceOffer, Error>(
    ['serviceOffer', serviceId],
    () => getService(serviceId),
    {
      enabled: !!serviceId, 
    }
  );

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation(
    (data: ServiceOfferUpdateData) => updateService(serviceId, data),
    {
      onSuccess: (data) => {
        toast({
          title: 'Service Offer Updated',
          description: `"${data.title}" has been successfully updated.`,
        });
        queryClient.invalidateQueries(['serviceOffer', serviceId]);
        queryClient.invalidateQueries(['allServicesForPartnerDashboard']);
        queryClient.invalidateQueries(['servicesAdmin']);
        navigate(`/partner`); 
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Failed to Update Service Offer',
          description: error.message || 'An unexpected error occurred.',
        });
      },
    }
  );

  const handleSubmit = async (formData: ServiceFormValues) => {
    if (!serviceId) return;
    // Ensure formData aligns with ServiceOfferUpdateData structure
    const updateData: ServiceOfferUpdateData = { 
        title: formData.title,
        description: formData.description,
        property: formData.property, // Property ID
        approved: formData.approved,
    };
    updateMutate(updateData);
  };

  if (isLoadingService) {
    return (
      <DashboardLayout requiredRole="service_provider">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-estate-600" />
          <p className="ml-2">Loading service details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !service) {
    return (
      <DashboardLayout requiredRole="service_provider">
        <div className="p-4 md:p-6 text-center">
          <p className="text-red-500">Error loading service: {error?.message || 'Service offer not found.'}</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/partner')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="service_provider">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ServiceForm 
          initialData={service}
          onSubmit={handleSubmit} 
          isLoading={isUpdating}
          submitButtonText="Save Changes"
        />
      </div>
    </DashboardLayout>
  );
};

export default EditServicePage;
