<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = ref(zhCn)

</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
