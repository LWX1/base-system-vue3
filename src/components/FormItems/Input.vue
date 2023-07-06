<template>
  <el-input
    :clearable="true"
    :placeholder="getPlaceholder(formItemProps)"
    v-bind="formItemProps.others"
    v-on="formItemProps.events"
    v-model="formItemProps.value"
    :style="{width: formItemProps.width || '100%'}"
  >
    <template v-if="CurrentComponent" #append>
      <CurrentComponent v-bind="CurrentComponentProps" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { getPlaceholder } from './getPlaceholder'
const props = defineProps({
  formItemProps: {
    type: Object,
    default: () => ({})
  }
})

const com = props.formItemProps.component || {}
const CurrentComponent = com.render && defineAsyncComponent(com.render);
const CurrentComponentProps = com.props || {}
</script>
