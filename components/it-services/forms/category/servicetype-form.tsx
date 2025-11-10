"use client";

import { useState, useEffect } from "react";
import { useMutation} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPublicSubCategories, upsertServiceType } from "@/app/it-services/actions/category";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceTypeSchema, ServiceTypeFormData,  SubCategoryFormData, CategoryFormData } from "@/schemas/it-services/category";
import { AsyncDropdown } from "@/components/it-services/extensions/async-dropdown";

interface ServiceTypeFormProps {
  // eslint-disable-next-line
  onClose?: (isSuccess?: boolean) => void;
  selectedServiceType?: ServiceTypeFormData | null;
}

const fetchSubCategories = async (
    offset: number,
    limit: number,
    search?: string
  ) => {
    const response = await getPublicSubCategories(limit, offset, search);
    const result = response;
    return { results: result as unknown as SubCategoryFormData[] };
  };

export default function ServiceTypeForm({
  onClose,
  selectedServiceType,
}: ServiceTypeFormProps) {
  const form = useForm<ServiceTypeFormData>({
    resolver: zodResolver(ServiceTypeSchema),
    defaultValues: {
      id: selectedServiceType?.id || "",
      subcategory: selectedServiceType?.subcategory || "",
      name: selectedServiceType?.name || "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  
  // Reset form when selectedServiceType changes
  useEffect(() => {
    if (selectedServiceType) {
      form.reset({
        id: selectedServiceType.id || "",
        subcategory: typeof selectedServiceType.subcategory === "object" && selectedServiceType.subcategory !== null
          ? (selectedServiceType.subcategory as { id: string }).id
          : (selectedServiceType.subcategory || ""),
        name: selectedServiceType.name || "",
      });
    } else {
      // Reset to empty form for new sub-category
      form.reset({
        id: "",
        subcategory: "",
        name: "",
      });
    }
  }, [selectedServiceType, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: upsertServiceType,
    onSuccess: () => {
      toast.success("Service type saved successfully");
      // Pass true to indicate success
      onClose?.(true);
    },
    onError: (error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: ServiceTypeFormData) => {
    const submitData = { ...data };
    mutate(submitData);
  };

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

    <FormField
        control={form.control}
        name="subcategory"
        disabled={isPending}
        render={({ field }) => (
        <FormItem className="space-y-2">
            <FormLabel>
            Category <span className="text-destructive">*</span>
            </FormLabel>
            <div className="relative mb-0">
            <FormControl>
                <AsyncDropdown
                value={field.value}
                onSelect={(value: string) => {
                    field.onChange(value);
                }}
                fetchFn={fetchSubCategories}
                queryKey={["categories"]}
                getOptionLabel={(option: CategoryFormData) => option.name}
                getOptionValue={(option: CategoryFormData) => option.id || ""}
                placeholder="Select Category..."
                isPending={isPending}
                />
            </FormControl>
            </div>
            <div className="mt-0 h-5">
            <FormMessage />
            </div>
        </FormItem>
        )}
    />
    {/* Sub Category Name */}
    <FormField
      control={form.control}
      name="name"
      disabled={isPending}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter category name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Submit Button */}
    <div className="flex justify-between items-center">
      <p className="text-sm text-destructive">{error}</p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => onClose?.(false)} disabled={isPending}>
          Cancel
        </Button>
        <Button disabled={isPending || !form.formState.isDirty}>
          {isPending ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  </form>
</Form>

  )
}