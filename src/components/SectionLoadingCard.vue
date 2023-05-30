<template>
  <v-card class='d-flex align-center pa-4'>
    <div class='card-icon fill-height'>
      <v-progress-circular
        indeterminate
        :size='20'
        :width='3'
      ></v-progress-circular>
    </div>
    <div class='card-text'>
      {{ text }}
    </div>
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

<style scoped>
.card-icon {
  width: 35px;
}

.card-text {
  width: calc(100% - 35px);
}
</style>
