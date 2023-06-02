<template>
  <v-container class='pb-2'>
    <v-row>
      <v-col>
        <!-- Page Title -->
        <h2 class='page-title'>Routes</h2>
        <!-- Reload Button -->
        <v-tooltip
          text='Reload Routes'
          location='start'
          open-delay='1200'
          content-class='pt-2 pb-2 ps-3 pe-3'
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind='props'
              @click='debouncedRoutesRequest()'
              icon='mdi-sync'
              size='large'
              class='reload-button mt-1'
            ></v-icon>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Inputs -->
  <v-container class='pt-2 pb-2'>
    <!-- Search Filters -->
    <v-row>
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
              <div v-show='filtersExpanded'>
                <route-type-select
                  :multiple='false'
                  :select-route-types='$route.query.rt ? $route.query.rt.split(" ") : ["0"]'
                  @selected-route-types='getRouteTypes'
                ></route-type-select>
              </div>
            </v-expand-transition>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Loading and Error Cards -->
  <v-container v-if='routesLoading || (!routesLoading && !jsonRoutes.length) || routesError'>
    <v-row>
      <v-col>
        <loading-card
          v-if='routesLoading && !routesError'
          text='Loading Routes...'
        ></loading-card>
        <error-card
          v-else-if='routesError'
          :text='routesError'
        ></error-card>
        <message-card
          v-else-if='!routesLoading && !jsonRoutes.length'
          text='No Routes Found'
        ></message-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Search Results -->
  <v-container
    v-if='jsonRoutes.length'
    class='mt-1'
  >
    <route-grid
      :route-list='sortedRoutes'
    ></route-grid>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

// Child components
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'
import MessageCard from '../components/SectionMessageCard.vue'
import RouteTypeSelect from '../components/FragmentRouteTypeSelect.vue'
import RouteGrid from '../components/SectionRouteGrid.vue'

export default defineComponent({
  name: 'ViewFavourites',

  components: { // Child components
    ErrorCard,
    LoadingCard,
    MessageCard,
    RouteTypeSelect,
    RouteGrid
  },

  data: function () { // Default data
    return {
      routesLoading: true,
      routesError: '',
      jsonRoutes: [],
      filterRouteTypes: ['0'],
      filtersExpanded: false
    }
  },

  computed: {
    totalFilters: function () {
      let total = 0
      if (this.filterRouteTypes.length) { total += 1 }
      return total
    },

    // Sort routes list
    sortedRoutes: function () {
      if (this.filterRouteTypes[0] === '2') { // Don't sort bus routes
        return this.jsonRoutes
      } else {
        return this.jsonRoutes.toSorted((a, b) => { // Sort route numbers chronologically and route names alphabetically
          if (a.route_number && b.route_number) {
            if (a.route_number.includes('combined') && !b.route_number.includes('combined')) {
              return 1 // b before a
            } else if (!a.route_number.includes('combined') && b.route_number.includes('combined')) {
              return -1 // a before b
            } else {
              return a.route_number.split('-')[0].replace(/\D/g, '') - b.route_number.split('-')[0].replace(/\D/g, '')
            }
          } else if (a.route_number && !b.route_number) {
            return -1 // a before b
          } else if (!a.route_number && b.route_number) {
            return 1 // b before a
          } else {
            return a.route_name < b.route_name ? -1 : 1
          }
        })
      }
    }
  },

  created: function () {
    // Mount debounced request function
    this.debouncedRoutesRequest = this.debounce(500, function () {
      this.routesSearch()
    })
  },

  mounted: function () {
    if (this.$route.query.rt) this.filterRouteTypes = this.$route.query.rt.split(' ') // Get route types from URL params
    this.debouncedRoutesRequest()
  },

  methods: {
    // Push queries to route, and run request to API
    routesSearch: function () {
      this.routesLoading = true
      this.routesError = ''
      this.jsonRoutes = []
      const urlPath = '/routes'
      const urlQuery = {}
      if (this.filterRouteTypes.length) urlQuery.rt = this.filterRouteTypes.toString().replaceAll(/,/g, ' ')
      if (this.$route.path === urlPath) { // prevents bouncing if path changes
        this.$router.push({ // Push new query to URL
          path: urlPath,
          query: urlQuery
        })
      }
      this.routesRequest() // Run API request
    },

    // Query API for routes
    routesRequest: function () {
      let request = '/v3/routes'
      this.filterRouteTypes.forEach(function (routeType) {
        request += request.includes('?') ? '&' : '?'
        request += 'route_types=' + routeType
      })
      this.$root.ptvApiRequest(request)
        .then((data) => {
          this.jsonRoutes = data.routes
          this.routesLoading = false
          this.routesError = ''
        })
        .catch((error) => {
          this.routesLoading = false
          this.routesError = error.message
        })
    },

    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.filterRouteTypes = value
      this.debouncedRoutesRequest()
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
