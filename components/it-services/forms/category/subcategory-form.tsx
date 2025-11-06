"use client";

import { useState } from "react";
import { useMutation} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPublicCategories, upsertSubCategory } from "@/app/it-services/actions/category";
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
import ImagePicker from "@/components/it-services/utils/ImagePicker";
import { SubCategorySchema, SubCategoryFormData, CategoryFormData } from "@/schemas/it-services/category";
import { options } from "@/lib/it-services/utils";
import imageCompression from "browser-image-compression";
import { Textarea } from "@/components/ui/textarea";
import { AsyncDropdown } from "@/components/it-services/extensions/async-dropdown";

interface SubCategoryFormProps {
  onClose?: () => void;
  selectedCategory?: SubCategoryFormData | null;
}

const fetchCategories = async (
    offset: number,
    limit: number,
    search?: string
  ) => {
    const response = await getPublicCategories(limit, offset, search);
    const result = response;
    return { results: result as unknown as CategoryFormData[] };
  };

export default function SubCategoryForm({
  onClose,
  selectedCategory,
}: SubCategoryFormProps) {
  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: {
      id: selectedCategory?.id || "",
      category: selectedCategory?.category || "",
      name: selectedCategory?.name || "",
      image: selectedCategory?.image || undefined,
      icon: selectedCategory?.icon || undefined,
      description: selectedCategory?.description || "",
      has_service_type: selectedCategory?.has_service_type,
    },
  });

  const [error, setError] = useState<string | null>(null);
    const { mutate, isPending } = useMutation({
            mutationFn: upsertSubCategory,
            onSuccess: () => {
                toast.success("Sub Category saved successfully");
                onClose?.();
            },
            onError: (error) => {
                setError(error.message);
                toast.error("Failed to save Sub Category");
            },
        });

  const onSubmit = async (data: SubCategoryFormData) => {
    if (data.icon && data.image instanceof File) {
      const compressedIcon = await imageCompression(data.icon, options);
      const compressedImage = await imageCompression(data.image, options);
      const imageWithName = new File([compressedImage], data.image.name, {
        type: compressedIcon.type,
      });
      const iconWithName = new File([compressedIcon], data.icon.name, {
        type: compressedIcon.type,
      });
      mutate({ ...data, icon:iconWithName, image: imageWithName, });
    }
    else mutate(data);
  };

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

    <FormField
        control={form.control}
        name="category"
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
                fetchFn={fetchCategories}
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

    {/* Description */}
    <FormField
      control={form.control}
      name="description"
      disabled={isPending}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="Enter category description" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Icon Upload */}
    <FormField
      control={form.control}
      name="icon"
      disabled={isPending}
      render={() => (
        <FormItem>
          <FormLabel>Icon</FormLabel>
          <ImagePicker
            onChange={(file) => {
              if (file) form.setValue("icon", file, { shouldDirty: true });
              else form.setValue("icon", null, { shouldDirty: true });
            }}
            name="icon"
            defaultImage={(() => {
              const icon = form.getValues("icon");
              return typeof icon === "string" ? icon : null;
            })()}
          />
        </FormItem>
      )}
    />

    {/* Image Upload */}
    <FormField
      control={form.control}
      name="image"
      disabled={isPending}
      render={() => (
        <FormItem>
          <FormLabel>Image</FormLabel>
          <ImagePicker
            onChange={(file) => {
              if (file) form.setValue("image", file, { shouldDirty: true });
              else form.setValue("image", null, { shouldDirty: true });
            }}
            name="image"
            defaultImage={(() => {
              const image = form.getValues("image");
              return typeof image === "string" ? image : null;
            })()}
          />
        </FormItem>
      )}
    />

    {/* Has Service Type (Dropdown Boolean) */}
    <FormField
          control={form.control}
          name="has_service_type"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Has Service Type</FormLabel>
              <Select
                onValueChange={(val) =>
                  field.onChange(val === "true" ? true : val === "false" ? false : null)
                }
                value={
                  field.value === true
                    ? "true"
                    : field.value === false
                    ? "false"
                    : ""
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
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


    {/* Submit Button */}
    <div className="flex justify-between items-center">
      <p className="text-sm text-destructive">{error}</p>
      <Button disabled={isPending || !form.formState.isDirty}>
        {isPending ? <Loader2 className="animate-spin" /> : "Save"}
      </Button>
    </div>
  </form>
</Form>

  )
}