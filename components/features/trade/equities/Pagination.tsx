"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, Check } from "lucide-react";
import { ITEMS_PER_PAGE_OPTIONS } from "./types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);
  const dropUpRef = useRef<HTMLDivElement>(null);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Close drop-up when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropUpRef.current &&
        !dropUpRef.current.contains(event.target as Node)
      ) {
        setIsDropUpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate page numbers
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleItemsPerPageChange = (value: number) => {
    onItemsPerPageChange(value);
    onPageChange(1);
    setIsDropUpOpen(false);
  };

  return (
    <div className="flex items-center justify-center gap-54">
      {/* Items count */}
      <span className="text-base font-medium text-dashboard-text-primary font-figtree leading-5">
        Showing{" "}
        <span className="text-dashboard-teal">
          {startItem}-{endItem}
        </span>{" "}
        of {totalItems}
      </span>

      {/* Page numbers */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-9 flex items-center justify-center rounded-md bg-white hover:bg-dashboard-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4 text-dashboard-text-secondary" />
        </button>

        <div className="flex items-center gap-3">
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-8 h-9 flex items-center justify-center rounded-md text-base font-figtree transition-colors ${
                  currentPage === page
                    ? "bg-dashboard-teal text-white font-bold"
                    : "bg-white text-dashboard-text-primary font-semibold hover:bg-dashboard-bg-hover"
                }`}
              >
                {page}
              </button>
            ) : (
              <div
                key={index}
                className="w-8 h-9 flex items-center justify-center rounded-md bg-white text-base font-semibold text-dashboard-text-primary font-figtree"
              >
                {page}
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-9 flex items-center justify-center rounded-md bg-white hover:bg-dashboard-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4 text-dashboard-text-secondary" />
        </button>
      </div>

      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-dashboard-text-primary font-figtree leading-5">
          Row
        </span>
        <div className="relative" ref={dropUpRef}>
          <button
            type="button"
            onClick={() => setIsDropUpOpen(!isDropUpOpen)}
            className="flex items-center gap-1.5 pl-2.5 pr-1 py-2 border border-dashboard-border rounded-md bg-white hover:bg-dashboard-bg-hover transition-colors"
          >
            <span className="text-sm font-medium text-dashboard-text-primary font-figtree leading-5">
              {itemsPerPage} / page
            </span>
            <ChevronUp
              className={`h-5 w-5 text-dashboard-text-secondary transition-transform ${
                isDropUpOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropUpOpen && (
            <div className="absolute bottom-full mb-2 right-0 z-50 w-30 bg-white border border-dashboard-border rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-figtree hover:bg-dashboard-bg-hover transition-colors ${
                    itemsPerPage === option
                      ? "text-dashboard-teal bg-dashboard-bg-hover font-medium"
                      : "text-dashboard-text-primary"
                  }`}
                >
                  <span>{option} / page</span>
                  {itemsPerPage === option && (
                    <Check className="h-4 w-4 text-dashboard-teal" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
