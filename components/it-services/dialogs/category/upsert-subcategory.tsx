"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SubCategoryForm from "@/components/it-services/forms/category/subcategory-form"
import { SubCategoryFormData } from "@/schemas/it-services/category"

interface SubCategorySectionProps {
  selectedSubCategory?: SubCategoryFormData | null
  // eslint-disable-next-line
  onClose: (isSuccess?: boolean) => void
}

export default function UpsertSubCategorySection({ selectedSubCategory, onClose }: SubCategorySectionProps) {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{selectedSubCategory?.id ? "Edit Sub Category" : "Add Sub Category"}</CardTitle>
          <CardDescription>
            {selectedSubCategory?.id ? "Update sub category information" : "Create a new sub category"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onClose(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <SubCategoryForm onClose={onClose} selectedCategory={selectedSubCategory} />
      </CardContent>
    </Card>
  )
}