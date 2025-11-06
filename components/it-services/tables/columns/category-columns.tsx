"use client"

import Image from "next/image"
import { ColumnDef } from "@tanstack/react-table"
import { Trash, Pencil } from "lucide-react"
import { CategoryFormData } from "@/schemas/it-services/category"
import { Button } from "@/components/ui/button"

export const getColumns = (
  // eslint-disable-next-line
  onEdit: (category: CategoryFormData) => void,
  // eslint-disable-next-line
  onDelete: (id: string) => void
): ColumnDef<CategoryFormData>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ cell }) => {
            const icon = cell.getValue() as string
            return (
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <Image src={icon} alt="" width={32} height={32} className="object-cover rounded-full w-full h-full"/>
                </div>
            )
        },
        meta: {

            colSpan: 5
        }
    },
  {
        accessorKey: "image",
        header: "Image",
        cell: ({ cell }) => {
            const icon = cell.getValue() as string
            return (
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <Image src={icon} alt="category icon" width={32} height={32} className="object-cover rounded-full w-full h-full"/>
                </div>
            )
        },
        meta: {

            colSpan: 5
        }
    },
    {
      accessorKey: "is_active",
      header: "Active Status",
    },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-amber-500 hover:text-amber-600 cursor-pointer"
            onClick={() => onEdit(category)}
          >
            <Pencil/>
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:text-red-600 cursor-pointer"
            onClick={() => onDelete(category.id || "")}
          >
            <Trash/>
            Delete
          </Button>
        </div>
      )
    },
  },
]