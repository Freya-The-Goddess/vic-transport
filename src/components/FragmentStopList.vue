<template>
  <v-list class='pt-0 pb-1'>
    <template
      v-for='stop in stopList'
      :key='stop.stop_id'
    >
      <v-divider></v-divider>
      <v-list-item
        lines='5'
        class='ps-3 pe-4'
      >
        <template v-slot:prepend>
          <router-link
            :to='"/stop/" + stop.stop_id + "/" + stop.route_type'
            class='text-decoration-none text-over-color'
          >
            <v-card
              :color='$root.routeTypes[stop.route_type].route_type_color'
              rounded='circle'
              class='stop-icon d-flex align-center justify-center me-3'
            >
              <v-icon
                :icon='$root.routeTypes[stop.route_type].route_type_icon'
                class='text-over-color'
                size='large'
              ></v-icon>
            </v-card>
          </router-link>
        </template>
        <router-link
          :to='"/stop/" + stop.stop_id + "/" + stop.route_type'
          class='text-decoration-none text-over-color'
        >
          <v-list-item-title class='text-wrap pt-4 pb-4'>{{ stop.stop_name }}</v-list-item-title>
        </router-link>
        <template v-slot:append>
          <v-icon
            @click='favouriteButton(stop.stop_id, stop.route_type)'
            :icon='favouriteStop(stop.stop_id, stop.route_type) ? "mdi-star" : "mdi-star-outline"'
            :class='favouriteStop(stop.stop_id, stop.route_type) ? "text-favourite-yellow" : "text-over-color"'
            class='fav-button ma-1 me-0'
          ></v-icon>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'StopList',

  props: [ // Component properties
    'stopList'
  ],

  methods: {
    // Returns true if stop is in favourites
    favouriteStop: function (stopId, routeType) {
      const favourites = this.$store.state.favouriteStops
      return !!favourites.find((fav) => {
        return (fav.stopId === stopId && fav.routeType === routeType)
      })
    },

    favouriteButton: function (stopId, routeType) {
      if (!this.favouriteStop(stopId, routeType)) {
        this.$store.commit('addFavouriteStop', { stopId: stopId, routeType: routeType })
      } else {
        this.$store.commit('removeFavouriteStop', { stopId: stopId, routeType: routeType })
      }
    }
  }
}
</script>

<style scoped>
.stop-icon {
  opacity: 1 !important;
  width: 35px;
  height: 35px;
}

.fav-button {
  opacity: 1 !important;
}
</style>
