import { Metadata } from "next"
import ServiceMetadataSheet from "@/components/it-services/sheets/admin/service-metadata"

export const metadata: Metadata = {
  title: 'Category Management',
}

export default function CategoriesPage() {
  return <ServiceMetadataSheet />
}