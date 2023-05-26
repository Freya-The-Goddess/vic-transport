<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <h2>404 - Route Not Found</h2>
      </v-col>
    </v-row>
  </v-container>
  <v-container class='pt-2 pb-2'>
    <v-row>
      <v-col>
        <v-card class='pa-4'>
          <v-icon icon='text-error-text mdi-exclamation me-1' class='float-left'></v-icon>
          <span class='text-error-text float-left ms-1'>
            Could not resolve route
            <span
              v-for='(chunk, index) in $route.params.pathMatch'
              :key='index'
              class='font-weight-bold'
            >/{{ chunk }}</span>
            in application.
          </span>
        </v-card>
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
