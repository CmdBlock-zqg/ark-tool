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

          <v-list-item
            link
            :key="3"
            @click="navTo('/ware')"
          >
            <v-list-item-icon>
              <v-icon>mdi-layers-triple-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                仓库
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
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    selectedItem: 0,
    loadData: false,
  }),
  async mounted() {
    let LS = window.localStorage

    if (!LS.user_ops) LS.user_ops = JSON.stringify({})

    if (!LS.user_mtls) LS.user_mtls = '{"30011":0,"30012":0,"30013":0,"30014":0,"30021":0,"30022":0,"30023":0,"30024":0,"30031":0,"30032":0,"30033":0,"30034":0,"30041":0,"30042":0,"30043":0,"30044":0,"30051":0,"30052":0,"30053":0,"30054":0,"30061":0,"30062":0,"30063":0,"30064":0,"30073":0,"30074":0,"30083":0,"30084":0,"30093":0,"30094":0,"30103":0,"30104":0,"30115":0,"30125":0,"30135":0,"30145":0,"31013":0,"31014":0,"31023":0,"31024":0,"31033":0,"31034":0}'

    if (LS.init) return
    this.loadData = true
    let { data: characters } = await this.$axios.get('/data/characters.json')
    let { data: common } = await this.$axios.get('/data/common.json')
    let { data: formulas } = await this.$axios.get('/data/formulas.json')
    let { data: items } = await this.$axios.get('/data/items.json')
    LS.data_characters = JSON.stringify(characters)
    LS.data_common = JSON.stringify(common)
    LS.data_formulas = JSON.stringify(formulas)
    LS.data_items = JSON.stringify(items)

    let search = {}
    for (let i of Object.keys(characters)) {
      search[characters[i].name] = i
    }
    LS.data_search = JSON.stringify(search)

    LS.init = true
    this.loadData = false
  },
  methods: {
    navTo(to) {
      if (this.$route.path === to) return
      this.$router.push(to)
    }
  }
}
</script>
