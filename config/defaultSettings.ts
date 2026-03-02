import type { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  headerTheme: 'dark',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '公司数字化管理平台',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/c/font_5113905_7z9i2cs4lmt.js',
};

export type { DefaultSettings };

export default proSettings;
