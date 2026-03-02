// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    // 禁用可能与 antd 冲突的核心插件（如背景、边框等，按需调整）
    preflight: false, // 禁用 Tailwind 的默认样式重置（避免影响 antd 的 normalize.css）
    // 其他按需禁用...
  },
  // 如果遇到 Ant Design 与 Tailwind 的样式冲突，可在 tailwind.config.js 中自定义主题，避免覆盖 Ant Design 的核心样式：
  theme: {
    extend: {
      colors: {
        primary: '#165DFF', // 与 Ant Design 主色调保持一致
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};