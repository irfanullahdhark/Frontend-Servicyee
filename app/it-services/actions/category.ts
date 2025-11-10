'use server'

// import { fetchAPI } from "@/lib/api"
import {CategoryFormData, ServiceTypeFormData, SubCategoryFormData} from "@/schemas/it-services/category"
import { PaginatedResponse } from "@/types/it-services"
import { CategoryResponse } from "@/types/it-services/category"


const BASE_URL =  process.env.API_URL 
const CATEGORY_URL = `${BASE_URL}/api/v1/category/`
const CATEGORY_LIST_URL = `${BASE_URL}/api/v1/category-list/`
const SUB_CATEGORY_URL = `${BASE_URL}/api/v1/subcategory/`
const SERVICE_TYPE_URL = `${BASE_URL}/api/v1/service-type/`
const SUBCATEGORY_LIST_URL = `${BASE_URL}/api/v1/subcategory-list/`
const SERVICE_TYPE_LIST_URL = `${BASE_URL}/api/v1/service-type-list/`



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

export const getPublicCategories = async (limit: number, offset: number, search?: string): Promise<CategoryResponse> =>
{
    let params = `?limit=${limit}&offset=${offset}`
    if (search) params += `&search=${encodeURIComponent(search)}`
    const response = await fetch(CATEGORY_LIST_URL + params, { cache: 'no-store' })
    // If response.data is undefined, return a default CategoryResponse object
    if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to load categories')
    }
    const json = await response.json()
    return json;
}

export const upsertCategory = async (data: CategoryFormData) => {
    const isUpdate = !!data.id
    const url = isUpdate ? CATEGORY_URL + `${data.id}/` : CATEGORY_URL
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
        method: isUpdate ? "PATCH" : "POST",
        body: formData,
    })

    if (!response.ok) {
        throw new Error(await response.json().then(data => data.detail));
    }

    return (await response.json()) as CategoryFormData
}

export const deleteCategory = async (id:string) =>
    {
        const resp = await fetch(CATEGORY_URL + `${id}/`, {
            method: "DELETE",
        })
       
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        
        // these line will replace with fetchApi
        // Check if response has content before parsing JSON
        const contentType = resp.headers.get("content-type");
        let response = null;
        if (contentType && contentType.includes("application/json")) {
            const text = await resp.text();
            response = text ? JSON.parse(text) : null;
        }
        
        return {success: resp.ok, data: response , error: null} ;
    }



export const getSubCategories = async <T>(page: number, pageSize: number, search?: string) => {
    const params = `?page=${page + 1}&page_size=${pageSize}&search=${encodeURIComponent(search ?? "")}`
    const url = SUB_CATEGORY_URL + params
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to load sub categories')
    }
    const json = await response.json()
    return json as PaginatedResponse<T>
}


export const getPublicSubCategories = async (limit: number, offset: number, search?: string): Promise<CategoryResponse> =>
{
    let params = `?limit=${limit}&offset=${offset}`
    if (search) params += `&search=${encodeURIComponent(search)}`
    const response = await fetch(SUBCATEGORY_LIST_URL + params, { cache: 'no-store' })
    if (!response.ok) {
        throw new Error(await response.json().then(data => data.detail));
        }
    const json = await response.json()
    return json;
}

export const upsertSubCategory = async (data: SubCategoryFormData) => {
    const isUpdate = !!data.id
    const url = isUpdate ? SUB_CATEGORY_URL + `${data.id}/` : SUB_CATEGORY_URL
    const formData = new FormData();
  
    formData.append("category", data.category || "");
    formData.append("name", data.name);
  
    if (typeof data.description === "string")
      formData.append("description", data.description);
  
    if (typeof (data as any).has_service_type !== "undefined" && (data as any).has_service_type !== null) {
      formData.append("has_service_type", String((data as any).has_service_type));
    }
  
    if (typeof window !== "undefined") {
      if (data.icon instanceof File) formData.append("icon", data.icon);
      if (data.image instanceof File) formData.append("image", data.image);
    } else {
      // @ts-ignore - for Node.js or SSR
      if (data.icon && typeof (data.icon as any).arrayBuffer === "function")
        formData.append("icon", data.icon as any);
      // @ts-ignore
      if (data.image && typeof (data.image as any).arrayBuffer === "function")
        formData.append("image", data.image as any);
    }
  

    const response = await fetch(url, {
      method: isUpdate ? "PATCH" : "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.json().then(data => data.detail));
    }
  
    return (await response.json()) as CategoryFormData;
  };
  


export const deleteSubCategory = async (id:string) =>
{
    const resp = await fetch(SUB_CATEGORY_URL + `${id}/`, {
        method: "DELETE",
    })
   
    if (!resp.ok) {
        throw new Error(resp.statusText);
    }
    
    // these line will replace with fetchApi
    // Check if response has content before parsing JSON
    const contentType = resp.headers.get("content-type");
    let response = null;
    if (contentType && contentType.includes("application/json")) {
        const text = await resp.text();
        response = text ? JSON.parse(text) : null;
    }
    
    return {success: resp.ok, data: response , error: null} ;
}




export const getPublicServiceTypes = async (subcategoryId: string, limit: number, offset: number, search?: string): Promise<CategoryResponse> =>
{
    let params = `?subcategory_id=${subcategoryId}&limit=${limit}&offset=${offset}`
    if (search) params += `&search=${encodeURIComponent(search)}`
    const response = await fetch(SERVICE_TYPE_LIST_URL + params, { cache: 'no-store' })
    if (!response.ok) {
        throw new Error(await response.json().then(data => data.detail));
        }
    const json = await response.json()
    return json;
}

export const getServiceTypes = async <T>(page: number, pageSize: number, search?: string) => {
    const params = `?page=${page + 1}&page_size=${pageSize}&search=${encodeURIComponent(search ?? "")}`
    const url = SERVICE_TYPE_URL + params
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to load service types')
    }
    const json = await response.json()
    return json as PaginatedResponse<T>
}

export const upsertServiceType = async (data: ServiceTypeFormData) => {
    const isUpdate = !!data.id
    const url = isUpdate ? SERVICE_TYPE_URL + `${data.id}/` : SERVICE_TYPE_URL
    const formData = new FormData();
  
    formData.append("subcategory", data.subcategory || "");
    formData.append("name", data.name);
    
    const response = await fetch(url, {
      method: isUpdate ? "PATCH" : "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.json().then(data => data.detail));
    }
  
    return (await response.json()) as ServiceTypeFormData;
  };


export const deleteServiceType = async (id:string) =>
{
    const resp = await fetch(SERVICE_TYPE_URL + `${id}/`, {
        method: "DELETE",
    })
    
    if (!resp.ok) {
        throw new Error(resp.statusText);
    }
    
    // these line will replace with fetchApi
    // Check if response has content before parsing JSON
    const contentType = resp.headers.get("content-type");
    let response = null;
    if (contentType && contentType.includes("application/json")) {
        const text = await resp.text();
        response = text ? JSON.parse(text) : null;
    }
    
    return {success: resp.ok, data: response , error: null} ;
}