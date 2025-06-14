import { type Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                slab: ['"Roboto Slab"', 'serif'],
                inter: ['"Inter"', 'sans-serif'],
                oswald: ['"Oswald"', 'sans-serif'],
            },
        },
    },
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // если ты используешь React
    ],
};

export default config;