"use client"

import { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { deleteCategory, getCategories } from "@/app/it-services/actions/category"
import { CategoryFormData } from "@/types/it-services/category"
import { getColumns } from "@/components/it-services/tables/columns/category-columns"
import { TableSkeleton } from "@/components/it-services/skeletons/table"
import PageHeader from "@/components/it-services/dashboard/page-header"
import AdvancedTable from "@/components/it-services/utils/advanced-table"
import UpsertCategoryDialog from "@/components/it-services/dialogs/category/upsert-category"

export default function CategorySheet() {
  const queryClient = useQueryClient()
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | null>(null)

  const categoriesQueryKey = [
    "categories",
    paginationState.pageIndex,
    paginationState.pageSize,
    searchTerm,
  ]
  const { data: categories, isLoading } = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: () =>
      getCategories<CategoryFormData>(
        paginationState.pageIndex,
        paginationState.pageSize,
        searchTerm
      ),
    select: (response) => response
  })

  const { mutate: deleteCategoryMutation } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      if (response.success) {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
        queryClient.invalidateQueries({ queryKey: ["all-categories"] })
        toast.success("Category deleted successfully")
      }
    },
    onError: (error) => toast.error(error.message)
  })

  const handleClose = async (isSuccess: boolean) => {
    if (isSuccess) await queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
    setIsDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleEdit = (category: CategoryFormData) => {
    setIsDialogOpen(true)
    setSelectedCategory(category)
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize })
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleDelete = (id: string) => id && deleteCategoryMutation(id)

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-78px)]">
      <PageHeader
        title="Category Management"
        description="View and manage Service categories"
        action={{
          label: "Add Category",
          icon: <PlusCircle />,
          onClick: () => setIsDialogOpen(true),
        }}
      />
      <AdvancedTable<CategoryFormData>
        columns={getColumns(handleEdit, handleDelete)}
        data={(categories?.results as CategoryFormData[]) || []}
        searchPlaceholder="by name"
        searchColumn="name"
        isLoading={isLoading}
        loadingSkeleton={
          <TableSkeleton columns={3} rows={2} />
        }
        totalCount={categories?.count || 0}
        pageSize={paginationState.pageSize}
        pageIndex={paginationState.pageIndex}
        onPaginationChange={handlePaginationChange}
        serverPagination={true}
        serverSearch={true}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <UpsertCategoryDialog
        isOpen={isDialogOpen}
        selectedCategory={selectedCategory}
        onClose={handleClose}
      />
    </div>
  )
}