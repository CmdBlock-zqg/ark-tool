<template>
  <div class="stat">
    <div style="width: 240px;">
      <v-select
        :items="nodeSelectItems"
        label="目标"
        outlined
        v-model="nodeId"
        item-text="name"
        item-value="key"
        dense
      ></v-select>
    </div>
    <template v-if="nodeId !== 0">
      <v-tabs v-model="tab">
        <v-tab>总览</v-tab>
        <v-tab>经验货币</v-tab>
        <v-tab>芯片</v-tab>
        <v-tab>技巧概要</v-tab>
        <v-tab>精英材料</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <div style="padding: 8px;">
          <!--总览-->
          <v-tab-item>
            <v-switch
              v-model="monthCard"
              label="月卡"
              style="padding: 0;"
            ></v-switch>
            <b>目前因为精英材料统计未完成 未算入刷取精英材料的理智</b>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      项目
                    </th>
                    <th>
                      数值
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>需要理智总和</td>
                    <td>{{ viewTot.lz }}</td>
                  </tr>
                  <tr>
                    <td>自然回复理智等价天数</td>
                    <td>{{ viewTot.day }}</td>
                  </tr>
                  <tr>
                    <td>计算每周奖励理智夜，等价周数</td>
                    <td>{{ viewTot.week }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <!--经验货币-->
          <v-tab-item>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      项目
                    </th>
                    <th>
                      数值
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>还需龙门币</td>
                    <td>{{ viewExpGold.gold.lack }}</td>
                  </tr>
                  <tr>
                    <td>刷CE-5次数</td>
                    <td>{{ viewExpGold.gold.ce5 }}</td>
                  </tr>
                  <tr>
                    <td>预计消耗理智</td>
                    <td>{{ viewExpGold.gold.lz }}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>总需经验</td>
                    <td>{{ viewExpGold.exp.tot }}</td>
                  </tr>
                  <tr>
                    <td>已有作战记录总经验</td>
                    <td>{{ viewExpGold.exp.have }}</td>
                  </tr>
                  <tr>
                    <td>还需经验</td>
                    <td>{{ viewExpGold.exp.lack }}</td>
                  </tr>
                  <tr>
                    <td>刷LS-5次数</td>
                    <td>{{ viewExpGold.exp.ls5 }}</td>
                  </tr>
                  <tr>
                    <td>预计消耗理智</td>
                    <td>{{ viewExpGold.exp.lz }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <!--芯片-->
          <v-tab-item>
            <v-switch
              v-model="ascAutoForm"
              label="自动芯片间合成"
              style="padding: 0;"
            ></v-switch>
            计算中自动制造双芯片，芯片搜索关卡计算时假设两种芯片等概率掉落<br>
            <div class="d-flex justify-start flex-wrap">
              <v-card
                class="item"
                :class="[`t${data.item[k].rarity}`, `order-${4 - data.item[k].rarity}`]"
                elevation="3"
                
                v-for="(v, k) in viewAsc.mtl"
                :key="k"
              >
                <img
                  :src="`/assets/items/${data.item[k].icon}.png`"
                  height="80" width="80"
                >
                <div class="text-center">{{ data.item[k].name }}</div>
                <div class="text-center">{{ v }}</div>
              </v-card>
            </div>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      项目
                    </th>
                    <th>
                      数值
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(v, k) in viewAsc.stage[1]" :key="k">
                    <td>{{ k }} 次数</td>
                    <td>{{ v }}</td>
                  </tr>
                  <tr><td></td><td></td></tr>
                  <tr v-for="(v, k) in viewAsc.stage[2]" :key="k">
                    <td>{{ k }} 次数</td>
                    <td>{{ v }}</td>
                  </tr>
                  <tr><td></td><td></td></tr>
                  <tr>
                    <td>AP-5 次数</td>
                    <td>{{ viewAsc.ap5 }}</td>
                  </tr>
                  <tr>
                    <td>预计消耗理智</td>
                    <td>{{ viewAsc.lz }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <!--技巧概要-->
          <v-tab-item>
            因技巧概要获取难以计算，此处仅计算 技巧概要·卷3 的刷取
            <div class="d-flex justify-start flex-wrap">
              <v-card
                class="item"
                :class="[`t${data.item[id].rarity}`, `order-${4 - data.item[id].rarity}`]"
                elevation="3"
                
                v-for="id in data.mtlMap.skill"
                :key="id"
                v-show="lack[id]"
              >
                <img
                  :src="`/assets/items/${data.item[id].icon}.png`"
                  height="80" width="80"
                >
                <div class="text-center">{{ data.item[id].name }}</div>
                <div class="text-center">{{ lack[id] }}</div>
              </v-card>
            </div>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      项目
                    </th>
                    <th>
                      数值
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CA-5 次数</td>
                    <td>{{ viewSkill.ca5 }}</td>
                  </tr>
                  <tr>
                    <td>预计消耗理智</td>
                    <td>{{ viewSkill.lz }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <!--精英材料-->
          <v-tab-item>
            关卡刷取计算还没做
            <div class="d-flex justify-start flex-wrap">
              <v-card
                class="item"
                :class="[`t${data.item[id].rarity}`, `order-${4 - data.item[id].rarity}`]"
                elevation="3"
                
                v-for="id in data.mtlMap.sl"
                :key="id"
                v-show="lack[id]"
              >
                <img
                  :src="`/assets/items/${data.item[id].icon}.png`"
                  height="80" width="80"
                >
                <div class="text-center">{{ data.item[id].name }}</div>
                <div class="text-center">{{ lack[id] }}</div>
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
import core from '../core.js'

export default {
  data() {
    return {
      data,
      mtl,
      plan,
      nodeId: 0,
      tab: 0,

      ascAutoForm: false,
      monthCard: true
    }
  },
  beforeCreate() {
    mtl = JSON.parse(LS.mtl)
    plan = JSON.parse(LS.plan)
  },
  computed: {
    node() {
      return plan[this.nodeId]
    },
    nodeSelectItems() {
      let res = plan.map((v, k) => {
         return { name: v.name, key: k }
      })
      res.splice(0, 1)
      return res
    },
    cost() { // 所需要的全部素材
      let l = plan[0].op
      let r = this.node.op
      let cost = { 0: 0, 4001: 0 }
      for (let i of Object.keys(r)) {
        if (!l[i]) {
          cost = core.mtl.merge(
            cost,
            r[i].cost
          )
        } else {
          cost = core.mtl.merge(
            cost, 
            core.mtl.lack(
              r[i].cost,
              l[i].cost
            )
          )
        }
      }
      return cost
    },
    lack() { // 排除仓库后还缺
      return core.mtl.lack(this.cost, mtl)
    },
    left() { // 排除仓库后 仓库剩余
      return core.mtl.left(this.cost, mtl)
    },
    viewExpGold() { // 经验货币
      let res = {
        gold: {
          lack: this.lack[4001] // 缺少龙门币数量
        },
        exp: {
          tot: this.cost[0], // 需要的总经验
          have: mtl[2001] * 200 + mtl[2002] * 400 + mtl[2003] * 1000 + mtl[2004] * 2000 // 作战记录exp总和
        }
      }
      res.gold.ce5 = Math.ceil(res.gold.lack / 7500) // ce5次数
      res.gold.lz = res.gold.ce5 * 30 // 预计刷龙门币耗费理智

      res.exp.lack = Math.max(0, res.exp.tot - res.exp.have) // 缺少经验值
      res.exp.ls5 = Math.ceil(res.exp.lack / 7400) // ls5次数
      res.exp.lz = res.exp.ls5 * 30 // 预计刷狗粮耗费理智
      return res
    },
    viewAsc() { // 芯片
      let add = (t, k, v) => {
        t[k] = t[k] ? t[k] + v : v
      }
      let num = (k) => k ? k : 0
      let res = {
        mtl: {},
        stage: { 1: {}, 2: {} }, // 单芯片和双芯片
        lz: 0,
        ap5: 0,
      }
      for (let i of data.mtlMap.asc) {
        if (!this.lack[i]) continue
        if (i[3] === '3') { // 双芯片 拆成芯片组和助剂
          add(res.mtl, i - 1, 2 * this.lack[i]) // 芯片组
          add(res.mtl, 32001, this.lack[i]) // 助剂
        } else {
          add(res.mtl, i, this.lack[i])
        }
      }
      if (this.ascAutoForm) {
        // 芯片间自动合成
        let lack = core.mtl.lack(res.mtl, this.left)
        let left = core.mtl.left(res.mtl, this.left)
        const ascIdPair = {
          '1': '7',
          '2': '8',
          '3': '6',
          '4': '5',
          '5': '4',
          '6': '3',
          '7': '1',
          '8': '2'
        }
        for (let i of Object.keys(lack)) {
          if (i === '32001') continue
          let j = '32' + ascIdPair[i[2]] + i[3] // 同等级同关卡的另一种芯片id
          let k = Math.floor(num(left[j]) / 3) * 2 // 最多合成i的数量
          lack[i] = Math.max(0, lack[i] - k)
        }
        res.mtl = lack
      } else {
        // 不自动合成 自动消耗拆开双芯片后的所需材料
        res.mtl = core.mtl.lack(res.mtl, this.left)
      }
      if (res.mtl[32001]) {
        res.ap5 = Math.ceil(res.mtl[32001] * 4.5)
        res.lz += res.ap5 * 30
      }
      const stages = { // 关卡名和掉落的材料
        1: { // 芯片
          'PR-A-1(医疗重装)': [3261, 3231],
          'PR-B-1(狙击术师)': [3241, 3251],
          'PR-C-1(先锋辅助)': [3211, 3271],
          'PR-D-1(近卫特种)': [3221, 3281]
        },
        2: { // 芯片组
          'PR-A-2(医疗重装)': [3262, 3232],
          'PR-B-2(狙击术师)': [3242, 3252],
          'PR-C-2(先锋辅助)': [3212, 3272],
          'PR-D-2(近卫特种)': [3222, 3282]
        }
      }
      for (let i of Object.keys(stages)) { // i：芯片等级
        for (let j of Object.keys(stages[i])) { // j: 关卡名
          let a = num(res.mtl[stages[i][j][0]]), // 两种职业的芯片各自的编号
              b = num(res.mtl[stages[i][j][1]])
          let tmp = Math.min(a, b)
          if (this.ascAutoForm) {
            let cx = [0, 2, 4, 6, 6, 6]
            let ax = Math.floor((a - tmp) / 5),
                bx = Math.floor((b - tmp) / 5)
            res.stage[i][j] = tmp * 2 + ax * 6 + cx[a - tmp - ax * 5] + bx * 6 + cx[b - tmp - bx * 5]
          } else {
            res.stage[i][j] = tmp * 2 + (a - tmp) * 2 + (b - tmp) * 2
          }
          res.lz += i * 18 * res.stage[i][j]
          if (res.stage[i][j] === 0) delete res.stage[i][j]
        }
      }
      return res
    },
    viewSkill() { // 技巧概要
      let res = {
        ca5: 0,
        lz: 0
      }
      let sk = this.lack[3303] ? this.lack[3303] : 0 // 缺少三级技能书的数量
      res.ca5 = Math.ceil(sk / 2)
      res.lz = res.ca5 * 30
      return res
    },
    viewSl() { // 精英材料
      let res = {
        lz: 0
      }
      return res
    },
    viewTot() { // 总览
      let res = {
        lz: this.viewExpGold.gold.lz +
            this.viewExpGold.exp.lz + 
            this.viewAsc.lz +
            this.viewSkill.lz +
            this.viewSl.lz,
        day: 0,
        week: 0
      }
      if (this.monthCard) {
        res.day = Math.ceil(res.lz / 300)
        res.week = Math.ceil(res.lz / 2300)
      } else {
        res.day = Math.ceil(res.lz / 240)
        res.week = Math.ceil(res.lz / 1880)
      }
      return res
    }
  }
}
</script>
