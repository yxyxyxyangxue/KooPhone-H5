<template>
  <router-link to="/AppOrder" class="app-home"></router-link>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>

<style>
html, body, #app {
  width:100%;
  max-width: 46.8rem;
  overflow-x: hidden;
  margin: auto;
}
</style>
