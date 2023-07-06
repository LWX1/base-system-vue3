<template>
  <BaseModal
    :visible="visible"
    :title="title"
    :handleClose="handleClose"
    :onSubmit="handleSumbit"
    :onCancel="handleClose"
    :width="width"
  >
    <el-tree ref="treeRef" :data="treeData" node-key="id" show-checkbox default-expand-all />
  </BaseModal>
</template>

<script setup lang="ts">
import api from '@/api'
import { ref, toRef, watch } from 'vue'
import BaseModal from 'src/components/BaseModal.vue'
import message from '@/utils/message';
const DEFAULT_API = api.system.menu
const DEFAULT_API_ROLE = api.system.role

const treeData = ref([])
const treeRef = ref()

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '功能授权'
  },
  detail: {
    type: Object,
    default: () => ({})
  },
  cancelModalForm: Function,
  submitModalForm: Function,
  width: {
    type: String,
    default: '500px'
  }
})

// 获取每个节点
const nodeObj:{
  [key: number]: number
} = {
};

// 获取所有的节点及其父节点
const getCurrentNode = (dataList: any[], menuIds: Number[]) => {
  const result: Number[] = [];
  menuIds.forEach((item: any) => {
    result.push(item);
    let parent = nodeObj[item];
    while (parent) {
      result.push(parent);
      parent = nodeObj[parent];
    }
  })

  return Array.from( new Set(result));
}

// 格式化树节点
const formatTreeData = (data: any) => {
  return data.map((item: any) => {
    nodeObj[item.id] = item.parentId;
    if (item.children && item.children.length > 0) {
      return {
        id: item.id,
        value: item.id,
        label: item.name,
        children: formatTreeData(item.children)
      }
    }
    return {
      id: item.id,
      value: item.id,
      label: item.name,
      children: item.children
    }
  })
}

// 获取树节点
const getTreeNode = () => {
  DEFAULT_API.getTree().then((res) => {
    if (res.code === 200) {
      treeData.value = formatTreeData(res.data)
    }
  })
}

// 获取当前树选择节点
const getCurrentTree = () => {
  DEFAULT_API_ROLE.getTree({
    id: props.detail.id
  }).then((res) => {
    if (res.code === 200) {
      treeRef.value.setCheckedKeys(res.data || [])
    }
  })
}

// 关闭弹窗
const handleClose = () => {
  treeRef.value.setCheckedKeys([])
  props.cancelModalForm!()
}

// 提交弹窗
const handleSumbit = () => {
  const menuIds = treeRef.value.getCheckedKeys();
  const menuParentIds = getCurrentNode(treeData.value, menuIds)
  DEFAULT_API_ROLE.saveTree({
    id: props.detail.id,
    menuIds,
    menuParentIds
  }).then((res) => {
    if (res.code === 200) {
      props.submitModalForm!();
      treeRef.value.setCheckedKeys([])
      message.success('授权成功')
    }else {
      message.error(res.mes)
    }
  })
}

watch(
  () => props.visible,
  (val: boolean) => {
    if (val) {
      getTreeNode()
      getCurrentTree()
    }
  }
)

const visible = toRef(props, 'visible')
</script>

<style lang="scss" scoped></style>
