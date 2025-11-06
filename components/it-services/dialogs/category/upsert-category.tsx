"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryForm from "@/components/it-services/forms/category/category-form"
import { CategoryFormData } from "@/types/it-services/category"

interface CategorySectionProps {
  selectedCategory?: CategoryFormData | null
  // eslint-disable-next-line
  onClose: (isSuccess?: boolean) => void
}

export default function UpsertCategorySection({ selectedCategory, onClose }: CategorySectionProps) {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{selectedCategory?.id ? "Edit Category" : "Add Category"}</CardTitle>
          <CardDescription>
            {selectedCategory?.id ? "Update category information" : "Create a new category"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onClose(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <CategoryForm onClose={onClose} selectedCategory={selectedCategory} />
      </CardContent>
    </Card>
  )
}