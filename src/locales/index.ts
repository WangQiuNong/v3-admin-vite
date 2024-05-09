import zhCN from './modules/zh-CN';
import en from './modules/en';

const locales = {
  'zh-CN': zhCN,
  en: en
};

export type LocaleKey = keyof typeof locales;

export default locales;
