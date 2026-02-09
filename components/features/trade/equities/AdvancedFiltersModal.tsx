"use client";

import { useEffect, useRef } from "react";
import { X, SlidersHorizontal, Clock } from "lucide-react";
import { FilterState } from "./types";

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

interface FilterRowProps {
  icon: React.ReactNode;
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

function FilterRow({
  icon,
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: FilterRowProps) {
  return (
    <div className="flex items-end justify-between gap-5">
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 text-dashboard-text-primary">{icon}</span>
          <span className="text-base font-medium text-dashboard-text-primary font-figtree">
            {label}
          </span>
        </div>
        <input
          type="text"
          placeholder="Min."
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full p-3 border border-dashboard-border-input rounded-lg text-sm text-dashboard-text-primary placeholder:text-dashboard-text-hint font-figtree focus:outline-none focus:border-dashboard-accent-blue-light"
        />
      </div>
      <div className="flex flex-col flex-1">
        <input
          type="text"
          placeholder="Max."
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-full p-3 border border-dashboard-border-input rounded-lg text-sm text-dashboard-text-primary placeholder:text-dashboard-text-hint font-figtree focus:outline-none focus:border-dashboard-accent-blue-light"
        />
      </div>
    </div>
  );
}

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply,
  onClear,
}: AdvancedFiltersModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg w-[580px] max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dashboard-border-modal">
          <h2 className="text-xl font-semibold text-dashboard-text-primary font-figtree">
            Advanced Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-6.5 flex items-center justify-center bg-dashboard-bg-subtle rounded hover:bg-dashboard-border transition-colors"
            aria-label="Close filters"
          >
            <X className="h-4 w-4 text-dashboard-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <FilterRow
              icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              label="Market Cap (Billions $)"
              minValue={filters.marketCapMin}
              maxValue={filters.marketCapMax}
              onMinChange={(v) => handleInputChange("marketCapMin", v)}
              onMaxChange={(v) => handleInputChange("marketCapMax", v)}
            />

            <FilterRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="24h Change (%)"
              minValue={filters.change24hMin}
              maxValue={filters.change24hMax}
              onMinChange={(v) => handleInputChange("change24hMin", v)}
              onMaxChange={(v) => handleInputChange("change24hMax", v)}
            />

            <FilterRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="7d Change (%)"
              minValue={filters.change7dMin}
              maxValue={filters.change7dMax}
              onMinChange={(v) => handleInputChange("change7dMin", v)}
              onMaxChange={(v) => handleInputChange("change7dMax", v)}
            />

            <FilterRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="1 Month Change (%)"
              minValue={filters.change1mMin}
              maxValue={filters.change1mMax}
              onMinChange={(v) => handleInputChange("change1mMin", v)}
              onMaxChange={(v) => handleInputChange("change1mMax", v)}
            />

            <FilterRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="3 Month Change (%)"
              minValue={filters.change3mMin}
              maxValue={filters.change3mMax}
              onMinChange={(v) => handleInputChange("change3mMin", v)}
              onMaxChange={(v) => handleInputChange("change3mMax", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dashboard-border-modal">
          <button
            type="button"
            onClick={onClear}
            className="h-9 px-4 py-2 bg-white border border-dashboard-accent-blue-light rounded-xl text-[13px] font-semibold text-dashboard-accent-blue font-figtree hover:bg-dashboard-bg-light-blue transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onApply}
            className="h-9 px-4 py-2 bg-dashboard-teal border border-dashboard-teal-dark rounded-xl text-[13px] font-semibold text-white font-figtree hover:bg-dashboard-teal-hover transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
