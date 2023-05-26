<template>
  <v-card class='pa-4'>
    <span>{{ text }}</span>
  </v-card>
</template>

<script>
export default {
  name: 'MessageCard',

  props: [ // Component properties
    'text'
  ]
}
</script>
