<template>
  <v-list class='pt-0 pb-1'>
    <template
      v-for='disruption in disruptionList'
      :key='disruption.disruption_id'
    >
      <v-divider></v-divider>
      <v-list-item
        lines='5'
        class='mt-2 mb-2 ps-4 pe-5'
      >
        <template v-slot:prepend>
          <v-icon
            :icon='disruptionIcon(disruption).icon'
            :class='"text-"+disruptionIcon(disruption).color'
            size='x-large'
            class='me-4 disruption-icon'
          ></v-icon>
        </template>
        <v-list-item-title class='text-wrap mb-1'>{{ disruption.title }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ disruption.description }}
          <a :href='disruption.url' target='_blank'>more info</a>
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'DisruptionList',

  props: [ // Component properties
    'disruptionList'
  ],

  methods: {
    disruptionIcon: function (disruption) {
      if (disruption.disruption_type === 'Minor Delays') {
        return { icon: 'mdi-clock', color: 'minor-delay-orange' }
      } else if (disruption.disruption_type === 'Major Delays') {
        return { icon: 'mdi-clock', color: 'major-delay-red' }
      } else if (disruption.disruption_type === 'Planned Works') {
        return { icon: 'mdi-alert', color: 'works-yellow' }
      } else if (disruption.disruption_type === 'Part Suspended' || disruption.disruption_type === 'Suspended') {
        return { icon: 'mdi-alert-box', color: 'closure-grey' }
      } else if (disruption.disruption_type === 'General Alert' || disruption.disruption_type === 'Service Changes' || disruption.disruption_type === 'Service Information' || disruption.disruption_type === 'Planned Closure') {
        return { icon: 'mdi-information', color: 'info-blue' }
      } else {
        return { icon: 'mdi-alert-circle', color: 'disruption-orange' }
      }
    }
  }
}
</script>

<style scoped>
.disruption-icon {
  opacity: 1 !important;
}
</style>
