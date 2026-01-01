/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./projects/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom enterprise colors if needed
                primary: '#0f172a', // Slate 900
                accent: '#38bdf8', // Sky 400
            }
        },
    },
    plugins: [],
    darkMode: 'class', // Enable class-based dark mode
}
