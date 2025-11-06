"use client"

import { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { deleteSubCategory, getSubCategories } from "@/app/it-services/actions/category"
import { SubCategoryFormData } from "@/schemas/it-services/category"
import { getColumns } from "@/components/it-services/tables/columns/category-columns"
import { TableSkeleton } from "@/components/it-services/skeletons/table"
import PageHeader from "@/components/it-services/dashboard/page-header"
import AdvancedTable from "@/components/it-services/utils/advanced-table"
import UpsertSubCategory from "@/components/it-services/dialogs/category/upsert-subcategory"

export default function SubCategorySheet() {
  const queryClient = useQueryClient()
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryFormData | null>(null)

  const subCategoriesQueryKey = [
    "sub-categories",
    paginationState.pageIndex,
    paginationState.pageSize,
    searchTerm,
  ]
    const { data: subCategories, isLoading } = useQuery({
    queryKey: subCategoriesQueryKey,
    queryFn: () =>
      getSubCategories<SubCategoryFormData>(
        paginationState.pageIndex,
        paginationState.pageSize,
        searchTerm
      ),
    select: (response) => response
  })

  const { mutate: deleteSubCategoryMutation } = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: subCategoriesQueryKey })
        queryClient.invalidateQueries({ queryKey: ["all-sub-categories"] })
        toast.success("Sub Category deleted successfully")
      }
    },
    onError: (error) => toast.error(error.message)
  })

  const handleClose = async (isSuccess: boolean) => {
    if (isSuccess) await queryClient.invalidateQueries({ queryKey: subCategoriesQueryKey })
    setIsDialogOpen(false)
    setSelectedSubCategory(null)
  }

  const handleEdit = (category: SubCategoryFormData) => {
    setIsDialogOpen(true)
    setSelectedSubCategory(category)
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize })
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleDelete = (id: string) => id && deleteSubCategoryMutation(id)

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-78px)]">
      <PageHeader
        title="Sub Category Management"
        description="View and manage Service sub categories"
        action={{
          label: "Add Sub Category",
          icon: <PlusCircle />,
          onClick: () => setIsDialogOpen(true),
        }}
      />
      <AdvancedTable<SubCategoryFormData>
        columns={getColumns(handleEdit, handleDelete)}
        data={(subCategories?.results as SubCategoryFormData[]) || []}
        searchPlaceholder="by name"
        searchColumn="name"
        isLoading={isLoading}
        loadingSkeleton={
          <TableSkeleton columns={3} rows={2} />
        }
        totalCount={subCategories?.count || 0}
        pageSize={paginationState.pageSize}
        pageIndex={paginationState.pageIndex}
        onPaginationChange={handlePaginationChange}
        serverPagination={true}
        serverSearch={true}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <UpsertSubCategory
        isOpen={isDialogOpen}
        selectedSubCategory={selectedSubCategory}
        onClose={handleClose}
      />
    </div>
  )
}