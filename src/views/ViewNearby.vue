<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <h2>Nearby Stops</h2>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Inputs -->
  <v-container
    v-if='locationPermission'
    class='pt-2 pb-2'
  >
    <!-- Search Filters -->
    <v-row>
      <v-col>
        <v-card class='pa-3 pb-2'>
          <div
            @click='filtersExpanded = !filtersExpanded'
            role='button'
            class='card-expand-button float-right pb-1'
          >
            <v-icon
              :icon='filtersExpanded ? "mdi-menu-up" : "mdi-menu-down"'
              class='float-right'
            ></v-icon>
          </div>
          <div
            @click='filtersExpanded = !filtersExpanded'
            role='button'
            class='card-expand-title'
          >
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-filter'
                size='small'
                class='d-inline-block fill-height'
              ></v-icon>
              <span class='d-inline-block fill-height ms-2'>
                Search Filters
                <span v-if='totalFilters'>({{ totalFilters }})</span>
              </span>
            </div>
          </div>
          <div class='pt-1'>
            <v-expand-transition>
              <div v-show='filtersExpanded' class='pt-3 pb-2'>
                <route-type-select
                  :multiple='true'
                  :select-route-types='$route.query.rt ? $route.query.rt.split(" ") : []'
                  @selected-route-types='getRouteTypes'
                ></route-type-select>
              </div>
            </v-expand-transition>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Loading and Error Cards -->
  <v-container v-if='searchLoading || !locationPermission || (!searchLoading && !jsonStops.length) || searchError'>
    <v-row>
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
          <v-icon icon='text-error-text mdi-exclamation me-1' class='float-left'></v-icon>
          <span class='text-error-text float-left ms-1'>Location must be enabled for 'Nearby Stops' feature</span>
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
          <v-icon icon='text-error-text mdi-exclamation me-1' class='float-left'></v-icon>
          <span class='text-error-text float-left ms-1'>Nearby Stops Request Error</span>
        </v-card>
        <v-card
          v-else-if='!searchLoading && !jsonStops.length'
          class='pa-4'
        >
          <span>No Stops Nearby</span>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Results -->
  <v-container
    v-if='jsonStops.length'
    class='mt-1'
  >
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
      filterRouteTypes: [],
      filtersExpanded: false
    }
  },

  computed: {
    totalFilters: function () {
      let total = 0
      if (this.filterRouteTypes.length) { total += 1 }
      return total
    }
  },

  created: function () {
    // Mount debounced search function
    this.debouncedRequest = this.debounce(500, function () {
      this.locationSearch()
    })
  },

  mounted: function () {
    this.getLocation()
    if (this.$route.query.rt) this.filterRouteTypes = this.$route.query.rt.split(' ') // Get route types from URL params
    // TODO: add distance filter
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

    locationSearch: function () {
      if (this.location.lat && this.location.long) { this.searchLoading = true }
      this.searchError = false
      this.jsonStops = []
      const urlPath = '/nearby'
      const urlQuery = {}
      if (this.filterRouteTypes.length) { urlQuery.rt = this.filterRouteTypes.toString().replaceAll(/,/g, ' ') }
      // TODO: add distance filter to query
      if (this.$route.path === urlPath) { // prevents bouncing if path changes
        this.$router.push({ // Push new search query to URL
          path: urlPath,
          query: urlQuery
        })
      }
      this.locationStopRequest()
    },

    // Query API for stops near location
    locationStopRequest: function () {
      let request = `/v3/stops/location/${this.location.lat},${this.location.long}`
      this.filterRouteTypes.forEach(function (routeType) {
        request += request.includes('?') ? '&' : '?'
        request += 'route_types=' + routeType
      })
      // TODO: add distance filter to request
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

<style>
.card-expand-title {
  width: calc(100% - 40px);
}

.card-expand-button {
  width: 40px;
}
</style>
