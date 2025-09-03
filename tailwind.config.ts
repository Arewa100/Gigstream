/** @type {import('tailwindcss').Config} */
const figmaScale = 0.9;

// Helper function to scale values
const scaleValues = (values) => {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === 'string' && value.includes('px') 
        ? `${Math.round(parseFloat(value) * figmaScale)}px`
        : value
    ])
  );
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // This scales all default Tailwind spacing
    spacing: scaleValues({
      '0': '0px', 'px': '1px', '0.5': '2px', '1': '4px', '1.5': '6px',
      '2': '8px', '2.5': '10px', '3': '12px', '3.5': '14px', '4': '16px',
      '5': '20px', '6': '24px', '7': '28px', '8': '32px', '9': '36px',
      '10': '40px', '12': '48px', '14': '56px', '16': '64px', '20': '80px',
      '24': '96px', '28': '112px', '32': '128px', '40': '160px', '48': '192px',
      '56': '224px', '64': '256px', '80': '320px', '96': '384px'
    }),
    
    extend: {

      height: {
        '618': `${Math.round(618 * 0.9)}px`, // 556px
        '416': `${Math.round(416 * 0.9)}px`, // 374px
      },
      fontFamily: {
        'roboto': ['Roboto Flex', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      screens: {
        'mobile-screen': '320px',
        'tablets': '768px'
      },
      boxShadow: {
        'radial-sm': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)',
        'radial-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1)',
        'radial-sm-faint': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 -1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 1px 0 rgba(0, 0, 0, 0.05), 0 -1px 1px 0 rgba(0, 0, 0, 0.05)',
        'radial-sm-soft': '0 1px 3px rgba(0, 0, 0, 0.05), 0 -1px 3px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05), 0 -2px 4px rgba(0, 0, 0, 0.05)',
        'radial-sm-soft-faint': '0 1px 2px rgba(0, 0, 0, 0.03), 0 -1px 2px rgba(0, 0, 0, 0.03), 0 2px 3px rgba(0, 0, 0, 0.03), 0 -2px 3px rgba(0, 0, 0, 0.03)',
        'radial-sm-less-noticeable': '0 0.5px 1.5px rgba(0, 0, 0, 0.02), 0 -0.5px 1.5px rgba(0, 0, 0, 0.02), 0 1.5px 2.5px rgba(0, 0, 0, 0.02), 0 -1.5px 2.5px rgba(0, 0, 0, 0.02)'
      }
    },
  },
  plugins: [],
}