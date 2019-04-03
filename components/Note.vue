<template lang='pug'>
.note(:style="style")
  .icon(
    :style="{ width: gridWidth+'px', 'font-size': (gridWidth-12)+'px', color: note.fillColor }"
    :tabindex="0"
    @click="show = !show"
    @keydown.delete="$emit('delete', note.id)"
    )
    i.fas.fa-exclamation-circle
  .balloon(:class="{ show: show }")
    .text
      textarea(
        v-model="note.text"
        rows="4"
        )
    .color-and-close
      select(
        v-model="note.fillColor"
        :style="{ 'background-color': note.fillColor }"
        )
        option(
          v-for="color in colors"
          :key="color"
          :value="color"
          :style="{ 'background-color': color }"
          ) {{ color }}
      i.fas.fa-times.close(
        @click="show = false"
        )
        
</template>

<script>
export default {
  props: {
    note: {
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
    },
    startDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: true
    }
  },
  computed: {
    style() {
      return {
        left: this.$moment(this.note.date).diff(this.startDate, 'days') * this.gridWidth + 'px',
        top: this.note.offset * this.gridHeight + this.topMargin + 'px'
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
    }
  }
}
</script>

<style scoped>
.note {
  position: absolute;
}
.icon {
  text-align: center;
  color: maroon;
}
.icon:focus {
  outline: navy dashed 2px;
}
.balloon {
  position: relative;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid dimgray;
  border-radius: 1px;
  background-color: rgba(255,255,255,0.8);
  padding: 5px;
  visibility: hidden;
  opacity: 0;
  transition: all .3s ease;
}
.balloon.show {
  visibility: visible;
  opacity: 1;
}
.balloon::before{
  content: '';
  position: absolute;
  left: 5px;
  top: -6px;
  display: block;
  width: 0;
  height: 0;
  border-right: 6px solid transparent;
  border-bottom: 6px solid dimgray;
  border-left: 6px solid transparent;
}
.text, .color-and-close {
  display: flex;
  align-items: flex-end;
}
.text {
  margin-bottom: 3px;
}
textarea {
  flex-grow: 1;
}
select {
  flex-grow: 1;
}
.close {
  margin-left: 5px;
  font-size: .8em;
  color: gray;
}
</style>