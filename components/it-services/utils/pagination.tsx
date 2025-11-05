import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table"

interface DataTablePaginationProps<TData> {
    table: Table<TData>,
    totalCount?: number,
    serverPagination?: boolean
}

export function DataTablePagination<TData>({
                                               table,
                                               totalCount,
                                               serverPagination = false
                                           }: DataTablePaginationProps<TData>) {
    // Calculate values for server pagination
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = serverPagination
        ? Math.ceil((totalCount || 0) / pageSize)
        : table.getPageCount();

    return (
        <div className="flex items-center w-full justify-between space-x-2 py-4">
            <div className="flex text-muted-foreground text-xs sm:text-sm">
                {serverPagination
                    ? `Showing ${pageIndex * pageSize + 1}-${Math.min((pageIndex + 1) * pageSize, totalCount || 0)} of ${totalCount} item(s)`
                    : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getRowCount()} row(s) selected.`
                }
            </div>
            <div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => !table.getCanPreviousPage() || table.previousPage()}
                                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "select-none cursor-pointer"}
                            />
                        </PaginationItem>
                        {(() => {
                            const currentPage = pageIndex + 1;
                            const pages = [];
                            const showEllipsis = pageCount > 7;

                            if (showEllipsis) {
                                if (currentPage <= 4) {
                                    // Show first 5 pages, ellipsis, and last page
                                    for (let i = 1; i <= 5; i++) pages.push(i);
                                    pages.push("ellipsis");
                                    pages.push(pageCount);
                                } else if (currentPage >= pageCount - 3) {
                                    // Show first page, ellipsis, and last 5 pages
                                    pages.push(1);
                                    pages.push("ellipsis");
                                    for (let i = pageCount - 4; i <= pageCount; i++) pages.push(i);
                                } else {
                                    // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
                                    pages.push(1);
                                    pages.push("ellipsis");
                                    pages.push(currentPage - 1);
                                    pages.push(currentPage);
                                    pages.push(currentPage + 1);
                                    pages.push("ellipsis");
                                    pages.push(pageCount);
                                }
                            } else {
                                // Show all pages if total pages are 7 or less
                                for (let i = 1; i <= pageCount; i++) pages.push(i);
                            }

                            return pages.map((pageNumber, index) => {
                                if (pageNumber === "ellipsis") {
                                    return (
                                        <PaginationItem key={`ellipsis-${index}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            size="sm"
                                            onClick={() => table.setPageIndex(+pageNumber - 1)}
                                            isActive={currentPage === pageNumber}
                                            className={cn(currentPage === pageNumber ? "bg-primary/20 text-primary hover:bg-primary/90 hover:text-white" : "",
                                                "rounded-md border-none select-none cursor-pointer"
                                            )}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            });
                        })()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => !table.getCanNextPage() || table.nextPage()}
                                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : " cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}