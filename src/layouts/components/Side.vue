<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    default-active="2"
    text-color="#fff"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    router="true"
  >
    <template v-for="item in menuLists" :key="item.name">
      <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
          <!-- <i :class="item.icon"></i> -->
          <span slot="title">{{ item.name }}</span>
        </template>
        <el-menu-item-group>
          <template v-for="subItem in item.children" :key="subItem.name">
            <el-menu-item :index="subItem.path">
              <!-- <i :class="subItem.icon"></i> -->
              <span slot="title">{{ subItem.name }}</span>
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-sub-menu>
      <el-menu-item v-else :index="item.path">
        <!-- <i :class="item.icon"></i> -->
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { SubInfo } from '@/utils/pubSub';
import { ref } from 'vue'

let menuList = localStorage.getItem('menuList')

const menuLists = ref(menuList ? JSON.parse(menuList) : []) ;

// 订阅更新菜单列表
SubInfo.subscribe("updateMenuList", () => {
  let menuList = localStorage.getItem('menuList')
  menuLists.value = menuList ? JSON.parse(menuList) : [];
})


const isCollapse = ref(false)

const handleOpen = (e) => {
  console.log('handleOpen', e)
}
const handleClose = () => {
  console.log('handleClose')
}
</script>

<style lang="scss" scoped></style>
