/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            spacing: {
                '5px': '5px',
                '10px': '10px',
                '12px': '12px',
                '15px': '15px',
                '20px': '20px',
                '24px': '24px',
                '30px': '30px',
                '60px': '60px',
                '75px': '75px',
                '95px': '95px',
                '100px': '100px',
                '160px': '160px',
            },
            borderRadius: {
                'rounded-75': '75px', // Fixed value
            },
            screens: {
                'ss': '320px',
                'sm': '576px',
                'md': '768px',
                'lg': '992px',
                'xl': '1200px',
                '2xl': '1536px',
            },
            colors: {
                'regal-blue-2': '#243c5a',
                'black': '#000',
                'white': '#fff',
                'purple': '#B80E45',
            },
        },
    },
    plugins: [],
}
