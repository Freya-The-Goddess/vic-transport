<template>
  <v-chip-group>
    <v-chip
      v-for='(route, index) in trimmedChipList'
      :key='index'
      :disabled='!selectable'
      :filter='selectable'
      variant='outlined'
      style='opacity: 1'
      :class='"text-" + $root.routeTypes[route.route_type].route_type_color'
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
        style='opacity: 1'
        class='text-caption'
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
      })
    },

    // Map routes list to list of chip labels
    chipList: function () {
      return this.sortedRoutesList.map((route) => {
        if ((route.route_type === 1 || route.route_type === 2) && route.route_number !== '') {
          return { short_name: route.route_number.toString(), route_type: route.route_type }
        } else {
          if (route.route_name.length <= 15 || !this.truncateChips) {
            return { short_name: route.route_name, route_type: route.route_type }
          } else {
            return { short_name: route.route_name.substr(0, 12) + '...', route_type: route.route_type }
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
