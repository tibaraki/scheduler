<template lang='pug'>
.root
  .schedule-area
    svg(
      :width="scheduleWidth"
      height="100%"
      )
      schedule(
        :schedule="schedule"
        :gridWidth="gridWidth"
        :gridHeight="gridHeight"
        :topMargin="topMargin"
        @selectTask="onSelectTask"
        @unselectTask="showForm = false"
        )
    .notes
      note(
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :gridWidth="gridWidth"
        :gridHeight="gridHeight"
        :topMargin="topMargin"
        :startDate="schedule.startDate"
        @delete="onDeleteNote"
        )
  .task-form
    div.balloon(:style="balloonStyle" :class="{ show: showForm }")
      div.form(v-if="selectedTask")
        div.title-and-color
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
        div.range {{ `${selectedTask.startDate} ～ ${selectedTask.endDate}` }}
  .manual {{ manual }}
</template>

<script>
import Schedule from '~/components/Schedule.vue'
import Note from '~/components/Note.vue'

const MANUAL =`操作方法
  タスクの追加: タブルクリック
  タスクの移動: 選択して矢印キー
  タスクのサイズ変更: 選択してshift+矢印キー
  タスクの削除: 選択してdeleteキー
  メモの追加: shift+クリック
  メモの削除: 選択してdeleteキー
`

export default {
  components: { Schedule, Note },
  data() {
    return {
      selectedTaskId: null,
      balloonX: 0,
      balloonY: 0,
      showForm: false,
      lastUpdate: null
    }
  },
  async asyncData({ app, params }) {
    const doc = await app.$db.collection('schedules').doc(params.id).get()
    return {
      id: params.id,
      schedule: doc.data(),
      schedulePersisted: doc.data()
    }
  },
  mounted() {
    this.$db.collection('schedules').doc(this.id).onSnapshot((doc) => {
      const data = doc.data()
      if (this.lastUpdate === data.updatedAt) return
      this.schedulePersisted = _.cloneDeep(data)
      this.lastUpdate = data.updatedAt
      this.schedule = _.cloneDeep(data)
    })
  },
  computed: {
    manual() {
      return MANUAL
    },
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
        "maroon",
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
    },
    notes() {
      return this.schedule.notes
    },
    gridWidth() {
      return 24
    },
    gridHeight() {
      return 28
    },
    topMargin() {
      return 82
    }
  },
  watch: {
    schedule: {
      deep: true,
      async handler() {
        if (_.isEqual(this.schedule, this.schedulePersisted)) return
        this.lastUpdate = this.$moment().toISOString()
        const data = _.cloneDeep(this.schedule)
        data.updatedAt = this.lastUpdate
        await this.$db.collection('schedules').doc(this.id).set(_.cloneDeep(data))
      }
    }
  },
  methods: {
    onSelectTask({ taskId, event }) {
      this.selectedTaskId = taskId
      this.balloonX = event.clientX
      this.balloonY = event.clientY
      this.showForm = false
      this.$nextTick(() => this.showForm = true)
    },
    onDeleteNote(id) {
      this.$set(this.schedule, "notes", this.schedule.notes.filter(note => note.id !== id))
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
  position: relative;
}
.balloon {
  position: fixed;
  visibility: hidden;
  border: 1px solid dimgray;
  border-radius: 1px;
  background-color: rgba(255,255,255,0.8);
  opacity: 0;
  transition: all .3s ease;
}
.balloon.show {
  visibility: visible;
  opacity: 1;
}
.form .range {
  color: snow;
  background-color: dimgray;
  font-size: .6em;
  padding: 1px 5px;
  text-align: right;
}
.form .title-and-color {
  display: flex;
  padding: 5px;
}
.form .title, .form .color {
  display: flex;
}
.form .title {
  margin-right: 5px;
}
.title input {
  width: 16em;
}
.manual {
  white-space: pre-wrap;
  color: dimgray;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: .7em;
  padding: 0 0 5px 5px;
}
</style>