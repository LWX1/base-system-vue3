import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 语言
import ElementPlus from 'element-plus'

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { initPublicRouter } from './router'

const app = createApp(App)

// app.use(router)

app.use(ElementPlus as any, {
  locale: zhCn
})

initPublicRouter(app)
export default app
