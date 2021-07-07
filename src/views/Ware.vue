<template>
  <div style="padding: 16px;">
    <div class="card">
      <v-card-text>
        <div class="text-h5 text--primary">
          材料仓库
          <v-btn
            color="primary"
            elevation="2"
            style="float: right;"
            @click="save"
          ><v-icon>mdi-content-save-outline</v-icon>保存</v-btn>
        </div>
        <div style="margin-top: 8px;">点击材料图标可输入数量和查看更多选项</div>
      </v-card-text>
    </div>

    <div class="d-flex justify-space-around flex-wrap">
      <v-card class="item" :class="[`t${data.item[k].rarity}`, `order-${4 - data.item[k].rarity}`]" elevation="3" v-for="(v, k) in user_mtls" :key="k">
        <img :src="`/assets/items/${data.item[k].icon}.png`" height="80" width="80" @click="open(k)">
        <div class="text-center">{{ data.item[k].name }}</div>
        <div class="d-flex justify-space-between">
          <v-btn
            elevation="2"
            icon
            small
            @click="add(k, -1)"
          ><v-icon>mdi-minus</v-icon></v-btn>
          <span style="line-height: 24px;">{{ v }}</span>
          <v-btn
            elevation="2"
            icon
            small
            @click="add(k, 1)"
          ><v-icon>mdi-plus</v-icon></v-btn>
        </div>
      </v-card>
    </div>

    <v-dialog v-model="edit.show" width="400">
      <v-card>
        <v-card-title class="text-h6 lighten-2">
          {{ data.item[edit.id].name }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="数量"
            filled
            dense
            v-model="edit.num"
            type="number"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="edit.show = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="apply"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<style scoped>
  .card {
    margin: 8px;
    padding: 8px;
  }
  .item {
    margin: 4px;
    padding: 8px;
  }
  .t0 {
    border-top: rgb(156, 156, 156) solid 3px;
  }
  .t1 {
    border-top: rgb(179, 194, 49) solid 3px;
  }
  .t2 {
    border-top: rgb(8,178,247) solid 3px;
  }
  .t3 {
    border-top: rgb(209, 133, 214) solid 3px;
  }
  .t4 {
    border-top: rgb(244,202,28) solid 3px;
  }
</style>

<script>

var LS = window.localStorage
import data from '../data.js'

export default ({
  data() {
    return {
      data: data,
      user_mtls: JSON.parse(LS.user_mtls),

      edit: {
        show: false,
        id: 4001,
        num: 0
      }
    }
  },
  mounted() {
    for (let i of Object.keys(data.item)) {
      if (data.item[i].icon.indexOf('MTL_SL') === -1 || this.user_mtls[i]) continue
      this.user_mtls[i] = 0
    }
    LS.user_mtls = JSON.stringify(this.user_mtls)
  },
  methods: {
    add(k, t) {
      if (this.user_mtls[k] === 0 && t == -1) return
      this.user_mtls[k] += t
    },
    save() {
      LS.user_mtls = JSON.stringify(this.user_mtls)
      window.mdui.snackbar({ message: '已保存' })
    },
    open(k) {
      this.edit.id = k
      this.edit.num = this.user_mtls[k]
      this.edit.show = true
    },
    apply() {
      let v = this.edit.num
      if (v > 0) this.user_mtls[this.edit.id] = Math.floor(v)
      this.edit.show = false
    }
  }
})
</script>
