<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Search Stops</h2>
      </v-col>
    </v-row>
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
    <route-type-select
      :multiple='true'
      :select-route-types='$route.params.routeTypes'
      @selected-route-types='getRouteTypes'
    ></route-type-select>
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
      filterRouteTypes: []
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
    this.strSearchInput = this.$route.params.searchString // Get search string from URL params
    if (this.$route.params.routeTypes) {
      this.filterRouteTypes = this.$route.params.routeTypes.split(',') // Get route types from URL params
    }
    this.debouncedSearch()
  },

  methods: {
    // Sanitise search string, push to route, and run search to API
    search: function () {
      this.jsonStops = []
      this.searchError = false
      const searchString = this.strSearchInput.replace(/[?&*=:<>/\\]/, '').trimEnd() // Remove forbidden characters and trailing whitespace
      if (searchString) {
        this.searchLoading = true
        let path = `/search/${encodeURIComponent(searchString)}`
        if (this.filterRouteTypes.length > 0) { // If route type filters selected append to URL path
          path += `/route_types/${encodeURIComponent(this.filterRouteTypes)}`
        }
        this.$router.push({ path: path }) // Push new search parameters to URL
        this.searchRequest(searchString) // Run search request
      } else {
        this.searchLoading = false
        this.$router.push({ path: '/search' }) // Push blank search URL
      }
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
