<template>
  <v-row>
    <v-col
      v-for='route in paginatedRouteList'
      :key='route.route_id'
      cols='12'
      md='6'
      xl='4'
      class='pt-2 pb-2'
    >
      <route-card
        :route='route'
      ></route-card>
    </v-col>
  </v-row>
  <pagination-buttons
    v-if='routeList.length'
    :total-items='routeList.length'
    @items-per-page='getItemsPerPage'
    @current-page='getCurrentPage'
    @total-pages='getTotalPages'
  ></pagination-buttons>
</template>

<script>
// Child components
import PaginationButtons from '../components/FragmentPagination.vue'
import RouteCard from '../components/SectionRouteCard.vue'

export default {
  name: 'RouteList',

  props: [ // Component properties
    'routeList'
  ],

  components: { // Child components
    PaginationButtons,
    RouteCard
  },

  data: function () { // Default data
    return {
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 1
    }
  },

  computed: {
    // Slice routes list for pagination
    paginatedRouteList: function () {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.routeList.slice(start, end)
    }
  },

  watch: { // Change listeners
    routeList: {
      handler: function () {
        this.currentPage = 1
      },
      deep: true
    }
  },

  methods: {
    // Get items per page callback for child component $emit event
    getItemsPerPage: function (value) {
      this.itemsPerPage = value
    },

    // Get current page callback for child component $emit event
    getCurrentPage: function (value) {
      this.currentPage = value
    },

    // Get total pages for child component $emit event
    getTotalPages: function (value) {
      this.totalPages = value
    }
  }
}
</script>
