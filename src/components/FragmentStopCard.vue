<template>
  <v-card
    class='stop-card fill-height pa-3'
  >
    <div
      class='float-right stop-actions'
    >
      <v-icon
        @click='favouriteButton()'
        :icon='favouriteStop ? "mdi-star" : "mdi-star-outline"'
        class='text-favourite-yellow float-right'
      ></v-icon><br>
      <v-icon
        v-if='disruption'
        icon='mdi-alert-circle'
        class="text-disruption-orange float-right mt-4"
      ></v-icon>
    </div>
    <router-link
      :to='"/stop/" + stop.stop_id + "/route_type/" + stop.route_type'
      class='text-decoration-none text-over-color'
    >
      <div
        role='button'
        class='stop-header d-flex align-center float-left fill-height'
      >
        <v-card
          :color='$root.routeTypes[stop.route_type].route_type_color'
          rounded='circle'
          class='route-type-card text-over-color float-left me-3'
        >
          <v-icon
            :icon='$root.routeTypes[stop.route_type].route_type_icon'
            size='x-large'
            class='route-type-icon'
          ></v-icon>
        </v-card>
        <div class='align-top fill-height'>
          <span class='font-weight-bold text-break'>{{ stop.stop_name }}</span><br>
          <route-chips
            :routes-list='stop.routes'
            :route-type='stop.route_type'
            :max-chips='maxChips'
            :truncate-chips='true'
            :selectable='false'
            :expandable='false'
          ></route-chips>
        </div>
      </div>
    </router-link>
  </v-card>
</template>

<script>
import { useDisplay } from 'vuetify'

// Child components
import RouteChips from '../components/FragmentRouteChips.vue'

export default {
  name: 'StopCard',

  components: { // Child components
    RouteChips
  },

  props: [ // Component properties
    'stop'
  ],

  setup () {
    const { xs, sm, md, lgAndUp } = useDisplay()
    return { xs, sm, md, lgAndUp }
  },

  data: function () {
    return {
      disruption: false,
      jsonDisruptions: ''
    }
  },

  computed: {
    // Returns true if stop is in favourites
    favouriteStop: function () {
      const self = this
      const favourites = this.$store.state.favouriteStops
      return !!favourites.find(function (fav) {
        return (fav.stopId === self.stop.stop_id && fav.routeType === self.stop.route_type)
      })
    },

    // Maximum number of chips to show for each breakpoint when not expanded
    maxChips: function () {
      if (this.xs || this.md) {
        switch (this.stop.route_type) {
          case 0: return 3
          case 1: return 5
          case 2: return 4
          case 3: return 2
          default: return 3
        }
      } else if (this.sm || this.lgAndUp) {
        switch (this.stop.route_type) {
          case 0: return 4
          case 1: return 8
          case 2: return 6
          case 3: return 3
          default: return 4
        }
      } else return 0
    }
  },

  mounted: function () {
    this.getDisruptionsRequest(this.stop.stop_id)
  },

  methods: {
    // Query API for disruptions at stop
    getDisruptionsRequest: function (stopId) {
      const request = `/v3/disruptions/stop/${stopId}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          Object.values(data.disruptions).forEach((disType) => {
            disType.forEach((dis) => {
              if (dis.disruption_status === 'Current') {
                this.disruption = true
                return null // Exit loop
              }
            })
          })
        })
    },

    favouriteButton: function () {
      if (!this.favouriteStop) {
        this.$store.commit('addFavouriteStop', { stopId: this.stop.stop_id, routeType: this.stop.route_type })
      } else {
        this.$store.commit('removeFavouriteStop', { stopId: this.stop.stop_id, routeType: this.stop.route_type })
      }
    }
  }
}
</script>

<style scoped>
.stop-card {
  min-height: 95px;
}

.stop-actions {
  width: 30px
}

.stop-header {
  width: calc(100% - 30px)
}

.route-type-card {
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
}

.route-type-icon {
  width: 50px;
  height: 50px;
}
</style>
