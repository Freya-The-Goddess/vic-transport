<template>
  <v-card
    class='route-card fill-height pa-3'
  >
    <div
      class='route-actions float-right'
    >
      <v-icon
        v-if='disruption'
        icon='mdi-alert-circle'
        class="text-disruption-orange float-right"
      ></v-icon>
    </div>
    <router-link
      :to='"/route/"+route.route_id+"/"+route.route_type'
      class='text-decoration-none text-over-color'
    >
      <div
        role='button'
        class='route-header d-flex align-center float-left fill-height'
      >
        <v-card
          :color='$root.routeTypes[route.route_type].route_type_color'
          rounded='circle'
          class='route-type-card text-over-color float-left me-3'
        >
          <v-icon
            :icon='$root.routeTypes[route.route_type].route_type_icon'
            size='x-large'
            class='route-type-icon'
          ></v-icon>
        </v-card>
        <div class='align-top fill-height'>
          <span v-if='route.route_number' class='font-weight-bold text-break'>{{ route.route_number }} - </span>
          <span class='font-weight-bold text-break'>{{ route.route_name }}</span><br>
          <div>
            <v-icon
              :icon='statusIcon.icon'
              :class='"text-"+statusIcon.color'
              size='x-small'
              class='me-1'
            ></v-icon>
            <span class='text-caption'>{{ route.route_service_status.description }}</span>
          </div>
        </div>
      </div>
    </router-link>
  </v-card>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
  name: 'RouteCard',

  props: [ // Component properties
    'route'
  ],

  setup () {
    const { xs, sm, md, lgAndUp } = useDisplay()
    return { xs, sm, md, lgAndUp }
  },

  data: function () {
    return {
      disruption: false,
      jsonDisruptions: ''
    }
  },

  computed: {
    statusIcon: function () {
      const status = this.route.route_service_status.description
      if (status === 'Good Service') {
        return { icon: 'mdi-check-circle', color: 'good-green' }
      } else if (status === 'Minor Delays') {
        return { icon: 'mdi-clock', color: 'minor-delay-orange' }
      } else if (status === 'Major Delays') {
        return { icon: 'mdi-clock', color: 'major-delay-red' }
      } else if (status === 'Planned Works') {
        return { icon: 'mdi-alert-circle', color: 'works-yellow' }
      } else if (status === 'Part Suspended' || status === 'Suspended') {
        return { icon: 'mdi-close-circle', color: 'closure-grey' }
      } else if (status === 'General Alert' || status === 'Service Changes' || status === 'Service Information' || status === 'Planned Closure') {
        return { icon: 'mdi-information', color: 'info-blue' }
      } else {
        return { icon: 'mdi-alert-circle', color: 'disruption-orange' }
      }
    }
  },

  mounted: function () {
    this.getDisruptionsRequest(this.route.route_id)
  },

  methods: {
    // Query API for disruptions at stop
    getDisruptionsRequest: function (routeId) {
      const request = `/v3/disruptions/route/${routeId}`
      this.$root.ptvApiRequest(request)
        .then((data) => {
          Object.values(data.disruptions).forEach((disType) => {
            disType.forEach((dis) => {
              if (dis.disruption_status === 'Current') {
                this.disruption = true
                return null // Exit loop
              }
            })
          })
        })
    }
  }
}
</script>

<style scoped>
.v-tooltip .v-overlay__content {
  background: rgba(var(--v-theme-surface-variant), 1) !important;
}

.route-card {
  min-height: 70px;
}

.route-actions {
  width: 30px
}

.route-header {
  width: calc(100% - 30px)
}

.route-type-card {
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
}

.route-type-icon {
  width: 50px;
  height: 50px;
}
</style>
