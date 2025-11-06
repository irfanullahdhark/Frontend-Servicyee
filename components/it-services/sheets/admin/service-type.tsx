"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { deleteServiceType, getServiceTypes } from "@/app/it-services/actions/category"
import { ServiceTypeFormData} from "@/schemas/it-services/category"
import { getColumns } from "@/components/it-services/tables/columns/service-type-columns"
import { TableSkeleton } from "@/components/it-services/skeletons/table"
import PageHeader from "@/components/it-services/dashboard/page-header"
import AdvancedTable from "@/components/it-services/utils/advanced-table"
import UpsertServiceTypeSection from "@/components/it-services/cards/admin-dashboard/upsert-service-type"

export default function ServiceTypeSheet() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceTypeFormData | null>(null)
  
  const showServiceTypeForm = searchParams.get("servicetype") !== null
  const serviceTypeId = searchParams.get("id")

  const serviceTypesQueryKey = [
    "service-types",
    paginationState.pageIndex,
    paginationState.pageSize,
    searchTerm,
  ]
    const { data: serviceTypes, isLoading } = useQuery({
    queryKey: serviceTypesQueryKey,
    queryFn: () =>
      getServiceTypes<ServiceTypeFormData>(
        paginationState.pageIndex,
        paginationState.pageSize,
        searchTerm
      ),
    select: (response) => response
  })

  const { mutate: deleteServiceTypeMutation } = useMutation({
    mutationFn: deleteServiceType,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["service-types"] })
        queryClient.invalidateQueries({ queryKey: ["all-service-types"] })
        toast.success("Service type deleted successfully")
      }
    },
    onError: (error) => toast.error(error.message)
  })

  // Load service types data when edit mode is active
  useEffect(() => {
    if (showServiceTypeForm && serviceTypeId && serviceTypes?.results) {
      const serviceType = (serviceTypes.results as ServiceTypeFormData[]).find(
        (cat) => cat.id === serviceTypeId
      )
      if (serviceType) {
        setSelectedServiceType(serviceType)
      }
    } else if (showServiceTypeForm && !serviceTypeId) {
      setSelectedServiceType(null)
    }
  }, [showServiceTypeForm, serviceTypeId, serviceTypes])

  const handleClose = async (isSuccess: boolean = false) => {
    if (isSuccess) {
      // Invalidate all service-types queries, not just the specific one
      await queryClient.invalidateQueries({ queryKey: ["service-types"] })
      await queryClient.invalidateQueries({ queryKey: ["all-service-types"] })
    }
    // Clear URL params
    const params = new URLSearchParams(searchParams.toString())
    params.delete("servicetype")
    params.delete("id")
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setSelectedServiceType(null)
  }

  const handleEdit = (serviceType: ServiceTypeFormData) => {
    // Set the service-types immediately so form can populate
    setSelectedServiceType(serviceType)
    const params = new URLSearchParams(searchParams.toString())
    params.set("servicetype", "edit")
    if (serviceType.id) {
      params.set("id", serviceType.id)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleAddServiceType = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("servicetype", "add")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize })
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleDelete = (id: string) => id && deleteServiceTypeMutation(id)

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-78px)]">
      <PageHeader
        title="Service Type Management"
        description="View and manage Service Type"
        action={{
          label: "Add Service Type",
          icon: <PlusCircle />,
          onClick: handleAddServiceType,
        }}
      />
      
      {showServiceTypeForm ? (
        <UpsertServiceTypeSection
          selectedServiceType={selectedServiceType}
          onClose={handleClose}
        />
      ) : (
        <AdvancedTable<ServiceTypeFormData>
          columns={getColumns(handleEdit, handleDelete)}
          data={(serviceTypes?.results as ServiceTypeFormData[]) || []}
          searchPlaceholder="by name"
          searchColumn="name"
          isLoading={isLoading}
          loadingSkeleton={
            <TableSkeleton columns={3} rows={2} />
          }
          totalCount={serviceTypes?.count || 0}
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