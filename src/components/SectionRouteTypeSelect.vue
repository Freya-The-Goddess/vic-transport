<template>
  <v-row>
    <v-col
      v-for='(n,routeType) in 4'
      :key='routeType'
      cols='3'
    >
      <v-btn
        :color='routeTypeSelected(routeType.toString()) ? $root.routeTypes[routeType].route_type_color : ""'
        @click='selectRouteType(routeType.toString())'
        class='text-over-color rounded-xl w-100 h-100 pt-2 pb-2 pt-md-1 pb-md-1'
      >
        <div class='d-flex flex-column flex-md-row align-center'>
          <div class='mb-1 mb-md-0 me-md-2'>
            <v-icon
              :icon='$root.routeTypes[routeType].route_type_icon'
              size='large'
              class='d-none d-md-inline'
            ></v-icon>
            <v-icon
              :icon='$root.routeTypes[routeType].route_type_icon'
              size='xx-large'
              class='d-inline d-md-none'
            ></v-icon>
          </div>
          <div class='text-caption text-md-button d-none d-sm-block'>{{ $root.routeTypes[routeType].route_type_name.toUpperCase() }}</div>
          <div class='text-caption d-block d-sm-none'>{{ $root.routeTypes[routeType].route_type_short_name.toUpperCase() }}</div>
        </div>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'RouteTypeSelect',

  props: [ // Component properties
    'multiple',
    'selectRouteTypes'
  ],

  data: function () { // Default data
    return {
      routeTypes: []
    }
  },

  watch: { // Change listeners
    routeTypes: {
      handler: function () {
        this.$emit('selectedRouteTypes', this.routeTypes)
      },
      deep: true
    }
  },

  mounted: function () {
    // Populate selection from props
    if (this.selectRouteTypes) {
      this.routeTypes = this.selectRouteTypes.split(',')
    }
  },

  methods: {
    // Route button clicked, select/unselect if multiple or replace if not multiple
    selectRouteType: function (routeType) {
      if (this.multiple === 'true') { // Multiple selections allowed
        if ($.inArray(routeType, this.routeTypes) !== -1) {
          this.routeTypes = this.routeTypes.filter(function (type) { return type !== routeType })
        } else {
          this.routeTypes.push(routeType)
          this.routeTypes.sort()
        }
      } else { // Only one selection allowed
        this.routeTypes = [routeType]
      }
    },

    // Returns true if route type (string) specified is in routeTypes array
    routeTypeSelected: function (routeType) {
      return ($.inArray(routeType, this.routeTypes) !== -1)
    }
  }
}
</script>
