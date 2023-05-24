<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Search Stops</h2>
      </v-col>
    </v-row>
    <!-- Search Input -->
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
    <v-row>
      <v-col>
        <v-card class='pa-3'>
          <v-icon
            :icon='filtersExpanded ? "mdi-menu-up" : "mdi-menu-down"'
            @click='filtersExpanded = !filtersExpanded'
            role='button'
            class='card-expand-button float-right pa-1'
          ></v-icon>
          <div
            @click='filtersExpanded = !filtersExpanded'
            role='button'
            class='card-title'
          >
            <div class='d-flex align-center'>
              <v-icon
                icon='mdi-filter'
                class='d-inline-block fill-height'
              ></v-icon>
              <h3 class='d-inline-block fill-height ms-2'>Search Filters</h3>
            </div>
          </div>
          <v-expand-transition>
            <div v-show='filtersExpanded' class='pt-5'>
              <route-type-select
                :multiple='true'
                :select-route-types='$route.query.rt'
                @selected-route-types='getRouteTypes'
              ></route-type-select>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <!-- Loading and Error Cards -->
    <v-row v-if='searchLoading || (!searchLoading && !jsonStops.length) || searchError'>
      <v-col>
        <v-card
          v-if='searchLoading && !searchError'
          class='pa-4'
        >
          <v-progress-circular
            indeterminate
            :size='20'
            :width='3'
            class='me-2'
          ></v-progress-circular>
          <span class='ms-2'>Loading Results...</span>
        </v-card>
        <v-card
          v-else-if='searchError'
          class='pa-4'
        >
          <v-icon icon='text-error-text mdi-exclamation-thick me-1' class='float-left'></v-icon>
          <span class='text-error-text font-weight-bold float-left ms-1'>Search Request Error</span>
        </v-card>
        <v-card
          v-else-if='!jsonStops.length'
          class='pa-4'
        >
          <span>No Results</span>
        </v-card>
      </v-col>
    </v-row>
    <!-- Search Results -->
    <stop-list
      :stop-list='jsonStops'
    ></stop-list>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

// Child components
import RouteTypeSelect from '../components/SectionRouteTypeSelect.vue'
import StopList from '../components/SectionStopList.vue'

export default defineComponent({
  name: 'ViewSearch',

  components: { // Child components
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

  watch: {
    strSearchInput: function () {
      this.debouncedSearch() // Debounced search when search input changes
    }
  },

  created: function () {
    // Mount debounced search function
    this.debouncedSearch = this.debounce(500, function () {
      if (this.strSearchInput) { this.searchLoading = true }
      this.search()
    })
  },

  mounted: function () {
    this.strSearchInput = this.$route.query.q // Get search string from URL params
    if (this.$route.query.rt) {
      this.filterRouteTypes = this.$route.query.rt.split(' ') // Get route types from URL params
    }
    this.debouncedSearch()
  },

  methods: {
    // Sanitise search string, push queries to route, and run search to API
    search: function () {
      this.jsonStops = []
      this.searchError = false
      const searchString = this.strSearchInput
        ? this.strSearchInput.replace(/[#?&*=:<>/\\]/, '').trimEnd() // Remove forbidden characters and trailing whitespace
        : ''
      let urlQuery = {}
      if (searchString) {
        this.searchLoading = true
        urlQuery = this.filterRouteTypes.length > 0
          ? { q: searchString, rt: this.filterRouteTypes.toString().replace(/,/, ' ') }
          : { q: searchString }
        this.searchRequest(searchString) // Run search request
      } else {
        this.searchLoading = false
      }
      this.$router.push({ // Push new search query to URL
        path: '/search',
        query: urlQuery
      })
    },

    // Query API for stops matching search
    searchRequest: function (searchString) {
      let request = `/v3/search/${encodeURIComponent(searchString)}`
      this.filterRouteTypes.forEach(function (routeType) {
        request += request.includes('?') ? '&' : '?'
        request += 'route_types=' + routeType
      })
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.jsonStops = data.stops.toSorted(function (a, b) { return a.route_type - b.route_type })
          this.searchError = false
          this.searchLoading = false
        })
        .catch((error) => {
          this.searchError = true
          console.log(error)
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

<style>
.card-title {
  max-width: 90%;
}

.card-expand-button {
  max-width: 10%;
}
</style>
