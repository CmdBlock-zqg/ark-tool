import data from '../data.js'

/*
计算从初始等级到给出等级的消耗
op: {
  id,
  rarity,
  level,
  phase,
  allSkill,
  skill[]
}
*/
let getCost = (op) => {
  const char = data.character[op.id]
  let res = { 4001: 0, 0: 0 }
  // 升到目标精英等级的1级
  for (let i = 0; i < op.phase; i++) {
    // 升满级
    res[4001] += data.common.upgradeCost[i][data.common.maxLevel[op.rarity][i]]
    res[0] += data.common.characterExp[i][data.common.maxLevel[op.rarity][i]]

    // 精英化
    for (let j of char.evolveCost[i]) {
      res[j.id] = res[j.id] ? res[j.id] + j.count : j.count
    }
    res[4001] += data.common.evolveCost[op.rarity][i]
  }
  // 升到目标等级
  res[4001] += data.common.upgradeCost[op.phase][op.level]
  res[0] += data.common.characterExp[op.phase][op.level]
  // 升级技能通用等级
  for (let i = 0; i < op.allSkill - 1; i++) {
    for (let j of char.allSkillLvlup[i]) {
      res[j.id] = res[j.id] ? res[j.id] + j.count : j.count
    }
  }
  // 专精
  for (let s = 0; s < 3; s++) {
    for (let i = 0; i < op.skill[s]; i++) {
      for (let j of char.skills[s].levelUpCost[i]) {
        res[j.id] = res[j.id] ? res[j.id] + j.count : j.count
      }
    }
  }
  return res
}

/*
计算c1 - c2 请保证c1中元素一定比c2多
*/
let getDif = (c1, c2) => {
  let res = {}
  for (let i of Object.keys(c1)) {
    res[i] = c2[i] ? c1[i] - c2[i] : c1[i]
  }
  return res
}

export default {
  op: {
    getCost
  },
  mtl: {
    getDif
  }
}