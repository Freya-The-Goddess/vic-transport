// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          'header-footer-grey': '#455A64', // blue-grey-darken-2
          'network-grey': '#333434',
          'over-color': '#000000',
          'error-text': '#AA0000',
          'favourite-yellow': '#DDDD00',
          'disruption-orange': '#EE5500',
          'works-yellow': '#DDAA00',
          'closure-grey': '#777777',
          'metro-blue': '#058FFF',
          'tram-green': '#78BE20',
          'bus-orange': '#FF8200',
          'vline-purple': '#CC25D4'
        }
      },
      dark: {
        dark: true,
        colors: {
          'header-footer-grey': '#263238', // blue-grey-darken-4
          'network-grey': '#333434',
          'over-color': '#FFFFFF',
          'error-text': '#FF6666',
          'favourite-yellow': '#FFFF33',
          'disruption-orange': '#FF621A',
          'works-yellow': '#FFBB33',
          'closure-grey': '#999999',
          'metro-blue': '#005194',
          'tram-green': '#4F7E15',
          'bus-orange': '#B35C00',
          'vline-purple': '#75157A'
        }
      }
    }
  }
})
