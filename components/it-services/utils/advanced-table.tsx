"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import { useState, useMemo, useEffect, ChangeEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/it-services/utils/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteAlert } from "@/components/it-services/utils/delete-alert";

interface AdvancedTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder: string;
  searchColumn: string;
  onDeleteSelected?: (items: T[]) => Promise<void>;
  onRowClick?: (row: T) => void;
  isClickable?: boolean;
  totalCount?: number;
  pageSize?: number;
  pageIndex?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  serverPagination?: boolean;
  serverSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
  loadingSkeleton?: ReactNode;
}

export default function AdvancedTable<TData>({
  columns,
  data,
  searchPlaceholder,
  searchColumn = "",
  onDeleteSelected,
  onRowClick,
  isClickable,
  totalCount = 0,
  pageSize = 10,
  pageIndex = 0,
  onPaginationChange,
  serverPagination = false,
  serverSearch = false,
  searchValue = "",
  onSearchChange,
  isLoading = false,
  loadingSkeleton,
}: AdvancedTableProps<TData>) {
  // Ensure data is always an array, even if undefined
  const safeData = useMemo(() => data || [], [data]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const MotionTableBody = motion(TableBody);
  const MotionTableRow = motion(TableRow);
  // Initialize pagination state
  const [pagination, setPagination] = useState({
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  // Update local search value when prop changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Update local pagination state when props change
  useEffect(() => {
    setPagination({
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data: safeData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // Conditionally use pagination model based on serverPagination flag
    getPaginationRowModel: serverPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: serverSearch ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    // For server pagination, manually control the pagination state
    manualPagination: serverPagination,
    manualFiltering: serverSearch,
    pageCount: serverPagination
      ? Math.ceil(totalCount / pagination.pageSize)
      : undefined,

    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(pagination);
        setPagination(newPagination);
        onPaginationChange?.(newPagination.pageIndex, newPagination.pageSize);
      } else {
        setPagination(updater);
        onPaginationChange?.(updater.pageIndex, updater.pageSize);
      }
    },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Create debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (serverSearch) {
          onSearchChange?.(value);
        } else {
          table.getColumn(searchColumn)?.setFilterValue(value);
        }
      }, 500),
    [serverSearch, onSearchChange, searchColumn, table]
  );
  const pageSizes = [5, 7, 10, 20, 50, 100];

  // Clean up debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleDeleteSelected = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    onDeleteSelected?.(selectedRows);
    setShowDeleteAlert(false);
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1 },
  };

  // Handle search input change
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <motion.div
          className="flex gap-2 items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            placeholder={`Filter ${searchPlaceholder}...`}
            value={localSearchValue}
            onChange={handleSearchInputChange}
            className="max-w-sm text-xs sm:text-sm"
          />
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DeleteAlert
              count={table.getFilteredSelectedRowModel().rows.length}
              open={showDeleteAlert}
              onOpenChange={setShowDeleteAlert}
              onDelete={handleDeleteSelected}
            />
          )}
        </motion.div>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-xs sm:text-sm">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-xs sm:text-sm"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.header as string}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPagination({ pageIndex: 0, pageSize: parseInt(value) });
            }}
          >
            <SelectTrigger className="w-[80px] text-xs sm:text-sm">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()} className="text-xs sm:text-sm">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>
      <motion.div
        className="rounded-md border bg-background/70 dark:bg-gray-950 shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs sm:text-sm">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <AnimatePresence mode="wait">
            <MotionTableBody
              variants={tableVariants}
              initial="hidden"
              animate="show"
            >
              {isLoading && loadingSkeleton ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {loadingSkeleton}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <MotionTableRow
                    key={row.id}
                    variants={rowVariants}
                    data-state={row.getIsSelected() && "selected"}
                    className={`text-xs sm:text-sm ${isClickable && 'cursor-pointer hover:bg-muted/50'}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        data-cell-type={
                          cell.column.id === "actions" ? "action" : "default"
                        }
                        onClick={(e) => {
                          // Get the clicked element and its ancestors
                          const target = e.target as HTMLElement;
                          const selectCell = cell.column.id === "select";
                          const actionCell =
                            target.closest('[data-cell-type="action"]') ||
                            cell.column.id === "actions";
                          const dialog = target.closest(
                            'dialog, [role="dialog"]'
                          );
                          const investDialog =
                            cell.column.id === "user_invested";

                          // Don't trigger row click if:
                          // 1. Clicking an action cell
                          // 2. Clicking within a dialog/modal
                          // 3. Clicking a button or interactive element
                          if (
                            actionCell ||
                            dialog ||
                            selectCell ||
                            target.closest("button") ||
                            target.closest("a") ||
                            target.closest("input") ||
                            target.closest("select") ||
                            investDialog
                          ) {
                            return;
                          }

                          onRowClick?.(row.original);
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </MotionTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </MotionTableBody>
          </AnimatePresence>
        </Table>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <DataTablePagination
          table={table}
          totalCount={serverPagination ? totalCount : undefined}
          serverPagination={serverPagination}
        />
      </motion.div>
    </div>
  );
}
