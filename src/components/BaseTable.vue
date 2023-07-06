<template>
  <el-table :data="tableData" style="width: 100%" row-key="id" v-bind="$attrs">
    <el-table-column
      v-for="item in columns"
      :key="item.title"
      :prop="item.dataIndex"
      :label="item.title"
      :width="item.width"
    >
      <template #default="scope">
        <template v-if="item.render">
          <slot :name="item.dataIndex" :column="item" :data="scope.row"></slot>
        </template>
        <template v-else>
          <span>{{ scope.row[item.dataIndex] }}</span>
        </template>
      </template>
    </el-table-column>

    <slot></slot>
  </el-table>
  <template v-if="pagination">
    <div style="display: flex; justify-content: flex-end; padding: 16px">
      <BasePagination
        :current="pagination.current"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :onChange="onChange"
        :onPageSizeChange="onPageSizeChange"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { ITableColumns } from '@/interface'
import BasePagination from './BasePagination.vue'

defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array<ITableColumns>,
    default: () => []
  },
  pagination: {
    type: Object,
  },
  onChange: {
    type: Function,
    default: () => {}
  },
  onPageSizeChange: {
    type: Function,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped></style>
