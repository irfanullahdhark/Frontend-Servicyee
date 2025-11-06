"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  RefObject,
} from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/it-services/useIntersectionObserver";
import { debounce } from "lodash";
import { DEFAULT_PER_PAGE } from "@/config/it-services/apiConfig";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import React from "react";

interface EmptyComponentProps {
  searchQuery: string;
  onClose: () => void;
}

interface AsyncDropdownProps<T> {
  onSelect: (value: string, option?: T) => void;
  fetchFn: (
    offset: number,
    limit: number,
    search?: string
  ) => Promise<{ results: T[] }>;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  placeholder?: string;
  value?: string;
  isOptionDisabled?: (option: T) => boolean;
  className?: string;
  queryKey: string[];
  emptyMessage?: string;
  EmptyComponent?:
    | React.ComponentType<EmptyComponentProps>
    | React.ReactElement;
  cacheTime?: number;
  initialLabel?: string;
  isPending?: boolean;
}

export function AsyncDropdown<T>({
  onSelect,
  fetchFn,
  getOptionLabel,
  getOptionValue,
  placeholder = "Select an option",
  value,
  isOptionDisabled,
  className = "",
  queryKey,
  emptyMessage = "No options available",
  EmptyComponent,
  cacheTime,
  initialLabel,
  isPending = false,
}: AsyncDropdownProps<T>) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<HTMLDivElement>(null);

  // Track initial organization display label
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(
    initialLabel
  );
  const loadedValueRef = useRef<string | null>(null);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [...queryKey, debouncedQuery],
      initialPageParam: 0,
      queryFn: async ({ pageParam }) => {
        return await fetchFn(pageParam, DEFAULT_PER_PAGE, debouncedQuery);
      },
      getNextPageParam: (lastPage, pages) => {
        const resultsLength = lastPage?.results?.length || 0;
        return resultsLength === DEFAULT_PER_PAGE
          ? pages.length * DEFAULT_PER_PAGE
          : undefined;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      gcTime: cacheTime != null ? cacheTime : 1000 * 60 * 5,
    });

  const allOptions = useMemo(
    () => data?.pages.flatMap((page) => page?.results ?? []) ?? [],
    [data]
  );

  // Load organization if it's not in the current results
  useEffect(() => {
    if (
      value &&
      !allOptions.some((opt) => getOptionValue(opt) === value) &&
      loadedValueRef.current !== value &&
      !isLoading
    ) {
      loadedValueRef.current = value;

      const loadSelectedItem = async () => {
        try {
          const result = await fetchFn(0, 1, value);
          const exactMatch = result.results.find(
            (item) => getOptionValue(item) === value
          );

          if (exactMatch) {
            setSelectedLabel(getOptionLabel(exactMatch));
          }
        } catch (error) {
          console.error("Error loading selected item:", error);
        }
      };

      loadSelectedItem();
    }
  }, [value, allOptions, fetchFn, getOptionLabel, getOptionValue, isLoading]);

  useIntersectionObserver({
    target: scrollTriggerRef as RefObject<HTMLElement>,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage && isOpen,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (query === "") {
        queryClient.setQueryData(
          [...queryKey, ""],
          (data: InfiniteData<{ results: T[] }> | undefined) => ({
            pages: data?.pages.slice(0, 1) ?? [],
            pageParams: data?.pageParams.slice(0, 1) ?? [],
          })
        );
      }

      setSearchQuery(query);
      debouncedSetSearch(query);
      queryClient.cancelQueries({
        queryKey: [...queryKey, debouncedQuery],
      });
    },
    [debouncedSetSearch, queryClient, debouncedQuery, queryKey]
  );

  // Find the selected option for display
  const selectedOption = value
    ? allOptions.find((opt) => getOptionValue(opt) === value)
    : undefined;

  // Display logic with fallbacks
  const displayText = selectedOption
    ? getOptionLabel(selectedOption)
    : value && selectedLabel
    ? selectedLabel
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen && !isPending)}
        className="flex items-center justify-between w-full h-9 px-3 py-2 rounded-md border
                 bg-background text-sm cursor-pointer hover:border-primary transition-colors
                 focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <span
          className={`truncate ${
            isPending &&
            "cursor-not-allowed pointer-events-none text-muted-foreground"
          }`}
        >
          {displayText}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg 
                      ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 animate-in fade-in-0 zoom-in-95"
        >
          <div className="sticky top-0 p-2 border-b bg-background/80 backdrop-blur-sm">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                onClick={(e) => e.stopPropagation()}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <div className="p-2 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-1">
                      <div className="h-4 w-24 animate-pulse bg-muted rounded" />
                      <div className="h-3 w-16 animate-pulse bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allOptions.length > 0 ? (
              <>
                {allOptions.map((option) => (
                  <div
                    key={getOptionValue(option)}
                    onClick={() => {
                      if (!isOptionDisabled?.(option)) {
                        onSelect(getOptionValue(option), option);
                        setSelectedLabel(getOptionLabel(option));
                        setIsOpen(false);
                      }
                    }}
                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors
                              hover:bg-accent/50 active:bg-accent
                              ${
                                value === getOptionValue(option)
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              }
                              ${
                                isOptionDisabled?.(option)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                  >
                    {getOptionLabel(option)}
                  </div>
                ))}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollTriggerRef} className="h-4" />
              </>
            ) : (
              <div className="py-3">
                {typeof EmptyComponent === "function" ? (
                  <EmptyComponent
                    searchQuery={searchQuery}
                    onClose={() => setIsOpen(false)}
                  />
                ) : React.isValidElement(EmptyComponent) ? (
                  React.cloneElement(
                    EmptyComponent as React.ReactElement<EmptyComponentProps>,
                    {
                      searchQuery,
                      onClose: () => setIsOpen(false),
                    }
                  )
                ) : (
                  <div className="text-sm text-center text-muted-foreground">
                    <p className="mt-2">{emptyMessage}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
