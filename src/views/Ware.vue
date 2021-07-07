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
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <img
              :src="`/assets/items/${data.item[k].icon}.png`"
              height="80" width="80"
              v-bind="attrs"
              v-on="on"
            >
          </template>
          <v-list dense>
            <v-list-item link>
              <v-list-item-title @click="openEdit(k)">输入数量</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="openForm(k)">合成</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
            <span>龙门币 x {{ form.formula.goldCost }}</span><br>
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
          <div>此处“最多”不考虑下位材料合成，与游戏中相同</div>
          <v-switch
            v-model="form.sub"
            label="下位材料不足时自动合成"
          ></v-switch>
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

var LS = window.localStorage
import data from '../data.js'

export default ({
  data() {
    return {
      data: data,
      user_mtls: JSON.parse(LS.user_mtls),

      edit: {
        show: false,
        id: 30011,
        num: 0
      },

      form: {
        show: false,
        formula: {},
        id: 30011,
        num: 0,
        sub: false
      }
    }
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
    openEdit(k) {
      this.edit.id = k
      this.edit.num = this.user_mtls[k]
      this.edit.show = true
    },
    applyEdit() {
      let v = this.edit.num
      if (v >= 0) this.user_mtls[this.edit.id] = Math.floor(v)
      this.edit.show = false
    },
    openForm(k) {
      if (!data.item[k].formula) {
        window.mdui.snackbar({ message: '该材料无法合成' })
        return
      }
      this.form.id = k
      this.form.formula = data.formula[data.item[k].formula]
      this.form.num = 0
      this.form.sub = false
      this.form.show = true
    },
    applyForm() {
      this.form.show = false
    },
    formAdd(k) {// -1, 1, -2, 2
      if (k === -2) { // 最少
        this.form.num = 0
      } else if (k === -1) {
        if (this.form.num > 0) this.form.num--
      } else if (k === 1) {
        this.form.num++
      } else if (k === 2) { // 最多
        let res = Infinity
        for (let i of this.form.formula.costs) {
          res = Math.min(res, Math.floor(this.user_mtls[i.id] / i.count))
        }
        this.form.num = res
      }
    }
  }
})
</script>
