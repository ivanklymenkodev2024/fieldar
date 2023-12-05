import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        panel: 'calc(100% - 320px)',
        sidebar: '320px',
      },
      height: {
        menu: 'calc(100% - 220px)',
        ttable: 'calc(100vh - 400px)',
        actable: 'calc(100vh - 280px)',
      },
      colors: {
        gray: {
          "2": "#2A2A2A",
          "3": "#343434",
          "3-5": "#4F5362",
          "4": "#484848",
          "5": "#54B7B9",
          "7": "#707070",
          "7-5": "#979797",
          "8": "#9F9F9F",
          "9": "#ABABAB",
          "10": "#C1C1C1",
          "10-5": "#C9C9C9",
          "11": "#DFDFDF",
          "12": "#FBFBFB"
        },
        red: {
          primary: "#FF7878",
        },
        custom: {
          "1": "#62D3D5"
        }
      },
      fontFamily: {
        primary: "Open Sans"
      },
      fontSize: {
        "2xsmall": "14px",
        sxsmall: '15px',
        primary: '16px',
        xsmall: '14px',
        small: '18px',
        msmall: '20px',
        ssmall: '22px',
        medium: '24px',
        sbig: '26px',
        big: '28px',
        "2xbig": '43px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
export default config
