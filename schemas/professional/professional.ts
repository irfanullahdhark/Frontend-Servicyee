import z from "zod";

export const professionalSchema = z.object({
  introduction: z
    .string()
    .min(100, "Introduction must be at least 100 characters")
    .max(500, "Introduction must be less than 500 characters"),
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

export const UpdateProfessionalIntroSchema = z.object({
  business_name: z
    .string()
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name must be less than 100 characters"),

  founded_year: z
    .number()
    .int("Founded year must be an integer")
    .refine((year) => year >= 1800 && year <= new Date().getFullYear(), {
      message: `Founded year must be between 1800 and ${new Date().getFullYear()}`,
    }),

  employees: z
    .number()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1,
      "Employees must be at least 1"
    ),

  website: z.string().optional().or(z.literal("")),

  address_line: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long"),

  zipcode: z
    .string()
    .regex(/^\d{4,10}$/, "Zip code must be between 4–10 digits"),

  payment_methods: z
    .array(z.enum(["Cash", "Apple Pay", "Paypal", "Stripe", "Zelle"]))
    .min(1, "Please select at least one payment method"),

profile_image: z
  .any()
  .refine(
    (files) => {
      if (!files || files.length === 0) return true; // no file uploaded is OK (optional)
      const file = files[0];
      return ["image/jpeg", "image/png"].includes(file.type);
    },
    "Only JPG/PNG files are allowed"
  )
  .refine(
    (files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      return file.size <= 10 * 1024 * 1024; // max 10MB
    },
    "Image must be less than 10MB"
  )
  .optional(),
});

export type UpdateProfessionalFormData = z.infer<
  typeof UpdateProfessionalIntroSchema
>;
