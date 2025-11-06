"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { deleteCategory, getCategories } from "@/app/it-services/actions/category"
import { CategoryFormData } from "@/types/it-services/category"
import { getColumns } from "@/components/it-services/tables/columns/category-columns"
import { TableSkeleton } from "@/components/it-services/skeletons/table"
import PageHeader from "@/components/it-services/dashboard/page-header"
import AdvancedTable from "@/components/it-services/utils/advanced-table"
import UpsertCategorySection from "@/components/it-services/cards/admin-dashboard/upsert-category"

export default function CategorySheet() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | null>(null)
  
  const showCategoryForm = searchParams.get("category") !== null
  const categoryId = searchParams.get("id")

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

  // Load category data when edit mode is active
  useEffect(() => {
    if (showCategoryForm && categoryId && categories?.results) {
      const category = (categories.results as CategoryFormData[]).find(
        (cat) => cat.id === categoryId
      )
      if (category) {
        setSelectedCategory(category)
      }
    } else if (showCategoryForm && !categoryId) {
      setSelectedCategory(null)
    }
  }, [showCategoryForm, categoryId, categories])

  const handleClose = async (isSuccess: boolean = false) => {
    if (isSuccess) {
      // Invalidate all category queries, not just the specific one
      await queryClient.invalidateQueries({ queryKey: ["categories"] })
      await queryClient.invalidateQueries({ queryKey: ["all-categories"] })
    }
    // Clear URL params
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("id")
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setSelectedCategory(null)
  }

  const handleEdit = (category: CategoryFormData) => {
    // Set the category immediately so form can populate
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", "edit")
    if (category.id) {
      params.set("id", category.id)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleAddCategory = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", "add")
    router.push(`${pathname}?${params.toString()}`)
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
          onClick: handleAddCategory,
        }}
      />
      
      {showCategoryForm ? (
        <UpsertCategorySection
          selectedCategory={selectedCategory}
          onClose={handleClose}
        />
      ) : (
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
      )}
    </div>
  )
}