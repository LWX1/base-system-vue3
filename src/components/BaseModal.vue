<template>
  <el-dialog
    v-model="open"
    :title="title"
    :width="width"
    :before-close="handleClose"
    v-bind="$attrs"
  >
    <slot></slot>
    <template #footer v-if="showFooter">
      <div style="display: flex; justify-content: flex-end">
        <el-button  @click="onCancel"> {{ cancelText }} </el-button>
        <el-button type="primary" @click="onSubmit">{{ okText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  handleClose: {
    type: Function,
    default: () => {}
  },
  onSubmit: {
    type: Function,
    default: () => {}
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  width: {
    type: String || Number,
    default: '50%'
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  okText: {
    type: String,
    default: '提交'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})
const open = computed(() => {
  return props.visible
})
</script>

<style lang="scss" scoped></style>
