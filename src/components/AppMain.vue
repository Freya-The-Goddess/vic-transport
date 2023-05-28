<template>
  <v-main id='app-main'>
    <router-view></router-view>
  </v-main>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style scoped>
#app-main {
  min-height: 80%;
}
</style>
