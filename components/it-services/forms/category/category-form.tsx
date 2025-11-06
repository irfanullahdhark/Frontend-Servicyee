"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upsertCategory } from "@/app/it-services/actions/category";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/it-services/utils/ImagePicker";
import { CategorySchema, CategoryFormData } from "@/schemas/it-services/category";
import { options } from "@/lib/it-services/utils";
import imageCompression from "browser-image-compression";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  // eslint-disable-next-line
  onClose?: (isSuccess?: boolean) => void;
  selectedCategory?: CategoryFormData | null;
}

export default function CategoryForm({
  onClose,
  selectedCategory,
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      id: selectedCategory?.id || "",
      name: selectedCategory?.name || "",
      image: selectedCategory?.image || undefined,
      icon: selectedCategory?.icon || undefined,
      description: selectedCategory?.description || "",
      faqs: Array.isArray(selectedCategory?.faqs)
        ? selectedCategory?.faqs
        : selectedCategory?.faqs && typeof selectedCategory.faqs === "object"
        ? Object.entries(selectedCategory.faqs).map(([question, answer]) => ({
            question,
            answer: String(answer ?? ""),
          }))
        : [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        id: selectedCategory.id || "",
        name: selectedCategory.name || "",
        image: selectedCategory.image || undefined,
        icon: selectedCategory.icon || undefined,
        description: selectedCategory.description || "",
        faqs: Array.isArray(selectedCategory.faqs)
          ? selectedCategory.faqs
          : selectedCategory.faqs && typeof selectedCategory.faqs === "object"
          ? Object.entries(selectedCategory.faqs).map(([question, answer]) => ({
              question,
              answer: String(answer ?? ""),
            }))
          : [{ question: "", answer: "" }],
      });
    } else {
      // Reset to empty form for new category
      form.reset({
        id: "",
        name: "",
        image: undefined,
        icon: undefined,
        description: "",
        faqs: [{ question: "", answer: "" }],
      });
    }
  }, [selectedCategory, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: upsertCategory,
    onSuccess: () => {
      toast.success("Category saved successfully");
      // Pass true to indicate success
      onClose?.(true);
    },
    onError: (error) => {
      setError(error.message);
      toast.error("Failed to save Category");
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    const submitData = { ...data };
    
    // Handle icon - only process if it's a File
    if (data.icon instanceof File) {
      const compressedIcon = await imageCompression(data.icon, options);
      const iconWithName = new File([compressedIcon], data.icon.name, {
        type: compressedIcon.type,
      });
      submitData.icon = iconWithName;
    } else if (typeof data.icon === 'string') {
      // If it's a string (existing URL), remove it so backend keeps the existing file
      delete (submitData as any).icon;
    } else {
      // If it's null/undefined, set to null
      submitData.icon = null;
    }
    
    // Handle image - only process if it's a File
    if (data.image instanceof File) {
      const compressedImage = await imageCompression(data.image, options);
      const imageWithName = new File([compressedImage], data.image.name, {
        type: compressedImage.type,
      });
      submitData.image = imageWithName;
    } else if (typeof data.image === 'string') {
      // If it's a string (existing URL), remove it so backend keeps the existing file
      delete (submitData as any).image;
    } else {
      // If it's null/undefined, set to null
      submitData.image = null;
    }
    
    mutate(submitData);
  };

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

    {/* Category Name */}
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

    {/* FAQs (Dynamic field array) */}
    <FormItem>
      <FormLabel>FAQs</FormLabel>
      <FormDescription>Add FAQs as question → answer pairs</FormDescription>
      <div className="space-y-2">
        {fields.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name={`faqs.${index}.question` as const}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea {...field} placeholder="Question" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`faqs.${index}.answer` as const}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea {...field} placeholder="Answer" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ question: "", answer: "" })}
        >
          Add FAQ
        </Button>
      </div>
    </FormItem>

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