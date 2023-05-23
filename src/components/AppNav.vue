<template>
  <div id='app-nav' class='bg-header-footer-grey'>
    <v-container>
      <v-row>
        <v-col cols='3'>
          <router-link
            to='/'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.path === "/" ? "nav-button-selected" : "nav-button"'
              class='text-over-color rounded-xl w-100 h-100 pt-1 pb-2 pb-md-1'
            >
              <div class='d-flex flex-column flex-md-row align-center'>
                <div class='mb-1 mb-md-0 me-md-2'>
                  <v-icon icon='mdi-star' size='large' class='d-none d-md-inline'></v-icon>
                  <v-icon icon='mdi-star' size='xx-large' class='d-inline d-md-none'></v-icon>
                </div>
                <div class='text-caption text-md-button d-none d-sm-block'>FAVOURITES</div>
                <div class='text-caption d-block d-sm-none'>FAVS</div>
              </div>
            </v-btn>
          </router-link>
        </v-col>
        <v-col cols='3'>
          <router-link
            to='/routes'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.path === "/routes" ? "nav-button-selected" : "nav-button"'
              class='text-over-color rounded-xl w-100 h-100 pt-1 pb-2 pb-md-1'
            >
              <div class='d-flex flex-column flex-md-row align-center'>
                <div class='mb-1 mb-md-0 me-md-2'>
                  <v-icon icon='mdi-routes' size='large' class='d-none d-md-inline'></v-icon>
                  <v-icon icon='mdi-routes' size='xx-large' class='d-inline d-md-none'></v-icon>
                </div>
                <div class='text-caption text-md-button'>ROUTES</div>
              </div>
            </v-btn>
          </router-link>
        </v-col>
        <v-col cols='3'>
          <router-link
            to='/nearby'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.path === "/nearby" ? "nav-button-selected" : "nav-button"'
              class='text-over-color rounded-xl w-100 h-100 pt-1 pb-2 pb-md-1'
            >
              <div class='d-flex flex-column flex-md-row align-center'>
                <div class='mb-1 mb-md-0 me-md-2'>
                  <v-icon icon='mdi-map-marker' size='large' class='d-none d-md-inline'></v-icon>
                  <v-icon icon='mdi-map-marker' size='xx-large' class='d-inline d-md-none'></v-icon>
                </div>
                <div class='text-caption text-md-button'>NEARBY</div>
              </div>
            </v-btn>
          </router-link>
        </v-col>
        <v-col cols='3'>
          <router-link
            to='/search'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.path === "/search" ? "nav-button-selected" : "nav-button"'
              class='text-over-color rounded-xl w-100 h-100 pt-1 pb-2 pb-md-1'
            >
              <div class='d-flex flex-column flex-md-row align-center'>
                <div class='mb-1 mb-md-0 me-md-2'>
                  <v-icon icon='mdi-magnify' size='large' class='d-none d-md-inline'></v-icon>
                  <v-icon icon='mdi-magnify' size='xx-large' class='d-inline d-md-none'></v-icon>
                </div>
                <div class='text-caption text-md-button'>SEARCH</div>
              </div>
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AppNav'
}
</script>
