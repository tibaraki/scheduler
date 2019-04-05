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
        @click.shift.prevent.stop="onShiftClickGrid"
        @dblclick.prevent.stop="onDoubleClickGrid"
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
        :gridWidth="gridWidth"
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
      default: 82
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
          fill: this.$moment().isSame(this.startDate.clone().add(i, 'days'), 'day') ? 'indianred' : (i % 2 === 1 ? "white" : "mistyrose")
        }
      }))
    },
    dateTitles() {
      return [...Array(this.days)].map((_, i) => ({
        index: i,
        text: this.startDate.clone().add(i, 'days').format("YYYY - MM - DD"),
        attrs: {
          x: 5,
          y: 0,
          "font-size": this.gridWidth - 14,
          transform: "rotate(90 5 4)",
          fill: "gray"
        }
      }))
    },
    tasks() {
      return _.sortBy(this.schedule.tasks, ['order'])
    },
    notes() {
      return this.schedule.notes
    },
    maxOrder() {
      if (this.tasks.length === 0) return 1
      return this.tasks[this.tasks.length-1].order
    },
    maxId() {
      if (this.tasks.length === 0) return 1
      return Math.max(...this.tasks.map(task => task.id))
    },
    maxNoteId() {
      if (this.notes.length === 0) return 1
      return Math.max(...this.notes.map(note => note.id))
    }
  },
  methods: {
    onClickTask(obj) {
      this.$emit("selectTask", obj)
    },
    onShiftClickGrid(event) {
      const date = this.startDate.clone().add(Math.floor(event.offsetX / this.gridWidth), "days").format("YYYY-MM-DD")
      const offset = Math.max(Math.floor((event.offsetY - this.topMargin) / this.gridHeight), 0)
      this.newNote(date, offset)
    },
    onDoubleClickGrid(event) {
      const date = this.startDate.clone().add(Math.floor(event.offsetX / this.gridWidth), "days").format("YYYY-MM-DD")
      const offset = Math.max(Math.floor((event.offsetY - this.topMargin) / this.gridHeight), 0)
      this.newTask(date, offset)
    },
    newTask(date, offset) {
      this.schedule.tasks.push(
        {
          id: this.maxId + 1,
          startDate: date,
          endDate: this.$moment(date).add(2, "days").format("YYYY-MM-DD"),
          title: "new task",
          description: "description",
          order: this.maxOrder + 1,
          offset: offset,
          thickness: 1,
          fillColor: "coral"
        }
      )
    },
    newNote(date, offset) {
      this.schedule.notes.push(
        {
          id: this.maxNoteId + 1,
          date: date,
          offset: offset,
          text: '',
          fillColor: 'maroon'
        }
      )
    },
    onDeleteTask(id) {
      this.$set(this.schedule, "tasks", this.schedule.tasks.filter(task => task.id !== id))
    }
  }
}
</script>