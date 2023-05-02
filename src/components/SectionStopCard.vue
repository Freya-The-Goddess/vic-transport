<template>
  <v-card
    class='fill-height pa-3'
  >
    <router-link
      :to='"/stop/" + stop.stop_id + "/route_type/" + stop.route_type'
      class='text-decoration-none text-over-color'
    >
      <div
        role='button'
        class='d-flex align-center float-left fill-height'
        :style='xs ? "width: 88%" : "width: 92%"'
      >
        <v-card
          :color='$root.routeTypes[stop.route_type].route_type_color'
          rounded='circle'
          style='width: 50px; height: 50px; flex: 0 0 50px'
          class='text-over-color float-left me-3'
        >
          <v-icon
            :icon='$root.routeTypes[stop.route_type].route_type_icon'
            size='x-large'
            style='width: 50px; height: 50px;'
          ></v-icon>
        </v-card>
        <div class='align-top fill-height'>
          <span class='font-weight-bold text-break'>{{ stop.stop_name }}</span><br>
          <route-chips
            :routes-list='stop.routes'
            :route-type='stop.route_type'
            :max-chips='4'
            :truncate-chips='true'
            :expandable='false'
            :chip-links='false'
          ></route-chips>
        </div>
      </div>
    </router-link>
    <div
      class='float-right'
      :style='xs ? "max-width: 12%" : "max-width: 8%"'
    >
      <v-icon
        @click='favouriteButton()'
        :icon='favouriteStop ? "mdi-star" : "mdi-star-outline"'
        class='text-favourite-yellow'
      ></v-icon><br>
      <v-icon
        v-if='disruption'
        icon='mdi-alert-circle'
        class="text-disruption-orange mt-4"
      ></v-icon>
    </div>
  </v-card>
</template>

<script>
import { useDisplay } from 'vuetify'

// Child components
import RouteChips from '../components/SectionRouteChips.vue'

export default {
  name: 'StopCard',

  components: { // Child components
    RouteChips
  },

  props: [ // Component properties
    'stop'
  ],

  setup () {
    // Destructure only the keys we want to use
    const { xs } = useDisplay()
    return { xs }
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
    }
  },

  mounted: function () {
    this.getDisruptions()
  },

  methods: {
    // Query API for disruptions at stop
    getDisruptions: function () {
      const request = `/v3/disruptions/stop/${this.stop.stop_id}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          Object.keys(data.disruptions).forEach(disruptionType => {
            if (data.disruptions[disruptionType].length) {
              this.disruption = true
              return null // Exit loop
            }
          })
        })
        .catch((error) => {
          console.log(error)
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
