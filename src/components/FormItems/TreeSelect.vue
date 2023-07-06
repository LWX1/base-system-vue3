<template>
  <el-tree-select
    :clearable="true"
    :style="{width: formItemProps.width || '100%'}"
    v-model="formItemProps.value"
    :data="formItemProps.options"
    check-strictly
    :render-after-expand="false"
    v-bind="formItemProps.others"
  />
</template>

<script setup lang="ts">
defineProps({
  formItemProps: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped></style>
