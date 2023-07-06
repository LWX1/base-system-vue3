<template>
  <div class="code-box cursor" v-html="imgUrl" @click="getCode" />
</template>

<script setup lang="ts">
import { SubInfo } from '@/utils/pubSub';
import API from 'src/api'
import { ref } from 'vue'

const imgUrl = ref('')
const getCode = () => {
    API.login.getCode().then((res: any) => {
        imgUrl.value = res
    })
}

getCode();

defineExpose({
    getCode
})

SubInfo.subscribe("code", getCode);

</script>

<style lang="scss" scoped>
    .code-box {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
