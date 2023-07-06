<template>
  <el-cascader
    :clearable="true"
    style="width:100%"
    v-model="formItemProps.value"
    :options="formItemProps.options"
    @change="formItemProps.change"
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
