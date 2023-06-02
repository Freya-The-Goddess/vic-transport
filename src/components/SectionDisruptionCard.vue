<template>
  <v-expand-transition>
    <v-row v-if='currentDisruptions.length || disruptionLoading'>
      <v-col>
        <v-card>
          <!-- Expand Button -->
          <div
            @click='disruptionsExpanded = !disruptionsExpanded'
            role='button'
            class='card-expand-button float-right pa-3 ps-0 pb-1'
          >
            <v-icon
              :icon='disruptionsExpanded ? "mdi-menu-up" : "mdi-menu-down"'
              class='float-right'
            ></v-icon>
          </div>
          <!-- Card Header -->
          <div
            @click='disruptionsExpanded = !disruptionsExpanded'
            role='button'
            class='card-expand-title pa-3 pe-0'
          >
            <div class='d-flex align-center'>
              <v-progress-circular
                v-if='disruptionLoading && !disruptionsExpanded'
                indeterminate
                :size='20'
                :width='3'
                class='me-1 text-disruption-orange'
              ></v-progress-circular>
              <v-icon
                v-else
                icon='mdi-alert-circle'
                class='d-inline-block fill-height text-disruption-orange'
              ></v-icon>
              <h3 class='d-inline-block fill-height text-disruption-orange ms-2'>
                Disruptions
                <span v-if='currentDisruptions.length'>({{ currentDisruptions.length }})</span>
              </h3>
            </div>
          </div>
          <v-expand-transition>
            <template v-if='disruptionsExpanded'>
              <!-- Error and Loading Cards -->
              <loading-card
                v-if='disruptionLoading && !disruptionError'
                text='Loading Disruptions...'
                class='pt-1'
              ></loading-card>
              <error-card
                v-else-if='disruptionError'
                :text='disruptionError'
                class='pt-1'
              ></error-card>
              <!-- Disruptions List -->
              <disruption-list
                v-else-if='disruptionData.length'
                :disruptionList='currentDisruptions'
                class='w-100'
              ></disruption-list>
            </template>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script>
// Child components
import DisruptionList from '../components/FragmentDisruptionList.vue'
import ErrorCard from '../components/SectionErrorCard.vue'
import LoadingCard from '../components/SectionLoadingCard.vue'

export default {
  name: 'DisruptionCard',

  components: { // Child components
    DisruptionList,
    ErrorCard,
    LoadingCard
  },

  props: [ // Component properties
    'disruptionData',
    'disruptionLoading',
    'disruptionError'
  ],

  data: function () { // Default data
    return {
      disruptionsExpanded: false
    }
  },

  computed: {
    // Filter disruptions list for only current disruptions
    currentDisruptions: function () {
      if (this.disruptionData.length) {
        return this.disruptionData.filter(function (dis) {
          return dis.disruption_status === 'Current'
        })
      } else return []
    }
  }
}
</script>
