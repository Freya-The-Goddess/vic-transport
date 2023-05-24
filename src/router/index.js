import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/favourites'
  },
  {
    path: '/favourites',
    name: 'favourites',
    component: () => import(/* webpackChunkName: "favourites" */ '../views/ViewFavourites.vue')
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
    path: '/search',
    name: 'search',
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
