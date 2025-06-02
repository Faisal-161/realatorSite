import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import type { ServiceOffer } from '@/lib/types';
import { ServiceOfferCreateData, ServiceOfferUpdateData } from '@/api/services'; // For payload types

// Zod schema for validation
const serviceFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  property: z.coerce.number().int().positive({ message: "Property ID must be a positive number." }),
  approved: z.boolean().default(false),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  initialData?: ServiceOffer; // For editing
  onSubmit: (data: ServiceOfferCreateData | ServiceOfferUpdateData) => Promise<void>; // Accepts structured data
  isLoading?: boolean;
  submitButtonText?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, isLoading, submitButtonText = 'Submit Service' }) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      property: initialData?.property?.id || undefined, // Assuming property is nested and has an id
      approved: initialData?.approved || false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        property: initialData.property?.id,
        approved: initialData.approved,
      });
    }
  }, [initialData, reset]);

  const processSubmit = async (data: ServiceFormValues) => {
    // The data from react-hook-form matches ServiceOfferCreateData / ServiceOfferUpdateData structure
    // as long as 'property' is treated as property ID.
    await onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Service Offer' : 'Add New Service Offer'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Service Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Service Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="property">Property ID</Label>
            <Input id="property" type="number" {...register('property')} placeholder="Enter ID of associated property" />
            {errors.property && <p className="text-sm text-red-500 mt-1">{errors.property.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Enter the ID of the property this service is offered for.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="approved" 
              {...register('approved')} 
              checked={watch('approved')}
              onCheckedChange={(checked) => setValue('approved', !!checked)}
            />
            <Label htmlFor="approved" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Approved (Note: This may be admin-controlled)
            </Label>
            {errors.approved && <p className="text-sm text-red-500 mt-1">{errors.approved.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ServiceForm;
