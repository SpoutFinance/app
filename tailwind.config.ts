import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateRows: {
        "fit-3": "repeat(3, minmax(0, 1fr))",
      },
      gridTemplateColumns: {
        "fit-2": "repeat(2, minmax(0, 1fr))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        lora: ["var(--font-lora)", ...defaultTheme.fontFamily.serif],
        "noto-sans": ["var(--font-noto-sans)", ...defaultTheme.fontFamily.sans],
        "pt-serif": ["var(--font-pt-serif)", ...defaultTheme.fontFamily.serif],
        "dm-sans": ["var(--font-dm-sans)", ...defaultTheme.fontFamily.sans],
        figtree: ["var(--font-figtree)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        spout: {
          primary: "hsl(var(--spout-primary))",
          accent: "hsl(var(--spout-accent))",
          "text-muted": "hsl(var(--spout-text-muted))",
          "text-secondary": "hsl(var(--spout-text-secondary))",
          "text-gray": "hsl(var(--spout-text-gray))",
          border: "hsl(var(--spout-border))",
          blue: "hsl(var(--spout-blue))",
          gray: "hsl(var(--spout-gray))",
          "light-gray": "hsl(var(--spout-light-gray))",
          "deep-teal": "#004040",
          "text-muted-dark": "#525252",
          "gradient-red": "rgba(255, 0, 0, 0.76)",
          "gradient-peach": "rgba(255, 201, 135, 0.76)",
          "gradient-orange": "rgba(255, 100, 50, 0.5)",
          "gradient-cyan": "rgba(78, 210, 255, 0.68)",
          "gradient-blue": "rgba(0, 87, 216, 0.68)",
          "gradient-blue-mid": "rgba(39, 148, 236, 0.68)",
        },
        // Dashboard color scheme
        dashboard: {
          // Primary teal colors
          teal: {
            DEFAULT: "#004a4a",
            hover: "#003838",
            dark: "#002828",
          },
          // Text colors
          text: {
            primary: "#171717",
            heading: "#131313",
            secondary: "#666666",
            label: "#4a4a4a",
            muted: "#929292",
            hint: "#888888",
            placeholder: "#898989",
            subtle: "#828282",
            dark: "#444444",
          },
          // Background colors
          bg: {
            DEFAULT: "#fafafa",
            active: "#f1f1f1",
            hover: "#f5f5f5",
            "row-hover": "#f9f9f9",
            light: "#efefef",
            subtle: "#f8f8f8",
            "light-subtle": "#F0F0F0",
            "light-blue": "#f5f8fc",
            disabled: "#fbfbfb",
            selected: "#fafcff",
            card: "#fdfdfd",
            summary: "#f6f6f6",
            toggle: "#e8e8e8",
          },
          // Border colors
          border: {
            DEFAULT: "#e6e6e6",
            light: "#e0e0e0",
            input: "#e2e2e2",
            subtle: "#e1e1e1",
            muted: "#e3e3e3",
            modal: "#f0f0f0",
            checkbox: "#d1d5db",
          },
          // Notification/accent colors
          accent: {
            blue: "#3d5678",
            "blue-dark": "#1e3a5f",
            "blue-light": "#a7c6ed",
            "blue-bg": "#e8f3ff",
            "blue-highlight": "#f7fbff",
            "blue-hover": "#f0f7ff",
            success: "#078842",
            "success-light": "#22c55e",
            "success-bg": "#deffee",
            error: "#e23434",
            "error-dark": "#D60404",
            "error-bg": "#FFE5E5",
            warning: "#f59e0b",
            "warning-dark": "#9F6B00",
            "warning-bg": "#fffaed",
            "warning-border": "#ffe9a9",
            "warning-light": "#fef3c7",
            caution: "#baac4d",
            "at-risk-bg": "#fee2e2",
            usdc: "#2775ca",
            disabled: "#cccccc",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "radial-gradient-green-blue":
          "`radial-gradient(60% 100% at left 60%, rgba(61, 199, 132, 0.38), transparent 70%),\r\n          radial-gradient(150% 100% at right 60%, rgba(88, 162, 255, 0.38), transparent 70%)`",
        "linear-gradient-1":
          "linear-gradient(180deg, #ABFFE1 0%, #DCFFE2 100%)",
        "linear-gradient-2":
          "linear-gradient(180deg, #FEC8BB 0%, #FFE4C8 100%)",
        "linear-gradient-3":
          "linear-gradient(180deg, #ADE1FF 0%, #E8FBF9 100%)",
        "linear-gradient-green-2":
          "linear-gradient(180deg, #48CA83 0%, #C1F672 100%)",
        "linear-gradient-blue-2":
          "linear-gradient(180deg, #0168FF 0%, #02BFFF 100%)",
        "linear-gradient-4":
          "linear-gradient(180deg, #FEBB46 0%, #FEE6A9 100%)",
        "linear-gradient-5":
          "linear-gradient(180deg, #FAB6E4 0%, #F8CCE9 100%)",
        "linear-gradient-blue-3":
          "linear-gradient(180deg, #4FACFF 0%, #00F5FF 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-in-right": {
          from: {
            transform: "translateX(100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "slide-out-right": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
