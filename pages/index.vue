<template lang='pug'>
.root
  .schedule-area
    svg(
      :width="scheduleWidth"
      height="100%"
      )
      schedule(
        :schedule="schedule"
        :gridWidth="25"
        @selectTask="onSelectTask"
        @unselectTask="showForm = false"
        )
  .task-form
    div.balloon(:style="balloonStyle" :class="{ show: showForm }")
      div.form(v-if="selectedTask")
        div.range {{ `${selectedTask.startDate} ～ ${selectedTask.endDate}` }}
        div.title
          input(
            type="text"
            v-model="selectedTask.title"
            )
        div.color
          select(
            v-model="selectedTask.fillColor"
            :style="{ 'background-color': selectedTask.fillColor }"
            )
            option(
              v-for="color in colors"
              :key="color"
              :value="color"
              :style="{ 'background-color': color }"
              ) {{ color }}
</template>

<script>
import Schedule from '~/components/Schedule.vue'

export default {
  components: { Schedule },
  data() {
    return {
      selectedTaskId: null,
      balloonX: 0,
      balloonY: 0,
      showForm: false,
      schedule: {
        startDate: '2019-03-01',
        endDate: '2019-04-30',
        tasks: [
          {
            id: 1,
            startDate: '2019-03-01',
            endDate: '2019-03-27',
            title: "title",
            description: "description",
            order: 1,
            offset: 0,
            thickness: 1,
            fillColor: "coral"
          },
          {
            id: 2,
            startDate: '2019-03-04',
            endDate: '2019-03-07',
            title: "タイトル",
            description: "description",
            order: 2,
            offset: 1,
            thickness: 2,
            fillColor: "lavender"
          },
        ]
      }
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
    scheduleWidth() {
      return this.days * 25
    },
    selectedTask() {
      return this.schedule.tasks.find(task => task.id === this.selectedTaskId)
    },
    balloonStyle() {
      return {
        left: this.balloonX + "px",
        top: this.balloonY + "px"
      }
    },
    colors() {
      return [
        "gray",
        "peachpuff",
        "lightsteelblue",
        "turquoise",
        "lavender",
        "mediumseagreen",
        "darkkhaki",
        "gold",
        "salmon",
        "slateblue",
        "coral"
        ]
    }
  },
  methods: {
    onSelectTask({ taskId, event }) {
      this.selectedTaskId = taskId
      this.balloonX = event.clientX
      this.balloonY = event.clientY
      this.showForm = false
      this.$nextTick(() => this.showForm = true)
    }
  }
}
</script>

<style scoped>
.root {
  height: 100vh;
}
.schedule-area {
  height: 100%;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
}
.balloon {
  position: fixed;
  visibility: hidden;
  border: 1px solid dimgray;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.8);
  opacity: 0;
  transition: all .3s ease;
}
.balloon.show {
  visibility: visible;
  opacity: 1;
}
.form {
  padding: 5px;
}
.form > * {
  margin: 10px;
}
input, select {
  width: 100%;
  box-sizing: border-box;
}
</style>