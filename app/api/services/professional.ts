import { toast } from "sonner";
import apiClient from "../axios";
import { ProfessionalFormData } from "@/schemas/professional/professional";

export interface ProfessionalDetails {
  id: string;
  business_name: string;
  founded_year: number;
  employees: number;
  website?: string;
  address_line?: string;
  zipcode?: string;
  payment_methods: ("Cash" | "Apple Pay" | "Paypal" | "Stripe" | "Zelle")[];
  profile_image?: string; // URL of uploaded image
}

export type Professional = {
  id: string;
  introduction: string;
};
export const getProfessionalById = async () => {
  try {
    const response = await apiClient.get("/professionals/pro");
    return response.data;
  } catch (error) {
    toast.error(`Error fetching professional data:", ${error}`);
    throw error;
  }
};

export const updateProfessional = async (
  id: string,
  data: ProfessionalFormData
): Promise<Professional> => {
  try {
    const response = await apiClient.put(`/professionals/${id}`, data);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to update professional";
    toast.error(message);
    throw new Error(message);
  }
};

export const updateProfessionalDetails = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ProfessionalDetails> & { profile_image?: File | string };
}): Promise<ProfessionalDetails> => {
  const formData = new FormData();
  console.log(data);

  (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      if (key === "payment_methods") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "profile_image" && value instanceof File) {
        formData.append("profile_image", value);
      } else {
        formData.append(key, value as string); 
      }
    }
  });
  const response = await apiClient.put(`/api/professionals/${id}`, formData);
  return response.data;
};