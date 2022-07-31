module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/contexts/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        scheme: {
          primary: '#252f54', //"#010A26",
          secondary: '#021140',
          tertiary: '#DCE6F2',
          quaternary: '#ADC5D9',
          quinary: '#593F44',
          senary: '#7198c7',
          buttonbg: '#c7d2dd',
          inputbg: '#763483f2'
        },
        fontcolor: {
          primary: '#a16969f2',
          bold: '#20213e'
        },
        blue: {
          light: '#ADC5D9',
          DEFAULT: '#021140',
          dark: '#010A26'
        },
        pink: {
          light: '#ff7ce5',
          DEFAULT: '#ff49db',
          dark: '#ff16d1'
        },
        green: {
          light: '#e6ffed',
          DEFAULT: '#00ffb2',
          dark: '#00d28e'
        },
        red: {
          light: '#ffc5c5',
          DEFAULT: '#ff49db',
          dark: '#ff16d1'
        },
        outsider: {
          light: '#ffc5c5',
          DEFAULT: '#593F44',
          dark: '#ff16d1'
        },
        light: {
          DEFAULT: '#DCE6F2',
          dark: '#e6e6e6'
        },
        gray: {
          darkest: '#1f2d3d',
          dark: '#3c4858',
          DEFAULT: '#c0ccda',
          light: '#e0e6ed',
          lightest: '#f9fafc'
        }
      },
      // backgroundImage: (theme) => ({
      //     "form-pattern": "url('/img/rect-light.svg')",
      //     "main-texture": "url('/img/contour-line.svg')",
      // }),
      boxShadow: {
        '3xl': '0 0 7px 2px #e9e6e6'
      },
      fontFamily: {
        google: ['Roboto', 'sans-serif']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
