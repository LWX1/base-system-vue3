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
      </div>
    </template>
    <template #roleId="{ column, data }">
      <span >{{ getKeyValue(userRoleList, data.roleId) }}</span>
    </template>
    <template #status="{ column, data }">
      <span :class="data.status === 1? 'success':'fail'">{{ getKeyValue(UserStatus, data.status) }}</span>
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
</template>

<script setup lang="ts">
import message from '@/utils/message'
import messageBox from '@/utils/messageBox'
import { computed, reactive, ref, toRef } from 'vue'
import api from '@/api'
import { formatTime, getKeyValue } from '@/utils'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import BaseForm from '@/components/BaseForm.vue'
import BaseSearch from '@/components/BaseSearch.vue'
import BaseTable from '@/components/BaseTable.vue'
import BtnList from '@/components/BtnList.vue'
import BaseModal from 'src/components/BaseModal.vue'
import {UserStatus} from '@/config/selected'

const DEFAULT_API = api.system.user
const DEFAULT_API_ROLE = api.system.role

/******** 搜索表单 */
const searchRef = ref()
const formList = [
  {
    type: 'Input',
    name: 'username',
    label: '用户名称'
  }
]

const submit = (values: any) => {
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
    title: '用户名称',
    dataIndex: 'username'
  },
  {
    title: '角色',
    dataIndex: 'roleId',
    render: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: true
      
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
    username: string | undefined
  } = {
    username: undefined
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
const title = ref('');
const userRoleList = ref([])

const formModal = reactive({
  id: 0,
  username: '',
  status: 1
})

const formModalRef = ref<FormInstance>()

const FormModalList = computed(() => {
  return [
    {
      type: 'Input',
      name: 'username',
      label: '用户名称'
    },
    {
      type: 'Select',
      name: 'status',
      label: '状态',
      options: UserStatus
    },
    {
      type: 'Select',
      name: 'roleId',
      label: '角色',
      options: userRoleList
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
      username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
      status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
    }
  }
})

// 获取所有的角色
const getRoleList = () => {
  DEFAULT_API_ROLE.all().then((res) => {
    if (res.code === 200) {
      userRoleList.value = (res.data || []).map((item: { name: string; id: number }) => ({
        label: item.name,
        value: item.id
      }))
    }
  })
}

getRoleList();

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
      title.value = '修改用户'
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
    username: '',
    status: 1,
    roleId: undefined
  })
  visible.value = true
  title.value = '新增用户'
}

</script>

<style lang="scss" scoped></style>
