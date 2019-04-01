<template lang='pug'>
g(
  tabindex="0"
  @click.stop="onClick"
  @keydown.left.exact.stop.prevent="move(-1)"
  @keydown.right.exact.stop.prevent="move(1)"
  @keydown.left.shift.exact.stop.prevent="expand(-1)"
  @keydown.right.shift.exact.stop.prevent="expand(1)"
  @keydown.up.exact.stop.prevent="offset(-1)"
  @keydown.down.exact.stop.prevent="offset(1)"
  @keydown.up.shift.exact.stop.prevent="thickness(-1)"
  @keydown.down.shift.exact.stop.prevent="thickness(1)"
  @keydown.delete="$emit('delete', task.id)"
  )
  rect(v-bind="rectAttrs")
  text(v-bind="textAttrs") {{ task.title }}
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    },
    gridWidth: {
      type: Number,
      default: 25
    },
    gridHeight: {
      type: Number,
      default: 35
    }
  },
  computed: {
    startDate() {
      return this.$moment(this.task.startDate)
    },
    endDate() {
      return this.$moment(this.task.endDate).add(1, 'day')
    },
    days() {
      return this.endDate.diff(this.startDate, 'days')
    },
    rectAttrs() {
      return {
        x: 2,
        y: 2,
        width: this.days * this.gridWidth - 4,
        height: this.task.thickness * this.gridHeight - 4,
        stroke: "dimgray",
        fill: this.task.fillColor,
        'fill-opacity': 0.6,
        rx: 3,
        ry: 3
      }
    },
    textAttrs() {
      return {
        x: 8,
        y: this.gridHeight - 8,
        'font-size': this.gridHeight - 16,
        fill: "dimgray"
      }
    }
  },
  methods: {
    onClick(event) {
      this.$emit("click", { event: event, taskId: this.task.id })
    },
    move(days) {
      this.$set(this.task, "startDate", this.$moment(this.task.startDate).add(days, "days").format("YYYY-MM-DD"))
      this.$set(this.task, "endDate", this.$moment(this.task.endDate).add(days, "days").format("YYYY-MM-DD"))
    },
    expand(days) {
      if (this.days + days <= 0) return
      this.$set(this.task, "endDate", this.$moment(this.task.endDate).add(days, "days").format("YYYY-MM-DD"))
    },
    offset(delta) {
      if (this.task.offset + delta < 0) return
      this.$set(this.task, "offset", this.task.offset + delta)
    },
    thickness(delta) {
      if (this.task.thickness + delta < 0) return
      this.$set(this.task, "thickness", this.task.thickness + delta)
    }
  }
}
</script>