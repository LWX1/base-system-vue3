import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import { NotFoundRoute, NotFoundComponent, Routes, LoginRoute, PluginRoutesComponent } from './data'
import api from '@/api'
import type { IAside, IMenu, IObject, IResponse } from '@/interface'
import type { App } from 'vue'
import { SubInfo } from '@/utils/pubSub'

// 获取自定义的路由已拼接
const RoutesObj: IObject<RouteRecordRaw> = {}

// 获取自定义的路由和404路由
const PublicRoutes: Array<RouteRecordRaw> = [...NotFoundRoute, ...LoginRoute, ...PluginRoutesComponent]

// 遍历自定义路由
const formatRoutes = (data: Array<RouteRecordRaw>) => {
  data.forEach((item: RouteRecordRaw) => {
    RoutesObj[item.path] = item
    if (item.redirect) {
      PublicRoutes.push(item)
    };
    if (item.children && item.children.length > 0) {
      item.children = item.children.map(child => {
        child.path = `${item.path}/${child.path}`;
        return child;
      })
      formatRoutes(item.children)
    }
  })
}
formatRoutes(Routes);

// 格式化路由
const formatRouter = (data: Array<IMenu>): Array<RouteRecordRaw> => {
  return data.map((item: IMenu) => {
    item.url = item.url?.charAt(0) === '/' ? item.url : `/${item.url}`
    const obj: RouteRecordRaw = {
      path: item.url as string,
      name: item.name,
      redirect: item.redirect,
      children: []
    }
    if (item.url && RoutesObj[item.url]) {
      obj.component = RoutesObj[item.url].component
      if (item.children && item.children.length > 0) {
        return {
          ...obj,
          children: formatRouter(item.children)
        }
      }
      return obj
    }
    obj.component = NotFoundComponent
    return obj
  })
}

// 保存路由到浏览器
const saveRouter = (data: Array<RouteRecordRaw>) => {
  const fun = (values: Array<RouteRecordRaw>): Array<IAside>=> {
    return values.map((item: RouteRecordRaw) => {
      if (item.children && item.children.length > 0) {
        return {
          path: item.path as string,
          name: item.name as string,
          children: fun(item.children)
        }
      }
      return {
        path: item.path as string,
        name: item.name as string,
      }
    })
  }
  // 过滤404和重定向
  const filterData = data.filter((item) => {
    if (item.redirect) {
      return false
    } else if (item.component === NotFoundComponent) {
      return false
    }
    return true
  })
  const result = fun(filterData);
  // 保存菜单列表,过滤404和重定向
  localStorage.setItem('menuList', JSON.stringify(result));

  // 发布更新菜单列表
  SubInfo.publish('updateMenuList');
}

const AppData: {
  instance: App<Element> | null,
  router: ReturnType<typeof createRouter> | null,
  requestData: Array<RouteRecordRaw> | null
} = {
  instance: null,
  router: null,
  requestData: null
}

// 初始化公共路由
export const initPublicRouter = (app: App<Element>) => {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: PublicRoutes
  })
  router.beforeEach((to, from, next) => {
    if(to.name === 'login') {
      localStorage.clear()
      next && next()
    }else {
      if(!localStorage.getItem("menuList") || !AppData.requestData) {
        addRequestRouter(next, to)
      }else {
        AppData.requestData.forEach((item: RouteRecordRaw) => {
          AppData.router?.addRoute(item);
        })
        next && next()
      }
    }
   
  })
  AppData.instance = app;
  AppData.router = router;
  app.use(router);
  app.mount('#app');
  
}

// 初始化私有路由
const addRequestRouter = (next?: NavigationGuardNext, to?: RouteLocationNormalized | Error) => {
  api.system.menu.getAuthTree().then((res: IResponse<Array<IMenu>>) => {
    if (res.code === 200) {
      const data = res.data
      const result = formatRouter(data);
      // console.log(result, 'result')
      // 移除之前的路由
      AppData.requestData?.forEach((item: RouteRecordRaw) => {
        AppData.router?.removeRoute(item.name as string);
      })

      // 添加新的路由
      result.forEach((item: RouteRecordRaw) => {
        AppData.router?.addRoute(item);
      })
      AppData.requestData = result;
      saveRouter([...result]);
    }
  }).finally(() => {
    next && next({
      ...to,
      replace: true
    })
  })
}

// 菜单改变，添加路由
SubInfo.subscribe('changeRouter', addRequestRouter);
