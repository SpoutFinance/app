/**
 * Debug utility for conditional logging.
 * Only logs in development mode to keep production builds clean.
 */

/* eslint-disable no-console */

const isDev = process.env.NODE_ENV === "development";

export const debug = {
  log: (label: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[${label}]`, ...args);
    }
  },

  warn: (label: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(`[${label}]`, ...args);
    }
  },

  error: (label: string, ...args: unknown[]) => {
    // Errors are always logged
    console.error(`[${label}]`, ...args);
  },

  table: (label: string, data: unknown) => {
    if (isDev) {
      console.log(`[${label}]`);
      console.table(data);
    }
  },

  group: (label: string, fn: () => void) => {
    if (isDev) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  },
};

export default debug;
