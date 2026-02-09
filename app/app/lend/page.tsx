"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  LockupPeriodCard,
  YieldSimulator,
  YourPositions,
  ConfirmDepositDrawer,
} from "@/components/features/lend";

/**
 * TODO: Replace with live data from your lending protocol/API
 * Example: const { data: periods } = useLendingPools();
 */
const LOCKUP_PERIODS = [
  {
    id: "no-lockup",
    title: "No Lockup",
    subtitle: "Withdraw anytime • Flexible liquidity",
    apyPercent: 8.5,
    liquidityInPool: 25834567.89,
  },
  {
    id: "30-day",
    title: "30 Days Lock",
    subtitle: "Short-term commitment • Higher returns",
    apyPercent: 11.2,
    liquidityInPool: 18234567.89,
  },
  {
    id: "90-day",
    title: "90 Days Lock",
    subtitle: "Medium-term commitment • Strong returns",
    apyPercent: 14.8,
    liquidityInPool: 32456234.12,
  },
  {
    id: "180-day",
    title: "180 Days Lock",
    subtitle: "Long-term commitment • Maximum returns",
    apyPercent: 18.5,
    liquidityInPool: 15345678.9,
  },
];

/**
 * TODO: Replace with user's actual wallet balance
 * Example: const { balance } = useWalletBalance();
 */
const USER_BALANCE = 125000.0;

interface PendingDeposit {
  periodId: string;
  amount: number;
  apyPercent: number;
  title: string;
  subtitle: string;
}

interface Position {
  id: string;
  lockupPeriod: string;
  principal: number;
  apy: number;
  startDate: string;
  unlockDate: string | null;
  earnedToDate: number;
}

export default function LendPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [positions] = useState<Position[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [pendingDeposit, setPendingDeposit] = useState<PendingDeposit | null>(
    null
  );
  const [isDepositing, setIsDepositing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleDepositClick = (
    periodId: string,
    amount: number,
    period: (typeof LOCKUP_PERIODS)[0]
  ) => {
    setPendingDeposit({
      periodId,
      amount,
      apyPercent: period.apyPercent,
      title: period.title,
      subtitle: period.subtitle,
    });
    setIsDrawerOpen(true);
  };

  const handleConfirmDeposit = async () => {
    if (!pendingDeposit) return;

    setIsDepositing(true);
    try {
      /**
       * TODO: Replace with actual deposit transaction
       * Example:
       *   const tx = await lendingContract.deposit(pendingDeposit.amount, pendingDeposit.periodId);
       *   await tx.wait();
       */
      console.log(
        `Depositing ${pendingDeposit.amount} USDC to ${pendingDeposit.periodId}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate transaction

      setIsDrawerOpen(false);
      setPendingDeposit(null);
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleCloseDrawer = () => {
    if (!isDepositing) {
      setIsDrawerOpen(false);
      setPendingDeposit(null);
    }
  };

  return (
    <div className="space-y-8 font-figtree!">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-semibold text-dashboard-text-heading tracking-tight font-figtree">
            Lend
          </h1>
          <p className="text-base text-dashboard-text-secondary">
            Earn yield on your stablecoins
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-dashboard-border rounded-lg bg-white hover:bg-dashboard-bg-hover transition-colors disabled:opacity-50"
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

      {/* Lockup Periods */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-dashboard-text-heading">
          Lockup Periods
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOCKUP_PERIODS.map((period) => (
            <LockupPeriodCard
              key={period.id}
              title={period.title}
              subtitle={period.subtitle}
              apyPercent={period.apyPercent}
              liquidityInPool={period.liquidityInPool}
              userBalance={USER_BALANCE}
              onDeposit={(amount) =>
                handleDepositClick(period.id, amount, period)
              }
            />
          ))}
        </div>
      </div>

      {/* Yield Simulator */}
      <YieldSimulator />

      {/* Your Positions */}
      <YourPositions positions={positions} />

      {/* Confirm Deposit Drawer */}
      <ConfirmDepositDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onConfirm={handleConfirmDeposit}
        amount={pendingDeposit?.amount ?? 0}
        apyPercent={pendingDeposit?.apyPercent ?? 0}
        lockupTitle={pendingDeposit?.title ?? ""}
        lockupSubtitle={pendingDeposit?.subtitle ?? ""}
        isLoading={isDepositing}
      />
    </div>
  );
}
