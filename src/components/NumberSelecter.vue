<template>
  <div>
    <div>{{ title }}</div>
    <v-toolbar dense>
      <v-container>
        <v-row>
          <v-col v-if="plus" class="col">
            <v-btn
              icon
              @click="add(-10)"
            >
              <v-icon>mdi-chevron-double-left</v-icon>
            </v-btn>
          </v-col>
          <v-col class="col">
            <v-btn
              icon
              @click="add(-1)"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-col>
          <v-col class="col">
            <div style="line-height: 48px; text-align: center; font-size=28px;">
              {{ value }}
            </div>
          </v-col>
          <v-col class="col">
            <v-btn
              icon
              @click="add(1)"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="plus" class="col">
            <v-btn
              icon
              @click="add(10)"
            >
              <v-icon>mdi-chevron-double-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      
      
      
    </v-toolbar>
  </div>
</template>

<style scoped>
  .col {
    padding-left: 0;
    padding-right: 0;
    text-align: center;
  }
</style>

<script>
export default({
  data() {
    return {
      
    }
  },
  props: {
    plus: Boolean,
    title: String,
    value: Number,
    min: Number,
    max: Number
  },
  methods: {
    add(k) {
      let res = this.value + k
      if (res > this.max) this.$emit('input', this.max)
      else if (res < this.min) this.$emit('input', this.min)
      else this.$emit('input', res)
    }
  },
  watch: {
    min(v) {
      if (this.value < v) {
        this.$emit('input', v)
      }
    },
    max(v) {
      if (this.value > v) {
        this.$emit('input', v)
      }
    }
  }
})
</script>
