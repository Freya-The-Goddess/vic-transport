<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Routes</h2>
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
                :multiple='false'
                :select-route-types='["0"]'
                @selected-route-types='getRouteTypes'
              ></route-type-select>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'

// Components
import RouteTypeSelect from '../components/SectionRouteTypeSelect.vue'

export default defineComponent({
  name: 'ViewFavourites',

  components: { // Child components
    RouteTypeSelect
  },

  data: function () { // Default data
    return {
      routeType: '',
      filtersExpanded: false
    }
  },

  methods: {
    // Get route types callback for child component $emit event
    getRouteTypes: function (value) {
      this.routeType = value[0]
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
