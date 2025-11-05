"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upsertCategory } from "@/app/it-services/actions/category";
import { CategoryFormData } from "@/types/it-services/category";
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
import ImagePicker from "@/components/it-services/utils/ImagePicker";
import { categorySchema } from "@/schemas/it-services/category";
import { options } from "@/lib/it-services/utils";
import imageCompression from "browser-image-compression";

interface CategoryFormProps {
  onClose?: (isSuccess: boolean) => void;
  selectedCategory?: CategoryFormData | null;
}

export default function CategoryForm({
  onClose,
  selectedCategory,
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: selectedCategory?.id || "",
      name: selectedCategory?.name || "",
      icon: selectedCategory?.icon || undefined,
    },
  });
  const [error, setError] = useState<string | null>(null);
    const { mutate, isPending } = useMutation({
            mutationFn: upsertCategory,
            onSuccess: () => {
                toast.success("Category saved successfully");
                onClose?.(true);
            },
            onError: (error) => {
                setError(error.message);
                toast.error("Failed to save Category");
            },
        });

  const onSubmit = async (data: CategoryFormData) => {
    if (data.icon instanceof File) {
      const compressedIcon = await imageCompression(data.icon, options);
      const fileWithName = new File([compressedIcon], data.icon.name, {
        type: compressedIcon.type,
      });
      mutate({ ...data, icon: fileWithName });
    }
    else mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="icon"
          disabled={isPending}
          render={() => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <ImagePicker
                onChange={(file) => {
                  if (file) form.setValue(`icon`, file, { shouldDirty: true });
                  else form.setValue(`icon`, null, { shouldDirty: true });
                }}
                name="icon"
                defaultImage={(() => {
                  const icon = form.getValues(`icon`);
                  return typeof icon === "string" ? icon : null;
                })()}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button disabled={isPending || !form.formState.isDirty}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}