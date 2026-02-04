"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { VaultDeposit } from "@/components/features/borrow/vaultdeposit";
import { VaultPositions } from "@/components/features/borrow/vaultpositions";
import { EquitySearch } from "@/components/features/borrow/equitysearch";
import { StockData } from "@/lib/types/markets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BorrowPage() {
  // Set LQD as the default selected equity
  const defaultLQD: StockData = {
    ticker: "LQD",
    name: "Spout LQD Token",
    price: null,
    change: null,
    changePercent: null,
    volume: "0",
    marketCap: "$0",
    dataSource: "mock",
  };
  
  const [selectedEquity, setSelectedEquity] = useState<StockData | null>(defaultLQD);

  return (
    <div className="space-y-8">
      {/* Equity Search Section */}
      <section className="rounded-none border border-[#004040]/15 bg-white p-8 shadow-sm">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#004040]">
              Search Equities
            </CardTitle>
            <CardDescription>
              Search for equities to use as collateral or for borrowing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EquitySearch
              onSelectEquity={setSelectedEquity}
              selectedEquity={selectedEquity}
            />
          </CardContent>
        </Card>
      </section>

      {/* Vault Operations Section */}
      <section className="rounded-none border border-[#004040]/15 bg-white p-8 shadow-sm">
        <Tabs defaultValue="deposit" className="space-y-6">
          <div className="flex items-center gap-4">
            {selectedEquity && (
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[#004040]">
                  {selectedEquity.ticker}
                </span>
              </div>
            )}
            <TabsList className="grid grid-cols-2 bg-[#e6f2f2]">
              <TabsTrigger
                value="deposit"
                className="data-[state=active]:bg-white data-[state=active]:text-[#004040]"
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger
                value="positions"
                className="data-[state=active]:bg-white data-[state=active]:text-[#004040]"
              >
                Positions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="deposit" className="space-y-4">
            <VaultDeposit selectedEquity={selectedEquity} />
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <VaultPositions selectedEquity={selectedEquity} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

