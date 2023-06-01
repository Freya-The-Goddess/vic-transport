<template>
  <!-- Loading and Error Cards -->
  <v-container v-if='!stopData || stopError'>
    <v-row>
      <v-col>
        <loading-card
          v-if='!stopData && !stopError'
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
              size='xx-large'
              class='fav-button text-favourite-yellow'
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
            <span>{{ $root.routeTypes[stopData.route_type].route_type_name }} Stop</span>
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
            class='card-expand-button pb-1'
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
            :truncate-chips='!routesExpanded'
            :selectable='!!(stopData.routes.length-1)'
            :expandable='true'
            @expand='routesExpanded = true'
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
        <v-card class='pa-3'>
          <div class='card-title d-flex align-center'>
            <v-icon
              icon='mdi-clock'
              class='d-inline-block fill-height'
            ></v-icon>
            <h3 class='d-inline-block fill-height ms-2'>Departures</h3>
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
import RouteChips from '../components/SectionRouteChips.vue'

export default defineComponent({
  name: 'ViewStop',

  components: { // Child components
    ErrorCard,
    LoadingCard,
    DisruptionCard,
    RouteChips
  },

  setup () {
    const { xs, sm, md, lgAndUp } = useDisplay()
    return { xs, sm, md, lgAndUp }
  },

  data: function () { // Default data
    return {
      stopData: '',
      stopError: '',
      routesExpanded: false,
      disruptionData: [],
      disruptionLoading: false,
      disruptionError: ''
    }
  },

  computed: {
    // Returns true if stop is in favourites
    favouriteStop: function () {
      const self = this
      const favourites = this.$store.state.favouriteStops
      return !!favourites.find(function (fav) {
        return (fav.stopId.toString() === self.$route.params.stopId && fav.routeType.toString() === self.$route.params.routeType)
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

  mounted: function () {
    this.getStopRequest(this.$route.params.stopId, this.$route.params.routeType)
    this.getDisruptionsRequest(this.$route.params.stopId)
  },

  methods: {
    // Query API for stop data
    getStopRequest: function (stopId, routeType) {
      const request = `/v3/stops/${stopId}/route_type/${routeType}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.stopData = data.stop
          if (this.stopData.routes.length < this.maxChips) {
            this.routesExpanded = true
          }
          this.stopError = ''
        })
        .catch((error) => {
          this.stopError = error.message
        })
    },

    // Query API for disruptions at stop
    getDisruptionsRequest: function (stopId) {
      this.disruptionLoading = true
      const request = `/v3/disruptions/stop/${stopId}`
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

    favouriteButton: function () {
      if (!this.favouriteStop) {
        this.$store.commit('addFavouriteStop', { stopId: this.stopData.stop_id, routeType: this.stopData.route_type })
      } else {
        this.$store.commit('removeFavouriteStop', { stopId: this.stopData.stop_id, routeType: this.stopData.route_type })
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
