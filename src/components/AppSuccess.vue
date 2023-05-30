<template>
  <div class="success">
     <span class="phone-mask">123****9374{{mobilemask}}</span>
    <div class="order-center">
      <div class="order-btn success-btn" @click="handleSuccess"></div>
      <p class="order-info">活动时间：即日起-{{new Date().getFullYear()}}年12月31日</p>
      <div class="order-rule">
        <p class="order-title">——·活动规则·——</p>
        <div v-for="item in ruleList" :key="item.id">
          <span :class="item.type === 'title' ? 'order-subtitle' : 'order-content'">{{item.content}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSuccess',
  props: {
    msg: String
  },
  data:function() {
    return {
      ruleList:[{
        id:0,
        type: 'title',
        content:'1、用户对象'
      },{
        id:1,
        type: 'content',
        content:'仅限中国移动用户（不含WAP不限量套餐用户、副卡用户、物联网卡用户）'
      },{
        id:2,
        type: 'title',
        content:'2、活动时间'
      },{
        id:3,
        type: 'content',
        content:`即日起～${new Date().getFullYear()}年12月31日`
      },{
        id:4,
        type: 'title',
        content:'3、奖品说明'
      },{
        id:5,
        type: 'content',
        content:'云手机定向流量：用户每月可享0元30GB云手机-进入云机内使用（不含应用上传）免流量。具体适用范围见第7点。'
      },{
        id:6,
        type: 'title',
        content:'4、定向流量有效期'
      },{
        id:7,
        type: 'content',
        content:'云手机客户端（）'
      }],
      mobilemask:''
    }
  },
  created:function() {
  },
  methods: {
    handleSuccess:function() {

    }
  }
}
</script>

<style scoped>
.success {
  width: 100%;
  height: 100%;
  background:url("../assets/success.jpg") no-repeat;
  background-size:100% 100%;
}
.success-btn {
  background:url("../assets/use-btn.png") no-repeat;
  background-size: 100% 100%;
}
</style>
