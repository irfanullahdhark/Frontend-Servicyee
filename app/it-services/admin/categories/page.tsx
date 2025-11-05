import { Metadata } from "next"
import CategorySheet from "@/components/it-services/sheets/admin/category"

export const metadata: Metadata = {
  title: 'Category Management',
}

export default function CategoriesPage() {
  return <CategorySheet />
}