"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Lock, Zap } from "lucide-react";

interface DeFiApp {
  id: string;
  name: string;
  description: string;
  category: string;
  apy?: string;
  tvl?: string;
  url: string;
  logo?: string;
  featured?: boolean;
}

const defiApps: DeFiApp[] = [
  {
    id: "uniswap",
    name: "Uniswap",
    description:
      "Decentralized exchange for swapping tokens and providing liquidity",
    category: "DEX",
    apy: "5-15%",
    tvl: "$3.2B",
    url: "https://uniswap.org",
    featured: true,
  },
  {
    id: "aave",
    name: "Aave",
    description:
      "Lending and borrowing protocol with competitive interest rates",
    category: "Lending",
    apy: "3-8%",
    tvl: "$12.5B",
    url: "https://aave.com",
    featured: true,
  },
  {
    id: "compound",
    name: "Compound",
    description: "Algorithmic money market protocol for earning interest",
    category: "Lending",
    apy: "2-6%",
    tvl: "$2.1B",
    url: "https://compound.finance",
    featured: false,
  },
  {
    id: "curve",
    name: "Curve Finance",
    description: "Exchange optimized for stablecoins and low-slippage swaps",
    category: "DEX",
    apy: "4-12%",
    tvl: "$1.8B",
    url: "https://curve.fi",
    featured: false,
  },
  {
    id: "yearn",
    name: "Yearn Finance",
    description:
      "Yield aggregator that optimizes DeFi yield farming strategies",
    category: "Yield",
    apy: "8-20%",
    tvl: "$500M",
    url: "https://yearn.fi",
    featured: true,
  },
  {
    id: "balancer",
    name: "Balancer",
    description: "Automated portfolio manager and liquidity provider",
    category: "DEX",
    apy: "3-10%",
    tvl: "$800M",
    url: "https://balancer.fi",
    featured: false,
  },
  {
    id: "makerdao",
    name: "MakerDAO",
    description: "Decentralized lending platform for generating DAI stablecoin",
    category: "Lending",
    apy: "1-5%",
    tvl: "$5.2B",
    url: "https://makerdao.com",
    featured: false,
  },
  {
    id: "convex",
    name: "Convex Finance",
    description: "Boost rewards for Curve and Frax liquidity providers",
    category: "Yield",
    apy: "10-25%",
    tvl: "$1.2B",
    url: "https://www.convexfinance.com",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  DEX: "bg-blue-100 text-blue-800",
  Lending: "bg-green-100 text-green-800",
  Yield: "bg-purple-100 text-purple-800",
};

export function DeFiDappStore() {
  const featuredApps = defiApps.filter((app) => app.featured);
  const otherApps = defiApps.filter((app) => !app.featured);

  return (
    <div className="space-y-8">
      {/* Featured Apps Section */}
      {featuredApps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#004040] mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Featured Protocols
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredApps.map((app) => (
              <Card
                key={app.id}
                className="border border-[#004040]/15 hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-[#004040]">
                        {app.name}
                      </CardTitle>
                      <Badge
                        className={`mt-2 ${categoryColors[app.category] || "bg-gray-100 text-gray-800"}`}
                      >
                        {app.category}
                      </Badge>
                    </div>
                    {app.featured && (
                      <Badge className="bg-amber-100 text-amber-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm text-slate-600">
                    {app.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {app.apy && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-slate-700">APY:</span>
                        <span className="text-green-600 font-semibold">
                          {app.apy}
                        </span>
                      </div>
                    )}
                    {app.tvl && (
                      <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">TVL:</span>
                        <span className="text-slate-600">{app.tvl}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#004040]/20 hover:bg-[#004040]/5"
                    onClick={() => window.open(app.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Protocol
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Apps Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#004040] mb-4">
          All Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherApps.map((app) => (
            <Card
              key={app.id}
              className="border border-[#004040]/15 hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#004040]">
                      {app.name}
                    </CardTitle>
                    <Badge
                      className={`mt-2 ${categoryColors[app.category] || "bg-gray-100 text-gray-800"}`}
                    >
                      {app.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm text-slate-600">
                  {app.description}
                </CardDescription>
                <div className="flex flex-wrap gap-4 text-sm">
                  {app.apy && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-slate-700">APY:</span>
                      <span className="text-green-600 font-semibold">
                        {app.apy}
                      </span>
                    </div>
                  )}
                  {app.tvl && (
                    <div className="flex items-center gap-1">
                      <Lock className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-700">TVL:</span>
                      <span className="text-slate-600">{app.tvl}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#004040]/20 hover:bg-[#004040]/5"
                  onClick={() => window.open(app.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Protocol
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
