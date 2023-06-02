<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <!-- Page Title -->
        <h2 class='page-title'>Nearby Stops</h2>
        <!-- Reload Button -->
        <v-tooltip
          text='Reload Nearby Stops'
          location='start'
          open-delay='1200'
          content-class='pt-2 pb-2 ps-3 pe-3'
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind='props'
              @click='debouncedGetLocation()'
              icon='mdi-sync'
              size='large'
              class='reload-button mt-1'
            ></v-icon>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
  <!-- Location Loading and Error Cards -->
  <v-container
    v-if='locationLoading || !locationPermission'
    class='pt-2 pb-2'
  >
    <v-row>
      <v-col>
        <loading-card
          v-if='locationLoading'
          text='Loading Current Location...'
        ></loading-card>
        <error-card
          v-else-if='!locationPermission'
          :warning = 'true'
          :text='locationError'
        ></error-card>
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
              <div v-show='filtersExpanded'>
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
  <!-- Search Loading and Error Cards -->
  <v-container v-if='locationPermission && (nearbyLoading || (!nearbyLoading && !jsonStops.length) || nearbyError)'>
    <v-row>
      <v-col>
        <loading-card
          v-if='nearbyLoading && !nearbyError'
          text='Loading Neaby Stops...'
        ></loading-card>
        <error-card
          v-else-if='nearbyError'
          :text='nearbyError'
        ></error-card>
        <message-card
          v-else-if='!nearbyLoading && !jsonStops.length'
          text='No Stops Nearby'
        ></message-card>
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
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import MessageCard from '../components/SectionMessageCard.vue'
import RouteTypeSelect from '../components/FragmentRouteTypeSelect.vue'
import StopList from '../components/SectionStopList.vue'

export default defineComponent({
  name: 'ViewNearby',

  components: { // Child components
    ErrorCard,
    LoadingCard,
    MessageCard,
    RouteTypeSelect,
    StopList
  },

  data: function () { // Default data
    return {
      locationError: '',
      locationLoading: true,
      locationPermission: false,
      location: { lat: 0, long: 0 },
      nearbyLoading: true,
      nearbyError: '',
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
    // Mount debounced request function
    this.debouncedNearbyRequest = this.debounce(500, function () {
      this.locationSearch()
    })

    // Mount debounced get location function
    this.debouncedGetLocation = this.debounce(500, function () {
      this.getLocation()
    })
  },

  mounted: function () {
    if (this.$route.query.rt) this.filterRouteTypes = this.$route.query.rt.split(' ') // Get route types from URL params
    // TODO: add distance filter
    this.debouncedGetLocation()
  },

  methods: {
    // Get location from browser
    getLocation: function () {
      this.locationLoading = true
      navigator.geolocation.getCurrentPosition(
        (position) => { // location permission granted
          this.locationLoading = false
          this.locationPermission = true
          this.locationError = ''
          this.location = { lat: position.coords.latitude, long: position.coords.longitude }
          this.debouncedNearbyRequest()
        },
        () => { // location permission not granted
          const warningMessage = 'Location must be enabled for "Nearby Stops" feature'
          console.warn(warningMessage)
          this.locationError = warningMessage
          this.locationLoading = false
          this.locationPermission = false
        })
    },

    // Push queries to route, and run request to API
    locationSearch: function () {
      if (this.location.lat && this.location.long) { this.nearbyLoading = true }
      this.nearbyError = ''
      this.jsonStops = []
      const urlPath = '/nearby'
      const urlQuery = {}
      if (this.filterRouteTypes.length) { urlQuery.rt = this.filterRouteTypes.toString().replaceAll(/,/g, ' ') }
      // TODO: add distance filter to query
      if (this.$route.path === urlPath) { // prevents bouncing if path changes
        this.$router.push({ // Push new query to URL
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
          this.nearbyLoading = false
          this.nearbyError = ''
        })
        .catch((error) => {
          this.nearbyLoading = false
          this.nearbyError = error.message
        })
    },

    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.filterRouteTypes = value
      this.debouncedNearbyRequest()
    },

    // Debounce function for inputs
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
