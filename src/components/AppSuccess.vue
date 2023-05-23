<template>
  <div class="success">
    <van-button type="primary">success</van-button>
  </div>
</template>

<script>
export default {
  name: 'AppSuccess',
  props: {
    msg: String
  },
  created:function() {
  },
  methods: {
  }
}
</script>

<style scoped>
.success {
  width: 100%;
  height: 100%;
}
</style>
