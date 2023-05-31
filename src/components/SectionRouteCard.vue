<template>
  <v-card
    class='route-card fill-height pa-3'
  >
    <div
      class='float-right route-actions'
    >
      <v-tooltip
        text='Good Service'
        location='start'
        open-delay='1200'
        content-class='text-caption pt-1 pb-1 ps-2 pe-2'
      >
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind='props'
            icon='mdi-star-outline'
            class='float-right'
          ></v-icon>
        </template>
      </v-tooltip>
      <br>
      <v-icon
        v-if='disruption'
        icon='mdi-alert-circle'
        class="text-disruption-orange float-right mt-4"
      ></v-icon>
    </div>
    <router-link
      :to='"/route"'
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
  min-height: 100px;
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
