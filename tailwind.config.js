/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          ink: "#0F172A",
          mute: "#64748B",
          accent: "#0EA5E9"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.05), 0 6px 24px rgba(15, 23, 42, 0.06)"
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}

