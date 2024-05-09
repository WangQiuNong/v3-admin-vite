import { ref, watchEffect } from "vue"
import { getActiveLang, setActiveLang } from "@/utils/cache/local-storage"

const DEFAULT_LANG = "zh-CN"
type DefaultLang = typeof DEFAULT_LANG

export type Lang = DefaultLang | string

interface LangList {
  title: string
  name: Lang
}

const langList: LangList[] = [
  {
    title: "简体中文",
    name: DEFAULT_LANG
  },
  {
    title: "English",
    name: "en"
  }
]

/** 正在应用的主题名称 */
const activeLang = ref<Lang>(getActiveLang() || DEFAULT_LANG)

/** 设置主题 */
const setLang = (value: Lang) => {
  activeLang.value = value
}

/** 初始化 */
const initLang = () => {
  // watchEffect 来收集副作用
  watchEffect(() => {
    const value = activeLang.value
    setActiveLang(value)
  })
}

/** 主题 hook */
export function useTheme() {
  return { langList, activeLang, initLang, setLang }
}
