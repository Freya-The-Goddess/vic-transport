<template>
  <div class='w-100 d-flex align-center'>
    <div class='pe-2'>Direction:</div>
    <v-chip-group v-model='selectedDirection' class='pt-0 pb-0'>
      <v-chip
        v-for='direction in directionList'
        :key='direction.direction_id'
        :value='direction'
        filter
        variant='outlined'
        class='chip-opacity'
      >
        <span class='text-caption text-over-color'>to {{ direction.direction_name }}</span>
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script>
export default {
  name: 'DirectionChips',

  props: [ // Component properties
    'directionList',
    'selectDirection'
  ],

  emits: [ // Component emits
    'selectedDirection'
  ],

  data: function () {
    return {
      selectedDirection: undefined
    }
  },

  watch: {
    selectedDirection: function () {
      if (this.selectedDirection) {
        this.$emit('selectedDirection', this.selectedDirection)
      } else {
        this.$emit('selectedDirection', null)
      }
    }
  },

  mounted: function () {
    // Populate selection from props
    if (this.selectDirection) {
      this.selectedDirection = this.directionList.find(direction => direction.direction_id === parseInt(this.selectDirection))
      this.$emit('selectedDirection', this.selectedDirection)
    } else {
      this.$emit('selectedDirection', null)
    }
  }
}
</script>

<style scoped>
.chip-opacity {
  opacity: 1 !important;
}
</style>
