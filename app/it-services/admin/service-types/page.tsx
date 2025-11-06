import { Metadata } from "next"
import ServiceTypeSheet from "@/components/it-services/sheets/admin/service-type"

export const metadata: Metadata = {
  title: 'Service Types Management',
}

export default function ServiceTypes() {
  return <ServiceTypeSheet />
}