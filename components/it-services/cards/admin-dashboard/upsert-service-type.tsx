"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ServiceTypeForm from "@/components/it-services/forms/category/servicetype-form"
import { ServiceTypeFormData } from "@/schemas/it-services/category"

interface ServoceTypeSectionProps {
  selectedServiceType?: ServiceTypeFormData | null
  // eslint-disable-next-line
  onClose: (isSuccess?: boolean) => void
}

export default function UpsertServiceTypeSection({ selectedServiceType, onClose }: ServoceTypeSectionProps) {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{selectedServiceType?.id ? "Edit Sevice Type" : "Add Service Type"}</CardTitle>
          <CardDescription>
            {selectedServiceType?.id ? "Update Service Type information" : "Create a new service type"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onClose(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ServiceTypeForm onClose={onClose} selectedServiceType={selectedServiceType} />
      </CardContent>
    </Card>
  )
}