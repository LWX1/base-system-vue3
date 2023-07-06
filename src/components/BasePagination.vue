<template>
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="pageSizeList"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :small="true"
      @size-change="onPageSizeChange"
      @current-change="onChange"
      v-bind="$attrs"
    />
</template>

<script setup lang='ts'>
import { toRef } from 'vue';

const pageSizeList = [5, 10, 20, 50, 100];

const props = defineProps({
    pageNum: {
        type: Number,
        default: 1
    },
    total: {
        type: Number,
        default: 0
    },
    pageSize: {
        type: Number,
        default: 10
    },
    onPageSizeChange: {
        type: Function,
        default: () => {}
    },
    onChange: {
        type: Function,
        default: () => {}
    }
});

const pageNum = toRef(props, 'pageNum');
const pageSize = toRef(props, 'pageSize');
const total = toRef(props, 'total');
</script>

<style lang='scss' scoped>

</style>