import { createStore } from 'vuex'
import { useTheme } from 'vuetify'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      favouriteStops: [],
      theme: ''
    }
  },

  mutations: {
    // Initialise store and retrieve data from local storage
    initStore: function (state) {
      // Get favourites from local storage
      const favourites = localStorage.getItem('favouriteStops')
      if (favourites) state.favouriteStops = JSON.parse(favourites)

      // Get theme from local storage
      const theme = localStorage.getItem('theme')
      state.theme = theme ?? 'dark'
      useTheme().global.name.value = state.theme
      localStorage.setItem('theme', state.theme)
    },

    // Add stop to favourite stops
    addFavouriteStop: function (state, stop) {
      const favourites = state.favouriteStops
      favourites.push(stop)
      state.favouriteStops = favourites
      localStorage.setItem('favouriteStops', JSON.stringify(state.favouriteStops))
    },

    // Remove stop from favourite stops
    removeFavouriteStop: function (state, stop) {
      let favourites = state.favouriteStops
      favourites = favourites.filter(function (fav) {
        return !(fav.stopId === stop.stopId && fav.routeType === stop.routeType)
      })
      state.favouriteStops = favourites
      localStorage.setItem('favouriteStops', JSON.stringify(state.favouriteStops))
    },

    // Change theme
    changeTheme: function (state, theme) {
      state.theme = theme
      useTheme().global.name.value = state.theme
      localStorage.setItem('theme', state.theme)
    }
  }
})

export default store
