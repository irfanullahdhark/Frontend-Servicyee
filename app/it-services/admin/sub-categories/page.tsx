import { Metadata } from "next"
import SubCategorySheet from "@/components/it-services/sheets/admin/sub-categories"

export const metadata: Metadata = {
  title: 'Sub Management',
}

export default function SubCategory() {
  return <SubCategorySheet />
}