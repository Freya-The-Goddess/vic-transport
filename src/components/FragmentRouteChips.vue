<template>
  <div
    v-if='selectable && chipList.length > 1'
    class='font-italic mt-2'
  >
    Select route to filter disruptions and departures
  </div>
  <v-chip-group
    v-model='selectedRouteIndex'
    :class='!selectable || chipList.length <= 1 ? "mt-2" : ""'
  >
    <v-chip
      v-for='route in trimmedChipList'
      :key='route.route_id'
      :disabled='!selectable'
      :filter='selectable'
      variant='outlined'
      :class='"text-" + $root.routeTypes[route.route_type].route_type_color'
      class='chip-opacity'
    >
      <span class='text-caption text-over-color'>{{ route.short_name }}</span>
    </v-chip>
    <div
      v-if='extraChips'
      @click='expand'
      role='button'
    >
      <v-chip
        :disabled='true'
        variant='outlined'
        class='chip-opacity text-caption'
      >+{{ extraChips }} more...</v-chip>
    </div>
  </v-chip-group>
</template>

<script>
export default {
  name: 'RouteChips',

  props: [ // Component properties
    'routesList',
    'routeType',
    'maxChips',
    'truncateChips',
    'selectable',
    'expandable'
  ],

  data: function () {
    return {
      selectedRouteIndex: undefined
    }
  },

  watch: {
    selectedRouteIndex: function () {
      if (this.selectedRouteIndex !== undefined) {
        this.$emit('selectedRoute', { route_id: this.chipList[this.selectedRouteIndex].route_id, route_type: this.chipList[this.selectedRouteIndex].route_type })
      } else {
        this.$emit('selectedRoute', null)
      }
    }
  },

  computed: { // Computed values
    // Sort routes list
    sortedRoutesList: function () {
      return this.routesList.toSorted((a, b) => { // Sort matching route types first
        if (a.route_type === this.routeType && b.route_type === this.routeType) {
          return 0 // keep order
        } else if (a.route_type === this.routeType && b.route_type !== this.routeType) {
          return -1 // a before b
        } else if (a.route_type !== this.routeType && b.route_type === this.routeType) {
          return 1 // b before a
        }
      }).toSorted((a, b) => { // Sort route numbers chronologically
        if (a.route_number.includes('combined') && !b.route_number.includes('combined')) {
          return 1 // b before a
        } else if (!a.route_number.includes('combined') && b.route_number.includes('combined')) {
          return -1 // a before b
        } else {
          return a.route_number.split('-')[0].replace(/\D/g, '') - b.route_number.split('-')[0].replace(/\D/g, '')
        }
      }).filter((value, index, self) => { // Remove duplicates (from API)
        return index === self.findIndex((t) => (
          t.route_id === value.route_id && t.route_type === value.route_type
        ))
      })
    },

    // Map routes list to list of chip labels
    chipList: function () {
      return this.sortedRoutesList.map((route) => {
        if ((route.route_type === 1 || route.route_type === 2) && route.route_number !== '') {
          return { short_name: route.route_number.toString(), route_type: route.route_type, route_id: route.route_id }
        } else {
          if (route.route_name.length <= 15 || !this.truncateChips) {
            return { short_name: route.route_name, route_type: route.route_type, route_id: route.route_id }
          } else {
            return { short_name: route.route_name.substr(0, 12) + '...', route_type: route.route_type, route_id: route.route_id }
          }
        }
      })
    },

    // Trim chip list to max length
    trimmedChipList: function () {
      if (this.maxChips > 0 && this.chipList.length > this.maxChips) {
        return this.chipList.slice(0, this.maxChips - 1)
      } else return this.chipList
    },

    // Number of hidden chips on trimmed chip list
    extraChips: function () {
      if (this.maxChips > 0 && this.chipList.length > this.maxChips) {
        return this.chipList.length - (this.maxChips - 1)
      } else return 0
    }
  },

  methods: {
    expand: function () {
      if (this.expandable) this.$emit('expand')
    }
  }
}
</script>

<style scoped>
.chip-opacity {
  opacity: 1 !important;
}
</style>
