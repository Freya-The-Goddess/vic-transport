<template>
  <div id='app-header' class='bg-header-footer-grey'>
    <v-container>
      <v-row>
        <v-col class='d-flex align-center pb-0'>
          <app-logo class='d-inline-block me-1'></app-logo>
          <h1
            class='text-h4 font-weight-bold d-inline-block mt-1 ms-1'
            :class='xs ? "title-xs" : ""'
          >Vic Transport</h1>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useDisplay } from 'vuetify'

// Child components
import AppLogo from '../components/AppLogo.vue'

export default {
  name: 'AppHeader',

  setup () {
    const { xs } = useDisplay()
    return { xs }
  },

  components: { // Child components
    AppLogo
  }
}
</script>

<style scoped>
.title-xs {
  font-size: min(2.125rem, 8vw) !important;
}
</style>
