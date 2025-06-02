import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PropertyForm from '@/components/properties/PropertyForm';
import { createProperty } from '@/api/listings';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation(createProperty, {
    onSuccess: (data) => {
      toast({
        title: 'Property Created',
        description: `"${data.title}" has been successfully listed.`,
      });
      queryClient.invalidateQueries(['allListingsForSellerDashboard']); // To refresh seller's property list
      queryClient.invalidateQueries(['listings']); // To refresh public listings
      navigate('/seller'); // Or to the new property's detail page: `/properties/${data.id}`
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Create Property',
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const handleSubmit = async (formData: FormData) => {
    mutate(formData);
  };

  return (
    <DashboardLayout requiredRole="seller">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <PropertyForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          submitButtonText="Create Property"
        />
      </div>
    </DashboardLayout>
  );
};

export default AddPropertyPage;
