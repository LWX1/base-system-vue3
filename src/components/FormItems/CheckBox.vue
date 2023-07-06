<template>
  <el-checkbox-group v-model="formItemProps.value" v-bind="formItemProps.others">
    <el-checkbox
      v-for="item in formItemProps.options || []"
      v-bind="item"
      :key="item.value"
      :label="item.value"
      
    >
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
defineProps({
  formItemProps: {
    type: Object,
    default: () => ({})
  }
})
</script>
