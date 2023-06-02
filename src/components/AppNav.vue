<template>
  <div id='app-nav' class='bg-header-footer-grey'>
    <v-container>
      <v-row>
        <v-col
          cols='3'
          class='ps-1 pe-1 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3'
        >
          <router-link
            to='/favourites'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.name === "favourites" ? "nav-button-selected" : "nav-button"'
              class='nav-button text-over-color rounded-xl pt-1 pb-2 pb-md-1'
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
        <v-col
          cols='3'
          class='ps-1 pe-1 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3'
        >
          <router-link
            to='/routes'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.name === "routes" ? "nav-button-selected" : "nav-button"'
              class='nav-button text-over-color rounded-xl pt-1 pb-2 pb-md-1'
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
        <v-col
          cols='3'
          class='ps-1 pe-1 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3'
        >
          <router-link
            to='/nearby'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.name === "nearby" ? "nav-button-selected" : "nav-button"'
              class='nav-button text-over-color rounded-xl pt-1 pb-2 pb-md-1'
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
        <v-col
          cols='3'
          class='ps-1 pe-1 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3'
        >
          <router-link
            to='/search'
            custom
            v-slot='{ navigate }'
          >
            <v-btn
              @click='navigate'
              :color='$route.name === "search" ? "nav-button-selected" : "nav-button"'
              class='nav-button text-over-color rounded-xl pt-1 pb-2 pb-md-1'
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

<style scoped>
.nav-button {
  min-width: 0;
  height: 100% !important;
  width: 100% !important;
}
</style>
