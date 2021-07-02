<template>
  <div style="padding: 16px;">
    <div class="card">
      <v-card-text>
        <div class="text-h5 text--primary">
          我的干员
          <v-dialog
            v-model="addDialog.show"
            width="400"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                elevation="2"
                style="float: right;"
                v-bind="attrs"
                v-on="on"
              ><v-icon>mdi-plus</v-icon>添加</v-btn>

              <v-snackbar
                v-model="addDialog.snackbar.show"
                :timeout="2000"
              >
                {{ addDialog.snackbar.text }}

                <template v-slot:action="{ attrs }">
                  <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="addDialog.snackbar.show = false"
                  >
                    OK
                  </v-btn>
                </template>
              </v-snackbar>

            </template>
            <v-card>
              <v-card-title>
                添加干员
              </v-card-title>
              <v-card-text>
                <v-autocomplete
                  auto-select-first
                  clearable
                  label="输入干员名字"
                  :items="addDialog.opList"
                  v-model="addDialog.input"
                ></v-autocomplete>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="addOp"
                >
                  确定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-text>
    </div>

    <v-dialog
      v-model="delDialog.show"
      width="400"
    >
      <v-card>
        <v-card-title>
          确认删除？
        </v-card-title>
        <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="delDialog.show = false"
            >
              取消
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="delOp"
            >
              确定
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card
      class="card"
      style="float: left; width: 320px;"
      elevation="7"
      v-for="(v, k) in user_ops"
      :key="k"
    >
      <div style="height: 80px;">
        <img style="float: left;" :src="`/assets/avatars/${v.id}.png`" height="80" width="80">
        <div style="height: 80px; float: left; padding: 16px;">
          <span style="font-size: 20px;">{{ v.name }}</span>
          <br>
          <img :src="`/assets/common/rarity_${v.rarity}.png`">
        </div>

        <v-btn
          color="error"
          style="float: right; margin-top: 16px;"
          @click="delDialog.id = v.id, delDialog.show = true"
        >
          <v-icon>mdi-delete-outline</v-icon>
          删除
        </v-btn>
        

      </div>
      <v-divider></v-divider>
      <div style="height: 80px; padding: 8px;" v-ripple @click="editOp(k, 'cur')">
        <div style="height: 80px; float: left;">
          <span>当前练度</span><br>
          <img style="float: left;" height="40" :src="`/assets/common/elite_${v.cur.evolve}.png`">
          <div style="height: 40px; line-height: 50px; float: left; font-size: 24px;">
            {{ v.cur.level }}
          </div>
        </div>
        <div style="height: 80px; float: left; margin-left: 8px; padding-top: 12px;" v-for="(s, i) in data_characters[k].skills" :key="s.skillId">
          <img :src="`/assets/skills/skill_icon_${s.skillId}.png`" height="56" width="56">
          <div class="rank">
            {{ v.cur.allSkills + v.cur.skills[i] }}
          </div>
        </div>
      </div>
      <v-divider></v-divider>
      <div style="height: 80px; padding: 8px;" v-ripple  @click="editOp(k, 'aim')">
        <div style="height: 80px; float: left;">
          <span>目标练度</span><br>
          <img style="float: left;" height="40" :src="`/assets/common/elite_${v.aim.evolve}.png`">
          <div style="height: 40px; line-height: 50px; float: left; font-size: 24px;">
            {{ v.aim.level }}
          </div>
        </div>
        <div style="height: 80px; float: left; margin-left: 8px; padding-top: 12px;" v-for="(s, i) in data_characters[k].skills" :key="s.skillId">
          <img :src="`/assets/skills/skill_icon_${s.skillId}.png`" height="56" width="56">
          <div class="rank">
            {{ v.aim.allSkills + v.aim.skills[i] }}
          </div>
        </div>
      </div>
    </v-card>

    <v-dialog
      v-model="edit.show"
      width="400"
    >
      <v-card>
        <v-card-title class="text-h6 lighten-2">
          修改{{ edit.name + (edit.type === 'cur' ? '当前' : '目标') }}练度
        </v-card-title>
        <v-card-text>
          <number-selecter v-model="edit.evolve" title="精英化等级" :min="0" :max="edit.rarity > 3 ? 2 : (edit.rarity > 2 ? 1 : 0)"></number-selecter>
          <number-selecter plus v-model="edit.level" title="等级" :min="1" :max="data_common.maxLevel[edit.rarity][edit.evolve]"></number-selecter>
          <number-selecter v-show="edit.rarity > 2" v-model="edit.allSkills" title="通用技能等级" :min="1" :max="edit.evolve > 0 ? 7 : 4"></number-selecter>
          <number-selecter v-show="edit.rarity > 3 && edit.allSkills === 7 && edit.evolve === 2" v-model="edit.skills[0]" title="一技能专精等级" :min="0" :max="edit.allSkills === 7 && edit.evolve === 2 ? 3 : 0"></number-selecter>
          <number-selecter v-show="edit.rarity > 3 && edit.allSkills === 7 && edit.evolve === 2" v-model="edit.skills[1]" title="二技能专精等级" :min="0" :max="edit.allSkills === 7 && edit.evolve === 2 ? 3 : 0"></number-selecter>
          <number-selecter v-show="edit.rarity > 5 && edit.allSkills === 7 && edit.evolve === 2" v-model="edit.skills[2]" title="三技能专精等级" :min="0" :max="edit.allSkills === 7 && edit.evolve === 2 ? 3 : 0"></number-selecter>
        </v-card-text>
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
            确定
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
  .rank {
    width: 24px;
    position: relative;
    top: -72px;
    left: 40px;
    background-color: black;
    line-height: 24px;
    text-align: center;
  }
</style>

<script>

var LS = window.localStorage
const data_search = JSON.parse(LS.data_search)

import NumberSelecter from '../components/NumberSelecter.vue'

export default({
  components: {
    NumberSelecter
  },
  data() {
    return {
      user_ops: JSON.parse(LS.user_ops),
      data_characters: JSON.parse(LS.data_characters),
      data_common: JSON.parse(LS.data_common),
      addDialog: {
        show: false,
        input: '',
        opList: Object.keys(data_search),
        snackbar: {
          show: false,
          text: ''
        }
      },
      delDialog: {
        id: '',
        show: false
      },
      edit: {
        show: false,
        id: '',
        name: '',
        rarity: 0,
        type: '',


        evolve: 0,
        level: 1,
        allSkills: 1,
        skills: [0, 0, 0]
      }
    }
  },
  methods: {
    addOp() {
      this.addDialog.show = false
      if (!this.addDialog.input) return
      let opid = data_search[this.addDialog.input]
      if (this.user_ops[opid]) {
        this.addDialog.snackbar.text = '干员已存在'
        this.addDialog.snackbar.show = true
        return
      }
      let character = this.data_characters[opid]
      this.user_ops[opid] = {
        id: opid,
        name: character.name,
        rarity: character.rarity,
        cur: {
          evolve: 0,
          level: 1,
          allSkills: 1,
          skills: [0, 0, 0]
        },
        aim: {
          evolve: 0,
          level: 1,
          allSkills: 1,
          skills: [0, 0, 0]
        },
        costs: {}
      }
      LS.user_ops = JSON.stringify(this.user_ops)
    },
    delOp() {
      this.delDialog.show = false
      delete this.user_ops[this.delDialog.id]
      LS.user_ops = JSON.stringify(this.user_ops)
    },
    editOp(id, type) {
      let char = this.data_characters[id]
      let op = this.user_ops[id]
      this.edit.id = id
      this.edit.name = char.name
      this.edit.rarity = char.rarity
      this.edit.type = type

      this.edit.evolve = op[type].evolve
      this.edit.level = op[type].level
      this.edit.allSkills = op[type].allSkills
      this.edit.skills[0] = op[type].skills[0]
      this.edit.skills[1] = op[type].skills[1]
      this.edit.skills[2] = op[type].skills[2]

      this.edit.show = true
    },
    applyEdit() {
      this.user_ops[this.edit.id][this.edit.type].level = this.edit.level
      this.user_ops[this.edit.id][this.edit.type].evolve = this.edit.evolve
      this.user_ops[this.edit.id][this.edit.type].allSkills = this.edit.allSkills
      this.user_ops[this.edit.id][this.edit.type].skills[0] = this.edit.skills[0]
      this.user_ops[this.edit.id][this.edit.type].skills[1] = this.edit.skills[1]
      this.user_ops[this.edit.id][this.edit.type].skills[2] = this.edit.skills[2]

      this.user_ops[this.edit.id].costs = this.updateCost(JSON.parse(JSON.stringify(this.user_ops[this.edit.id])))
      LS.user_ops = JSON.stringify(this.user_ops)
      this.edit.show = false
    },
    updateCost(op) {
      const char = this.data_characters[op.id]
      let res = {}
      // 升级&精英化 龙门币4001
      for (let i = op.cur.evolve; i < op.aim.evolve; i++) {
        // 升满级
        if (res[4001]) res[4001] += this.data_common.upgradeCost[i][this.data_common.maxLevel[op.rarity][i]] - this.data_common.upgradeCost[i][op.cur.level]
        else res[4001] = this.data_common.upgradeCost[i][this.data_common.maxLevel[op.rarity][i]] - this.data_common.upgradeCost[i][op.cur.level]

        if (res[0]) res[0] += this.data_common.characterExp[i][this.data_common.maxLevel[op.rarity][i]] - this.data_common.characterExp[i][op.cur.level]
        else res[0] = this.data_common.characterExp[i][this.data_common.maxLevel[op.rarity][i]] - this.data_common.characterExp[i][op.cur.level]

        // 精英化
        for (let j of char.evolveCost[i]) {
          if (res[j.id]) res[j.id] += j.count
          else res[j.id] = j.count
        }
        if (res[4001]) res[4001] += this.data_common.evolveCost[op.rarity][i]
        else res[4001] = this.data_common.evolveCost[op.rarity][i]

        // 改属性
        op.cur.evolve += 1
        op.cur.level = 1
      }
      if (res[4001]) res[4001] += this.data_common.upgradeCost[op.aim.evolve][op.aim.level] - this.data_common.upgradeCost[op.aim.evolve][op.cur.level]
      else res[4001] = this.data_common.upgradeCost[op.aim.evolve][op.aim.level] - this.data_common.upgradeCost[op.aim.evolve][op.cur.level]

      if (res[0]) res[0] += this.data_common.characterExp[op.aim.evolve][op.aim.level] - this.data_common.characterExp[op.aim.evolve][op.cur.level]
      else res[0] = this.data_common.characterExp[op.aim.evolve][op.aim.level] - this.data_common.characterExp[op.aim.evolve][op.cur.level]

      // 通用技能升级
      for (let i = op.cur.allSkills - 1; i < op.aim.allSkills - 1; i++) {
        for (let j of char.allSkillLvlup[i]) {
          if (res[j.id]) res[j.id] += j.count
          else res[j.id] = j.count
        }
      }

      // 专精
      for (let s = 0; s < 3; s++) {
        for (let i = op.cur.skills[s]; i < op.aim.skills[s]; i++) {
          for (let j of char.skills[s].levelUpCost[i]) {
            if (res[j.id]) res[j.id] += j.count
            else res[j.id] = j.count
          }
        }
      }

      return res
    }
  }
})
</script>
