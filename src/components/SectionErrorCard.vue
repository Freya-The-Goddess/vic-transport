<template>
  <v-card
    class='d-flex align-center pa-4'
    :class='warning ? "text-warning-text" : "text-error-text"'
  >
    <div class='card-icon fill-height'>
      <v-icon icon='mdi-exclamation'></v-icon>
    </div>
    <div class='card-text'>
      <span class='font-weight-bold'>{{ warning ? 'Warning:' : 'Error:'}}</span> {{ text }}
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ErrorCard',

  props: [ // Component properties
    'text',
    'warning'
  ]
}
</script>

<style scoped>
.card-icon {
  width: 35px;
}

.card-text {
  width: calc(100% - 35px);
}
</style>
