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
        <!-- Route Heading -->
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
        <v-card class='pa-3'>
          <div class='card-title d-flex align-center'>
            <v-icon
              icon='mdi-clock'
              class='d-inline-block fill-height'
            ></v-icon>
            <h3 class='d-inline-block fill-height ms-2'>Stops</h3>
          </div>
          <div class='mt-2'>
            Lorem ipsm dolor sit amet
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'

// Child components
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import DisruptionCard from '../components/SectionDisruptionCard.vue'

export default defineComponent({
  name: 'ViewRoute',

  components: { // Child components
    ErrorCard,
    LoadingCard,
    DisruptionCard
  },

  setup () {
    const { xs, sm, md, lgAndUp } = useDisplay()
    return { xs, sm, md, lgAndUp }
  },

  data: function () { // Default data
    return {
      routeData: [],
      routeLoading: true,
      routeError: '',
      stopsData: [],
      stopsLoading: false,
      stopsError: '',
      disruptionData: [],
      disruptionLoading: false,
      disruptionError: ''
    }
  },

  mounted: function () {
    this.getRouteRequest(this.$route.params.routeId)
    this.getStopsRequest(this.$route.params.routeId, this.$route.params.routeType)
    this.getDisruptionsRequest(this.$route.params.routeId)
  },

  methods: {
    // Query API for stop data
    getRouteRequest: function (routeId) {
      this.routeLoading = true
      const request = `/v3/routes/${routeId}`
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

    // Query API for stops data
    getStopsRequest: function (routeId, routeType) {
      this.stopsLoading = true
      const request = `/v3/stops/route/${routeId}/route_type/${routeType}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.stopsData = data.stops
          this.stopsLoading = false
          this.stopsError = ''
        })
        .catch((error) => {
          this.stopsLoading = false
          this.stopsError = error.message
        })
    },

    // Query API for disruptions on route
    getDisruptionsRequest: function (routeId) {
      this.disruptionLoading = true
      const request = `/v3/disruptions/route/${routeId}`
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
    }
  }
})
</script>

<style scoped>
.route-heading {
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
