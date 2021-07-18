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
            1.0 alpha By CmdBlock
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list
        dense
        nav
      >
        <v-list-item-group
          :value="$route.meta.key"
          color="primary"
        >
          <v-list-item
            link
            key="home"
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
            key="stat"
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
            key="ops"
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
            key="ware"
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
      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import data from './data.js'

export default {
  data() {
    return {
      drawer: null,
    }
  },
  async mounted() {
    let LS = window.localStorage
    if (!LS.user_ops) LS.user_ops = '{}'
    if (!LS.plan) LS.plan = JSON.stringify([{
      name: '当前练度',
      op: {}
    }])
    if (!LS.user_mtls) {
      let user_mtls = {}
      for (let i of Object.keys(data.item)) {
        if (data.item[i].icon.indexOf('MTL_SL') === -1) continue
        user_mtls[i] = 0
      }
      LS.user_mtls = JSON.stringify(user_mtls)
    }
  },
  methods: {
    navTo(to) {
      if (this.$route.path === to) return
      this.$router.push(to)
    }
  }
}
</script>
