"use client";

import { LayoutGrid, Landmark } from "lucide-react";
import { Category } from "./types";

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

interface TabConfig {
  id: Category;
  label: string;
  icon?: React.ReactNode;
}

const tabs: TabConfig[] = [
  { id: "all", label: "All", icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "equities", label: "Equities", icon: <Landmark className="h-4 w-4" /> },
  { id: "etfs", label: "ETFs" },
];

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onCategoryChange(tab.id)}
          className={`flex items-center justify-center gap-1.5 h-9 px-5 py-2 rounded-md text-lg font-medium transition-colors ${
            activeCategory === tab.id
              ? "bg-dashboard-accent-blue-bg border border-dashboard-accent-blue-light text-dashboard-accent-blue"
              : "bg-white border border-dashboard-border-subtle text-dashboard-accent-blue hover:bg-dashboard-bg-hover"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
