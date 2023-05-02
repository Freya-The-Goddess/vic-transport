import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      favouriteStops: []
    }
  },
  mutations: {
    // Initialise store and retrieve data from localStorage
    initStore: function (state) {
      const favourites = localStorage.getItem('favouriteStops')
      if (favourites) {
        state.favouriteStops = JSON.parse(favourites)
      }
    },

    // Add stop to favourite stops
    addFavouriteStop: function (state, stop) {
      const favourites = state.favouriteStops
      favourites.push(stop)
      state.favouriteStops = favourites
      localStorage.setItem('favouriteStops', JSON.stringify(favourites))
    },

    // Remove stop from favourite stops
    removeFavouriteStop: function (state, stop) {
      let favourites = state.favouriteStops
      favourites = favourites.filter(function (fav) {
        return !(fav.stopId === stop.stopId && fav.routeType === stop.routeType)
      })
      state.favouriteStops = favourites
      localStorage.setItem('favouriteStops', JSON.stringify(favourites))
    }
  }
})

export default store
