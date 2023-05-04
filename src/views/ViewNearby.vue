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

// Child components
import RouteTypeSelect from '../components/SectionRouteTypeSelect.vue'
import StopList from '../components/SectionStopList.vue'

export default defineComponent({
  name: 'ViewNearby',

  components: { // Child components
    RouteTypeSelect,
    StopList
  },

  data: function () { // Default data
    return {
      locationPermission: false,
      location: { lat: 0, long: 0 },
      jsonStops: [],
      filterRouteTypes: []
    }
  },

  mounted: function () {
    this.getLocation()
  },

  methods: {
    getLocation: function () {
      const self = this
      navigator.geolocation.getCurrentPosition(
      function (position) {
        self.locationPermission = true
        self.location = { lat: position.coords.latitude, long: position.coords.longitude }
        console.log(self.location)
      },
      function () {
        self.locationPermission = false
      })
    },

    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.filterRouteTypes = value
      // run search
    }
  }
})
</script>
