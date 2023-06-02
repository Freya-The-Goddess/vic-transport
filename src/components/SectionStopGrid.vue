<template>
  <v-row>
    <v-col
      v-for='stop in paginatedStopList'
      :key='stop.stop_id'
      cols='12'
      md='6'
      xl='4'
      class='pt-2 pb-2'
    >
      <stop-card
        :stop='stop'
      ></stop-card>
    </v-col>
  </v-row>
  <pagination-buttons
    v-if='stopList.length'
    :total-items='stopList.length'
    @items-per-page='getItemsPerPage'
    @current-page='getCurrentPage'
    @total-pages='getTotalPages'
  ></pagination-buttons>
</template>

<script>
// Child components
import PaginationButtons from '../components/FragmentPagination.vue'
import StopCard from '../components/FragmentStopCard.vue'

export default {
  name: 'StopGrid',

  props: [ // Component properties
    'stopList'
  ],

  components: { // Child components
    PaginationButtons,
    StopCard
  },

  data: function () { // Default data
    return {
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 1
    }
  },

  computed: {
    // Slice stops list for pagination
    paginatedStopList: function () {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.stopList.slice(start, end)
    }
  },

  watch: { // Change listeners
    stopList: {
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
