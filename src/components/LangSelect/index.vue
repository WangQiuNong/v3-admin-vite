<script lang="ts" setup>
import { type Lang, useLang } from "@/hooks/useLang"
import { Eleme } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { useI18n } from 'vue-i18n';

const { langList, activeLang, setLang } = useLang()
const { t, locale } = useI18n()
function changeLang(lang: Lang) {
  setLang(lang)
  locale.value = lang
  ElMessage.success(t('common.switchLanguage'));
}

</script>

<template>
  <el-dropdown trigger="click">
    <div>
      <el-tooltip effect="dark" :content="t('common.lang')" placement="bottom">
        <el-icon :size="20">
          <Eleme />
        </el-icon>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(lang, index) in langList"
          :key="index"
          :disabled="activeLang === lang.name"
          @click="changeLang(lang.name)"
        >
          <span>{{ lang.title }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
