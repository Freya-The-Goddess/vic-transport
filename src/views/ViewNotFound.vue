<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>404 - Route Not Found</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>
          Could not resolve route
          <span
            v-for='(chunk, index) in $route.params.pathMatch'
            :key='index'
            class='font-weight-bold'
          >/{{ chunk }}</span>
          in application.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ViewFavourites'
})
</script>
