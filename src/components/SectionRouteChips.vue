<template>
  <v-chip-group>
    <v-chip
      v-for='(route, index) in trimmedChipList'
      :key='index'
      class='text-caption'
    >{{ route }}</v-chip>
    <v-chip
      v-if='extraChips'
      class='text-caption font-italic'
    >+{{ extraChips }} MORE...</v-chip>
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
    'chipLinks'
  ],

  data: function () { // Default data
    return {
      extraChips: 0
    }
  },

  computed: {
    // Sort routes list
    sortedRoutesList: function () {
      const self = this
      const sorted = this.routesList.toSorted(function (a, b) { // Sort matching route types first
        if (a.route_type === self.routeType && b.route_type === self.routeType) {
          return 0 // keep order
        } else if (a.route_type === self.routeType && b.route_type !== self.routeType) {
          return -1 // a before b
        } else if (a.route_type !== self.routeType && b.route_type === self.routeType) {
          return 1 // b before a
        }
      }).toSorted(function (a, b) { // Sort route numbers chronologically
        if (a.route_number.includes('combined') && !b.route_number.includes('combined')) {
          return 1 // b before a
        } else if (!a.route_number.includes('combined') && b.route_number.includes('combined')) {
          return -1 // a before b
        } else {
          return a.route_number.split('-')[0].replace(/\D/g, '') - b.route_number.split('-')[0].replace(/\D/g, '')
        }
      })
      return sorted
    },

    // Map routes list to list of chip labels
    chipList: function () {
      const self = this
      return this.sortedRoutesList.map(function (route) {
        if ((route.route_type === 1 || route.route_type === 2) && route.route_number !== '') {
          return route.route_number
        } else {
          if (route.route_name.length <= 15 || !self.truncateChips) {
            return route.route_name
          } else {
            return route.route_name.substr(0, 12) + '...'
          }
        }
      })
    },

    // Trim chip list to max length
    trimmedChipList: function () {
      if (this.maxChips > 0) {
        if (this.chipList.length > this.maxChips) {
          // eslint-disable-next-line
          this.extraChips = this.chipList.length - (this.maxChips - 1)
          return this.chipList.slice(0, this.maxChips - 1)
        } else return this.chipList
      } else return this.chipList
    }
  }
}
</script>
