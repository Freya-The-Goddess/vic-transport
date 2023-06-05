<template>
  <!-- Loading and Error Cards -->
  <v-container v-if='routeLoading || routeError'>
    <v-row>
      <v-col>
        <loading-card
          v-if='routeLoading && !routeError'
          text='Loading Route Data...'
        ></loading-card>
        <error-card
          v-else-if='routeError'
          :text='routeError'
        ></error-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Route Data -->
  <v-container v-else>
    <!-- Route Header -->
    <v-row>
      <v-col>
        <!-- Route Status -->
        <v-tooltip
          v-if='xs'
          :text='routeData.route_service_status.description'
          location='start'
          open-delay='1200'
          content-class='pt-2 pb-2 ps-3 pe-3'
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind='props'
              :icon='statusIcon.icon'
              :class='"text-"+statusIcon.color'
              size='large'
              class='route-status-xs'
            ></v-icon>
          </template>
        </v-tooltip>
        <div
          v-else
          class='route-status'
        >
          <span>{{ routeData.route_service_status.description }}</span>
          <v-icon
            :icon='statusIcon.icon'
            :class='"text-"+statusIcon.color'
            size='large'
            class='ms-2'
          ></v-icon>
        </div>
        <!-- Route Heading -->
        <div
          class='d-flex'
          :class='xs ? "route-heading-xs" : "route-heading"'>
          <v-card
            :color='$root.routeTypes[routeData.route_type].route_type_color'
            rounded='circle'
            class='route-heading-card text-over-color me-3'
          >
            <v-icon
              :icon='$root.routeTypes[routeData.route_type].route_type_icon'
              size='xxx-large'
              class='route-heading-icon'
            ></v-icon>
          </v-card>
          <div class='route-title align-center'>
            <h2>
              <span v-if='routeData.route_number' class='font-weight-bold text-break'>{{ routeData.route_number }} - </span>
              <span class='font-weight-bold text-break'>{{ routeData.route_name }}</span>
            </h2>
            <span>
              {{ $root.routeTypes[routeData.route_type].route_type_name }}
              {{ routeData.route_type <= 1 ? "Line" : "Route" }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- Route Disruptions -->
    <disruption-card
      :disruption-data='disruptionData'
      :disruption-loading='disruptionLoading'
      :disruption-error='disruptionError'
    ></disruption-card>
    <!-- Route Departures -->
    <v-row>
      <v-col>
        <v-card>
          <div class='card-title d-flex align-center pa-3 pb-1'>
            <v-icon
              icon='mdi-transit-connection-variant'
              class='d-inline-block fill-height'
            ></v-icon>
            <h3 class='d-inline-block fill-height ms-2'>Stops</h3>
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
            v-if='stopsLoading && !stopsError && !directionsError'
            text='Loading Stops...'
            class='pt-1'
          ></loading-card>
          <error-card
            v-else-if='stopsError || directionsError'
            :text='stopsError || directionsError'
            class='pt-1'
          ></error-card>
          <!-- Stops List -->
          <stop-list
            v-else-if='stopsData.length'
            :stopList='stopsData'
            class='w-100'
          ></stop-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'

// Child components
import DirectionChips from '../components/FragmentDirectionChips.vue'
import DisruptionCard from '../components/SectionDisruptionCard.vue'
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import StopList from '../components/FragmentStopList.vue'

export default defineComponent({
  name: 'ViewRoute',

  components: { // Child components
    DirectionChips,
    DisruptionCard,
    ErrorCard,
    LoadingCard,
    StopList
  },

  setup () {
    const { xs } = useDisplay()
    return { xs }
  },

  data: function () { // Default data
    return {
      routeData: [],
      routeLoading: true,
      routeError: '',
      selectedDirection: null,
      directionsData: [],
      directionsError: '',
      stopsData: [],
      stopsLoading: false,
      stopsError: '',
      disruptionData: [],
      disruptionLoading: false,
      disruptionError: ''
    }
  },

  computed: {
    statusIcon: function () {
      const status = this.routeData.route_service_status.description
      if (status === 'Good Service') {
        return { icon: 'mdi-check-circle', color: 'good-green' }
      } else if (status === 'Minor Delays') {
        return { icon: 'mdi-clock', color: 'minor-delay-orange' }
      } else if (status === 'Major Delays') {
        return { icon: 'mdi-clock', color: 'major-delay-red' }
      } else if (status === 'Planned Works') {
        return { icon: 'mdi-alert-circle', color: 'works-yellow' }
      } else if (status === 'Part Suspended' || status === 'Suspended') {
        return { icon: 'mdi-close-circle', color: 'closure-grey' }
      } else if (status === 'General Alert' || status === 'Service Changes' || status === 'Service Information' || status === 'Planned Closure') {
        return { icon: 'mdi-information', color: 'info-blue' }
      } else {
        return { icon: 'mdi-alert-circle', color: 'disruption-orange' }
      }
    }
  },

  created: function () {
    // Mount debounced route request function
    this.debouncedRouteRequest = this.debounce(500, function () {
      this.routeRequest()
    })

    // Mount debounced directions request function
    this.debouncedDirectionsRequest = this.debounce(500, function () {
      this.directionsRequest()
    })

    // Mount debounced stops request function
    this.debouncedStopsRequest = this.debounce(500, function () {
      this.stopsRequest()
    })

    // Mount debounced disruptions request function
    this.debouncedDisruptionsRequest = this.debounce(500, function () {
      this.disruptionsRequest()
    })
  },

  mounted: function () {
    this.debouncedRouteRequest()
    this.debouncedDirectionsRequest()
    this.debouncedStopsRequest()
    this.debouncedDisruptionsRequest()
  },

  methods: {
    // Query API for stop data
    routeRequest: function () {
      this.routeLoading = true
      const request = `/v3/routes/${this.$route.params.routeId}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.routeData = data.route
          this.routeLoading = false
          this.routeError = ''
        })
        .catch((error) => {
          this.routeLoading = false
          this.routeError = error.message
        })
    },

    // Query API for directions data
    directionsRequest: function () {
      const request = `/v3/directions/route/${this.$route.params.routeId}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.directionsData = data.directions
          this.directionsError = ''
        })
        .catch((error) => {
          this.directionsError = error.message
        })
    },

    // Query API for stops data
    stopsRequest: function () {
      this.stopsLoading = true
      let request = `/v3/stops/route/${this.$route.params.routeId}/route_type/${this.$route.params.routeType}`
      if (this.selectedDirection) {
        request += request.includes('?') ? '&' : '?'
        request += 'direction_id=' + this.selectedDirection.direction_id
      }
      this.$root.ptvApiRequest(request)
        .then((data) => {
          if (this.selectedDirection) {
            this.stopsData = data.stops
              .filter(stop => stop.stop_sequence !== 0)
              .toSorted((a, b) => a.stop_sequence - b.stop_sequence)
          } else {
            this.stopsData = data.stops
          }
          this.stopsLoading = false
          this.stopsError = ''
        })
        .catch((error) => {
          this.stopsLoading = false
          this.stopsError = error.message
        })
    },

    // Query API for disruptions on route
    disruptionsRequest: function () {
      this.disruptionLoading = true
      const request = `/v3/disruptions/route/${this.$route.params.routeId}`
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
    getSelectedDirection: function (value) {
      this.selectedDirection = value
      const urlPath = this.$route.path
      const urlQuery = {}
      if (this.selectedDirection) {
        urlQuery.d = this.selectedDirection.direction_id
      }
      if (this.$route.name === 'route') { // prevents bouncing if path changes
        this.$router.push({ // Push new search query to URL
          path: urlPath,
          query: urlQuery
        })
      }
      this.debouncedStopsRequest()
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
.route-status {
  max-width: 180px;
  float: right;
}

.route-status-xs {
  max-width: 50px;
  float: right;
}

.route-heading {
  max-width: calc(100% - 180px);
  height: 100%;
  float: left;
}

.route-heading-xs {
  max-width: calc(100% - 50px);
  height: 100%;
  float: left;
}

.route-heading-card {
  width: 65px;
  height: 65px;
  flex: 0 0 65px;
  float: left;
}

.route-heading-icon {
  width: 65px;
  height: 65px;
}

.route-title {
  height: 100%;
  float: left;
}
</style>
