"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { getColumns } from "@/components/it-services/tables/columns/metadata-columns"
import { TableSkeleton } from "@/components/it-services/skeletons/table"
import PageHeader from "@/components/it-services/dashboard/page-header"
import AdvancedTable from "@/components/it-services/utils/advanced-table"
import UpsertMetadataSection from "@/components/it-services/cards/admin-dashboard/upsert-metadata"
import { ServiceMetadataFormData } from "@/schemas/it-services/service"
import { deleteServiceMetadata, getServiceMetadata } from "@/app/it-services/actions/metadata"

export default function  ServiceMetadataSheet() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMetadata, setSelectedMetadata] = useState<ServiceMetadataFormData | null>(null)
  
  const showMetadataForm = searchParams.get("metadata") !== null
  const metadataId = searchParams.get("id")

  const serviceMetadataQueryKey = [
    "service-metadata",
    paginationState.pageIndex,
    paginationState.pageSize,
    searchTerm,
  ]
  const { data: serviceMetadata, isLoading } = useQuery({
    queryKey: serviceMetadataQueryKey,
    queryFn: () =>
      getServiceMetadata<ServiceMetadataFormData>(
        paginationState.pageIndex,
        paginationState.pageSize,
        searchTerm
      ),
    select: (response) => response
  })

  const { mutate: deleteServiceMetadataMutation } = useMutation({
    mutationFn: deleteServiceMetadata,
    onSuccess: (response) => {
      if (response.success) {
      queryClient.invalidateQueries({ queryKey: serviceMetadataQueryKey })
        queryClient.invalidateQueries({ queryKey: ["all-service-metadata"] })
        toast.success("Service metadata deleted successfully")
      }
    },
    onError: (error) => toast.error(error.message)
  })

  // Load metadata data when edit mode is active
  useEffect(() => { 
    if (showMetadataForm && metadataId && serviceMetadata?.results) {
      const metadata = (serviceMetadata.results as ServiceMetadataFormData[]).find(
        (metadata) => metadata.id === metadataId
      )
      if (metadata) {
        setSelectedMetadata(metadata)
      }
    } else if (showMetadataForm && !metadataId) {
      setSelectedMetadata(null)
    }
  }, [showMetadataForm, metadataId, serviceMetadata])

  const handleClose = async (isSuccess: boolean = false) => {
    if (isSuccess) {
      // Invalidate all service-metadata queries, not just the specific one
      await queryClient.invalidateQueries({ queryKey: ["service-metadata"] })
      await queryClient.invalidateQueries({ queryKey: ["all-service-metadata"] })
    }
    // Clear URL params
    const params = new URLSearchParams(searchParams.toString())
    params.delete("metadata")
    params.delete("id")
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setSelectedMetadata(null)
  }

  const handleEdit = (metadata: ServiceMetadataFormData) => {
    setSelectedMetadata(metadata)
    const params = new URLSearchParams(searchParams.toString())
    params.set("metadata", "edit")
    if (metadata.id) {
      params.set("id", metadata.id)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleAddMetadata = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("metadata", "add")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize })
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleDelete = (id: string) => id && deleteServiceMetadataMutation(id)

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-78px)]">
      <PageHeader
        title="Metadata Management"
        description="View and manage Service metadata"
        action={{
          label: "Add Metadata",
          icon: <PlusCircle />,
          onClick: handleAddMetadata,
        }}
      />
      
      {showMetadataForm ? (
        <UpsertMetadataSection
          selectedMetadata={selectedMetadata}
          onClose={handleClose}
        />
      ) : (
        <AdvancedTable<ServiceMetadataFormData>
          columns={getColumns(handleEdit, handleDelete)}
          data={(serviceMetadata?.results as ServiceMetadataFormData[]) || []}
          searchPlaceholder="by name"
          searchColumn="name"
          isLoading={isLoading}
          loadingSkeleton={
            <TableSkeleton columns={3} rows={2} />
          }
          totalCount={serviceMetadata?.count || 0}
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