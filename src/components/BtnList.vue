<template>
    <el-dropdown style="display: flex;align-items: center;color: #1890ff;">
        <i-ep-MoreFilled />
        <template v-if="btnList.length" #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item v-for="item in btnList" :key="item.name">
                <span class="deit" @click="item.onClick(record)">{{ item.name }}</span>
            </el-dropdown-item>
        </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang='ts'>
import type { IButton } from '@/interface';
defineProps({
    btnList: {
        type: Array<IButton>,
        default: () => []
    },
    record: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style lang='scss' scoped>

</style>