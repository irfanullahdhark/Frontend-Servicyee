import {z} from 'zod'
import { IconSchema } from '.';

export const CategorySchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().min(1, { message: "Category name is required" }),
  image: IconSchema,
  icon: IconSchema,
  description: z.string().trim().optional(),
  is_active: z.boolean().nullable().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().trim(),
        answer: z.string().trim(),
      })
    )
    .optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type CategoryFormData = z.infer<typeof CategorySchema>


export const SubCategorySchema = z.object({
  id: z.string().trim().optional(),
  category: z.string().trim().optional(), 
  name: z.string().trim().min(1, { message: "Category name is required" }),
  image: IconSchema,
  icon: IconSchema,
  description: z.string().trim().optional(),
  is_active: z.boolean().nullable().optional(),
  has_service_type: z.boolean().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type SubCategoryFormData = z.infer<typeof SubCategorySchema>
