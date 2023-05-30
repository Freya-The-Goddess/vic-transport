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
          background: '#F0F0F1',
          surface: '#FEFEFE',
          primary: '#607D8B',
          'header-footer-grey': '#455A64',
          'nav-button': '#B0BEC5',
          'nav-button-selected': '#ECEFF1',
          'network-grey': '#333434',
          'over-color': '#000000',
          'error-text': '#BB1100',
          'warning-text': '#CC9900',
          'favourite-yellow': '#DDDD00',
          'disruption-orange': '#EE5500',
          'works-yellow': '#DDAA00',
          'closure-grey': '#777777',
          'metro-blue': '#0F9BFF',
          'tram-green': '#78BE20',
          'bus-orange': '#FF8200',
          'vline-purple': '#C73FD3',
          'metro-blue-dim': '#BFE4FF',
          'tram-green-dim': '#D2FF99',
          'bus-orange-dim': '#FFD4B2',
          'vline-purple-dim': '#E4B0E8'
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#0B0B0C',
          surface: '#1B1B1B',
          primary: '#607D8B',
          'header-footer-grey': '#263238',
          'nav-button': '#151B1E',
          'nav-button-selected': '#455A64',
          'network-grey': '#333434',
          'over-color': '#FFFFFF',
          'error-text': '#FF6650',
          'warning-text': '#FFDD33',
          'favourite-yellow': '#FFFF33',
          'disruption-orange': '#FF621A',
          'works-yellow': '#FFBB33',
          'closure-grey': '#999999',
          'metro-blue': '#064B7F',
          'tram-green': '#4F7E15',
          'bus-orange': '#B35C00',
          'vline-purple': '#6B1C72',
          'metro-blue-dim': '#2B3C47',
          'tram-green-dim': '#3B472A',
          'bus-orange-dim': '#4C3826',
          'vline-purple-dim': '#412B42'
        }
      }
    }
  }
})
