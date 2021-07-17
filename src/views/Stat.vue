<template>
  <div class="about">
    <v-combobox
      label="选择干员"
      multiple
      small-chips
      :items="opItems"
      v-model="selectedOps"
    ></v-combobox>

    <div class="d-flex justify-space-around flex-wrap">
      <v-card class="display">
        <div class="text-h5">
          共需龙门币：{{ totalGold }}
        </div>
        <div class="d-flex" style="height: 36px; line-height: 36px;">
          相当于CE-5刷{{ Math.ceil(totalGold / 7500) }}次
        </div>
        <div class="text-h5">
          共需经验：{{ totalExp }}
        </div>
        <div>相当于：</div>
        <div class="d-flex" style="height: 36px; line-height: 36px;">
          <img style="margin-right: 8px;" src="/assets/items/sprite_exp_card_t4.png" height="36">
          {{ Math.ceil(totalExp / 2000) }}
          <img style="margin-right: 8px;" src="/assets/items/sprite_exp_card_t3.png" height="36">
          {{ Math.ceil(totalExp / 1000) }}
        </div>
        <div class="d-flex" style="height: 36px; line-height: 36px;">
          <img style="margin-right: 8px;" src="/assets/items/sprite_exp_card_t2.png" height="36">
          {{ Math.ceil(totalExp / 400) }}
          <img style="margin-right: 8px;" src="/assets/items/sprite_exp_card_t1.png" height="36">
          {{ Math.ceil(totalExp / 200) }}
        </div>
      </v-card>
    </div>

    

    

    <div class="d-flex justify-space-around flex-wrap">
      <v-card class="item" :class="[`t${data.item[k].rarity}`, `order-${4 - data.item[k].rarity}`]" elevation="3" v-for="(v, k) in totalMtls" :key="k">
        <img
          :src="`/assets/items/${data.item[k].icon}.png`"
          height="80" width="80"
        >
        <div class="text-center">{{ data.item[k].name }}</div>
        <div class="text-center">{{ v }}</div>
      </v-card>
    </div>

  </div>
</template>

<style scoped>
  .about {
    padding: 16px;
  }
  .display {
    padding: 16px;
    margin: 16px 0;
  }
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

var user_ops = JSON.parse(LS.user_ops)
var user_mtls = JSON.parse(LS.user_mtls)
var opItems = Object.values(user_ops).map((v) => v.name)

export default {
  data() {
    return {
      data,
      selectedOps: opItems,
    }
  },
  beforeCreate() {
    user_ops = JSON.parse(LS.user_ops)
    user_mtls = JSON.parse(LS.user_mtls)
    opItems = Object.values(user_ops).map((v) => v.name)
  },
  computed: {
    opItems: () => opItems,
    totalMtls() {
      let ops = this.selectedOps.map((v) => data.search[v])
      let res = {}
      for (let i of ops)
        for (let j of Object.keys(user_ops[i].costs))
          if (typeof(user_mtls[j]) !== 'undefined') res[j] = res[j] ? res[j] + user_ops[i].costs[j] : user_ops[i].costs[j]
      return res
    },
    totalGold() {
      let ops = this.selectedOps.map((v) => data.search[v])
      let res = 0
      ops.forEach((i) => {
        res += user_ops[i].costs[4001]
      })
      return res
    },
    totalExp() {
      let ops = this.selectedOps.map((v) => data.search[v])
      let res = 0
      ops.forEach((i) => {
        res += user_ops[i].costs[0]
      })
      return res
    }
  },
  methods: {

  }
}
</script>
