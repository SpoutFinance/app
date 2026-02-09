"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, Check } from "lucide-react";

type Holding = {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  dayChange: number;
  totalReturn: number;
  allocation: number;
};

type PortfolioHoldingsProps = {
  holdings: Holding[];
  formatNumber: (num: number) => string;
};

// Sample asset logos/icons mapping
const assetLogos: Record<string, string> = {
  TSLA: "/assets/logos/tsla.png",
  AAPL: "/assets/logos/aapl.png",
  NVDA: "/assets/logos/nvda.png",
  NFLX: "/assets/logos/nflx.png",
  ORCL: "/assets/logos/orcl.png",
  MSFT: "/assets/logos/msft.png",
  LQD: "/SLQD.png",
  USDC: "/assets/logos/usdc.png",
};

// Asset icon colors
const assetColors: Record<string, string> = {
  TSLA: "#cc0000",
  AAPL: "#555555",
  NVDA: "#76b900",
  NFLX: "#e50914",
  ORCL: "#f80000",
  MSFT: "#00a4ef",
  LQD: "#004a4a",
  USDC: "#2775ca",
  GOLD: "#ffd700",
};

// Format currency
const formatCurrency = (num: number) => {
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Asset icon component
function AssetIcon({ symbol, name }: { symbol: string; name: string }) {
  const color = assetColors[symbol] || "#004a4a";

  return (
    <div
      className="w-[21px] h-[21px] rounded-full flex items-center justify-center text-white text-[10px] font-bold"
      style={{ backgroundColor: color }}
    >
      {symbol[0]}
    </div>
  );
}

// Table row component
function PositionRow({ holding, formatNumber }: { holding: Holding; formatNumber: (num: number) => string }) {
  const changeColor = holding.dayChange >= 0 ? "text-dashboard-accent-success" : "text-red-500";
  const changePrefix = holding.dayChange >= 0 ? "+" : "";

  return (
    <tr className="border-b border-dashboard-border">
      <td className="py-4 px-7">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-[6px]">
            <AssetIcon symbol={holding.symbol} name={holding.name} />
            <span className="text-[20px] font-semibold text-[#666] font-figtree tracking-[-0.2px] leading-[16px]">
              {holding.symbol}
            </span>
          </div>
          <span className="text-[12px] font-normal text-[#929292] font-figtree tracking-[-0.2px] leading-[12px]">
            {holding.name}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-dashboard-text-primary font-figtree">
          {formatNumber(holding.shares)}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-dashboard-text-primary font-figtree">
          {formatCurrency(holding.currentPrice)}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-dashboard-text-primary font-figtree">
          {formatCurrency(holding.value)}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className={`text-sm font-medium font-figtree ${changeColor}`}>
          {changePrefix}{holding.dayChange.toFixed(2)}%
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-dashboard-text-primary font-figtree">
          {holding.allocation}%
        </span>
      </td>
    </tr>
  );
}

// Items per page options
const itemsPerPageOptions = [6, 10, 15, 20, 25, 50];

// Pagination component - Independent from table
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}) {
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);
  const dropUpRef = useRef<HTMLDivElement>(null);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Close drop-up when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropUpRef.current && !dropUpRef.current.contains(event.target as Node)) {
        setIsDropUpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate page numbers to display
  const getPageNumbers = () => {
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
    onPageChange(1); // Reset to first page when changing items per page
    setIsDropUpOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      {/* Items count */}
      <span className="text-[16px] font-medium text-[#171717] font-figtree leading-[20px]">
        Showing <span className="text-[#004a4a]">{startItem}-{endItem}</span> of {totalItems}
      </span>

      {/* Page numbers */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-[33px] h-[36px] flex items-center justify-center rounded-[6px] bg-white hover:bg-dashboard-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                className={`w-[33px] h-[36px] flex items-center justify-center rounded-[6px] text-[16px] font-figtree transition-colors ${
                  currentPage === page
                    ? "bg-[#004a4a] text-white font-bold"
                    : "bg-white text-[#171717] font-semibold hover:bg-dashboard-bg-hover"
                }`}
              >
                {page}
              </button>
            ) : (
              <div
                key={index}
                className="w-[33px] h-[36px] flex items-center justify-center rounded-[6px] bg-white text-[16px] font-semibold text-[#171717] font-figtree"
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
          className="w-[33px] h-[36px] flex items-center justify-center rounded-[6px] bg-white hover:bg-dashboard-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-dashboard-text-secondary" />
        </button>
      </div>

      {/* Items per page selector - Drop Up */}
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-semibold text-[#171717] font-figtree leading-[20px]">Row</span>
        <div className="relative" ref={dropUpRef}>
          <button
            type="button"
            onClick={() => setIsDropUpOpen(!isDropUpOpen)}
            className="flex items-center gap-[6px] pl-[10px] pr-1 py-2 border-[1.2px] border-[#e6e6e6] rounded-[6px] bg-white hover:bg-dashboard-bg-hover transition-colors"
          >
            <span className="text-[14px] font-medium text-[#171717] font-figtree leading-[20px]">
              {itemsPerPage} / page
            </span>
            <ChevronUp className={`h-5 w-5 text-dashboard-text-secondary transition-transform ${isDropUpOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Drop-up menu */}
          {isDropUpOpen && (
            <div className="absolute bottom-full mb-2 right-0 z-50 w-[120px] bg-white border border-[#e6e6e6] rounded-[8px] shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
              {itemsPerPageOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-[14px] font-figtree hover:bg-dashboard-bg-hover transition-colors ${
                    itemsPerPage === option
                      ? "text-[#004a4a] bg-[#f5f5f5] font-medium"
                      : "text-[#171717]"
                  }`}
                >
                  <span>{option} / page</span>
                  {itemsPerPage === option && (
                    <Check className="h-4 w-4 text-[#004a4a]" />
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

export default function PortfolioHoldings({
  holdings,
  formatNumber,
}: PortfolioHoldingsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Calculate pagination
  const totalItems = holdings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedHoldings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return holdings.slice(start, start + itemsPerPage);
  }, [holdings, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Title */}
      <h3 className="text-[17px] font-medium text-dashboard-text-primary font-figtree">
        Your Positions
      </h3>

      {/* Table and Pagination wrapper */}
      <div className="flex flex-col gap-[28px]">
        {/* Table */}
        <div className="bg-white border-2 border-[#e6e6e6] rounded-[8px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dashboard-border">
              <th className="text-left py-[19px] px-7">
                <span className="text-[20px] font-medium text-[#131313] font-figtree">
                  Asset
                </span>
              </th>
              <th className="text-left py-[19px] px-4">
                <span className="text-[20px] font-medium text-[#131313] font-figtree">
                  Amount
                </span>
              </th>
              <th className="text-left py-[19px] px-4">
                <span className="text-[20px] font-medium text-[#131313] font-figtree">
                  Price
                </span>
              </th>
              <th className="text-left py-[19px] px-4">
                <span className="text-[20px] font-medium text-[#131313] font-figtree">
                  Value
                </span>
              </th>
              <th className="text-left py-[19px] px-4">
                <span className="text-[20px] font-medium text-[#131313] font-figtree">
                  24h Change
                </span>
              </th>
              <th className="text-left py-[19px] px-4">
                <span className="text-[20px] font-medium text-[#131313] font-figtree">
                  Allocation
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedHoldings.length > 0 ? (
              paginatedHoldings.map((holding) => (
                <PositionRow
                  key={holding.symbol}
                  holding={holding}
                  formatNumber={formatNumber}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <span className="text-dashboard-text-muted font-figtree">
                    No positions to display
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* Pagination - Independent from table */}
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
    </div>
  );
}
