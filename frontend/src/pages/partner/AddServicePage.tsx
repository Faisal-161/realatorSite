import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ServiceForm, { ServiceFormValues } from '@/components/services/ServiceForm';
import { createService, ServiceOfferCreateData } from '@/api/services';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddServicePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation(
    (data: ServiceOfferCreateData) => createService(data), 
    {
      onSuccess: (data) => {
        toast({
          title: 'Service Offer Created',
          description: `"${data.title}" has been successfully created.`,
        });
        queryClient.invalidateQueries(['allServicesForPartnerDashboard']);
        queryClient.invalidateQueries(['servicesAdmin']); // For admin dashboard potentially
        navigate('/partner'); 
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Failed to Create Service Offer',
          description: error.message || 'An unexpected error occurred.',
        });
      },
    }
  );

  const handleSubmit = async (formData: ServiceFormValues) => {
    // ServiceFormValues matches ServiceOfferCreateData if property is property_id
    mutate(formData as ServiceOfferCreateData);
  };

  return (
    <DashboardLayout requiredRole="service_provider">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ServiceForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          submitButtonText="Create Service Offer"
        />
      </div>
    </DashboardLayout>
  );
};

export default AddServicePage;
