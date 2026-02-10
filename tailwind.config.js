module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px', // Super small smartphones (360-408px)
        sm: '409px', // Small-medium smartphones (409-639px)
        md: '640px', // Medium-large smartphones (640-767px)
        lg: '768px', // Tablets
        xl: '1024px', // Laptops
      },
    },
  },
};
