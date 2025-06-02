import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import type { PropertyListing, User } from '@/lib/types'; // Assuming User might be needed for seller info display
import { PropertyListingCreateData, PropertyListingUpdateData } from '@/api/listings'; // For payload types

// Zod schema for validation
const propertyFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  num_bedrooms: z.coerce.number().int().min(0, { message: "Number of bedrooms must be non-negative." }),
  num_bathrooms: z.coerce.number().int().min(0, { message: "Number of bathrooms must be non-negative." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  image: z.instanceof(FileList).optional(), // FileList for input type file
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  initialData?: PropertyListing; // For editing
  onSubmit: (data: FormData) => Promise<void>; // Accepts FormData
  isLoading?: boolean;
  submitButtonText?: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, isLoading, submitButtonText = 'Submit Property' }) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      num_bedrooms: initialData?.num_bedrooms || 0,
      num_bathrooms: initialData?.num_bathrooms || 0,
      price: initialData ? parseFloat(initialData.price) : 0, // API price is string
      image: undefined, // File input cannot have a default value in the same way
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        address: initialData.address,
        num_bedrooms: initialData.num_bedrooms,
        num_bathrooms: initialData.num_bathrooms,
        price: parseFloat(initialData.price),
        image: undefined,
      });
    }
  }, [initialData, reset]);

  const processSubmit = async (data: PropertyFormValues) => {
    const formData = new FormData();
    
    // Append all fields from PropertyListingCreateData/UpdateData
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('num_bedrooms', String(data.num_bedrooms));
    formData.append('num_bathrooms', String(data.num_bathrooms));
    formData.append('price', String(data.price));

    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    } else if (initialData && !data.image && initialData.image === null) {
      // If image was explicitly cleared and backend needs indication
      // formData.append('image', ''); // Or however backend expects nullification
    }


    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Property' : 'Add New Property'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="num_bedrooms">Bedrooms</Label>
              <Input id="num_bedrooms" type="number" {...register('num_bedrooms')} />
              {errors.num_bedrooms && <p className="text-sm text-red-500 mt-1">{errors.num_bedrooms.message}</p>}
            </div>
            <div>
              <Label htmlFor="num_bathrooms">Bathrooms</Label>
              <Input id="num_bathrooms" type="number" {...register('num_bathrooms')} />
              {errors.num_bathrooms && <p className="text-sm text-red-500 mt-1">{errors.num_bathrooms.message}</p>}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="image">Property Image</Label>
            <Input id="image" type="file" {...register('image')} accept="image/*" />
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message as string}</p>}
            {initialData?.image && !errors.image && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Current image:</p>
                <img src={initialData.image} alt="Current property" className="h-20 w-auto rounded-md object-cover" />
                <p className="text-xs text-muted-foreground mt-1">Uploading a new image will replace the current one.</p>
              </div>
            )}
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

export default PropertyForm;
