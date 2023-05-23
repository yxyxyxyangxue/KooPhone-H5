<template>
  <div class="order">
    <van-button type="primary" @click="getTraffic">0元领取</van-button>
  </div>
</template>

<script>
import { getAllData } from '../api/axios';
export default {
  name: 'AppOrder',
  props: {
    msg: String
  },
  created:function() {

    getAllData().then((res) => {
      console.log(res)
    })
  },
  methods: {
    getTraffic:function() {
      console.log('click');
      this.$router.push('/AppSuccess');
    }
  }
}
</script>

<style scoped>
.order {
  width: 100%;
  height: 100%;
}
</style>
