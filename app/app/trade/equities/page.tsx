"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { getAppRoute } from "@/lib/utils";
import { useEquitiesData } from "@/hooks/useEquitiesData";
import {
  CategoryTabs,
  SearchAndFilters,
  AdvancedFiltersModal,
  EquitiesTable,
  Pagination,
} from "@/components/features/trade/equities";

export default function EquitiesPage() {
  const router = useRouter();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    paginatedEquities,
    loading,
    refreshing,
    loading7d,
    loadingYTD,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    filters,
    setFilters,
    activeFilterLabels,
    handleApplyFilters,
    handleClearFilters,
    removeFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    handleRefresh,
  } = useEquitiesData();

  const handleSelectEquity = (ticker: string) => {
    router.push(getAppRoute(`/app/trade?ticker=${ticker}`));
  };

  const onApplyFilters = () => {
    handleApplyFilters();
    setIsFilterModalOpen(false);
  };

  return (
    <div className="space-y-6 font-figtree">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold text-dashboard-text-heading tracking-tight">
            Trade
          </h1>
          <p className="text-base text-dashboard-text-secondary font-normal">
            Discover markets and place trades with real-time data
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-dashboard-border rounded-md bg-white hover:bg-dashboard-bg-hover transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 text-dashboard-text-secondary ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          <span className="text-sm font-medium text-dashboard-text-heading">
            Refresh
          </span>
        </button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        activeFilters={activeFilterLabels}
        onRemoveFilter={removeFilter}
      />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-dashboard-text-muted" />
          <span className="ml-2 text-dashboard-text-secondary">
            Loading equities...
          </span>
        </div>
      ) : paginatedEquities.length === 0 ? (
        <div className="text-center py-12 text-dashboard-text-secondary">
          {searchTerm ? (
            <>No equities found matching &quot;{searchTerm}&quot;</>
          ) : (
            <>No equities available</>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {/* Table */}
          <EquitiesTable
            equities={paginatedEquities}
            loading7d={loading7d}
            loadingYTD={loadingYTD}
            onSelectEquity={handleSelectEquity}
          />

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>
      )}

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={onApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}
