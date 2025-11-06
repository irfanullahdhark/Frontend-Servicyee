"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { deleteSubCategory, getSubCategories } from "@/app/it-services/actions/category"
import { SubCategoryFormData } from "@/schemas/it-services/category"
import { getColumns } from "@/components/it-services/tables/columns/category-columns"
import { TableSkeleton } from "@/components/it-services/skeletons/table"
import PageHeader from "@/components/it-services/dashboard/page-header"
import AdvancedTable from "@/components/it-services/utils/advanced-table"
import UpsertSubCategorySection from "@/components/it-services/dialogs/category/upsert-subcategory"

export default function SubCategorySheet() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryFormData | null>(null)
  
  const showSubCategoryForm = searchParams.get("subcategory") !== null
  const subCategoryId = searchParams.get("id")

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
        queryClient.invalidateQueries({ queryKey: ["sub-categories"] })
        queryClient.invalidateQueries({ queryKey: ["all-sub-categories"] })
        toast.success("Sub Category deleted successfully")
      }
    },
    onError: (error) => toast.error(error.message)
  })

  // Load sub-category data when edit mode is active
  useEffect(() => {
    if (showSubCategoryForm && subCategoryId && subCategories?.results) {
      const subCategory = (subCategories.results as SubCategoryFormData[]).find(
        (cat) => cat.id === subCategoryId
      )
      if (subCategory) {
        setSelectedSubCategory(subCategory)
      }
    } else if (showSubCategoryForm && !subCategoryId) {
      setSelectedSubCategory(null)
    }
  }, [showSubCategoryForm, subCategoryId, subCategories])

  const handleClose = async (isSuccess: boolean = false) => {
    if (isSuccess) {
      // Invalidate all sub-category queries, not just the specific one
      await queryClient.invalidateQueries({ queryKey: ["sub-categories"] })
      await queryClient.invalidateQueries({ queryKey: ["all-sub-categories"] })
    }
    // Clear URL params
    const params = new URLSearchParams(searchParams.toString())
    params.delete("subcategory")
    params.delete("id")
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setSelectedSubCategory(null)
  }

  const handleEdit = (subCategory: SubCategoryFormData) => {
    // Set the sub-category immediately so form can populate
    setSelectedSubCategory(subCategory)
    const params = new URLSearchParams(searchParams.toString())
    params.set("subcategory", "edit")
    if (subCategory.id) {
      params.set("id", subCategory.id)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleAddSubCategory = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("subcategory", "add")
    router.push(`${pathname}?${params.toString()}`)
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
          onClick: handleAddSubCategory,
        }}
      />
      
      {showSubCategoryForm ? (
        <UpsertSubCategorySection
          selectedSubCategory={selectedSubCategory}
          onClose={handleClose}
        />
      ) : (
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
      )}
    </div>
  )
}