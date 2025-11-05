'use server'

// import { fetchAPI } from "@/lib/api"
import {CategoryFormData} from "@/schemas/it-services/category"
import { PaginatedResponse, Response } from "@/types/it-services"
import { CategoryResponse } from "@/types/it-services/category"

const BASE_URL =  process.env.API_URL 
const CATEGORY_URL = `${BASE_URL}/api/v1/category/`

export const getCategories = async <T>(page: number, pageSize: number, search?: string) => {
    const params = `?page=${page + 1}&page_size=${pageSize}&search=${encodeURIComponent(search ?? "")}`
    const url = CATEGORY_URL + params
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to load categories')
    }
    const json = await response.json()
    return json as PaginatedResponse<T>
}

export const getPublicCategories = async (): Promise<CategoryResponse> =>
{

    return {} as CategoryResponse
}

export const upsertCategory = async (data: CategoryFormData) => {
    const url = `${CATEGORY_URL}`
    const formData = new FormData()

    // text fields
    formData.append("name", data.name)
    if (typeof data.description === 'string') formData.append("description", data.description)
    if (typeof (data as any).is_active !== 'undefined') {
        formData.append("is_active", String((data as any).is_active))
    }
    // faqs as JSON string
    if (Array.isArray(data.faqs)) {
        formData.append("faqs", JSON.stringify(data.faqs))
    }
    // files (only append when File)
    if (typeof window !== 'undefined') {
        if (data.icon instanceof File) formData.append('icon', data.icon)
        if (data.image instanceof File) formData.append('image', data.image)
    } else {
        // @ts-ignore
        if (data.icon && typeof (data.icon as any).arrayBuffer === 'function') formData.append('icon', data.icon as any)
        // @ts-ignore
        if (data.image && typeof (data.image as any).arrayBuffer === 'function') formData.append('image', data.image as any)
    }

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        throw new Error("Failed to upsert category");
    }

    return (await response.json()) as CategoryFormData
}

export const deleteCategory = async (id:string) =>
{
    const response = await fetch(CATEGORY_URL + `${id}/`, {
        method: "DELETE",
    })

    if (!response.ok) {
        throw new Error("Failed to upsert category");
    }

    return await response.json()
}