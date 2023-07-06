<template>
  <el-select
  :style="{width: formItemProps.width || '100%'}"
    :clearable="true"
    v-model="formItemProps.value"
    v-bind="formItemProps.others"
    v-on="formItemProps.events"
  >
    <el-option
      v-for="item in formItemProps.options || []"
      v-bind="item"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <template v-if="item.icon">
        <BaseIcon :name="item.icon" />
        {{ item.value  }}
      </template>
      <span v-else> {{ item.label }}</span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import BaseIcon from "src/components/BaseIcon.vue"
defineProps({
  formItemProps: {
    type: Object,
    default: () => ({})
  }
})
</script>
