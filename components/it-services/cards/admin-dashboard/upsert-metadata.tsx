"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MetadataForm from "../../forms/service/metadata-form"
import { ServiceMetadataFormData } from "@/schemas/it-services/service"

interface MetadataSectionProps {
  selectedMetadata?: ServiceMetadataFormData | null
  // eslint-disable-next-line
  onClose: (isSuccess?: boolean) => void
}

export default function UpsertMetadataSection({ selectedMetadata, onClose }: MetadataSectionProps) {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{selectedMetadata?.id ? "Edit Metadata" : "Add Metadata"}</CardTitle>
          <CardDescription>
            {selectedMetadata?.id ? "Update metadata information" : "Create a new metadata"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onClose(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <MetadataForm onClose={onClose} selectedMetadata={selectedMetadata} />
      </CardContent>
    </Card>
  )
}