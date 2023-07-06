<template>
  <div class="btn-list">
    <!-- <i-ep-house /> -->
    <el-button type="primary" @click="addData">新增</el-button>
  </div>

  <BaseTable :tableData="tableData" :columns="columns" default-expand-all > 
      <template #type="{ column, data }">
        <span>{{ menuTypeObj[data.type] }}</span>
      </template>
      <template #action="{ column, data }">
          <a @click.stop="editData(data)" class="edit"> 修改 </a>
          <a style="margin-left: 8px" @click.stop="removeData(data)" class="delete"> 删除 </a>
      </template>
      <template #updateTime="{ column, data }">
        <span>{{ formatTime(data.updateTime) }}</span>
      </template>
      <template #createTime="{ column, data }">
        <span>{{ formatTime(data.createTime) }}</span>
      </template>
  </BaseTable>
 
  <BaseModal
    :visible="visible"
    :title="title"
    :handleClose="cancelModalForm"
    :onSubmit="submitModalForm"
    :onCancel="cancelModalForm"
  >
    <BaseForm :formProps="formModalProps" :dataList="FormModalLists" />
  </BaseModal>
</template>

<script setup lang="ts">
import api from '@/api'
import type { IObject, ITreeNode } from '@/interface'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import { computed, reactive, ref, toRef } from 'vue'
import BaseForm from 'src/components/BaseForm.vue'
import BaseTable from 'src/components/BaseTable.vue'
import BaseModal from 'src/components/BaseModal.vue'
import { IconList, MenuType } from '@/config/selected'
import message from '@/utils/message'
import messageBox from '@/utils/messageBox'
import { SubInfo } from '@/utils/pubSub'
import { formatTime } from '@/utils'

const DEFAULT_API = api.system.menu


/******** 表格 */
const treeData = ref([]);
const tableData = ref([]);
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
  },
  {
    title: '菜单类型',
    dataIndex: 'type',
    render: true,
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    
  },
  {
    title: '菜单路径',
    dataIndex: 'url',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    render: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    render: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: true
  }
]
// 格式化树节点
const formatTreeData = (data: any) => {
  return data.map((item: any) => {
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
      tableData.value = res.data;
      treeData.value = formatTreeData(res.data);
    }
  })
}

getTreeNode()

/*****弹框表单 */

const visible = ref(false)
const title = ref('');

const menuTypeObj:IObject<string> = {
 
};

MenuType.forEach((item) => {
  menuTypeObj[item.value] = item.label
})

const formModal = reactive({
  id: 0,
  name: '',
  parentId: undefined,
  url: '',
  icon: '',
  type: 1
})

const formModalRef = ref<FormInstance>()

const FormModalList = computed(() => {
  return [
    {
      type: 'Input',
      name: 'name',
      label: '菜单名字'
    },
    {
      type: 'TreeSelect',
      name: 'parentId',
      label: '父级菜单',
      options: [
        {
          id: 0,
          value: 0,
          label: '顶级菜单',
          children: treeData
        }
      ]
    },
    {
      type: 'Input',
      name: 'url',
      label: '菜单路径'
    },
    {
      type: 'Select',
      name: 'icon',
      label: '菜单图标',
      options: IconList.map((item) => {
        return {
          label: item.label,
          value: item.label,
          icon: item.value
        }
      })
    },
    {
      type: 'Select',
      name: 'type',
      label: '类型',
      options: MenuType
    }
  ]
})

const FormModalLists = reactive(
  FormModalList.value.map((item: any) => {
    item.value = toRef(formModal, item.name)
    return item
  })
)

const formModalProps = computed(() => {
  return {
    model: formModal,
    ref: formModalRef,
    rules: {
      name: [{ required: true, message: '请输入菜单名字', trigger: 'blur' }],
      type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      url: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }]
      // icon: [{ required: true, message: '请输入菜单图标', trigger: 'blur' }]
    }
  }
})

// 提交
const submitModalForm = () => {
  formModalRef.value!.validate(async (valid) => {
    if (valid) {
      console.log(formModal)
      if (formModal.id) {
        // 修改
        const res = await DEFAULT_API.update(formModal.id, formModal)
        if (res.code === 200) {
          visible.value = false
          getTreeNode()
          message.success('修改成功')
          publishChangeMenuList();
        } else {
          message.error(res.msg)
        }
      } else {
        const obj = {
          ...formModal,
          id: undefined
        }
        // 新增
        const res = await DEFAULT_API.insert(obj)
        if (res.code === 200) {
          visible.value = false
          getTreeNode()
          message.success('新增成功')
          publishChangeMenuList();
        } else {
          message.error(res.msg)
        }
      }
      
    }
  })
}

// 取消
const cancelModalForm = () => {
  visible.value = false
}

/********* 新增、修改、删除 */
const editData = (values: any) => {
  DEFAULT_API.detail(values.id).then((res) => {
    if (res.code === 200) {
      res.data.parentId = res.data.parentId || undefined
      Object.assign(formModal, res.data)
      visible.value = true
      title.value = '修改菜单'
    } else {
      message.error(res.msg)
    }
  })
}

const removeData = (values: any) => {
  messageBox.delete((bool: boolean) => {
    if (bool) {
      DEFAULT_API.delete(values.id).then((res) => {
        if (res.code === 200) {
          getTreeNode()
          message.success('删除成功');
          publishChangeMenuList();
        } else {
          message.error(res.msg)
        }
      })
    }
  })
}

const addData = () => {
  // console.log('新增')
  Object.assign(formModal, {
    id: 0,
    name: '',
    parentId: undefined,
    url: '',
    icon: '',
    type: 1
  })
  visible.value = true
  title.value = '新增菜单'
}

/*******菜单联动 */
// 发布菜单改变
const publishChangeMenuList = () => {
  SubInfo.publish("changeRouter");
  formModalRef.value!.resetFields()
}

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
