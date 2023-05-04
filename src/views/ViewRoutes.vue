<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Routes</h2>
      </v-col>
    </v-row>
    <route-type-select
      :multiple='false'
      select-route-types='0'
      @selected-route-types='getRouteTypes'
    ></route-type-select>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

// Components
import RouteTypeSelect from '../components/SectionRouteTypeSelect.vue'

export default defineComponent({
  name: 'ViewFavourites',

  components: { // Child components
    RouteTypeSelect
  },

  data: function () { // Default data
    return {
      routeType: ''
    }
  },

  methods: {
    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.routeType = value[0]
    }
  }
})
</script>
