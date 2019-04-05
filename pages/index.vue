<template lang='pug'>
.new
  .range
    input(
      type="text"
      v-model="start"
      )
    span 〜
    input(
      type="text"
      v-model="end"
      )
  .submit
    button(
      @click="createSchedule"
      ) スケジュールの作成
</template>

<script>
export default {
  data() {
    return {
      start: '2019-4-1',
      end: '2019-5-31'
    }
  },
  methods: {
    createSchedule() {
      this.$router.push({ path: 'new', query: {start: this.start, end: this.end} })
    }
  }
}
</script>

<style scoped>
.new {
  padding: 20px;
}
.range  {
  display: flex;
}
input {
  border: 1px solid gray;
  text-align: center;
  width: 7em;
  font-size: 1.05em;
}
span {
  background-color: gray;
  color: white;
  font-size: 1em;
  padding: 0 3px;
}
.submit {
  margin-top: 20px;
}
</style>