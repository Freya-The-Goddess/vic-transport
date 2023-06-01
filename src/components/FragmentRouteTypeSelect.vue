<template>
  <v-row>
    <v-col
      v-for='(n,routeType) in 4'
      :key='routeType'
      cols='3'
      class='ps-1 pe-1 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3'
    >
      <v-btn
        :color='$root.routeTypes[routeType].route_type_color + (routeTypeSelected(routeType.toString()) ? "" : "-dim")'
        @click='selectRouteType(routeType.toString())'
        class='route-type-button text-over-color rounded-xl pt-2 pb-2 pt-md-1 pb-md-1'
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
          <div class='text-caption text-md-button d-none d-sm-block'>
            {{ $root.routeTypes[routeType].route_type_name.toUpperCase() }}
          </div>
          <div class='text-caption d-block d-sm-none'>
            {{ $root.routeTypes[routeType].route_type_short_name.toUpperCase() }}
          </div>
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
      this.routeTypes = this.selectRouteTypes
    }
  },

  methods: {
    // Route button clicked, select/unselect if multiple or replace if not multiple
    selectRouteType: function (routeType) {
      if (this.multiple) { // Multiple selections allowed
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

<style scoped>
.route-type-button {
  min-width: 0;
  height: 100% !important;
  width: 100% !important;
}
</style>
