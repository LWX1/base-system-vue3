<template>
  <div class="login-box">
    <el-card class="box-card">
      <h3>登录</h3>
      <BaseForm :formProps="formProps" :dataList="FormLists" />
      <el-button type="primary" @click="login(formRef as any)">登录</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import BaseForm from 'src/components/BaseForm.vue'
import { computed, reactive, ref, toRef, onBeforeMount, onBeforeUnmount } from 'vue'

import { User, Lock } from '@element-plus/icons-vue'
import { SubInfo } from '@/utils/pubSub'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import api from '@/api'
import message from '@/utils/message'
import { useRouter } from 'vue-router'
import { RouterPrefix } from '@/config'
import { publicKeyEncrypt } from '@/utils/aes'

const router = useRouter()

const formRef = ref<FormInstance>()

const form = reactive({
  username: 'lwx',
  password: '123456',
  code: ''
})

const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'change'
    }
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'change'
    }
  ]
})

const formProps = computed(() => {
  return {
    model: form,
    rules,
    ref: formRef
  }
})

const FormList = [
  {
    type: 'Input',
    name: 'username',
    label: '用户名',
    others: {
      'prefix-icon': User
    }
  },
  {
    type: 'Input',
    name: 'password',
    label: '密码',
    others: {
      'prefix-icon': Lock,
      type: 'password'
    }
  },
  {
    type: 'Input',
    name: 'code',
    label: '验证码',
    component: {
      render: () => import('./CodeComponent.vue')
    }
  }
]

const FormLists = reactive(
  FormList.map((item: any) => {
    item.value = toRef(form, item.name)
    return item
  })
)

// 获取盐
const getProfile = (token: string) => {
  localStorage.setItem('token', token)
  api.login.profile().then((res: any) => {
    if (res.code === 200) {
      const { username, userId } = res.data
      localStorage.setItem('username', username)
      localStorage.setItem('userId', userId)
      // console.log(router)
      router.push({
        path: `${RouterPrefix}/wx`
      })
    }
  })
}

// 登录
const startLogin = () => {
  // console.log(form.password)
  api.login
    .doLogin({
      ...form,
      password: publicKeyEncrypt(form.password)
    })
    .then((res: any) => {
      if (res.code === 200) {
        getProfile(res.data.access_token)
      } else {
      }
    })
    .catch((res: any) => {
      message.error(res.msg)
      SubInfo.publish('code')
    })
}

const login = (formEl: FormInstance) => {
  // console.log(form)
  formEl.validate((valid: any, fields: any) => {
    if (valid) {
      startLogin()
      // console.log(form)
    } else {
      // console.log('error submit!', fields)
    }
  })
}

// 监听enter键
const getKey = (e: any) => {
  if (e.keyCode === 13) {
    login(formRef.value as any)
  }
}

onBeforeMount(() => {
  document.addEventListener('keydown', getKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', getKey)
})
</script>

<style lang="scss" scoped>
.login-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(217deg, rgba(211, 214, 37, 1) 0%, rgba(253, 187, 45, 1) 100%);
}

.box-card {
  width: 400px;
  text-align: center;
}
</style>
