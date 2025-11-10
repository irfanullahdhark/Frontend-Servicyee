import { z } from 'zod'

export const ServiceMetadataSchema = z.object({
    id: z.string().trim().optional(),
    service_type: z.string().trim().nullable().optional(),
    subcategory: z.string().trim().min(1, { message: "SubCategory is required" }),
    name: z.string().trim().min(1, { message: "Metadata name is required" }),
    field_type: z.enum(["checkbox", "dropdown"], {
      message: "Field type is required",
    }),
    is_required: z.boolean(),
    title: z.string().trim().min(1, { message: "Metadata title is required" }),
    choices: z.array(z.string().trim()).optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  });
  
  export type ServiceMetadataFormData = z.infer<typeof ServiceMetadataSchema>;
  
