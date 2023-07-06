<template>
  <div class="btn-list">
    <!-- <i-ep-house /> -->
    <el-button type="primary" @click="addData">新增</el-button>
  </div>
  <BaseSearch ref="searchRef" :formList="formList" :onSubmit="submit" :onCancel="reset" />
  <BaseTable
    :tableData="tableData"
    :columns="columns"
    :pagination="pagination"
    :onChange="onChange"
    :onPageSizeChange="onPageSizeChange"
  >
    <template #action="{ column, data }">
      <div class="btn-list">
        <a @click.stop="editData(data)" class="edit"> 修改 </a>
        <a style="margin-left: 8px" @click.stop="removeData(data)" class="delete"> 删除 </a>
        <BtnList :btnList="btnList" :record="data" />
      </div>
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
    width="400px"
  >
    <BaseForm :formProps="formModalProps" :dataList="FormModalLists" />
  </BaseModal>
  <MenuAuth
    :visible="menuAuthVisible"
    :detail="detail"
    :cancelModalForm="cancelMenuAuth"
    :submitModalForm="cancelMenuAuth"
  />
</template>

<script setup lang="ts">
import message from '@/utils/message'
import messageBox from '@/utils/messageBox'
import { computed, reactive, ref, toRef } from 'vue'
import api from '@/api'
import { formatTime } from '@/utils'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import BaseForm from '@/components/BaseForm.vue'
import BaseSearch from '@/components/BaseSearch.vue'
import BaseTable from '@/components/BaseTable.vue'
import BtnList from '@/components/BtnList.vue'
import BaseModal from 'src/components/BaseModal.vue'
import MenuAuth from './components/MenuAuth.vue'

const DEFAULT_API = api.system.role

/******** 搜索表单 */
const searchRef = ref()
const formList = [
  {
    type: 'Input',
    name: 'name',
    label: '角色名称'
  }
]

const submit = (values: any) => {
  // console.log(values)
  getData(values)
}

const reset = () => {
  getData()
}

/******** 表格 */
const tableData = ref([])
const pagination = ref({
  pageNum: 1,
  total: 0,
  pageSize: 10
})
const columns = [
  {
    title: '角色名称',
    dataIndex: 'name'
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

// 按钮
const btnList = [
  {
    name: '菜单授权',
    onClick: (record: any) => {
      // console.log(record)
      menuAuthVisible.value = true
      detail.value = record
    }
  },
  {
    name: '用户列表',
    onClick: (record: any) => {
      console.log(record)
    }
  }
]

// 改变页码
const onChange = (pageNum: number) => {
  pagination.value.pageNum = pageNum
  searchRef.value.reset()
  // getData({
  //   pageNum: page
  // })
}

// 改变每页条数
const onPageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  searchRef.value.reset()
}

const getData = (
  params: {
    name: string | undefined
  } = {
    name: undefined
  }
) => {
  DEFAULT_API.list({
    ...params,
    pageNum: pagination.value.pageNum,
    pageSize: pagination.value.pageSize
  }).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.list || []
      pagination.value = {
        pageNum: res.data.pageNum,
        total: res.data.total,
        pageSize: res.data.pageSize
      }
    }
  })
}

getData()

/*****弹框表单 */

const visible = ref(false)
const title = ref('')

const formModal = reactive({
  id: 0,
  name: ''
})

const formModalRef = ref<FormInstance>()

const FormModalList = computed(() => {
  return [
    {
      type: 'Input',
      name: 'name',
      label: '角色名称'
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
      name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
    }
  }
})

// 提交
const submitModalForm = () => {
  formModalRef.value!.validate(async (valid) => {
    if (valid) {
      if (formModal.id) {
        // 修改
        const res = await DEFAULT_API.update(formModal.id, formModal)
        if (res.code === 200) {
          visible.value = false
          getData()
          message.success('修改成功')
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
          getData()
          message.success('新增成功')
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
      title.value = '修改角色'
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
          getData()
          message.success('删除成功')
        } else {
          message.error(res.msg)
        }
      })
    }
  })
}

const addData = () => {
  Object.assign(formModal, {
    id: 0,
    name: ''
  })
  visible.value = true
  title.value = '新增角色'
}

/****** 菜单授权 */
const menuAuthVisible = ref(false)
const detail = ref({})

const cancelMenuAuth = () => {
  menuAuthVisible.value = false
}

</script>

<style lang="scss" scoped></style>
