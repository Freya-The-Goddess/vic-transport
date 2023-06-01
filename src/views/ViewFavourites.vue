<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <!-- Page Title -->
        <h2 class='page-title'>Favourite Stops</h2>
        <!-- Reload Button -->
        <v-tooltip
          text='Reload Favourite Stops'
          location='start'
          open-delay='1200'
          content-class='pt-2 pb-2 ps-3 pe-3'
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind='props'
              @click='debouncedFavSearch()'
              icon='mdi-sync'
              size='large'
              class='reload-button mt-1'
            ></v-icon>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
  <!-- Loading and Error Cards -->
  <v-container
    v-if='favLoading || favError || (!favLoading && !favStops.length)'
    class='pt-2 pb-2'
  >
    <v-row>
      <v-col>
        <loading-card
          v-if='favLoading'
          text='Loading Favourite Stops...'
        ></loading-card>
        <error-card
          v-else-if='favError'
          :text='favError'
        ></error-card>
        <message-card
          v-else-if='!favLoading && !favStops.length'
          text='No Favourite Stops'
        ></message-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Results -->
  <v-container
    v-if='favStops.length'
    class='pt-3 pb-2'
  >
    <stop-list
      :stop-list='favStops'
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
      favStops: [],
      favError: '',
      favLoading: true
    }
  },

  watch: {
    jsonStops: {
      handler: function () {
        if (this.jsonStops.length >= this.$store.state.favouriteStops.length) {
          this.favLoading = false
          this.favError = ''
          this.favStops = this.sortFavStops()
        } else {
          this.favStops = []
        }
      },
      deep: true
    }
  },

  created: function () {
    // Mount debounced request function
    this.debouncedFavSearch = this.debounce(500, function () {
      this.favSearch()
    })
  },

  mounted: function () {
    this.debouncedFavSearch()
  },

  methods: {
    // Sort favourite stops list by route type
    sortFavStops: function () {
      return this.jsonStops.toSorted((a, b) => {
        if (a.route_type === b.route_type) {
          return a.stop_name < b.stop_name ? -1 : 1
        } else {
          return a.route_type - b.route_type
        }
      })
    },

    // Get favourites and run API request
    favSearch: function () {
      this.favLoading = true
      this.favError = ''
      this.jsonStops = []
      this.favStops = []
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
        })
        .catch((error) => {
          this.favLoading = false
          this.favError = error.message
        })
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
