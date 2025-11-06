"use client"

import { ColumnDef } from "@tanstack/react-table"
import {  ServiceTypeFormData } from "@/schemas/it-services/category"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"

// Type for API response which includes nested category and subcategory objects
type ServiceTypeResponse = ServiceTypeFormData & {
  category?: {
    id: string
    name: string
  } | string
  subcategory?: {
    id: string
    name: string
  } | string
}

export const getColumns = (
  // eslint-disable-next-line
  onEdit: (serviceType: ServiceTypeFormData) => void,
  // eslint-disable-next-line
  onDelete: (id: string) => void
): ColumnDef<ServiceTypeResponse>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = (row.original as ServiceTypeResponse).category
          // Handle both object and string formats
          if (category && typeof category === 'object' && 'name' in category) {
            return (category as { name: string }).name || '-'
          }
          return typeof category === 'string' ? category : '-'
        },
    },
    {
        accessorKey: "subcategory",
        header: "Sub Category",
        cell: ({ row }) => {
          const subcategory = (row.original as ServiceTypeResponse).subcategory
          // Handle both object and string formats
          if (subcategory && typeof subcategory === 'object' && 'name' in subcategory) {
            return (subcategory as { name: string }).name || '-'
          }
          return typeof subcategory === 'string' ? subcategory : '-'
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const serviceType = row.original
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-amber-500 hover:text-amber-600 cursor-pointer"
                onClick={() => onEdit(serviceType)}
              >
                <Pencil/>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600 cursor-pointer"
                onClick={() => onDelete(serviceType.id || "")}
              >
                <Trash/>
                Delete
              </Button>
            </div>
          )
        },
      },
 
]