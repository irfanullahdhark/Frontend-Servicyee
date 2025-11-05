'use server'

// import { fetchAPI } from "@/lib/api"
import { CategoryFormData, CategoryResponse } from "@/types/it-services/category"
import { PaginatedResponse, Response } from "@/types/it-services"

const CATEGORY_URL = "/jobs/categories/"
const PAGINATED_CATEGORY_URL = "/jobs/public_categories/"

export const getCategories = async <T>(page: number, pageSize: number, search?: string): Promise<Response<T>> =>
{
    return {} as  Response<T>
}

export const getPublicCategories = async (limit: number, offset: number, search?: string): Promise<CategoryResponse> =>
{
    return {} as CategoryResponse
}

export const upsertCategory = async (data: CategoryFormData) =>
{
    return {} as CategoryFormData
}

export const deleteCategory = async (id: string) =>
{
    return true
}