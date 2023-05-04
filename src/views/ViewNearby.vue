<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Nearby Stops</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <route-type-select
          :multiple='true'
          select-route-types='0'
          @selected-route-types='getRouteTypes'
        ></route-type-select>
        <stop-list
          :stop-list='jsonStops'
        ></stop-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ViewNearby',

  data: function () { // Default data
    return {
      jsonStops: []
    }
  }
})
</script>
