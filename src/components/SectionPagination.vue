<template>
  <v-row id='pagination'>
    <v-col>
      <!-- Items per page select input -->
      <div class='d-inline-block me-3'>
        <v-select
          v-model='itemsPerPage'
          :items='[5, 10, 20, 50]'
          label='Per Page'
          :hide-details='true'
          variant='solo'
          style='width: 100px'
          class='float-left'
        ></v-select>
      </div>
      <!-- Pagination controls -->
      <div class='d-inline-block ms-3'>
        <v-pagination
          v-model='currentPage'
          :length='totalPages'
          total-visible='4'
          rounded='circle'
          class='float-left'
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PaginationButtons',

  props: [ // Component properties
    'totalItems'
  ],

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
    this.calcTotalPages()
  },

  methods: {
    calcTotalPages: function () {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    }
  }
}
</script>
