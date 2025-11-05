import { PaginatedResponse } from "./";
  
export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface  Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[]; 
}

export interface CategoryResponse extends PaginatedResponse {
  results: Category[];
}

export interface CategoryFormData {
  id?: string;
  name: string;
  icon?: File | null;
}