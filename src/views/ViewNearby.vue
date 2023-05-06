<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Nearby Stops</h2>
      </v-col>
    </v-row>
    <route-type-select
      :multiple='true'
      @selected-route-types='getRouteTypes'
    ></route-type-select>
    <v-row v-if='searchLoading || !locationPermission || (!searchLoading && !jsonStops.length) || searchError'>
      <v-col>
        <v-card
          v-if='locationLoading'
          class='pa-4'
        >
          <v-progress-circular
            indeterminate
            :size='20'
            :width='3'
            class='me-2'
          ></v-progress-circular>
          <span class='ms-2'>Loading Current Location...</span>
        </v-card>
        <v-card
          v-else-if='!locationPermission'
          class='pa-4'
        >
          <span>Location must be enabled for 'Nearby Stops' feature</span>
        </v-card>
        <v-card
          v-else-if='searchLoading && locationPermission && !searchError'
          class='pa-4'
        >
          <v-progress-circular
            indeterminate
            :size='20'
            :width='3'
            class='me-2'
          ></v-progress-circular>
          <span class='ms-2'>Loading Neaby Stops...</span>
        </v-card>
        <v-card
          v-else-if='searchError'
          class='pa-4'
        >
          <v-icon icon='text-error-text mdi-exclamation-thick me-1' class='float-left'></v-icon>
          <span class='text-error-text font-weight-bold float-left ms-1'>Nearby Stops Request Error</span>
        </v-card>
        <v-card
          v-else-if='!searchLoading && !jsonStops.length'
          class='pa-4'
        >
          <span>No Stops Nearby</span>
        </v-card>
      </v-col>
    </v-row>
    <stop-list
      :stop-list='jsonStops'
    ></stop-list>
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
      locationLoading: true,
      locationPermission: false,
      location: { lat: 0, long: 0 },
      searchLoading: true,
      searchError: false,
      jsonStops: [],
      filterRouteTypes: []
    }
  },

  created: function () {
    // Mount debounced search function
    this.debouncedRequest = this.debounce(500, function () {
      if (this.location.lat && this.location.long) { this.searchLoading = true }
      this.locationStopRequest(this.location)
    })
  },

  mounted: function () {
    this.getLocation()
    // .then .catch
  },

  methods: {
    getLocation: function () {
      navigator.geolocation.getCurrentPosition(
        (position) => { // location permission granted
          this.locationLoading = false
          this.locationPermission = true
          this.location = { lat: position.coords.latitude, long: position.coords.longitude }
          this.debouncedRequest()
        },
        () => { // location permission not granted
          this.locationLoading = false
          this.locationPermission = false
        })
    },

    // Query API for stops near location
    locationStopRequest: function (location) {
      this.jsonStops = []
      this.searchError = false
      let request = `/v3/stops/location/${location.lat},${location.long}`
      this.filterRouteTypes.forEach(function (routeType) {
        request += request.includes('?') ? '&' : '?'
        request += 'route_types=' + routeType
      })
      // add max distance to request
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.jsonStops = data.stops.toSorted(function (a, b) { return a.route_type - b.route_type })
          this.searchError = false
          this.searchLoading = false
        })
        .catch((error) => {
          this.searchError = true
          console.log(error)
        })
    },

    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.filterRouteTypes = value
      this.debouncedRequest()
    },

    // Debounce function for search input
    debounce: function (timeout, func) {
      let timer
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
      }
    }
  }
})
</script>
