<template>
    <el-container class="layout-container">
        <el-aside class="layout-side-left"
            v-show="showSide">
            <Side />
        </el-aside>
        <el-container :class="['layout-side-right', showSide ? 'side-show' : 'side-hide']">
            <el-header class="layout-header">
                <div>{{SystemName}}</div>
                <div class="user-info">
                    <el-avatar size="small" :src="HeaderImg" />
                    <el-dropdown>
                        <span class="user-name">
                            {{ username }}
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item >
                                <span @click="loginOut">退出登录</span>
                            </el-dropdown-item>
                            
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                   
                </div>
            </el-header>
            <el-main class="layout-content">
                <RouterView />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import Side from './components/Side.vue';
import HeaderImg from '@/assets/images/photo.png'
import {RouterPrefix, SystemName} from '@/config'
const router = useRouter()

const showSide = ref(true);
const username = localStorage.getItem('username');

const loginOut = () => {
    router.push({
        path: `${RouterPrefix}/login`
      });
}

</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
