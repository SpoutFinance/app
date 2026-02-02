"use client";

import { useState, useCallback } from "react";
import { VaultPositions } from "@/components/features/borrow/vaultpositions";
import { EquitySearch } from "@/components/features/borrow/equitysearch";
import { StakingAPYChart } from "@/components/features/borrow/staking-apy-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function BorrowPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVaultCreated = useCallback(() => {
    // Trigger a refresh of vault positions by updating the key
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-8">
      <Tabs defaultValue="borrowing" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
          <TabsTrigger value="stake">Stake</TabsTrigger>
        </TabsList>

        <TabsContent value="borrowing" className="space-y-8">
          {/* Equity Search Section */}
          <section className="rounded-none border border-[#004040]/15 bg-white p-8 shadow-sm">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#004040]">
                  Collateral Options
                </CardTitle>
                <CardDescription>
                  Browse available stocks and ETFs. Create a vault for any
                  investment option to deposit collateral and borrow
                  stablecoins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EquitySearch onVaultCreated={handleVaultCreated} />
              </CardContent>
            </Card>
          </section>

          {/* Vault Positions Section */}
          <section className="rounded-none border border-[#004040]/15 bg-white p-8 shadow-sm">
            <VaultPositions key={refreshKey} />
          </section>
        </TabsContent>

        <TabsContent value="stake" className="space-y-8">
          {/* Staking APY Chart */}
          <section className="rounded-none border border-[#004040]/15 bg-white p-8 shadow-sm">
            <StakingAPYChart />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
