<template>
  <v-list class='pt-1 pb-1'>
    <template
      v-for='departure in departureList'
      :key='departure.run_id'
    >
      <v-divider></v-divider>
      <v-list-item
        lines='5'
        class='ps-3 pe-4 mt-2 mb-2'
      >
        <template v-slot:prepend>
          <v-card
            :color='$root.routeTypes[directionList[departure.direction_id].route_type].route_type_color'
            rounded='large'
            class='departure-time d-flex align-center justify-center me-3'
          >
            <span class='text-caption text-over-color'>{{ timeTillDeparture(departure) }}</span>
          </v-card>
        </template>
        <v-list-item-title class='text-wrap'>
          <span v-if='routeList[departure.route_id].route_number'>
            {{ routeList[departure.route_id].route_number }} to
          </span>
          {{ directionList[departure.direction_id].direction_name }}
        </v-list-item-title>
        <v-list-item-subtitle
          v-if='departure.platform_number'
          class='text-wrap pt-1'
        >
          Platform {{ departure.platform_number }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'DepartureList',

  props: [ // Component properties
    'departureList',
    'directionList',
    'routeList'
  ],

  methods: {
    timeTillDeparture: function (departure) {
      if (departure.estimated_departure_utc) {
        const departureTime = Date.parse(departure.estimated_departure_utc)
        const timeTill = Math.ceil((departureTime - Date.now()) / 60000)
        if (timeTill === 0) return 'Now'
        else if (timeTill <= 60) return timeTill.toString() + ' min'
        else return new Date(departureTime).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })
      } else if (departure.scheduled_departure_utc) {
        const departureTime = Date.parse(departure.scheduled_departure_utc)
        return new Date(departureTime).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })
      } else {
        return '?'
      }
    }
  }
}
</script>

<style scoped>
.departure-time {
  opacity: 1 !important;
  height: 40px;
  width: 70px;
}
</style>
