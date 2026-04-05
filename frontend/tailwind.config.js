/**
 * @file tailwind.config.js
 * @description Why this file exists: To define the custom styling system, theme tokens, and path scanners for Tailwind CSS in the frontend.
 * @description Responsibility: Instructs Tailwind on where to scan for class names (content files) and configures custom campus branding color sets (primary blues) and theme extension mappings.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Define content files to scan for utility class extraction
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define cohesive campus colors (primary blues matching academic themes)
      colors: {
        primary: {
          50: '#f0fdfa',
          100: 'rgba(20, 184, 166, 0.15)',
          200: 'rgba(20, 184, 166, 0.3)',
          300: '#99f6e4',
          400: '#2dd4bf',
          500: '#14B8A6', // Teal Brand Primary
          600: '#14B8A6',
          700: '#0D9488', // Teal Hover
          800: '#0f766e',
          900: '#115e59',
          950: '#042f2e',
        },
        slate: {
          50: '#0B0F19',   // Dark Navy Body background
          100: '#111827',  // Card background
          150: '#1f2937',  // Lighter navy elements
          200: '#1f2937',  // Thin borders / dividers
          300: '#374151',  // Inputs border
          400: '#6b7280',  // Very muted text
          500: '#9ca3af',  // Muted text
          600: '#d1d5db',  // Readable subtext
          700: '#e5e7eb',  // Regular text
          800: '#f3f4f6',  // Light headings
          900: '#F9FAFB',  // Bright headings / title text (F9FAFB)
          950: '#0f172a',  // Sticky header / Footer background
        },
      },
      fontFamily: {
        // Enforce modern premium typography
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/**
 * Line-by-line Explanation:
 * Line 7: Declares Configuration type exports for IDE IntelliSense support.
 * Line 10-13: Sets content array mapping files index.html and all files in source src/ containing js, ts, jsx, tsx extensions to scan for classes.
 * Line 16-29: Extends core color palettes with customized primary colors. Level 500 represents the base branding color, while light (50-400) and dark (600-900) shades support hover and border states.
 * Line 31-33: Declares standard typography font family mapping to Inter.
 */
