<template>
  <!-- Loading and Error Cards -->
  <v-container v-if='stopLoading || stopError'>
    <v-row>
      <v-col>
        <loading-card
          v-if='stopLoading && !stopError'
          text='Loading Stop Data...'
        ></loading-card>
        <error-card
          v-else-if='stopError'
          :text='stopError'
        ></error-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Stop Data -->
  <v-container v-else>
    <!-- Stop Header -->
    <v-row>
      <v-col>
        <!-- Favourite Button -->
        <v-tooltip
          :text='favouriteStop ? "Remove Favourite" : "Add Favourite"'
          location='start'
          open-delay='1200'
          content-class='pt-2 pb-2 ps-3 pe-3'
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind='props'
              @click='favouriteButton()'
              :icon='favouriteStop ? "mdi-star" : "mdi-star-outline"'
              :class='favouriteStop ? "text-favourite-yellow" : "text-over-color"'
              size='xx-large'
              class='fav-button'
            ></v-icon>
          </template>
        </v-tooltip>
        <!-- Stop Heading -->
        <div class='stop-heading d-flex'>
          <v-card
            :color='$root.routeTypes[stopData.route_type].route_type_color'
            rounded='circle'
            class='stop-heading-card text-over-color me-3'
          >
            <v-icon
              :icon='$root.routeTypes[stopData.route_type].route_type_icon'
              size='xxx-large'
              class='stop-heading-icon'
            ></v-icon>
          </v-card>
          <div class='stop-title align-center'>
            <h2>{{ stopData.stop_name }}</h2>
            <span>
              {{ $root.routeTypes[stopData.route_type].route_type_name }}
              {{ stopData.route_type === 0 ? "Station" : "Stop" }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- Stop Routes -->
    <v-row>
      <v-col>
        <v-card class='pa-3'>
          <div
            v-if='stopData.routes.length > maxChips'
            @click='routesExpanded = !routesExpanded'
            role='button'
            class='card-expand-button float-right pb-1'
          >
            <v-icon
              :icon='routesExpanded ? "mdi-menu-up" : "mdi-menu-down"'
              class='float-right'
            ></v-icon>
          </div>
          <div
            @click='routesExpanded = stopData.routes.length > maxChips ? !routesExpanded : routesExpanded'
            :role='stopData.routes.length > maxChips ? "button" : ""'
            :class='stopData.routes.length > maxChips ? "card-expand-title" : "card-title"'
          >
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-routes'
                class='d-inline-block fill-height'
              ></v-icon>
              <h3 class='d-inline-block fill-height ms-2'>Routes</h3>
            </div>
          </div>
          <route-chips
            :routes-list='stopData.routes'
            :route-type='stopData.route_type'
            :max-chips='routesExpanded ? 0 : maxChips'
            :expanded='routesExpanded'
            :selectable='!!(stopData.routes.length-1)'
            :expandable='true'
            @expand='routesExpanded = true'
            :select-route='$route.query.r ? $route.query.r : null'
            @selected-route='getSelectedRoute'
            class='mt-2 w-100'
          ></route-chips>
        </v-card>
      </v-col>
    </v-row>
    <!-- Stop Disruptions -->
    <disruption-card
      :disruption-data='disruptionData'
      :disruption-loading='disruptionLoading'
      :disruption-error='disruptionError'
    ></disruption-card>
    <!-- Stop Departures -->
    <v-row>
      <v-col>
        <v-card>
          <div
            @click='reloadButton()'
            role='button'
            class='card-expand-button float-right pa-3 pt-4 pb-1'
          >
            <v-icon
              icon='mdi-sync'
              class='float-right'
            ></v-icon>
          </div>
          <div class='card-expand-title d-flex align-center pa-3 pb-2'>
            <v-icon
              icon='mdi-clock'
              class='d-inline-block fill-height'
            ></v-icon>
            <h3 class='d-inline-block fill-height ms-2'>Departures</h3>
          </div>
          <direction-chips
            v-if='directionsData.length && !directionsError'
            :directionList='directionsData'
            :selectDirection='$route.query.d'
            @selectedDirection='getSelectedDirection'
            class='pa-3 pt-0 pb-2'
          ></direction-chips>
          <!-- Error and Loading Cards -->
          <loading-card
            v-if='departuresLoading && !departuresError && !directionsError'
            text='Loading Stops...'
            class='pt-2'
          ></loading-card>
          <error-card
            v-else-if='departuresError || directionsError'
            :text='departuresError || directionsError'
            class='pt-2'
          ></error-card>
          <message-card
            v-else-if='!departuresData.length'
            text='No Departures'
            class='pt-2'
          ></message-card>
          <!-- Departures List -->
          <departure-list
            v-else-if='departuresData.length'
            :departureList='departuresData'
            :directionList='departuresDirections'
            :routeList='departuresRoutes'
            class='w-100'
          ></departure-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'

// Child components
import DepartureList from '../components/FragmentDepartureList.vue'
import DirectionChips from '../components/FragmentDirectionChips.vue'
import DisruptionCard from '../components/SectionDisruptionCard.vue'
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import MessageCard from '../components/SectionMessageCard.vue'
import RouteChips from '../components/FragmentRouteChips.vue'

export default defineComponent({
  name: 'ViewStop',

  components: { // Child components
    DepartureList,
    DirectionChips,
    DisruptionCard,
    ErrorCard,
    LoadingCard,
    MessageCard,
    RouteChips
  },

  setup () {
    const { xs, sm, md, lgAndUp } = useDisplay()
    return { xs, sm, md, lgAndUp }
  },

  data: function () { // Default data
    return {
      stopData: [],
      stopLoading: true,
      stopError: '',
      routesExpanded: false,
      selectedRoute: null,
      selectedDirection: null,
      directionsData: [],
      directionsError: '',
      departuresData: [],
      departuresDirections: {},
      departuresRoutes: {},
      departuresLoading: false,
      departuresError: '',
      maxDepartures: 10,
      disruptionData: [],
      disruptionLoading: false,
      disruptionError: ''
    }
  },

  computed: {
    // Returns true if stop is in favourites
    favouriteStop: function () {
      const favourites = this.$store.state.favouriteStops
      return !!favourites.find((fav) => {
        return (fav.stopId.toString() === this.$route.params.stopId && fav.routeType.toString() === this.$route.params.routeType)
      })
    },

    // Maximum number of chips to show for each breakpoint when not expanded
    maxChips: function () {
      if (this.xs) {
        if (this.stopData.route_type === 1 || this.stopData.route_type === 2) return 5
        else return 6
      } else if (this.sm) {
        if (this.stopData.route_type === 1 || this.stopData.route_type === 2) return 8
        else return 9
      } else if (this.md) {
        if (this.stopData.route_type === 1 || this.stopData.route_type === 2) return 10
        else return 12
      } else if (this.lgAndUp) {
        if (this.stopData.route_type === 1 || this.stopData.route_type === 2) return 14
        else return 15
      } else return 0
    }
  },

  created: function () {
    // Mount debounced stop request function
    this.debouncedStopRequest = this.debounce(500, function () {
      this.stopRequest()
    })

    // Mount debounced directions request function
    this.debouncedDirectionsRequest = this.debounce(500, function () {
      this.directionsRequest()
    })

    // Mount debounced departures request function
    this.debouncedDeparturesRequest = this.debounce(500, function () {
      this.departuresRequest()
    })

    // Mount debounced disruptions request function
    this.debouncedDisruptionsRequest = this.debounce(500, function () {
      this.disruptionsRequest()
    })
  },

  mounted: function () {
    this.debouncedStopRequest()
    this.debouncedDirectionsRequest()
    this.debouncedDeparturesRequest()
    this.debouncedDisruptionsRequest()
  },

  methods: {
    // Query API for stop data
    stopRequest: function () {
      this.stopLoading = true
      const request = `/v3/stops/${this.$route.params.stopId}/route_type/${this.$route.params.routeType}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.stopData = data.stop
          if (this.stopData.routes.length < this.maxChips) {
            this.routesExpanded = true
          }
          if (this.stopData.routes.length === 1) {
            this.getSelectedRoute(this.stopData.routes[0])
          }
          this.stopLoading = false
          this.stopError = ''
        })
        .catch((error) => {
          this.stopLoading = false
          this.stopError = error.message
        })
    },

    // Query API for directions data
    directionsRequest: function () {
      this.directionsData = []
      if (this.selectedRoute) {
        const request = `/v3/directions/route/${this.selectedRoute.route_id}`
        this.$root.ptvApiRequest(request)
          .then((data) => {
            this.directionsData = data.directions.toSorted((a, b) => a.direction_id - b.direction_id)
            this.directionsError = ''
          })
          .catch((error) => {
            this.directionsError = error.message
          })
      }
    },

    // Query API for departures data at stop
    departuresRequest: function () {
      this.departuresLoading = true
      let request = ''
      if (this.selectedRoute) {
        request = `/v3/departures/route_type/${this.selectedRoute.route_type}/stop/${this.$route.params.stopId}/route/${this.selectedRoute.route_id}`
        if (this.selectedDirection) {
          request += request.includes('?') ? '&' : '?'
          request += 'direction_id=' + this.selectedDirection.direction_id
        }
      } else {
        request = `/v3/departures/route_type/${this.$route.params.routeType}/stop/${this.$route.params.stopId}`
      }
      if (this.maxDepartures) {
        request += request.includes('?') ? '&' : '?'
        request += 'max_results=' + this.maxDepartures
      }
      request += (request.includes('?') ? '&' : '?') + 'expand=Direction&expand=Route'
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.departuresData = data.departures
          this.departuresDirections = data.directions
          this.departuresRoutes = data.routes
          this.departuresLoading = false
          this.departuresError = ''
        })
        .catch((error) => {
          this.departuresLoading = false
          this.departuresError = error.message
        })
    },

    // Query API for disruptions at stop
    disruptionsRequest: function () {
      this.disruptionLoading = true
      let request = ''
      if (this.selectedRoute) {
        request = `/v3/disruptions/route/${this.selectedRoute.route_id}/stop/${this.$route.params.stopId}`
      } else {
        request = `/v3/disruptions/stop/${this.$route.params.stopId}`
      }
      this.$root.ptvApiRequest(request)
        .then((data) => {
          const disruptions = []
          Object.values(data.disruptions).forEach((disType) => {
            disType.forEach((dis) => {
              if (dis.disruption_status === 'Current') {
                disruptions.push(dis)
              }
            })
          })
          this.disruptionData = disruptions
          this.disruptionLoading = false
          this.disruptionError = ''
        })
        .catch((error) => {
          this.disruptionLoading = false
          this.disruptionError = error.message
        })
    },

    // Get selected route callback for child component $emit event
    getSelectedRoute: function (value) {
      this.selectedRoute = value
      const urlPath = this.$route.path
      const urlQuery = {}
      if (this.selectedRoute) {
        urlQuery.r = this.selectedRoute.route_id
        if (this.$route.query.d && this.selectedRoute.route_id === parseInt(this.$route.query.r)) {
          urlQuery.d = parseInt(this.$route.query.d)
        }
      }
      if (this.$route.name === 'stop') { // prevents bouncing if path changes
        this.$router.push({ // Push new search query to URL
          path: urlPath,
          query: urlQuery
        })
      }
      this.debouncedDisruptionsRequest()
      this.debouncedDirectionsRequest()
      this.debouncedDeparturesRequest()
    },

    // Get selected route callback for child component $emit event
    getSelectedDirection: function (value) {
      this.selectedDirection = value
      const urlPath = this.$route.path
      const urlQuery = {}
      if (this.$route.query.r) {
        urlQuery.r = parseInt(this.$route.query.r)
      }
      if (this.selectedDirection) {
        urlQuery.d = this.selectedDirection.direction_id
      }
      if (this.$route.name === 'stop') { // prevents bouncing if path changes
        this.$router.push({ // Push new search query to URL
          path: urlPath,
          query: urlQuery
        })
      }
      this.debouncedDeparturesRequest()
    },

    favouriteButton: function () {
      if (!this.favouriteStop) {
        this.$store.commit('addFavouriteStop', { stopId: this.stopData.stop_id, routeType: this.stopData.route_type })
      } else {
        this.$store.commit('removeFavouriteStop', { stopId: this.stopData.stop_id, routeType: this.stopData.route_type })
      }
    },

    reloadButton: function () {
      this.debouncedDeparturesRequest()
      this.debouncedDisruptionsRequest()
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

<style scoped>
.fav-button {
  max-width: 50px;
  float: right;
}

.stop-heading {
  max-width: calc(100% - 50px);
  height: 100%;
  float: left;
}

.stop-heading-card {
  width: 65px;
  height: 65px;
  flex: 0 0 65px;
  float: left;
}

.stop-heading-icon {
  width: 65px;
  height: 65px;
}

.stop-title {
  height: 100%;
  float: left;
}
</style>
