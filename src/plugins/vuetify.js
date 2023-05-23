// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          'header-footer-grey': '#455A64',
          'nav-button': '#B0BEC5',
          'nav-button-selected': '#ECEFF1',
          'network-grey': '#333434',
          'over-color': '#000000',
          'error-text': '#BB1100',
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
          'header-footer-grey': '#263238',
          'nav-button': '#151B1E',
          'nav-button-selected': '#455A64',
          'network-grey': '#333434',
          'over-color': '#FFFFFF',
          'error-text': '#FF5544',
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
