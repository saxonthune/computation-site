/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdoc,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
      },
      colors: {
        accent: {
          light: '#2563eb', // blue-600
          dark: '#d4a647',  // warm gold
        },
        dark: {
          bg: '#0d0e0f',        // near-black with warmth
          text: '#c8c3bc',      // warm light gray (body)
          heading: '#e8e2d6',   // cream white (headings)
          muted: '#a39a8f',     // warm gray (stubs, meta) — readable over the glass
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
