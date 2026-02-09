"use client";

import { StatusBadge } from "@/components/ui/status-badge";

interface Position {
  id: string;
  lockupPeriod: string;
  principal: number;
  apy: number;
  startDate: string;
  unlockDate: string | null;
  earnedToDate: number;
}

interface YourPositionsProps {
  positions: Position[];
}

export function YourPositions({ positions }: YourPositionsProps) {
  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (positions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-dashboard-text-heading">
          Your Positions
        </h2>
        <div className="bg-white border border-dashboard-border rounded-xl p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-dashboard-text-heading mb-1">
              No active deposits
            </p>
            <p className="text-base text-dashboard-text-muted">
              Start earning yield by depositing to a lockup period above
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-dashboard-text-heading">
        Your Positions
      </h2>
      <div className="bg-white border border-dashboard-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dashboard-border bg-dashboard-bg-subtle">
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                Lockup Period
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                Principal
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                APY
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                Unlock Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                Earned to Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dashboard-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                key={position.id}
                className="border-b border-dashboard-border last:border-b-0"
              >
                <td className="px-6 py-4 text-sm font-medium text-dashboard-text-heading">
                  {position.lockupPeriod}
                </td>
                <td className="px-6 py-4 text-sm text-dashboard-text-heading">
                  {formatCurrency(position.principal)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    value={`${position.apy}%`}
                    className="text-sm px-2 py-1 rounded-md"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-dashboard-text-secondary">
                  {position.startDate}
                </td>
                <td className="px-6 py-4 text-sm text-dashboard-text-secondary">
                  {position.unlockDate || "Flexible"}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-dashboard-teal">
                  {formatCurrency(position.earnedToDate)}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-dashboard-teal hover:underline"
                  >
                    {position.unlockDate ? "View" : "Withdraw"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
