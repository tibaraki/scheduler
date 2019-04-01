<template lang='pug'>
g(@click="$emit('unselectTask')")
  g.vertical-girds
    g(
      v-for="grid in verticalGrids"
      :key="grid.index"
      :transform="`translate(${grid.index * gridWidth} 0)`"
      )
      rect(
        v-bind="grid.attrs"
        fill-opacity="0.5"
        @dblclick.stop="onClickGrid"
        )
  g.date-titles
    g(
      v-for="title in dateTitles"
      :key="title.index"
      :transform="`translate(${title.index * gridWidth} 0)`"
      )
      text(
        v-bind="title.attrs"
        fill-opacity="0.8"
        ) {{ title.text }}
  g.tasks(
    :transform="`translate(0, ${topMargin})`"
    )
    g(
      v-for="task in tasks"
      :key="task.id"
      :transform="`translate(${$moment(task.startDate).diff(startDate, 'days') * gridWidth}, ${task.offset * gridHeight})`"
      )
      task(
        :task="task"
        :gridHeight="gridHeight"
        @click="onClickTask"
        @delete="onDeleteTask"
        )
</template>

<script>
import Task from "~/components/Task.vue"

export default {
  components: { Task },
  props: {
    schedule: {
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
    },
    topMargin: {
      type: Number,
      default: 100
    }
  },
  computed: {
    startDate() {
      return this.$moment(this.schedule.startDate)
    },
    endDate() {
      return this.$moment(this.schedule.endDate).add(1, 'day')
    },
    days() {
      return this.endDate.diff(this.startDate, 'days')
    },
    verticalGrids() {
      return [...Array(this.days)].map((_, i) => ({
        index: i,
        attrs: {
          x: 0,
          y: 0,
          width: this.gridWidth,
          height: "100%",
          fill: i % 2 === 0 ? "silver" : "lightgray"
        }
      }))
    },
    dateTitles() {
      return [...Array(this.days)].map((_, i) => ({
        index: i,
        text: this.startDate.clone().add(i, 'days').format("YY/MM/DD"),
        attrs: {
          x: 5,
          y: 4,
          "font-size": this.gridWidth - 8,
          transform: "rotate(90 5 4)"
        }
      }))
    },
    tasks() {
      return _.sortBy(this.schedule.tasks, ['order'])
    },
    maxOrder() {
      return this.tasks[this.tasks.length-1].order
    },
    maxId() {
      return Math.max(...this.tasks.map(task => task.id))
    }
  },
  methods: {
    onClickTask(obj) {
      this.$emit("selectTask", obj)
    },
    onClickGrid(event) {
      const date = this.startDate.clone().add(Math.floor(event.offsetX / this.gridWidth), "days").format("YYYY-MM-DD")
      const offset = Math.max(Math.floor((event.offsetY - this.topMargin) / this.gridHeight), 0)
      this.newTask(date, offset)
    },
    newTask(date, offset) {
      this.schedule.tasks.push(
        {
          id: this.maxId + 1,
          startDate: date,
          endDate: this.$moment(date).add(7, "days").format("YYYY-MM-DD"),
          title: "new task",
          description: "description",
          order: this.maxOrder + 1,
          offset: offset,
          thickness: 1,
          fillColor: "coral"
        }
      )
    },
    onDeleteTask(id) {
      this.$set(this.schedule, "tasks", this.schedule.tasks.filter(task => task.id !== id))
    }
  }
}
</script>