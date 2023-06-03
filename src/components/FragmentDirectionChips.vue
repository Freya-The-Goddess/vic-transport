<template>
  <div class='w-100 d-flex align-center'>
    <div class='pe-1'>Direction:</div>
    <v-chip-group
      v-model='selectedDirectionIndex'
      class='ps-1'
    >
      <v-chip
        v-for='direction in directionList'
        :key='direction.direction_id'
        filter
        mandatory
        variant='outlined'
        class='chip-opacity'
      >
        <span class='text-caption text-over-color'>{{ direction.direction_name }}</span>
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
      selectedDirectionIndex: 0
    }
  },

  watch: {
    selectedDirectionIndex: function () {
      if (this.selectedDirectionIndex === undefined) {
        this.selectedDirectionIndex = 0
      }
      this.$emit('selectedDirection', this.directionList[this.selectedDirectionIndex])
    }
  },

  mounted: function () {
    // Populate selection from props
    if (this.selectDirection) {
      this.selectedDirectionIndex = this.directionList.findIndex(direction => direction.direction_id === parseInt(this.selectDirection))
    } else {
      this.selectedDirectionIndex = 0
    }
    this.$emit('selectedDirection', this.directionList[this.selectedDirectionIndex])
  }
}
</script>

<style scoped>
.chip-opacity {
  opacity: 1 !important;
}
</style>
