<template>
  <v-row id='pagination'>
    <v-col>
      <!-- Items per page select input -->
      <div class='d-inline-block me-0 me-sm-2'>
        <v-select
          v-model='itemsPerPage'
          :items='[5, 10, 20, 50]'
          label='Per Page'
          :density='smAndDown ? "comfortable" : "default"'
          :hide-details='true'
          variant='solo'
          class='per-page-select float-left'
        ></v-select>
      </div>
      <!-- Pagination controls -->
      <div class='d-inline-block ms-0 ms-sm-2'>
        <v-pagination
          v-model='currentPage'
          :length='totalPages'
          :total-visible='smAndUp ? 6 : 1'
          :density='smAndDown ? "comfortable" : "default"'
          rounded='circle'
          class='float-left'
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
  name: 'PaginationButtons',

  props: [ // Component properties
    'totalItems'
  ],

  setup () {
    const { smAndDown, smAndUp } = useDisplay()
    return { smAndDown, smAndUp }
  },

  data: function () { // Default data
    return {
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 1
    }
  },

  watch: { // Change listeners
    totalItems: function () {
      this.calcTotalPages()
    },

    itemsPerPage: function () {
      this.currentPage = 1
      this.$store.commit('changePerPage', this.itemsPerPage)
      this.calcTotalPages()
      this.$emit('itemsPerPage', this.itemsPerPage)
    },

    currentPage: function () {
      this.$emit('currentPage', this.currentPage)
    },

    totalPages: function () {
      this.$emit('totalPages', this.totalPages)
    }
  },

  mounted: function () {
    this.itemsPerPage = parseInt(this.$store.state.perPage)
    this.calcTotalPages()
  },

  methods: {
    calcTotalPages: function () {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    }
  }
}
</script>

<style scoped>
.per-page-select {
  width: 100px;
}
</style>
