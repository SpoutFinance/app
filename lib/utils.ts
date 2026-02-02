import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if currently on the app subdomain (app.spout.finance)
 */
export function isAppSubdomain(): boolean {
  return (
    typeof window !== "undefined" && window.location.host.startsWith("app.")
  );
}

/**
 * Get the correct route for app pages based on current domain.
 * On app subdomain: /app/trade -> /trade
 * On main domain: keeps /app/trade as-is
 */
export function getAppRoute(path: string): string {
  if (isAppSubdomain()) {
    // Remove /app prefix for subdomain
    if (path.startsWith("/app")) {
      const stripped = path.slice(4);
      return stripped || "/";
    }
    return path;
  }
  // Ensure /app prefix on main domain
  return path.startsWith("/app") ? path : `/app${path}`;
}

/**
 * Normalize pathname for comparison (handles subdomain differences).
 * On subdomain: / -> /app, /trade -> /app/trade
 * On main domain: returns pathname as-is
 */
export function normalizePathname(pathname: string): string {
  if (isAppSubdomain() && !pathname.startsWith("/app")) {
    return pathname === "/" ? "/app" : `/app${pathname}`;
  }
  return pathname;
}

export const countryCodes = [
  { code: 1, name: "United States" },
  { code: 44, name: "United Kingdom" },
  { code: 91, name: "India" },
  { code: 86, name: "China" },
  { code: 81, name: "Japan" },
  { code: 49, name: "Germany" },
  { code: 33, name: "France" },
  { code: 39, name: "Italy" },
  { code: 34, name: "Spain" },
  { code: 31, name: "Netherlands" },
  { code: 32, name: "Belgium" },
  { code: 41, name: "Switzerland" },
  { code: 46, name: "Sweden" },
  { code: 47, name: "Norway" },
  { code: 45, name: "Denmark" },
  { code: 358, name: "Finland" },
  { code: 48, name: "Poland" },
  { code: 420, name: "Czech Republic" },
  { code: 36, name: "Hungary" },
  { code: 43, name: "Austria" },
  { code: 380, name: "Ukraine" },
  { code: 7, name: "Russia" },
  { code: 82, name: "South Korea" },
  { code: 65, name: "Singapore" },
  { code: 60, name: "Malaysia" },
  { code: 66, name: "Thailand" },
  { code: 84, name: "Vietnam" },
  { code: 63, name: "Philippines" },
  { code: 62, name: "Indonesia" },
  { code: 61, name: "Australia" },
  { code: 64, name: "New Zealand" },
  { code: 27, name: "South Africa" },
  { code: 234, name: "Nigeria" },
  { code: 254, name: "Kenya" },
  { code: 20, name: "Egypt" },
  { code: 971, name: "United Arab Emirates" },
  { code: 966, name: "Saudi Arabia" },
  { code: 972, name: "Israel" },
  { code: 90, name: "Turkey" },
  { code: 52, name: "Mexico" },
  { code: 55, name: "Brazil" },
  { code: 54, name: "Argentina" },
  { code: 56, name: "Chile" },
  { code: 57, name: "Colombia" },
  { code: 51, name: "Peru" },
  { code: 58, name: "Venezuela" },
  { code: 593, name: "Ecuador" },
  { code: 595, name: "Paraguay" },
  { code: 598, name: "Uruguay" },
  { code: 591, name: "Bolivia" },
  { code: 507, name: "Panama" },
  { code: 506, name: "Costa Rica" },
  { code: 502, name: "Guatemala" },
  { code: 503, name: "El Salvador" },
  { code: 504, name: "Honduras" },
  { code: 505, name: "Nicaragua" },
  { code: 53, name: "Cuba" },
  { code: 1, name: "Canada" },
];
