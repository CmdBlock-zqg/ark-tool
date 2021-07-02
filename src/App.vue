<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            明日方舟养成规划
          </v-list-item-title>
          <v-list-item-subtitle>
            By CmdBlock
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list
        dense
        nav
      >
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >


          <v-list-item
            link
            :key="0"
            @click="navTo('/')"
          >
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                主页
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :key="1"
            @click="navTo('/stat')"
          >
            <v-list-item-icon>
              <v-icon>mdi-poll-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                统计
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :key="2"
            @click="navTo('/ops')"
          >
            <v-list-item-icon>
              <v-icon>mdi-chess-rook</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                干员
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>



        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>主页</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <v-dialog
      v-model="loadData"
      persistent
      width="400"
    >
      <v-card style="text-align: center; padding: 24px;">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <div style="margin-top: 16px;">
          首次打开 正在下载数据
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarShow">
      游戏新内容已更新 请刷新页面
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="refresh"
        >
          刷新
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>

import initReg from './registerServiceWorker'

export default {
  data: () => ({
    drawer: null,
    selectedItem: 0,
    loadData: true,

    snackbarShow: false
  }),
  async mounted() {
    initReg(this)
    var LS = window.localStorage
    if (LS.init) {
      this.loadData = false
      return
    }
    this.loadData = true
    var { data: characters } = await this.$axios.get('/data/characters.json')
    var { data: common } = await this.$axios.get('/data/common.json')
    var { data: formulas } = await this.$axios.get('/data/formulas.json')
    var { data: items } = await this.$axios.get('/data/items.json')
    LS.data_characters = JSON.stringify(characters)
    LS.data_common = JSON.stringify(common)
    LS.data_formulas = JSON.stringify(formulas)
    LS.data_items = JSON.stringify(items)

    var search = {}
    for (var i of Object.keys(characters)) {
      search[characters[i].name] = i
    }
    LS.data_search = JSON.stringify(search)
    if (!LS.user_ops) LS.user_ops = JSON.stringify({})

    LS.init = true
    this.loadData = false
  },
  methods: {
    navTo(to) {
      if (this.$route.path === to) return
      this.$router.push(to)
    },
    snackbar() {
      this.snackbarShow = true
    },
    refresh() {
      window.location.reload()
    }
  }
}
</script>
