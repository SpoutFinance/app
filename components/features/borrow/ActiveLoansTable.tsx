"use client";

interface ActiveLoan {
  id: string;
  assetSymbol: string;
  assetName: string;
  collateral: number;
  borrowed: number;
  apr: number;
  interestAccrued: number;
  healthFactor: number;
}

interface ActiveLoansTableProps {
  loans: ActiveLoan[];
  onRepay: (loanId: string) => void;
}

export function ActiveLoansTable({ loans, onRepay }: ActiveLoansTableProps) {
  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return "text-dashboard-accent-success";
    if (hf >= 1.5) return "text-dashboard-accent-success-light";
    if (hf >= 1.2) return "text-dashboard-accent-warning";
    return "text-dashboard-accent-error";
  };

  if (loans.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-dashboard-text-primary tracking-[-0.6px]">
          Active Loans
        </h3>
        <div className="bg-white border border-dashboard-border rounded-lg p-8 text-center">
          <p className="text-dashboard-text-secondary">No active loans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-semibold text-dashboard-text-primary tracking-[-0.6px]">
        Active Loans
      </h3>

      <div className="bg-white border border-dashboard-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dashboard-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  Asset
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  Collateral
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  Borrowed
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  APR
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  Interest Accrued
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  Health Factor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dashboard-text-secondary">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-dashboard-bg transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Logo placeholder */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {loan.assetSymbol[0]}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-dashboard-text-primary">
                          {loan.assetSymbol}
                        </span>
                        <p className="text-xs text-dashboard-text-secondary">{loan.assetName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dashboard-text-primary">
                    {formatCurrency(loan.collateral)}
                  </td>
                  <td className="px-6 py-4 text-sm text-dashboard-text-primary">
                    {formatCurrency(loan.borrowed)}
                  </td>
                  <td className="px-6 py-4 text-sm text-dashboard-accent-success font-medium">
                    {loan.apr}%
                  </td>
                  <td className="px-6 py-4 text-sm text-dashboard-text-primary">
                    {formatCurrency(loan.interestAccrued)}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${getHealthFactorColor(
                      loan.healthFactor
                    )}`}
                  >
                    {loan.healthFactor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onRepay(loan.id)}
                      className="px-4 py-1.5 text-sm font-medium text-white bg-dashboard-teal rounded-md hover:bg-dashboard-teal-hover transition-colors"
                    >
                      Repay Loan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
