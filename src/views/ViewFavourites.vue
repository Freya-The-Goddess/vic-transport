<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <h2>Favourite Stops</h2>
      </v-col>
    </v-row>
  </v-container>
  <!-- Loading and Error Cards -->
  <v-container class='pt-2 pb-2' v-if='favLoading || favError || (!favLoading && !jsonStops.length)'>
    <v-row>
      <v-col>
        <loading-card
          v-if='favLoading'
          text='Loading Favourite Stops...'
        ></loading-card>
        <error-card
          v-else-if='favError'
          text='Favourite Stops Request Error'
        ></error-card>
        <message-card
          v-else-if='!favLoading && !jsonStops.length'
          text='No Favourite Stops'
        ></message-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Results -->
  <v-container
    v-if='jsonStops.length'
    class='mt-0'
  >
    <stop-list
      :stop-list='jsonStops'
    ></stop-list>
  </v-container>
</template>

<script scoped>
import { defineComponent } from 'vue'

// Child components
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import MessageCard from '../components/SectionMessageCard.vue'
import StopList from '../components/SectionStopList.vue'

export default defineComponent({
  name: 'ViewFavourites',

  components: { // Child components
    ErrorCard,
    LoadingCard,
    MessageCard,
    StopList
  },

  data: function () { // Default data
    return {
      jsonStops: [],
      favError: '',
      favLoading: false
    }
  },

  mounted: function () {
    this.favSearch()
  },

  methods: {
    favSearch: function () {
      this.favError = false
      if (this.$store.state.favouriteStops.length) {
        this.favLoading = true
        this.$store.state.favouriteStops.forEach((favStop) => {
          this.getStopRequest(favStop.stopId, favStop.routeType)
        })
      } else {
        this.favLoading = false
      }
    },

    // Query API for stop data
    getStopRequest: function (stopId, routeType) {
      const request = `/v3/stops/${stopId}/route_type/${routeType}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.jsonStops.push(data.stop)
          this.favLoading = false
          this.favError = false
        })
        .catch((error) => {
          this.favError = true
          console.log(error)
        })
    }
  }
})
</script>
