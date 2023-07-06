<template>
  <el-form v-bind="formDefault" @submit.native.prevent="submit">
    <template v-for="item in dataList" :key="item.name">
      <FormItem :defaultFormItemProps="formItemProps" :formItemProps="item" />
    </template>

    <el-form-item v-if="onSubmit || onCancel">
      <el-button v-show="okText" type="primary" @click="submit">{{ okText }}</el-button>
      <el-button v-show="cancelText" @click="onCancel">{{ cancelText }}</el-button>
    </el-form-item>
    <slot name="footer"> </slot>
  </el-form>
</template>

<script setup lang="ts">
// import type { IForm } from '@/types/typeForm'
import { computed, ref } from 'vue'
import FormItem from './FormItem.vue'
import { FormDefaultConfig } from '@/config/index'
const props = defineProps({
  formProps: {
    type: Object,
    default: () => ({})
  },
  dataList: {
    type: Array<Object>,
    required: true,
    default: () => []
  },
  formItemProps: {
    type: Object,
    default: () => ({})
  },
  onSubmit: {
    type: Function,
    default: undefined
  },
  onCancel: {
    type: Function,
    default: undefined
  },
  okText: {
    type: String,
    default: '查询'
  },
  cancelText: {
    type: String,
    default: '重置'
  }
})

const formDefault = computed(() => {
  return Object.assign({}, FormDefaultConfig, props.formProps)
})

const submit = () => {
  props.onSubmit && props.onSubmit()
}
</script>

<style lang="scss" scoped></style>
