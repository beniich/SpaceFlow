/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary': '#3b82f6',
                'background-dark': '#0f172a',
                'surface-dark': '#1e293b',
                'accent-blue': '#60a5fa',
                'accent-emerald': '#34d399',
                'accent-amber': '#fbbf24',
                'accent-red': '#f87171'
            },
            fontFamily: {
                'display': ['Inter', 'sans-serif']
            },
            borderRadius: {
                'DEFAULT': '0.25rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                'full': '9999px'
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
