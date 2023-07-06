<template>
  <BaseForm :formProps="formProps" :dataList="FormLists" :onSubmit="submit" :onCancel="reset" />
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import { ref, reactive, computed, toRef } from 'vue'
import type { IFormItem, IObject } from '@/interface'
import BaseForm from './BaseForm.vue'

const formRef = ref<FormInstance>()

const props = defineProps({
  formList: {
    type: Array<IFormItem>,
    required: true
  },
  onSubmit: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    required: true
  }
})

// 赋值，获取表单数据
const formData: IObject<string> = {}

props.formList.forEach((item: any) => {
  formData[item.name] = item.value
})

// 取值
const form = reactive(formData)

const FormLists = reactive(
  props.formList.map((item: any) => {
    item.width = item.width || '160px'
    item.value = toRef(form, item.name)
    return item
  })
)

const formProps = computed(() => {
  return {
    model: form,
    ref: formRef,
    inline: true
  }
})

// 查询
const submit = () => {
  props.onSubmit(form)
}
// 重置
const reset = () => {
  formRef.value?.resetFields()
  props.onCancel && props.onCancel()
}

defineExpose({
  reset
})

</script>

<style lang="scss" scoped></style>
