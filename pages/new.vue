<template lang='pug'>
</template>

<script>
const DATA = () => ({
    startDate: '2019-03-01',
    endDate: '2019-04-30',
    notes: [
      {
        id: 1,
        date: '2019-03-20',
        offset: 2,
        text: 'メモのサンプル',
        fillColor: 'gold'
      }
    ],
    tasks: [
      {
        id: 1,
        startDate: '2019-03-01',
        endDate: '2019-03-27',
        title: "長いスケジュールのサンプル",
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
        title: "サンプル",
        description: "description",
        order: 2,
        offset: 1,
        thickness: 2,
        fillColor: "lavender"
      },
    ]
  })

export default {
  async fetch({ app, redirect, query }) {
    const data = DATA()
    data.updatedAt = app.$moment().toISOString()
    if (query.start && query.end) {
      data.startDate = query.start
      data.endDate = query.end
      data.notes = []
      data.tasks = []
    }
    const ref = await app.$db.collection('schedules').add(data)
    redirect(`/schedules/${ref.id}`)
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
</style>