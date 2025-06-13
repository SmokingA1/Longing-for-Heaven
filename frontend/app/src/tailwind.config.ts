import { type Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                display: ['var(--font-display)'],
            },
        },
    },
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // если ты используешь React
    ],
};

export default config;