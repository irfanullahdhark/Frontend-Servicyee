import {z} from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/config/it-services/imageConfig";

//  reuse icon schema variable 
export const IconSchema = z.any()
  .refine((file) => file, { message: "Image icon is required" })
  .refine((file) =>
  {
    console.log('file type', typeof (file))
    if (typeof window === "undefined") return file.size <= MAX_FILE_SIZE;
    return file instanceof File ? file.size <= MAX_FILE_SIZE : true;
  }, "Image icon file size must be less than 5MB")
  .refine((file) =>
  {
    if (!file) return true;
    if (typeof window === "undefined")
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    return file instanceof File
      ? ACCEPTED_IMAGE_TYPES.includes(file.type)
      : true;
  }, "image Icon must be in JPG, JPEG, PNG, or WebP format")
