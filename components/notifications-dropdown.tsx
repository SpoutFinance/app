"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import NotificationIcon from "@/assets/images/notification.svg";
import { SvgIcon } from "./ui/svg-icon";
import YieldIcon from "@/assets/images/dollar_plus.svg";
import PriceAlertIcon from "@/assets/images/dollar_bell.svg"
import SystemIcon from "@/assets/images/cloud_tick.svg"

// Notification types
type NotificationType = "yield" | "price_alert" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  amount?: string;
  timestamp: string;
  isUnread: boolean;
  actions?: { label: string; variant: "primary" | "secondary" }[];
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "yield",
    title: "Yield Received",
    description: "from 180 day pool",
    amount: "+ $124.50",
    timestamp: "4:55 PM",
    isUnread: true,
    actions: [
      { label: "CTA 1", variant: "secondary" },
      { label: "CTA 2", variant: "primary" },
    ],
  },
  {
    id: "2",
    type: "price_alert",
    title: "Price Alert",
    description: "TSLA reached $245.67",
    timestamp: "10:36 AM",
    isUnread: true,
    actions: [{ label: "CTA", variant: "primary" }],
  },
  {
    id: "3",
    type: "system",
    title: "System Update",
    description: "Platform upgraded to v2.4.1",
    timestamp: "Jan 6",
    isUnread: false,
  },
  {
    id: "4",
    type: "yield",
    title: "Yield Received",
    description: "from 90 day pool",
    amount: "+ $444.67",
    timestamp: "Jan 2",
    isUnread: false,
  },
];

const filterTabs = ["All", "Price Alerts", "Custom Alerts"] as const;
type FilterTab = (typeof filterTabs)[number];

function NotificationTypeIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "yield":
      return <SvgIcon src={YieldIcon} size="sm" />;
    case "price_alert":
      return <SvgIcon src={PriceAlertIcon} size="sm" />;
    case "system":
      return <SvgIcon src={SystemIcon} size="sm" />;
    default:
      return <SvgIcon src={YieldIcon} size="sm" />;
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  const isHighlighted = notification.isUnread && notification.type === "yield";

  return (
    <div
      className={cn(
        "px-4 py-4 border-b border-dashboard-border-subtle",
        isHighlighted &&
          "bg-dashboard-accent-blue-highlight border-dashboard-accent-blue-light",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 items-start">
          {/* Icon */}
          <div className="bg-dashboard-accent-blue-bg rounded size-[21px] flex items-center justify-center shrink-0">
            <NotificationTypeIcon type={notification.type} />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              {notification.isUnread && (
                <div className="size-[7px] rounded-full bg-dashboard-accent-blue-light" />
              )}
              <span className="text-sm font-medium text-dashboard-text-muted font-figtree tracking-[-0.2px]">
                {notification.title}
              </span>
            </div>
            <div className="text-xs font-medium font-figtree tracking-[-0.2px]">
              {notification.amount ? (
                <>
                  <span className="text-dashboard-accent-success">
                    {notification.amount}{" "}
                  </span>
                  <span className="text-dashboard-text-primary">
                    {notification.description}
                  </span>
                </>
              ) : (
                <span className="text-dashboard-text-primary">
                  {notification.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-sm font-medium text-dashboard-text-muted font-figtree tracking-[-0.2px] shrink-0">
          {notification.timestamp}
        </span>
      </div>

      {/* Action buttons */}
      {notification.actions && notification.actions.length > 0 && (
        <div className="flex gap-2 mt-3 ml-[33px]">
          {notification.actions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "h-[22px] px-2 rounded-xl text-[8px] font-semibold font-figtree",
                action.variant === "primary"
                  ? "bg-dashboard-teal text-white border border-dashboard-teal-dark"
                  : "bg-white text-dashboard-accent-blue border border-dashboard-accent-blue-light",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredNotifications = mockNotifications.filter((notification) => {
    if (showOnlyUnread && !notification.isUnread) return false;
    if (activeFilter === "Price Alerts" && notification.type !== "price_alert")
      return false;
    if (activeFilter === "Custom Alerts" && notification.type !== "system")
      return false;
    return true;
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="flex items-center justify-center w-10 h-[38px] bg-white border-2 border-dashboard-border rounded-lg hover:bg-gray-50 transition-colors text-dashboard-text-secondary"
        >
          <SvgIcon src={NotificationIcon} size="md" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 rounded-xl border border-dashboard-border-muted shadow-[0px_4px_21.7px_0px_rgba(0,0,0,0.04)]"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dashboard-border">
          <h3 className="text-xl font-medium text-dashboard-text-primary font-figtree tracking-[-0.2px]">
            Notifications
          </h3>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={showOnlyUnread}
              onCheckedChange={setShowOnlyUnread}
              className="h-4 w-8 data-[state=checked]:bg-dashboard-teal data-[state=unchecked]:bg-dashboard-border-subtle"
            />
            <span className="text-sm text-dashboard-text-hint font-figtree">
              Show only unread
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-3 px-5 py-4">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "h-[26px] px-4 rounded-full text-sm font-medium font-figtree tracking-[-0.4px] border transition-colors",
                activeFilter === tab
                  ? "bg-dashboard-accent-blue-bg border-dashboard-accent-blue-light text-dashboard-accent-blue"
                  : "bg-white border-dashboard-border-subtle text-dashboard-accent-blue hover:bg-gray-50",
              )}
            >
              {tab}
            </button>
          ))}
          <button
            type="button"
            className="size-[26px] rounded-full bg-white border border-dashboard-border-subtle flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="More filters"
          >
            <ChevronRight className="size-4 text-dashboard-accent-blue" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="max-h-[350px] overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="py-8 text-center text-dashboard-text-muted font-figtree">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
