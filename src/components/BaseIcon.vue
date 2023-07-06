<template>
    <el-icon>
        <component :is="name" />
    </el-icon>
</template>

<script setup lang='ts'>

defineProps({
  name: {
    type: String,
    default: ''
  }
})



</script>

<style lang='scss' scoped>

</style>