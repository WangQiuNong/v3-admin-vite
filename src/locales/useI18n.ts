import { createI18n } from 'vue-i18n'
import { useLang } from '@/hooks/useLang'
import messages from './index'

const { activeLang } = useLang()
const i18n = createI18n({
  globalInjection: true, //全局生效$t
  locale: activeLang.value,
  fallbackLocale: 'en',
  messages,
  legacy: false
});

export const t = (key: string) => {
  return i18n.global.t(key)
}

export default i18n
