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
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
        lora: ["var(--font-lora)", ...defaultTheme.fontFamily.serif],
        "noto-sans": ["var(--font-noto-sans)", ...defaultTheme.fontFamily.sans],
        "pt-serif": ["var(--font-pt-serif)", ...defaultTheme.fontFamily.serif],
        "dm-sans": ["var(--font-dm-sans)", ...defaultTheme.fontFamily.sans],
        "dm-mono": ["var(--font-dm-mono)", ...defaultTheme.fontFamily.mono],
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
        slate: {
          600: "#3D5678",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
