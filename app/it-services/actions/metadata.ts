'use server'

// import { fetchAPI } from "@/lib/api"
import { ServiceMetadataFormData } from "@/schemas/it-services/service"
import { PaginatedResponse } from "@/types/it-services"


const BASE_URL =  process.env.API_URL 
const SERVICE_METADATA_URL = `${BASE_URL}/api/v1/service-metadata/`



export const getServiceMetadata = async <T>(page: number, pageSize: number, search?: string) => {
    const params = `?page=${page + 1}&page_size=${pageSize}&search=${encodeURIComponent(search ?? "")}`
    const url = SERVICE_METADATA_URL + params
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to load service metadata')
    }
    const json = await response.json()
    return json as PaginatedResponse<T>
}

// export const getPublicCategories = async (limit: number, offset: number, search?: string): Promise<CategoryResponse> =>
// {
//     let params = `?limit=${limit}&offset=${offset}`
//     if (search) params += `&search=${encodeURIComponent(search)}`
//     const response = await fetch(CATEGORY_LIST_URL + params, { cache: 'no-store' })
//     // If response.data is undefined, return a default CategoryResponse object
//     if (!response.ok) {
//         const text = await response.text().catch(() => '')
//         throw new Error(text || 'Failed to load categories')
//     }
//     const json = await response.json()
//     return json;
// }

export const upsertMetadata = async (data: ServiceMetadataFormData) => {
    const isUpdate = !!data.id
    const url = isUpdate ? SERVICE_METADATA_URL + `${data.id}/` : SERVICE_METADATA_URL
    const formData = new FormData()


    // service_type can be undefined or null, only append if defined
    if (typeof data.service_type === "string" && data.service_type.trim() !== "") {
      formData.append("service_type", data.service_type)
    } else if (data.service_type === null) {
      formData.append("service_type", "")
    }
    formData.append("subcategory", data.subcategory)
    formData.append("name", data.name)
    formData.append("title", data.title)
    formData.append("field_type", data.field_type)
    if (typeof (data as any).is_required !== 'undefined') {
        formData.append("is_required", String((data as any).is_required))
    }
    if (Array.isArray(data.choices)) {
        data.choices
          .filter((choice): choice is string => typeof choice === "string" && choice.trim() !== "")
          .forEach((choice) => {
            formData.append("choices", choice)
          })
    }

    const response = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        body: formData,
    })

    if (!response.ok) {
        throw new Error(await response.json().then(data => data.detail));
    }

    return (await response.json()) as ServiceMetadataFormData
}

export const deleteServiceMetadata = async (id:string) =>
    {
        const resp = await fetch(SERVICE_METADATA_URL + `${id}/`, {
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
