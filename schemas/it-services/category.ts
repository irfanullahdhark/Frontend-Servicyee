import {z} from 'zod'
import { IconSchema } from '.';

export const categorySchema = z.object({
    id: z.string().trim().optional(),
    name: z.string().trim().min(1, { message: "Category name is required" }),
    icon: IconSchema
  }); // Enums for the choices