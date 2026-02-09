import { RefreshCw } from "lucide-react";

type PortfolioHeaderProps = {
  username?: string;
  onRefresh: () => void;
};

export default function PortfolioHeader({
  username,
  onRefresh,
}: PortfolioHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-medium text-dashboard-text-primary font-figtree tracking-[-0.2px] leading-8.75">
          Portfolio Overview
        </h1>
        <p className="text-sm text-dashboard-text-secondary font-figtree tracking-[-0.2px]">
          {username ? `Welcome back, ${username}` : "Welcome to your portfolio"}
        </p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-dashboard-border rounded-[6px] hover:bg-dashboard-bg-hover transition-colors"
      >
        <RefreshCw className="h-5.5 w-5.5 text-dashboard-text-secondary" />
        <span className="text-base font-medium text-dashboard-text-secondary font-figtree">
          Refresh
        </span>
      </button>
    </div>
  );
}
