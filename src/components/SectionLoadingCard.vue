<template>
  <v-card class='pa-4'>
    <v-progress-circular
      indeterminate
      :size='20'
      :width='3'
      class='me-2'
    ></v-progress-circular>
    <span class='ms-2'>{{ text }}</span>
  </v-card>
</template>

<script>
export default {
  name: 'LoadingCard',

  props: [ // Component properties
    'text'
  ]
}
</script>
