<template>
  <div class="stat">
    <div style="width: 240px;">
      <v-select
        :items="selectItems"
        label="目标"
        outlined
        v-model="node"
        item-text="name"
        item-value="key"
        dense
      ></v-select>
    </div>
    <template v-if="node !== 0">
      <v-tabs v-model="tab">
        <v-tab>总览</v-tab>
        <v-tab>经验货币</v-tab>
        <v-tab>芯片</v-tab>
        <v-tab>技巧概要</v-tab>
        <v-tab>精英材料</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <div style="padding: 8px;">
          <v-tab-item> <!--总览-->
            <v-switch
              v-model="mc"
              label="月卡"
              style="padding: 0;"
            ></v-switch>
            <b>目前因为精英材料统计未完成 未算入刷取精英材料的理智</b><br>
            需要的理智总和：{{ totAp }}<br>
            自然回复理智等价天数：{{ Math.ceil(totAp / (mc ? 300 : 240)) }}<br>
            计算每周奖励理智夜，等价周数：{{ Math.ceil(totAp / (mc ? 2300 : 1880)) }}<br>
          </v-tab-item>
          <v-tab-item> <!--经验货币-->
            还需龙门币：{{ cost.gold }}<br>
            刷CE-5次数：{{ Math.ceil(cost.gold / 7500) }}<br>
            预计消耗理智：{{ Math.ceil(cost.gold / 7500) * 30 }}<br>
            <br>

            总需经验：{{ cost.exp[0] }}<br>
            已有作战记录总经验：{{ cost.exp[1] }}<br>
            还需经验：{{ Math.max(0, cost.exp[0] - cost.exp[1]) }}<br>
            刷LS-5次数：{{ Math.max(0, Math.ceil((cost.exp[0] - cost.exp[1]) / 7400)) }}<br>
            预计消耗理智：{{ Math.max(0, Math.ceil((cost.exp[0] - cost.exp[1]) / 7400) * 30) }}<br>
          </v-tab-item>
          <v-tab-item> <!--芯片-->
            <v-switch
              v-model="ascf"
              label="自动芯片间合成"
              style="padding: 0;"
            ></v-switch>
            计算中自动制造双芯片，关卡计算假设等概率<br>
            <div class="d-flex justify-start flex-wrap">
              <v-card class="item" :class="[`t${data.item[k].rarity}`, `order-${4 - data.item[k].rarity}`]" elevation="3" v-for="(v, k) in asc.asc" :key="k">
                <img
                  :src="`/assets/items/${data.item[k].icon}.png`"
                  height="80" width="80"
                >
                <div class="text-center">{{ data.item[k].name }}</div>
                <div class="text-center">{{ v }}</div>
              </v-card>
            </div>

            <template v-for="(v, k) in asc.stage[1]">
              {{ k }}：{{ v }}次<br :key="k">
            </template>
            <br>
            <template v-for="(v, k) in asc.stage[2]">
              {{ k }}：{{ v }}次<br :key="k">
            </template>
            <br>
            AP-5：{{ Math.ceil(asc.asc[32001] * 4.5) }} 次<br>
            <br>
            预计消耗理智：{{ asc.intel + Math.ceil(asc.asc[32001] * 4.5) * 30 }}
          </v-tab-item>
          <v-tab-item> <!--技巧概要-->
            因技巧概要获取难以计算，此处仅计算 技巧概要·卷3 的刷取
            <div class="d-flex justify-start flex-wrap">
              <v-card class="item" :class="[`t${data.item[k].rarity}`, `order-${4 - data.item[k].rarity}`]" elevation="3" v-for="(v, k) in cost.skill" :key="k">
                <img
                  :src="`/assets/items/${data.item[k].icon}.png`"
                  height="80" width="80"
                >
                <div class="text-center">{{ data.item[k].name }}</div>
                <div class="text-center">{{ v }}</div>
              </v-card>
            </div>
            刷CA-5次数：{{ Math.ceil((cost.skill[3303] ? cost.skill[3303] : 0) / 2) }}<br>
            预计消耗理智：{{ Math.ceil((cost.skill[3303] ? cost.skill[3303] : 0) / 2) * 30 }}
          </v-tab-item>
          <v-tab-item> <!--精英材料-->
          关卡刷取计算还没做
            <div class="d-flex justify-start flex-wrap">
              <v-card class="item" :class="[`t${data.item[k].rarity}`, `order-${4 - data.item[k].rarity}`]" elevation="3" v-for="(v, k) in cost.sl" :key="k">
                <img
                  :src="`/assets/items/${data.item[k].icon}.png`"
                  height="80" width="80"
                >
                <div class="text-center">{{ data.item[k].name }}</div>
                <div class="text-center">{{ v }}</div>
              </v-card>
            </div>
          </v-tab-item>
        </div>
      </v-tabs-items>
    </template>
  </div>
</template>

<style scoped>
  .stat {
    padding: 16px;
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
const LS = window.localStorage
var mtl
var plan

import data from '../data.js'
import core from '../core'

export default {
  data() {
    return {
      data,
      mtl,
      plan,

      node: 0,

      tab: 0,
      ascf: false,
      skf: false,
      mc: true
    }
  },
  beforeCreate() {
    mtl = JSON.parse(LS.mtl)
    plan = JSON.parse(LS.plan)
  },
  computed: {
    selectItems() {
      let res = this.plan.map((v, k) => {
         return { name: v.name, key: k }
      })
      res.splice(0, 1)
      return res
    },
    totCost() { // 总共需要
      let l = plan[0].op
      let r = plan[this.node].op
      let cost = { 0: 0, 4001: 0 }
      for (let i of Object.keys(r)) {
        if (!l[i]) {
          cost = core.mtl.plus(
            cost,
            r[i].cost
          )
        } else {
          cost = core.mtl.plus(
            cost, 
            core.mtl.minus(
              r[i].cost,
              l[i].cost
            )
          )
        }
      }
      let res = {
        sl: {},
        asc: {},
        skill: {}
      }
      for (let t of Object.keys(res)) { // t: item分类
        for (let i of Object.keys(mtl[t])) { // i: 遍历分类下的所有item
          if (!cost[i]) continue
          res[t][i] = cost[i]
        }
      }
      res.exp = cost[0]
      res.gold =  cost[4001]
      return res
    },
    cost() { // 排除仓库后需要
      let l = plan[0].op
      let r = plan[this.node].op
      let cost = { 0: 0, 4001: 0 }
      for (let i of Object.keys(r)) {
        if (!l[i]) {
          cost = core.mtl.plus(
            cost,
            r[i].cost
          )
        } else {
          cost = core.mtl.plus(
            cost, 
            core.mtl.minus(
              r[i].cost,
              l[i].cost
            )
          )
        }
      }
      let res = {
        sl: {},
        asc: {},
        skill: {}
      }
      for (let t of Object.keys(res)) { // t: item分类
        for (let i of Object.keys(mtl[t])) { // i: 遍历分类下的所有item
          if (!cost[i]) continue
          if (cost[i] > mtl[t][i]) res[t][i] = cost[i] - mtl[t][i]
        }
      }
      res.exp = mtl.exp
      res.exp[0] = cost[0]
      res.exp[1] = mtl.exp[2001] * 200 + mtl.exp[2002] * 400 + mtl.exp[2003] * 1000 + mtl.exp[2004] * 2000

      res.gold = Math.max(0, cost[4001] - mtl.gold[4001])

      return res
    },
    left() { // 排除仓库后，仓库剩下
      let res = {
        sl: {},
        asc: {},
        skill: {}
      }
      for (let t of Object.keys(res)) { // t: item分类
        for (let i of Object.keys(mtl[t])) { // i: 遍历分类下的所有item
          res[t][i] = Math.max(0, mtl[t][i] - (this.totCost[t][i] ? this.totCost[t][i] : 0))
        }
      }
      return res
    },
    asc() {
      let add = (t, k, v) => {
        t[k] = t[k] ? t[k] + v : v
      }
      let num = (k) => k ? k : 0
      let asc = {}
      
      for (let i of Object.keys(this.cost.asc)) {
        if (i[3] === '3') { // 双芯片
          add(asc, i - 1, 2 * this.cost.asc[i])
          add(asc, 32001, this.cost.asc[i])
        } else {
          add(asc, i, this.cost.asc[i])
        }
      }
      if (this.ascf) {
        let asct = core.mtl.minus(asc, this.left.asc)
        let ascl = core.mtl.minusLeft(asc, this.left.asc)
        const pair = {
          '1': '7',
          '2': '8',
          '3': '6',
          '4': '5',
          '5': '4',
          '6': '3',
          '7': '1',
          '8': '2'
        }
        for (let i of Object.keys(asct)) {
          if (i === '32001') continue
          let j = '32' + pair[i[2]] + i[3]
          let k = Math.floor(num(ascl[j]) / 3)
          asct[i] = Math.max(0, asct[i] - k * 2)
        }
        asc = asct
      } else {
        asc = core.mtl.minus(asc, this.left.asc)
      }
      if (!asc[32001]) asc[32001] = 0
      let intel = 0
      let stage = { 1: {}, 2: {}}
      const pair = {
        1: {
          'PR-A-1(医疗重装)': [3261, 3231],
          'PR-B-1(狙击术师)': [3241, 3251],
          'PR-C-1(先锋辅助)': [3211, 3271],
          'PR-D-1(近卫特种)': [3221, 3281]
        },
        2: {
          'PR-A-2(医疗重装)': [3262, 3232],
          'PR-B-2(狙击术师)': [3242, 3252],
          'PR-C-2(先锋辅助)': [3212, 3272],
          'PR-D-2(近卫特种)': [3222, 3282]
        }
      }
      for (let i of Object.keys(pair)) {
        for (let j of Object.keys(pair[i])) {
          let a = num(asc[pair[i][j][0]]), 
              b = num(asc[pair[i][j][1]])
          let tmp = Math.min(a, b)
          if (this.ascf) {
            let cx = [0, 2, 4, 6, 6, 6]
            let ax = Math.floor((a - tmp) / 5),
                bx = Math.floor((b - tmp) / 5)
            stage[i][j] = tmp * 2 + ax * 6 + cx[a - tmp - ax * 5] + bx * 6 + cx[b - tmp - bx * 5]
          } else {
            stage[i][j] = tmp * 2 + (a - tmp) * 2 + (b - tmp) * 2
          }
          intel += i * 18 * stage[i][j]
          if (stage[i][j] === 0) delete stage[i][j]
        }
      }

      return {
        asc,
        intel,
        stage
      }
    },
    totAp() {
      return Math.ceil(this.cost.gold / 7500) * 30 + 
             Math.max(0, Math.ceil((this.cost.exp[0] - this.cost.exp[1]) / 7400) * 30) + 
             this.asc.intel + Math.ceil(this.asc.asc[32001] * 4.5) * 30 +
             Math.ceil((this.cost.skill[3303] ? this.cost.skill[3303] : 0) / 2) * 30
    }
  },
  methods: {
  }
}
</script>
