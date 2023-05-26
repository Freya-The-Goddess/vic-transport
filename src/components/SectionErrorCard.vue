<template>
  <v-card class='pa-4'>
    <v-icon icon='text-error-text mdi-exclamation me-1' class='float-left'></v-icon>
    <span class='text-error-text float-left ms-1'>{{ text }}</span>
  </v-card>
</template>

<script>
export default {
  name: 'ErrorCard',

  props: [ // Component properties
    'text'
  ]
}
</script>
