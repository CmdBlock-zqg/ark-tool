<template>
  <div style="padding: 16px;">
    <div class="card">
      <div class="text-h5 text--primary">
        养成规划
      </div>
      <div style="margin-top: 8px; height: 100px;">
        <div style="float: left">
          点击右侧按钮，可添加一个<b>养成目标</b><br>
          点击卡片编辑，可修改其名称和干员情况<br>
          “当前练度”为特殊目标不可删除<br>
          未声明的干员默认为初始练度<br>
          拖拽可改变顺序
        </div>
        <v-btn
          color="primary"
          elevation="2"
          style="float: right;"
          @click="addNode"
        ><v-icon>mdi-plus</v-icon>添加目标</v-btn>
      </div>
    </div>

    <div class="drag">
       <v-card
        class="drag-item"
        v-ripple
        @click="showNode(0)"
      >
        <v-card-title>当前练度</v-card-title>
        <v-card-text>干员数：{{ Object.keys(plan[0].op).length }}</v-card-text>
      </v-card>

      <draggable
        v-model="plan"
        @start="drag.drag = true"
        @end="drag.drag = false"
        @update="save"
        v-bind="drag.options"
      >
        <transition-group type="transition" :name="!drag.drag ? 'flip-list' : null">
          <v-card
            v-for="(v, i) in plan"
            :key="i"
            v-show="i !== 0"
            class="drag-item"
            v-ripple
            @click="showNode(i)"
          >
            <v-card-title>{{ v.name }}</v-card-title>
            <v-card-text>干员数：{{ Object.keys(v.op).length }}</v-card-text>
          </v-card>
        </transition-group>
      </draggable>
    </div>

    <!--节点详情-->
    <v-dialog
      v-model="show"
      fullscreen
      persistent
      no-click-animation
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ node.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item link @click="renameNode">
                <v-list-item-title>重命名</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="deleteNode">
                <v-list-item-title>删除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>

        <div style="padding: 16px;">
          <v-dialog
            v-model="add.show"
            width="400"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                block
                color="primary"
                outlined
                v-bind="attrs"
                v-on="on"
              ><v-icon>mdi-plus</v-icon>添加干员</v-btn>
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
                  :items="add.opList"
                  v-model="add.input"
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

          <div class="d-flex justify-space-around flex-wrap">
            <v-card
              class="card"
              style="width: 320px; height: 185px;"
              elevation="7"
              v-for="(v, k) in node.op"
              :key="k"
            >
              <div style="height: 80px;">
                <img style="float: left;" :src="`/assets/avatars/${k}.png`" height="80" width="80">
                <div style="height: 80px; float: left; padding: 16px;">
                  <span style="font-size: 20px;">{{ v.name }}</span>
                  <br>
                  <img :src="`/assets/common/rarity_${v.rarity}.png`">
                </div>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      style="float: right; margin-top: 16px;"

                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-menu</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item link @click="moveOp(k)">
                      <v-list-item-title>移动至另一目标</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="deleteOp(k)">
                      <v-list-item-title>删除</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <v-divider></v-divider>
              <div style="height: 80px; padding: 8px;" v-ripple @click="showOp(k)">
                <div style="height: 80px; float: left; padding-top: 16px;">
                  <img style="float: left;" height="40" :src="`/assets/common/elite_${v.phase}.png`">
                  <div style="height: 40px; line-height: 50px; float: left; font-size: 24px;">
                    {{ v.level }}
                  </div>
                </div>
                <div style="position: relative; height: 80px; float: left; margin-left: 8px; padding-top: 12px;" v-for="(s, i) in data.character[k].skills" :key="s.skillId">
                  <img :src="`/assets/skills/skill_icon_${s.skillId}.png`" height="56" width="56">
                  <img v-if="v.skill[i]" class="rank-pic" :src="`/assets/common/evolve_${v.skill[i]}.png`" height="24" width="24">
                  <div class="rank" v-else>
                    {{ v.allSkill + v.skill[i] }}
                  </div>
                </div>
              </div>
            </v-card>
            <i style="margin: 0 8px; width: 320px;"></i>
            <i style="margin: 0 8px; width: 320px;"></i>
            <i style="margin: 0 8px; width: 320px;"></i>
            <i style="margin: 0 8px; width: 320px;"></i>
          </div>
          
        </div>
      </v-card>
    </v-dialog>

    <!--编辑干员练度-->
    <v-dialog
      v-model="edit.show"
      width="400"
    >
      <v-card>
        <v-card-title class="text-h6 lighten-2">
          修改{{ edit.op.name }}练度
        </v-card-title>
        <v-card-text>
          <number-selecter
            v-model="edit.op.phase"
            title="精英化等级"
            :min="0"
            :max="edit.op.rarity > 3 ? 2 : (edit.op.rarity > 2 ? 1 : 0)"
          ></number-selecter>
          <number-selecter
            plus
            v-model="edit.op.level"
            title="等级"
            :min="1"
            :max="data.common.maxLevel[edit.op.rarity][edit.op.phase]"
          ></number-selecter>
          <number-selecter
            v-show="edit.op.rarity > 2"
            v-model="edit.op.allSkill"
            title="通用技能等级"
            :min="1"
            :max="edit.op.phase > 0 ? 7 : 4"
          ></number-selecter>
          <number-selecter
            v-show="edit.op.rarity > 3 && edit.op.allSkill === 7 && edit.op.phase === 2"
            v-model="edit.op.skill[0]"
            :title="`一技能 ${ emptify(data.character[edit.op.id].skills[0]).skillName } 专精等级`"
            :min="0"
            :max="edit.op.allSkill === 7 && edit.op.phase === 2 ? 3 : 0"
          ></number-selecter>
          <number-selecter
            v-show="edit.op.rarity > 3 && edit.op.allSkill === 7 && edit.op.phase === 2"
            v-model="edit.op.skill[1]"
            :title="`二技能 ${ emptify(data.character[edit.op.id].skills[1]).skillName } 专精等级`"
            :min="0"
            :max="edit.op.allSkill === 7 && edit.op.phase === 2 ? 3 : 0"
          ></number-selecter>
          <number-selecter
            v-show="edit.op.rarity > 5 && edit.op.allSkill === 7 && edit.op.phase === 2"
            v-model="edit.op.skill[2]"
            :title="`三技能 ${ emptify(data.character[edit.op.id].skills[2]).skillName } 专精等级`"
            :min="0"
            :max="edit.op.allSkill === 7 && edit.op.phase === 2 ? 3 : 0"
          ></number-selecter>
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
            @click="editOp"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--移动干员-->
    <v-dialog
      v-model="move.show"
      width="400"
    >
      <v-card>
        <v-card-title>
          移动干员 {{ emptify(node.op[move.id]).name }}
        </v-card-title>
        <v-card-text>
          <p>注意：若移动目标含有相同干员，将会进行覆盖</p>
          <v-select
            :items="selectNodes"
            label="移动至"
            outlined
            v-model="move.to"
            item-text="name"
            item-value="key"
          ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="move.show = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="moveOp(false)"
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

  .rank-pic {
    position: absolute;
    z-index: 1;
    left: 40px;
    top: 2px;
  }

  .drag {
    padding: 8px;
  }

  .drag-item {
    width: 300px;
    margin: 8px;
    cursor: pointer;
    float: left;
  }

  .drag-ghost {
    opacity: 0.5;
  }
</style>

<script>
const LS = window.localStorage

import draggable from 'vuedraggable'
import NumberSelecter from '../components/NumberSelecter.vue'

import data from '../data.js'
import core from '../core'

export default {
  components: {
    NumberSelecter,
    draggable
  },
  data() {
    return {
      plan: JSON.parse(LS.plan),
      data,

      show: false,
      nodeId: 0,

      drag: {
        drag: false,
        options: {
          animation: 200,
          ghostClass: 'drag-ghost'
        }
      },

      add: {
        show: false,
        input: '',
        opList: Object.keys(data.search),
      },
      edit: {
        show: false,
        id: '',
        op: {
          id: 'char_285_medic2',
          name: '',
          rarity: 0,
          level: 0,
          phase: 0,
          allSkill: 0,
          skill: [0, 0, 0],
          cost: { 4001: 0, 0: 0 }
        }
      },
      move: {
        show: false,
        id: '',
        to: 0
      },

      emptify: (v) => v ? v : {}
    }
  },
  computed: {
    node() {
      return this.plan[this.nodeId]
    },
    selectNodes() {
      return this.plan.map((v, k) => {
         return { name: v.name, key: k }
      })
    },
  },
  methods: {
    save() { // 保存
      LS.plan = JSON.stringify(this.plan)
    },
    showNode(id) { // 展示节点详情
      this.nodeId = id
      this.show = true
    },
    renameNode() {
      if (this.nodeId === 0) {
        window.mdui.alert('无法重命名“当前练度”')
        return
      }
      let onConfirm = (v) => {
        if (v === '') {
          window.mdui.alert('请输入新名称')
          return
        }
        this.node.name = v
        this.save()
      }
      window.mdui.prompt(
        '新名字',
        `重命名${this.node.name}`,
        onConfirm
      )
    },
    addNode() {
      let onConfirm = (v) => {
        if (v === '') {
          window.mdui.alert('请输入新目标名称')
          return
        }
        this.plan.splice(this.plan.length, 0, { name: v, op: {} })
        this.save()
        this.show = false
      }
      window.mdui.prompt(
        '新目标名称',
        `新建目标`,
        onConfirm
      )
    },
    deleteNode() {
      if (this.nodeId === 0) {
        window.mdui.alert('无法删除“当前练度”')
        return
      }
      let onConfirm = () => {
        this.show = false
        let t = this.nodeId
        this.nodeId = 0
        this.plan.splice(t, 1)
        this.save()
      }
      window.mdui.confirm('操作不可恢复', '确认删除目标？', onConfirm)
    },
    addOp() {
      this.add.show = false
      if (!this.add.input) return
      let opid = data.search[this.add.input]
      if (this.node.op[opid]) {
        window.mdui.alert('干员已存在')
        return
      }
      if (this.plan[0].op[opid]) {
        this.node.op[opid] = JSON.parse(JSON.stringify(this.plan[0].op[opid]))
      } else {
        let char = data.character[opid]
        this.node.op[opid] = {
          id: opid,
          name: char.name,
          rarity: char.rarity,
          level: 1,
          phase: 0,
          allSkill: 1,
          skill: [0, 0, 0],
          cost: { 4001: 0, 0: 0 }
        }
      }
      this.save()
    },
    deleteOp(id) {
      let onConfirm = () => {
        this.$delete(this.node.op, id)
        this.save()
      }
      window.mdui.confirm('操作不可恢复', '确认删除干员？', onConfirm)
    },
    moveOp(id) {
      if (id) {
        this.move.id = id
        this.move.to = 0
        this.move.show = true
      } else {
        if (this.plan[this.move.to].op[this.move.id]) {
          this.plan[this.move.to].op[this.move.id] = this.node.op[this.move.id]
        } else {
          this.$set(this.plan[this.move.to].op, this.move.id, this.node.op[this.move.id])
        }
        this.$delete(this.node.op, this.move.id)
        this.save()
        this.move.show = false
      }
    },
    showOp(id) {
      this.edit.id = id
      this.edit.op = JSON.parse(JSON.stringify(this.node.op[id]))
      this.edit.show = true
    },
    editOp() {
      // 比较this.edit.op 和 this.plan[0].op[this.edit.id]
      let now = this.plan[0].op[this.edit.id]
      let next = this.edit.op
      if (
        now && this.nodeId !== 0 && (
          next.phase < now.phase ||
          (next.phase === now.phase && next.level < now.level) ||
          next.allSkill < now.allSkill ||
          next.skill[0] < now.skill[0] ||
          next.skill[1] < now.skill[1] ||
          next.skill[2] < now.skill[2]
        )
      ) {
        window.mdui.alert('修改失败！练度不得低于当前练度')
        return
      }
      this.node.op[this.edit.id] = this.edit.op
      this.node.op[this.edit.id].cost = core.op.getCost(this.edit.op)
      this.save()
      this.edit.show = false
    }
  }
}
</script>
