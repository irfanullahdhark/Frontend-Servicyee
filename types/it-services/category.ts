import { CategoryFormData, SubCategoryFormData } from "@/schemas/it-services/category";
import { Response } from "@/types/it-services";

export type { CategoryFormData };

export type CategoryResponse = Response<CategoryFormData>;

export type ServiceType = {
    id?:string;
    name: string;
    category: CategoryFormData,
    subcategory: SubCategoryFormData,
};