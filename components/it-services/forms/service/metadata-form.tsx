"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {  getPublicServiceTypes, getPublicSubCategories } from "@/app/it-services/actions/category";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryFormData, ServiceTypeFormData, SubCategoryFormData } from "@/schemas/it-services/category";
import { AsyncDropdown } from "@/components/it-services/extensions/async-dropdown";
import {
  ServiceMetadataFormData,
  ServiceMetadataSchema,
} from "@/schemas/it-services/service";
import { upsertMetadata } from "@/app/it-services/actions/metadata";

interface ServiceMetadataFormProps {
  // eslint-disable-next-line
  onClose?: (isSuccess?: boolean) => void;
  selectedMetadata?: ServiceMetadataFormData | null;
}

const fetchSubCategories = async (offset: number, limit: number, search?: string) => {
  const response = await getPublicSubCategories(limit, offset, search);
  return { results: response as unknown as CategoryFormData[] };
};

const fetchServiceTypes = async (subcategoryId: string, offset: number, limit: number, search?: string) => {
  const response = await getPublicServiceTypes(subcategoryId, limit, offset, search);
  return { results: response as unknown as ServiceTypeFormData[] };
};

export default function ServiceMetadataForm({
  onClose,
  selectedMetadata,
}: ServiceMetadataFormProps) {

  const [selectedSubcategory, setSelectedSubcategory] = useState<{id: string,name: string}>({
    id: "",
    name: "",
  });
  const [selectedServiceType, setSelectedServiceType] = useState<{id: string,name: string}>({
    id: "",
    name: "",
  });
  const form = useForm<ServiceMetadataFormData>({
    resolver: zodResolver(ServiceMetadataSchema),
    defaultValues: {
      id: selectedMetadata?.id || "",
      service_type: selectedMetadata?.service_type || "",
      subcategory: selectedMetadata?.subcategory || "",
      name: selectedMetadata?.name || "",
      field_type: selectedMetadata?.field_type || "checkbox",
      is_required: selectedMetadata?.is_required || false,
      title: selectedMetadata?.title || "",
      choices: selectedMetadata?.choices || [],
    },
  });

  const { fields, append, remove } = useFieldArray<ServiceMetadataFormData, never, string>({
    control: form.control,
    name: "choices" as never,
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMetadata) {
      // Extract subcategory ID (could be string ID or object with id property)
      const subcategoryId = typeof selectedMetadata.subcategory === 'string' 
        ? selectedMetadata.subcategory 
        : (selectedMetadata.subcategory as any)?.id || "";
      
      // Extract subcategory name if it's an object
      const subcategoryName = typeof selectedMetadata.subcategory === 'object' 
        ? (selectedMetadata.subcategory as any)?.name || ""
        : "";

      // Extract service_type ID (could be string ID, null, or object with id property)
      const serviceTypeId = selectedMetadata.service_type 
        ? (typeof selectedMetadata.service_type === 'string' 
            ? selectedMetadata.service_type 
            : (selectedMetadata.service_type as any)?.id || "")
        : "";
      
      // Extract service_type name if it's an object
      const serviceTypeName = selectedMetadata.service_type && typeof selectedMetadata.service_type === 'object'
        ? (selectedMetadata.service_type as any)?.name || ""
        : "";

      // Initialize state
      setSelectedSubcategory({
        id: subcategoryId,
        name: subcategoryName,
      });
      setSelectedServiceType({
        id: serviceTypeId,
        name: serviceTypeName,
      });

      form.reset({
        id: selectedMetadata.id || "",
        service_type: serviceTypeId,
        subcategory: subcategoryId,
        name: selectedMetadata.name || "",
        field_type: selectedMetadata.field_type || "checkbox",
        is_required: selectedMetadata.is_required || false,
        title: selectedMetadata.title || "",
        choices: selectedMetadata.choices || [],
      });
    } else {
      setSelectedSubcategory({ id: "", name: "" });
      setSelectedServiceType({ id: "", name: "" });
      form.reset({
        id: "",
        service_type: "",
        subcategory: "",
        name: "",
        field_type: "checkbox",
        is_required: false,
        title: "",
        choices: [],
      });
    }
  }, [selectedMetadata, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: upsertMetadata,
    onSuccess: () => {
      toast.success("Metadata saved successfully");
      onClose?.(true);
    },
    onError: (error) => {
      setError(error.message);
      toast.error("Failed to save Metadata");
    },
  });


  const handleSubCategoryChange = (value: string, option?: CategoryFormData) => {
    // If the same subcategory is selected, don't do anything
    if (selectedSubcategory.id === option?.id) return;
    
    setSelectedSubcategory({
      name: option?.name || "",
      id: option?.id || "",
    });
    setSelectedServiceType({
      name: "",
      id: "",
    });
    // Reset service_type form field when subcategory changes or is cleared
    form.setValue("service_type", "");
  };


  const handleServiceTypeChange = (value: string, option?: ServiceTypeFormData) => {
    if (selectedServiceType.name == option?.name) return;
    setSelectedServiceType({
      name: option?.name || "",
      id: option?.id || "",
    });
  };


  const onSubmit = async (data: ServiceMetadataFormData) => {
    const submitData = { ...data };
    mutate(submitData);
  };

  const subcategoryValue = form.watch("subcategory");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Subcategory */}
        <FormField
          control={form.control}
          name="subcategory"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                Subcategory <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <AsyncDropdown
                  value={field.value}
                  initialLabel={selectedSubcategory.name || undefined}
                  onSelect={(value: string, option?: SubCategoryFormData) => {
                    handleSubCategoryChange(value, option)
                    field.onChange(value)
                  }}
                  fetchFn={fetchSubCategories}
                  queryKey={["sub-categories"]}
                  getOptionLabel={(option: CategoryFormData) => option.name}
                  getOptionValue={(option: CategoryFormData) => option.id || ""}
                  placeholder="Select Subcategory..."
                  isPending={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
        control={form.control}
        name="service_type"
        disabled={isPending}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Service Type</FormLabel>
            <FormControl>
              <AsyncDropdown
                value={field.value || ""}
                initialLabel={selectedServiceType.name || undefined}
                onSelect={(value: string, option?: ServiceTypeFormData) => {
                  handleServiceTypeChange(value, option);
                  field.onChange(value);
                }}
                fetchFn={(offset, limit, search = "") => {
                  if (!selectedSubcategory.id && !subcategoryValue)
                    return Promise.resolve({ results: [] });
                  // Use selectedSubcategory.id if available, otherwise use the form value
                  const subcategoryId = selectedSubcategory.id || subcategoryValue;
                  if (!subcategoryId) return Promise.resolve({ results: [] });
                  return fetchServiceTypes(subcategoryId, offset, limit, search);
                }}
                queryKey={["service-types", selectedSubcategory.id || subcategoryValue || ""]}
                getOptionLabel={(option: ServiceTypeFormData) => option.name}
                getOptionValue={(option: ServiceTypeFormData) => option.id || ""}
                placeholder={
                  selectedSubcategory.id || subcategoryValue
                    ? "Select Service Type..."
                    : "Select Subcategory First"
                }
                isPending={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter metadata name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter metadata title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Field Type */}
        <FormField
          control={form.control}
          name="field_type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Field Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Required */}
        <FormField
          control={form.control}
          name="is_required"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Is Required</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val === "true")}
                value={String(field.value)}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


      
          <div className="space-y-3 border p-3 rounded-xl">
            <div className="flex justify-between items-center">
              <FormLabel>Choices</FormLabel>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append("")}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Choice
              </Button>

            </div>

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No choices added yet.
              </p>
            )}

            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`choices.${index}` as const)}
                  placeholder={`Choice ${index + 1}`}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>


        {/* Submit */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-destructive">{error}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose?.(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button disabled={isPending || !form.formState.isDirty}>
              {isPending ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
