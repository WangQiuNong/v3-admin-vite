<script lang="ts" setup>
import { computed } from 'vue'
import { useTheme } from "@/hooks/useTheme"
// 将 Element Plus 的语言设置为中文
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useLang } from '@/hooks/useLang'

const { activeLang } = useLang()
const locale = computed(() => (activeLang.value === 'zh-CN' ? zhCN : en))
const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
