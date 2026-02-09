"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SvgIcon } from "@/components/ui/svg-icon";
import FilterIcon from "@/assets/images/filters.svg";
import { ActiveFilter } from "./types";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (key: string) => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  onOpenFilters,
  activeFilters,
  onRemoveFilter,
}: SearchAndFiltersProps) {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Search Row */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
        <div className="relative w-[471px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-dashboard-text-secondary/85" />
          <Input
            type="text"
            placeholder="Search markets"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-5 h-10 bg-white border-dashboard-border-input rounded-md text-lg placeholder:text-dashboard-text-secondary/85 placeholder:tracking-tight font-figtree focus-visible:ring-1 focus-visible:ring-dashboard-teal/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-text-muted hover:text-dashboard-text-secondary transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Advanced Filters Button */}
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-2.5 h-10 w-[181px] px-5 py-3 bg-white border-2 border-dashboard-border rounded-lg hover:bg-dashboard-bg-hover transition-colors justify-center"
        >
          <SvgIcon src={FilterIcon} size="md" alt="Filter" />
          <span className="text-base font-medium text-dashboard-text-primary font-figtree tracking-tight whitespace-nowrap">
            Advanced Filters
          </span>
        </button>
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="flex items-center gap-4 flex-wrap">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center gap-2 h-8 pl-2 pr-1.5 py-2 bg-dashboard-accent-blue-bg/60 rounded-md"
            >
              <span className="text-sm font-medium text-dashboard-accent-blue font-figtree">
                {filter.label}
              </span>
              <button
                type="button"
                onClick={() => onRemoveFilter(filter.key)}
                className="flex items-center justify-center w-3.5 h-3.5 text-dashboard-accent-blue hover:text-dashboard-accent-blue-dark transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
