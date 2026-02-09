"use client";

/**
 * Borrow Page
 *
 * This page allows users to borrow USDC against their equity collateral.
 *
 * ============================================================
 * MOCK DATA USAGE
 * ============================================================
 * This page currently uses mock data for UI development/testing.
 * The following data sources are mocked:
 *
 * 1. MOCK_COLLATERALS - User's available collateral assets
 *    TO REVERT: Replace with useUserCollaterals() hook or API call
 *    Expected data: { id, symbol, name, ltvPercent, shares, value, maxBorrow }[]
 *
 * 2. MOCK_ACTIVE_LOANS - User's current active loans
 *    TO REVERT: Replace with useActiveLoans() hook or API call
 *    Expected data: { id, assetSymbol, assetName, collateral, borrowed, apr, interestAccrued, healthFactor }[]
 *
 * 3. usedAmount (line ~102) - Currently hardcoded to 50000
 *    TO REVERT: Fetch from lending protocol's user position data
 *
 * 4. handleBorrow/handleRepay - Currently use setTimeout to simulate transactions
 *    TO REVERT: Replace with actual smart contract calls
 *    Example: await lendingContract.borrow(amount) / await lendingContract.repay(loanId, amount)
 * ============================================================
 */

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  BorrowingPowerCard,
  HealthFactorGauge,
  CollateralSelector,
  BorrowUSDCForm,
  ActiveLoansTable,
  RepayLoanDrawer,
} from "@/components/features/borrow";

/**
 * MOCK DATA: User's available collateral assets
 * TO REVERT TO REAL DATA:
 * 1. Create a hook: const { data: collaterals, isLoading } = useUserCollaterals(userAddress);
 * 2. The hook should fetch from your lending protocol or backend API
 * 3. Replace MOCK_COLLATERALS usage with the hook's data
 */
const MOCK_COLLATERALS = [
  {
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla Inc.",
    ltvPercent: 50,
    shares: 250,
    value: 61445.0,
    maxBorrow: 30772.5,
  },
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    ltvPercent: 34,
    shares: 500,
    value: 91445.0,
    maxBorrow: 54746.5,
  },
  {
    id: "nvda",
    symbol: "NVDA",
    name: "Nvidia Corp.",
    ltvPercent: 50,
    shares: 75,
    value: 65655.0,
    maxBorrow: 29542.5,
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    ltvPercent: 50,
    shares: 200,
    value: 82500.0,
    maxBorrow: 41250.0,
  },
];

/**
 * MOCK DATA: User's active loans
 * TO REVERT TO REAL DATA:
 * 1. Create a hook: const { data: loans, isLoading } = useActiveLoans(userAddress);
 * 2. The hook should fetch from your lending protocol (e.g., Aave, Compound)
 * 3. Replace MOCK_ACTIVE_LOANS usage with the hook's data
 * 4. APR should come from the protocol's current borrow rate
 */
const MOCK_ACTIVE_LOANS = [
  {
    id: "loan-1",
    assetSymbol: "TSLA",
    assetName: "Tesla Inc.",
    collateral: 91260.0,
    borrowed: 30000.0,
    apr: 0,
    interestAccrued: 0.0,
    healthFactor: 2.54,
  },
  {
    id: "loan-2",
    assetSymbol: "AAPL",
    assetName: "Apple Inc.",
    collateral: 61445.0,
    borrowed: 20000.0,
    apr: 0,
    interestAccrued: 0.0,
    healthFactor: 2.33,
  },
];

export default function BorrowPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCollateralIds, setSelectedCollateralIds] = useState<string[]>([
    "tsla",
  ]);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isRepayDrawerOpen, setIsRepayDrawerOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isRepaying, setIsRepaying] = useState(false);

  // Calculate borrowing power based on selected collaterals
  const selectedCollaterals = MOCK_COLLATERALS.filter((c) =>
    selectedCollateralIds.includes(c.id)
  );
  const totalBorrowingPower = selectedCollaterals.reduce(
    (sum, c) => sum + c.maxBorrow,
    0
  );
  // MOCK: Total borrowed amount - TO REVERT: Fetch from lending protocol's user position
  const usedAmount = 50000;
  const overexposedBy = Math.max(usedAmount - totalBorrowingPower, 0);
  const availableToBorrow = totalBorrowingPower - usedAmount;

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleBorrow = async (amount: number) => {
    setIsBorrowing(true);
    try {
      /**
       * TODO: Replace with actual borrow transaction
       * Example:
       *   const tx = await lendingContract.borrow(amount);
       *   await tx.wait();
       */
      console.log(`Borrowing ${amount} USDC`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Borrow failed:", error);
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleRepayClick = (loanId: string) => {
    setSelectedLoanId(loanId);
    setIsRepayDrawerOpen(true);
  };

  const handleRepay = async (loanId: string, amount: number, isFullRepay: boolean) => {
    setIsRepaying(true);
    try {
      /**
       * TODO: Replace with actual repay transaction
       * Example:
       *   const tx = await lendingContract.repay(loanId, amount, isFullRepay);
       *   await tx.wait();
       */
      console.log(`Repaying loan ${loanId}: ${amount} USDC (${isFullRepay ? 'Full' : 'Partial'})`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsRepayDrawerOpen(false);
    } catch (error) {
      console.error("Repay failed:", error);
    } finally {
      setIsRepaying(false);
    }
  };

  const selectedLoan = MOCK_ACTIVE_LOANS.find((loan) => loan.id === selectedLoanId) || null;

  return (
    <div className="space-y-8 font-figtree">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-semibold text-dashboard-text-primary tracking-tight">
            Borrow
          </h1>
          <p className="text-base text-dashboard-text-secondary">
            Borrow assets against your collateral with real-time rates
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-dashboard-border rounded-lg bg-white hover:bg-dashboard-bg transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-5 w-5 text-dashboard-text-secondary ${refreshing ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-medium text-dashboard-text-primary">Refresh</span>
        </button>
      </div>

      {/* Borrowing Power & Health Factor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BorrowingPowerCard
          safeLimit={totalBorrowingPower}
          used={usedAmount}
          overexposedBy={overexposedBy}
        />
        <HealthFactorGauge healthFactor={1.53} />
      </div>

      {/* Select Collateral & Borrow USDC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollateralSelector
          collaterals={MOCK_COLLATERALS}
          selectedIds={selectedCollateralIds}
          onSelectionChange={setSelectedCollateralIds}
        />
        <BorrowUSDCForm
          availableAmount={availableToBorrow}
          apr={4.5}
          currentHealthFactor={1.53}
          onBorrow={handleBorrow}
          isLoading={isBorrowing}
        />
      </div>

      {/* Active Loans */}
      <ActiveLoansTable loans={MOCK_ACTIVE_LOANS} onRepay={handleRepayClick} />

      {/* Repay Loan Drawer */}
      <RepayLoanDrawer
        isOpen={isRepayDrawerOpen}
        onClose={() => setIsRepayDrawerOpen(false)}
        loan={selectedLoan}
        onRepay={handleRepay}
        isLoading={isRepaying}
      />
    </div>
  );
}
