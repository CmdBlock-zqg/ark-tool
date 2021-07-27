<template>
  <div style="padding: 16px;">
    <div class="card">
      <div class="text-h5 text--primary">
        材料仓库
      </div>
      <div style="margin-top: 8px;">
        即已有材料<br>
        点击材料图标可设置数量和合成
      </div>
    </div>

    <v-expansion-panels>
      <v-expansion-panel
        v-for="t in panelList"
        :key="t.type"
      >
        <v-expansion-panel-header>
          {{ t.title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="d-flex justify-start flex-wrap">
            <v-card
              class="item"
              elevation="3"
              v-for="id in data.mtlMap[t.type]"
              :key="id"

              :class="[`t${data.item[id].rarity}`, `order-${4 - data.item[id].rarity}`]"
            >
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <img
                    :src="`/assets/items/${data.item[id].icon}.png`"
                    height="80" width="80"
                    v-bind="attrs"
                    v-on="on"
                  >
                </template>
                <v-list dense>
                  <v-list-item link @click="openEdit(id)">
                    <v-list-item-title>输入数量</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="openForm(id)" v-if="data.item[id].formula && data.formula[data.item[id].formula].costs.length">
                    <v-list-item-title>合成</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <div class="text-center">{{ data.item[id].name }}</div>
              <div class="d-flex justify-space-between">
                <v-btn
                  elevation="2"
                  icon
                  small
                  @click="add(id, -1)"
                ><v-icon>mdi-minus</v-icon></v-btn>
                <span style="line-height: 24px;">{{ mtl[id] }}</span>
                <v-btn
                  elevation="2"
                  icon
                  small
                  @click="add(id, 1)"
                ><v-icon>mdi-plus</v-icon></v-btn>
              </div>
            </v-card>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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
            v-model.number="edit.num"
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
            @click="applyEdit"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="form.show" width="400">
      <v-card>
        <v-card-title class="text-h6 lighten-2">
          合成{{ data.item[form.id].name }}
        </v-card-title>

        <v-card-text>
          <div style="margin-bottom: 16px;">
            <span>合成{{ data.item[form.id].name }} x {{ form.formula.count }}需要：</span><br>
            <template v-for="(v, k) in form.formula.costs">
              <span :key="k">{{ data.item[v.id].name }} x {{ v.count }}</span>
              <br :key="k + 'br'">
            </template>
          </div>
          <v-toolbar dense>
            <v-container style="padding: 0">
              <v-row>
                <v-col class="col"><v-btn text style="height: 48px;" @click="formAdd(-2)">最少</v-btn></v-col>
                <v-col class="col"><v-btn icon @click="formAdd(-1)"><v-icon>mdi-chevron-left</v-icon></v-btn></v-col>
                <v-col class="col">
                  <div style="line-height: 48px; text-align: center; font-size=28px;">
                    {{ form.num }}
                  </div>
                </v-col>
                <v-col class="col"><v-btn icon @click="formAdd(1)"><v-icon>mdi-chevron-right</v-icon></v-btn></v-col>
                <v-col class="col"><v-btn text style="height: 48px;" @click="formAdd(2)">最多</v-btn></v-col>
              </v-row>
            </v-container>
          </v-toolbar>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="form.show = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="applyForm"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<style>
.v-expansion-panel-content__wrap {
    padding: 0 4px 16px !important;
  }
</style>

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
  .col {
    padding-left: 0;
    padding-right: 0;
    text-align: center;
    line-height: 48px;
  }
</style>

<script>
const LS = window.localStorage
import data from '../data.js'

export default {
  data() {
    return {
      data,
      mtl: JSON.parse(LS.mtl),

      panelList: [
        { type: 'gold', title: '龙门币' },
        { type: 'asc', title: '芯片' },
        { type: 'skill', title: '技巧概要' },
        { type: 'exp', title: '作战记录' },
        { type: 'sl', title: '精英材料' }
      ],

      edit: {
        show: false,
        id: '32001',
        num: 0
      },

      form: {
        show: false,
        formula: {},
        id: '32001',
        num: 0
      }
    }
  },
  methods: {
    save() {
      LS.mtl = JSON.stringify(this.mtl)
    },
    add(k, d) {
      if (this.mtl[k] === 0 && d == -1) return
      this.mtl[k] += d
      this.save()
    },
    openEdit(k) {
      this.edit.id = k
      this.edit.num = this.mtl[k]
      this.edit.show = true
    },
    applyEdit() {
      let v = this.edit.num
      if (v >= 0) this.mtl[this.edit.id] = Math.floor(v)
      this.save()
      this.edit.show = false
    },
    openForm(k) {
      this.form.id = k
      this.form.formula = data.formula[data.item[k].formula]
      this.form.num = 0
      this.form.show = true
    },
    applyForm() {
      for (let i of this.form.formula.costs) {
        this.mtl[i.id] -= i.count * this.form.num
      }
      this.mtl[this.form.id] += this.form.formula.count * this.form.num
      this.save()
      this.form.show = false
    },
    formAdd(k) {// -1, 1, -2, 2
      if (k === -2) { // 最少
        this.form.num = 0
      } else if (k === -1) { // 减一
        if (this.form.num > 0) this.form.num --
      } else if (k === 1) { // 加一
        let res = Infinity
        for (let i of this.form.formula.costs) {
          res = Math.min(res, Math.floor(this.mtl[i.id] / i.count))
        }
        if (this.form.num + 1 > res) return
        this.form.num ++
      } else if (k === 2) { // 最多
        let res = Infinity
        for (let i of this.form.formula.costs) {
          res = Math.min(res, Math.floor(this.mtl[i.id] / i.count))
        }
        this.form.num = res
      }
    }
  }
}
</script>