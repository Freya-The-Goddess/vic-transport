<template>
  <v-container v-if='!stopData'>
    <v-row>
      <v-col>
        <v-card class='pa-4'>
          <v-progress-circular
            indeterminate
            :size='20'
            :width='3'
            class='me-2'
          ></v-progress-circular>
          <span class='ms-2'>Loading...</span>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col>
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
              class='fav-button text-favourite-yellow float-right'
            ></v-icon>
          </template>
        </v-tooltip>
        <div class='stop-heading d-flex align-center float-left fill-height'>
          <v-card
            :color='$root.routeTypes[stopData.route_type].route_type_color'
            rounded='circle'
            class='stop-heading-card text-over-color float-left me-5'
          >
            <v-icon
              :icon='$root.routeTypes[stopData.route_type].route_type_icon'
              size='xxx-large'
              class='stop-heading-icon'
            ></v-icon>
          </v-card>
          <div class='float-left fill-height align-center'>
            <h2>{{ stopData.stop_name }}</h2>
            <span>{{ $root.routeTypes[stopData.route_type].route_type_name }} Stop</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if='currentDisruptions.length'>
      <v-col>
        <v-card class='pa-3'>
          <v-icon
            :icon='disruptionsExpanded ? "mdi-menu-up" : "mdi-menu-down"'
            @click='disruptionsExpanded = !disruptionsExpanded'
            role='button'
            class='card-expand-button float-right pa-1'
          ></v-icon>
          <div class='card-title'>
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-alert-circle'
                class='d-inline-block fill-height text-disruption-orange'
              ></v-icon>
              <h3 class='d-inline-block fill-height text-disruption-orange ms-2'>Disruptions ({{ currentDisruptions.length }})</h3>
            </div>
          </div>
          <disruption-list
            v-if='disruptionsExpanded'
            :disruptionList='currentDisruptions'
            class='w-100'
          ></disruption-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class='pa-3'>
          <v-icon
            v-if='stopData.routes.length > maxChips'
            :icon='routesExpanded ? "mdi-menu-up" : "mdi-menu-down"'
            @click='routesExpanded = !routesExpanded'
            role='button'
            class='card-expand-button float-right pa-1'
          ></v-icon>
          <div class='card-title'>
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
            :chip-links='true'
            :expandable='true'
            @expand='routesExpanded = true'
            class='mt-2 w-100'
          ></route-chips>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class='pa-3'>
          <div class='d-flex align-center'>
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
import DisruptionList from '../components/SectionDisruptionList.vue'
import RouteChips from '../components/SectionRouteChips.vue'

export default defineComponent({
  name: 'ViewStop',

  components: { // Child components
    DisruptionList,
    RouteChips
  },

  setup () {
    const { xs, sm, md, lgAndUp } = useDisplay()
    return { xs, sm, md, lgAndUp }
  },

  data: function () { // Default data
    return {
      stopData: '',
      disruptionData: '',
      disruptionsExpanded: false,
      routesExpanded: false
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
    },

    currentDisruptions: function () {
      return this.disruptionData.filter(function (dis) {
        return dis.disruption_status === 'Current'
      })
    }
  },

  mounted: function () {
    this.getStopData(this.$route.params.stopId, this.$route.params.routeType)
  },

  methods: {
    // Query API for stop data
    getStopData: function (stopId, routeType) {
      const request = `/v3/stops/${stopId}/route_type/${routeType}?stop_disruptions=true`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.stopData = data.stop
          if (this.stopData.routes.length < this.maxChips) {
            this.routesExpanded = true
          }
          this.disruptionData = Object.values(data.disruptions)
        })
        .catch((error) => {
          console.log(error)
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

<style>
.v-tooltip .v-overlay__content {
  background: rgba(var(--v-theme-surface-variant), 1) !important;
}

.fav-button {
  max-width: 20%;
}

.stop-heading {
  max-width: 80%;
}

.stop-heading-card {
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
}

.stop-heading-icon {
  width: 70px;
  height: 70px;
}

.card-title {
  max-width: 90%;
}

.card-expand-button {
  max-width: 10%;
}
</style>
