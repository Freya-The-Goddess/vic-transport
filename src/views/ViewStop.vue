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
        <v-icon
          @click='favouriteButton()'
          :icon='favouriteStop ? "mdi-star" : "mdi-star-outline"'
          size='xx-large'
          class='text-favourite-yellow float-right'
          style='max-width: 20%;'
        ></v-icon>
        <div class='d-flex align-center float-left fill-height' style='max-width: 80%;'>
          <v-card
            :color='$root.routeTypes[stopData.route_type].route_type_color'
            rounded='circle'
            style='width: 70px; height: 70px; flex: 0 0 70px'
            class='text-over-color float-left me-5'
          >
            <v-icon
              :icon='$root.routeTypes[stopData.route_type].route_type_icon'
              size='xxx-large'
              style='width: 70px; height: 70px;'
            ></v-icon>
          </v-card>
          <div class='float-left fill-height align-center'>
            <h2>{{ stopData.stop_name }}</h2>
            <span>{{ $root.routeTypes[stopData.route_type].route_type_name }} Stop</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if='disruptions'>
      <v-col>
        <v-card class='pa-3'>
          <v-icon
            :icon='disruptionsExpanded ? "mdi-menu-up" : "mdi-menu-down"'
            @click='disruptionsExpanded = !disruptionsExpanded'
            role='button'
            class='float-right pa-1'
            style='max-width: 10%'
          ></v-icon>
          <div class='' style='max-width: 90%'>
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-alert-circle'
                class='d-inline-block fill-height text-disruption-orange'
              ></v-icon>
              <h3 class='d-inline-block fill-height text-disruption-orange ms-2'>Disruptions ({{ disruptions }})</h3>
            </div>
            <div
              v-if='disruptionsExpanded'
              class='mt-2'
            >
              Lorem ipsm dolor sit amet
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class='pa-3'>
          <v-icon
            :icon='routesExpanded ? "mdi-menu-up" : "mdi-menu-down"'
            @click='routesExpanded = !routesExpanded'
            role='button'
            class='float-right pa-1'
            style='max-width: 10%'
          ></v-icon>
          <div class='' style='max-width: 90%'>
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-routes'
                class='d-inline-block fill-height'
              ></v-icon>
              <h3 class='d-inline-block fill-height ms-2'>Routes</h3>
            </div>
            <route-chips
              :routes-list='stopData.routes'
              :route-type='stopData.route_type'
              :max-chips='routesExpanded ? 0 : 10'
              :truncate-chips='false'
              :chip-links='true'
              class='mt-2'
            ></route-chips>
          </div>
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

// Child components
import RouteChips from '../components/SectionRouteChips.vue'

export default defineComponent({
  name: 'ViewStop',

  components: { // Child components
    RouteChips
  },

  data: function () { // Default data
    return {
      stopData: '',
      disruptions: 0,
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
          this.disruptionData = data.disruptions
          this.disruptions = Object.keys(this.disruptionData).length
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
