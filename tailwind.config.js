/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced rapper/musician theme colors
        'rap-gold': '#FFD700',
        'rap-platinum': '#E5E4E2', 
        'rap-diamond': '#B9F2FF',
        'rap-purple': '#6B46C1',
        'rap-dark': '#000000',
        'rap-gray': '#1C1C1E',
        
        // Premium iOS colors
        'ios-bg': '#F2F2F7',
        'ios-card': '#FFFFFF',
        'ios-secondary': '#F2F2F7',
        'ios-tertiary': '#F2F2F7',
        'ios-blue': '#007AFF',
        'ios-green': '#30D158',
        'ios-orange': '#FF9F0A',
        'ios-red': '#FF453A',
        'ios-purple': '#BF5AF2',
        'ios-pink': '#FF375F',
        'ios-teal': '#40C8E0',
        'ios-indigo': '#5E5CE6',
        'ios-mint': '#00C7BE',
        'ios-cyan': '#32D74B',
        'ios-gray': '#8E8E93',
        'ios-gray2': '#AEAEB2',
        'ios-gray3': '#C7C7CC',
        'ios-gray4': '#D1D1D6',
        'ios-gray5': '#E5E5EA',
        'ios-gray6': '#F2F2F7',
      },
      fontFamily: {
        'ios': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '16px', 
        'ios-xl': '20px',
      },
      boxShadow: {
        'ios': '0 1px 3px rgba(0,0,0,0.1)',
        'ios-lg': '0 4px 16px rgba(0,0,0,0.1)',
        'ios-xl': '0 8px 32px rgba(0,0,0,0.15)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #FFD700' },
          '100%': { boxShadow: '0 0 40px #FFD700, 0 0 60px #FFD700' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        'mobile': '428px',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}