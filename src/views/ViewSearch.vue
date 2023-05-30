<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <h2>Search Stops</h2>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Inputs -->
  <v-container class='pt-2 pb-2'>
    <!-- Search Text Input -->
    <v-row>
      <v-col>
        <v-text-field
          v-model='strSearchInput'
          placeholder='Search for Stops'
          :persistent-placeholder='true'
          clearable
          @click:clear='clearSearch'
          variant='solo'
          :hide-details='true'
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- Search Filters -->
    <v-row class='mt-0'>
      <v-col>
        <v-card class='pa-3 pb-2'>
          <div
            @click='filtersExpanded = !filtersExpanded'
            role='button'
            class='card-expand-button float-right pb-1'
          >
            <v-icon
              :icon='filtersExpanded ? "mdi-menu-up" : "mdi-menu-down"'
              class='float-right'
            ></v-icon>
          </div>
          <div
            @click='filtersExpanded = !filtersExpanded'
            role='button'
            class='card-expand-title'
          >
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-filter'
                size='small'
                class='d-inline-block fill-height'
              ></v-icon>
              <span class='d-inline-block fill-height ms-2'>
                Search Filters
                <span v-if='totalFilters'>({{ totalFilters }})</span>
              </span>
            </div>
          </div>
          <div class='pt-1'>
            <v-expand-transition>
              <div v-show='filtersExpanded' class='pt-3 pb-2'>
                <route-type-select
                  :multiple='true'
                  :select-route-types='$route.query.rt ? $route.query.rt.split(" ") : []'
                  @selected-route-types='getRouteTypes'
                ></route-type-select>
              </div>
            </v-expand-transition>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Loading and Error Cards -->
  <v-container v-if='searchLoading || (!searchLoading && !jsonStops.length) || searchError'>
    <v-row>
      <v-col>
        <loading-card
          v-if='searchLoading && !searchError'
          text='Loading Results...'
        ></loading-card>
        <error-card
          v-else-if='searchError'
          :text='searchError'
        ></error-card>
        <message-card
          v-else-if='!jsonStops.length'
          text='No Results'
        ></message-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Results -->
  <v-container
    v-if='jsonStops.length'
    class='mt-1'
  >
    <stop-list
      :stop-list='jsonStops'
    ></stop-list>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

// Child components
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import MessageCard from '../components/SectionMessageCard.vue'
import RouteTypeSelect from '../components/SectionRouteTypeSelect.vue'
import StopList from '../components/SectionStopList.vue'

export default defineComponent({
  name: 'ViewSearch',

  components: { // Child components
    ErrorCard,
    LoadingCard,
    MessageCard,
    RouteTypeSelect,
    StopList
  },

  data: function () { // Default data
    return {
      strSearchInput: '',
      searchLoading: false,
      searchError: false,
      jsonStops: [],
      filterRouteTypes: [],
      filtersExpanded: false
    }
  },

  computed: {
    totalFilters: function () {
      let total = 0
      if (this.filterRouteTypes.length) { total += 1 }
      return total
    },

    searchString: function () {
      return this.strSearchInput
        ? this.strSearchInput.replaceAll(/[#?&*=:<>/\\]/g, '').trimEnd() // Remove forbidden characters and trailing whitespace
        : ''
    }
  },

  watch: {
    strSearchInput: function () {
      this.debouncedSearch() // Debounced search when search input changes
    }
  },

  created: function () {
    // Mount debounced search function
    this.debouncedSearch = this.debounce(500, function () {
      this.search()
    })
  },

  mounted: function () {
    this.strSearchInput = this.$route.query.q // Get search string from URL params
    if (this.$route.query.rt) this.filterRouteTypes = this.$route.query.rt.split(' ') // Get route types from URL params
    this.debouncedSearch()
  },

  methods: {
    // Sanitise search string, push queries to route, and run search to API
    search: function () {
      if (this.strSearchInput) { this.searchLoading = true }
      this.searchError = false
      this.jsonStops = []
      const urlPath = '/search'
      const urlQuery = {}
      if (this.searchString) urlQuery.q = this.searchString
      if (this.filterRouteTypes.length) urlQuery.rt = this.filterRouteTypes.toString().replaceAll(/,/g, ' ')
      if (this.$route.path === urlPath) { // prevents bouncing if path changes
        this.$router.push({ // Push new search query to URL
          path: urlPath,
          query: urlQuery
        })
      }
      if (this.searchString) {
        this.searchLoading = true
        this.searchRequest() // Run search request
      } else {
        this.searchLoading = false
      }
    },

    // Query API for stops matching search
    searchRequest: function () {
      let request = `/v3/search/${encodeURIComponent(this.searchString)}`
      this.filterRouteTypes.forEach(function (routeType) {
        request += request.includes('?') ? '&' : '?'
        request += 'route_types=' + routeType
      })
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.jsonStops = data.stops.toSorted(function (a, b) { return a.route_type - b.route_type })
          this.searchLoading = false
          this.searchError = ''
        })
        .catch((error) => {
          this.searchLoading = false
          this.searchError = error.message
        })
    },

    // Clear search button
    clearSearch: function () {
      this.$router.push({ path: '/search' })
      this.strSearchInput = ''
    },

    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.filterRouteTypes = value
      this.debouncedSearch() // Debounced search when route type filter changes
    },

    // Debounce function for search input
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
.card-expand-title {
  width: calc(100% - 40px);
}

.card-expand-button {
  width: 40px;
}
</style>
