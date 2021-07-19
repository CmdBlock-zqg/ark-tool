<template>
  <div style="padding: 16px;">
    <div class="card" style="text-align: center;">
      <v-card-text>
        <v-icon style="font-size: 100px;">mdi-cube-outline</v-icon>
        <p class="text-h4 text--primary">
          欢迎使用明日方舟养成规划器
        </p>
        <div class="text--primary">
          使用方法：<br>
          从左侧菜单进入“养成规划”页面，设定当前干员练度和养成目标<br>
          在“材料仓库”页面，设定已经拥有的材料
          在“材料统计”页面看到所需的材料、经验、龙门币等资源及其计算结果<br>
          <b>注意：目前所有数据都存储在本地，若清除浏览数据，所有数据将被清除！</b>
        </div>
      </v-card-text>
    </div>
  </div>
</template>

<style scoped>
  .card {
    margin: 8px;
    padding: 8px;
  }
</style>