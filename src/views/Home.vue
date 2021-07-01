<template>
  <div style="padding: 16px;">
    <div class="card" style="text-align: center;">
      <v-card-text>
        <v-icon style="font-size: 100px;">mdi-cube</v-icon>
        <p class="text-h4 text--primary">
          欢迎使用明日方舟养成规划器
        </p>
        <div class="text--primary">
          使用方法：<br>
          从左侧菜单进入“我的干员”页面输入当前干员练度和目标干员练度<br>
          即可在“材料刷取”页面看到所需的材料、经验、龙门币等资源<br>
          <b>注意：目前所有数据都存储在本地，若清除浏览数据，所有数据将被清除！</b>
        </div>
      </v-card-text>
    </div>
    <p class="text-h5">所需全部资源</p>
    <v-card class="card item t3" elevation="7">
      <img style="margin-right: 8px;" class="fl" src="/assets/items/GOLD.png" height="72px;">
      <div>
        <span class="item-text">龙门币</span><br>
        <span class="item-text"><b>{{ lmb }}</b></span>
      </div>
    </v-card>

    <v-card style="width: 120px;" class="card item" elevation="7">
      <div>
        <span class="item-text">总经验</span><br>
        <span class="item-text"><b>{{ exp }}</b></span>
      </div>
    </v-card>

    <v-card class="card item t4" elevation="7">
      <img style="margin-right: 8px;" class="fl" src="/assets/items/sprite_exp_card_t4.png" height="72px;">
      <div>
        <span class="item-text-dense">高级作战记录</span><br>
        <span class="item-text-dense" style="font-size: 10px;">(全部经验等价)</span><br>
        <span class="item-text-dense"><b>{{ Math.ceil(lmb / 2000) }}</b></span>
      </div>
    </v-card>

    <v-card class="card item t3" elevation="7">
      <img style="margin-right: 8px;" class="fl" src="/assets/items/sprite_exp_card_t3.png" height="72px;">
      <div>
        <span class="item-text-dense">中级作战记录</span><br>
        <span class="item-text-dense" style="font-size: 10px;">(全部经验等价)</span><br>
        <span class="item-text-dense"><b>{{ Math.ceil(lmb / 1000) }}</b></span>
      </div>
    </v-card>

    <v-card class="card item t2" elevation="7">
      <img style="margin-right: 8px;" class="fl" src="/assets/items/sprite_exp_card_t2.png" height="72px;">
      <div>
        <span class="item-text-dense">初级作战记录</span><br>
        <span class="item-text-dense" style="font-size: 10px;">(全部经验等价)</span><br>
        <span class="item-text-dense"><b>{{ Math.ceil(lmb / 400) }}</b></span>
      </div>
    </v-card>

    <v-card class="card item t1" elevation="7">
      <img style="margin-right: 8px;" class="fl" src="/assets/items/sprite_exp_card_t1.png" height="72px;">
      <div>
        <span class="item-text-dense">基础作战记录</span><br>
        <span class="item-text-dense" style="font-size: 10px;">(全部经验等价)</span><br>
        <span class="item-text-dense"><b>{{ Math.ceil(lmb / 200) }}</b></span>
      </div>
    </v-card>

    <v-card class="card item" :class="[`t${v.rarity}`]" elevation="7" v-for="(v, k) in itemList" :key="k">
      <img style="margin-right: 8px;" class="fl" :src="`/assets/items/${v.icon}.png`" height="72px;">
      <div>
        <span class="item-text">{{ v.name }}</span><br>
        <span class="item-text"><b>{{ v.count }}</b></span>
      </div>
    </v-card>
    
  </div>
</template>

<style scoped>
  .card {
    margin: 8px;
    padding: 8px;
  }
  .item {
    float: left;
    width: 200px;
  }
  .item-text {
    line-height: 36px;
  }
  .item-text-dense {
    line-height: 16px;
    font-size: 16px;
  }
  .fl {
    float: left;
  }
  .t0 {
    border-left: rgb(156, 156, 156) solid 5px;
  }
  .t1 {
    border-left: rgb(179, 194, 49) solid 5px;
  }
  .t2 {
    border-left: rgb(8,178,247) solid 5px;
  }
  .t3 {
    border-left: rgb(209, 133, 214) solid 5px;
  }
  .t4 {
    border-left: rgb(244,202,28) solid 5px;
  }
</style>

<script>

  const LS = window.localStorage

  export default {
    data() {
      return {
        user_ops: JSON.parse(LS.user_ops),
        data_items: JSON.parse(LS.data_items),
        itemList: {},
        lmb: 0,
        exp: 0
      }
    },
    mounted() {
      for (let i of Object.keys(this.user_ops)) {
        let costs = this.user_ops[i].costs
        if (costs[4001]) this.lmb += costs[4001]
        if (costs[0]) this.exp += costs[0]
        for (let j of Object.keys(costs)) {
          if (j === '0' || j === '4001') continue
          if (this.itemList[j]) this.itemList[j].count += costs[j]
          else this.itemList[j] = {
            name: this.data_items[j].name,
            icon: this.data_items[j].icon,
            rarity: this.data_items[j].rarity,
            count: costs[j]
          }
        }
      }
    }
  }
</script>