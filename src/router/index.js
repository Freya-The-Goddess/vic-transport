import { createRouter, createWebHistory } from 'vue-router'

import ViewFavourites from '../views/ViewFavourites.vue'

const routes = [
  {
    path: '/',
    name: 'favourites',
    component: ViewFavourites
  },
  {
    path: '/routes/:routeType?',
    name: 'routes',
    component: () => import(/* webpackChunkName: "routes" */ '../views/ViewRoutes.vue')
  },
  {
    path: '/nearby',
    name: 'nearby',
    component: () => import(/* webpackChunkName: "nearby" */ '../views/ViewNearby.vue')
  },
  {
    path: '/search/:searchString?',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ '../views/ViewSearch.vue')
  },
  {
    path: '/search/:searchString/route_types/:routeTypes?',
    name: 'advancedSearch',
    component: () => import(/* webpackChunkName: "search" */ '../views/ViewSearch.vue')
  },
  {
    path: '/stop/:stopId/route_type/:routeType',
    name: 'stop',
    component: () => import(/* webpackChunkName: "search" */ '../views/ViewStop.vue')
  },
  { // route not found catch-all
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import(/* webpackChunkName: "notFound" */ '../views/ViewNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
