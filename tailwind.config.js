/** @type {import('tailwindcss').Config} */

const content = ['./src/**/*.{vue,js,ts,jsx,tsx}']
const plugins = []
const theme = {
  extend: {
    colors: {
      primary: '#63e2b7',
      warning: '#f2c97d',
      danger: '#e88080',
      info: '#70c0e8'
    }
  }
}
export { content, plugins, theme }