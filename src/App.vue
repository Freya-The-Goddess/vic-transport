<template>
  <v-app>
    <app-header></app-header>
    <app-nav></app-nav>
    <app-main></app-main>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import $ from 'jquery'

// App components
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import AppMain from './components/AppMain.vue'
import AppNav from './components/AppNav.vue'

export default {
  name: 'App',

  components: { // App components
    AppFooter,
    AppHeader,
    AppNav,
    AppMain
  },

  data: function () { // Default data
    return {
      routeTypes: [
        { route_type: '0', route_type_name: 'Metro Train', route_type_short_name: 'Metro', route_type_icon: 'mdi-train', route_type_color: 'metro-blue' },
        { route_type: '1', route_type_name: 'Tram', route_type_short_name: 'Tram', route_type_icon: 'mdi-tram', route_type_color: 'tram-green' },
        { route_type: '2', route_type_name: 'Local Bus', route_type_short_name: 'Bus', route_type_icon: 'mdi-bus', route_type_color: 'bus-orange' },
        { route_type: '3', route_type_name: 'V/Line', route_type_short_name: 'V/Line', route_type_icon: 'mdi-train-variant', route_type_color: 'vline-purple' }
      ]
    }
  },

  beforeCreate: function () {
    this.$store.commit('initStore') // initialise vuex store
  },

  methods: {
    // Run GET request to PHP script to get full API request URL with hash signature, returns promise of URL valu
    getSignedRequestUrl: function (requestString) {
      return new Promise((resolve, reject) => {
        const url = process.env.NODE_ENV === 'development'
          ? location.protocol + '//localhost/get-request-url.php' // Development url
          : process.env.BASE_URL + '/php/get-request-url.php' // Production url
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'text',
          cache: false,
          data: { request: requestString }
        })
          .done(function (requestUrl) {
            resolve(requestUrl)
          })
          .fail(function (xhr, status, error) {
            const errorMessage = 'An AJAX error occured attempting to access get-request-url.php. \nStatus: ' + status + '\nError: ' + error
            console.log(errorMessage)
            reject(errorMessage)
          })
      })
    },

    // Run GET request to PTV API with request string, returns promise of JSON data
    ptvApiRequest: function (requestString) {
      const self = this
      return new Promise((resolve, reject) => {
        self.getSignedRequestUrl(requestString) // Get signed URL
          .then((requestUrl) => {
            $.getJSON(requestUrl) // Get JSON data from PTV API
              .done(function (data) {
                // Check API response health check value
                if (data.status.health === 1) {
                  resolve(data)
                } else {
                  console.log('PTV API health check failed')
                  reject(new Error('Health Check Failed'))
                }
              })
              .fail(function (xhr, status, error) {
                const errorMessage = 'An AJAX error occured attempting to access PTV API. \nStatus: ' + status + '\nError: ' + error
                console.log(errorMessage)
                reject(errorMessage)
              })
          })
          .catch((errorMessage) => {
            reject(errorMessage)
          })
      })
    }
  }
}
</script>
