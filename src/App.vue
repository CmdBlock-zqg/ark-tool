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
                材料统计
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            key="plan"
            @click="navTo('/plan')"
          >
            <v-list-item-icon>
              <v-icon>mdi-chess-rook</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                养成规划
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            key="item"
            @click="navTo('/item')"
          >
            <v-list-item-icon>
              <v-icon>mdi-layers-triple-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                材料仓库
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
    if (!LS.plan) LS.plan = JSON.stringify([{
      name: '当前练度',
      op: {}
    }])
    if (!LS.mtl) {
      let mtl = {}
      for (let i of Object.keys(data.mtlMap)) {
        for (let j of data.mtlMap[i]) {
          mtl[j] = 0
        }
      }
      LS.mtl = JSON.stringify(mtl)
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
