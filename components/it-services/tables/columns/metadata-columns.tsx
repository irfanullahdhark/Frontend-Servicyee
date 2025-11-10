"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceMetadataFormData } from "@/schemas/it-services/service"
import { ServiceTypeFormData, SubCategoryFormData } from "@/schemas/it-services/category"


export const getColumns = (
    // eslint-disable-next-line
    onEdit: (metadata: ServiceMetadataFormData) => void,
    // eslint-disable-next-line
  onDelete: (id: string) => void
): ColumnDef<ServiceMetadataFormData>[] => [
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ cell }) => (cell.getValue() as SubCategoryFormData)?.name || "—",
  },
  {
    accessorKey: "service_type",
    header: "Service Type",
    cell: ({ cell }) => (cell.getValue() as ServiceTypeFormData)?.name || "—",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "field_type",
    header: "Field Type",
    cell: ({ cell }) => {
      const value = cell.getValue() as string
      return value === "checkbox" ? "Checkbox" : "Dropdown"
    },
  },
  {
    accessorKey: "is_required",
    header: "Required",
    cell: ({ cell }) => {
      const value = cell.getValue() as boolean
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const metadata = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-amber-500 hover:text-amber-600 cursor-pointer"
            onClick={() => onEdit(metadata)}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:text-red-600 cursor-pointer"
            onClick={() => onDelete(metadata.id || "")}
          >
            <Trash />
            Delete
          </Button>
        </div>
      )
    },
  },
]
