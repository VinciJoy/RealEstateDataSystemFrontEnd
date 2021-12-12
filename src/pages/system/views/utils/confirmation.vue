<template>
  <div class="board">

    <a-row>
      <a-col :span="16" class="gray-font">
        <span>确权-开盘 </span><span class="blue-number">{{ partDays(0, 0) + partDays(0, 1) + partDays(1, 0) + partDays(1, 1) }}</span> <span>天</span>
      </a-col>
      <div class="gray-font" style="float: right">
        <span>确权-交付总工期 </span><span class="blue-number">{{ partDays(0, 0) + partDays(0, 1) + partDays(1, 0) + partDays(1, 1) }}</span> <span>天</span><span style="margin-left: 40px">{{ ((partDays(0, 0) + partDays(0, 1) + partDays(1, 0) + partDays(1, 1)) / 30).toFixed(1) }} 个月</span>
      </div>
    </a-row>

    <a-checkbox-group v-model="selectedItems" style="width: 100%">
    <a-row :gutter="20" class="gray-board">
      <a-col :span="1" class="gray-font">
        <span style="font-size: 45px">
          1<br>
        </span>
        <span class="blue-number" style="font-size: 20px">
          设<br>
          计<br>
          阶<br>
          段
        </span>
      </a-col>
      <a-col :span="23">
        <div class="title-underline normal-font" style="bottom: 10px; width: 100%;">
          <div >
            <span>确权时间</span>
            <a-date-picker v-model="confirmationTime" format="YYYY/MM/DD" placeholder="请选择日期"/>
            <div style="float: right; margin-right: 15px">
              <span>完成时间</span>
              <span>{{ part1EndTime }}</span>
            </div>
          </div>
        </div>
        <div style="display: table; width: 100%; margin-top: 20px">
          <a-col class="white-board" style="width: 47%; display: table-cell;">
            <div class="title-underline normal-font" style="text-align: center">
              <span class="blue">方案设计单位招标</span>
              <div style="float: right;">
                <span class="gray-number">{{ partDays(0, 0) }}</span>
                <span>天</span>
              </div>
            </div>
            <div class="board-info normal-font" v-for="item of itemsList[0][0]" :key="item">
              <a-checkbox :value="item"><span class="board-info normal-font">{{ item }}</span></a-checkbox>
              <div style="float: right;">
                <a-input style="width: 100px" type="number" v-model="itemsDay[item]"/> 天
              </div>
            </div>
          </a-col>
          <div class="gray-font" style="width: 5%; display: table-cell; vertical-align: middle; font-size: 50px; text-align: center;">
            <a-icon type="arrow-right"/>
          </div>
          <a-col class="white-board" style="width: 47%; display: table-cell;">
            <div class="title-underline normal-font" style="text-align: center">
              <span class="blue">提交方案文本</span>
              <div style="float: right;">
                <span class="gray-number">{{ partDays(0, 1) }}</span>
                <span>天</span>
              </div>
            </div>
            <div class="board-info normal-font" v-for="item of itemsList[0][1]" :key="item">
              <a-checkbox :value="item"><span class="board-info normal-font">{{ item }}</span></a-checkbox>
              <div style="float: right;">
                <a-input style="width: 100px" type="number" v-model="itemsDay[item]"/> 天
              </div>
            </div>
          </a-col>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="20" class="gray-board">
      <a-col :span="1" class="gray-font">
        <span style="font-size: 45px">
          2<br>
        </span>
        <span class="blue-number" style="font-size: 20px">
          报<br>
          规<br>
          报<br>
          建<br>
          阶<br>
          段
        </span>
      </a-col>
      <a-col :span="23">
        <div class="title-underline normal-font" style="bottom: 10px; width: 100%;">
          <div >
            <span>开始时间</span>
            <span>{{ part1EndTime }}</span>
            <div style="float: right; margin-right: 15px">
              <span>完成时间</span>
              <span>{{ part2EndTime }}</span>
            </div>
          </div>
        </div>
        <div style="display: table; width: 100%; margin-top: 20px">
          <a-col class="white-board" style="width: 47%; display: table-cell;">
            <div class="title-underline normal-font" style="text-align: center">
              <span class="blue">方案审查通过</span>
              <div style="float: right;">
                <span class="gray-number">{{ partDays(1, 0) }}</span>
                <span>天</span>
              </div>
            </div>
            <div class="board-info normal-font" v-for="item of itemsList[1][0]" :key="item">
              <a-checkbox :value="item"><span class="board-info normal-font">{{ item }}</span></a-checkbox>
              <div style="float: right;">
                <a-input style="width: 100px" type="number" v-model="itemsDay[item]"/> 天
              </div>
            </div>
          </a-col>
          <div class="gray-font" style="width: 5%; display: table-cell; vertical-align: middle; font-size: 50px; text-align: center;">
            <a-icon type="arrow-right"/>
          </div>
          <a-col class="white-board" style="width: 47%; display: table-cell;">
            <div class="title-underline normal-font" style="text-align: center">
              <span class="blue">施工许可证办理</span>
              <div style="float: right;">
                <span class="gray-number">{{ partDays(1, 1) }}</span>
                <span>天</span>
              </div>
            </div>
            <div class="board-info normal-font" v-for="item of itemsList[1][1]" :key="item">
              <a-checkbox :value="item"><span class="board-info normal-font">{{ item }}</span></a-checkbox>
              <div style="float: right;">
                <a-input style="width: 100px" type="number" v-model="itemsDay[item]"/> 天
              </div>
            </div>
          </a-col>
        </div>
      </a-col>
    </a-row>
    </a-checkbox-group>
  </div>
</template>

<script>
import moment from 'moment'
import {getUserInfo} from '../../api/user'

export default {
  data () {
    return {
      itemsList: [
        [
          // 1
          [
            // 1.1
            '方案设计单位招标（有战略）',
            '方案设计单位招标（无战略）'
          ],
          [
            // 1.2
            '标准化方案总图及指标移交',
            '新设计方案总图及指标移交',
            '综合商业地块'
          ]
        ],
        [
          // 2
          [
            // 2.1
            '取得初步意见',
            '取得规划方案批复',
            '工程规划许可证'
          ],
          [
            // 2.2
            '基坑施工许可证',
            '精装施工许可证',
            '工程施工许可证'
          ]
        ]
      ],
      confirmationTime: null,
      selectedItems: [],
      itemsDay: {}
    }
  },
  computed: {
    'part1EndTime' () {
      if (!this.confirmationTime) {
        return 'YYYY/MM/DD'
      }
      return moment(this.confirmationTime).add(this.partDays(0, 0) + this.partDays(0, 1), 'days').format('YYYY/MM/DD')
    },
    'part2EndTime' () {
      if (!this.confirmationTime) {
        return 'YYYY/MM/DD'
      }
      return moment(this.confirmationTime).add(this.partDays(0, 0) + this.partDays(0, 1) + this.partDays(1, 0) + this.partDays(1, 1), 'days').format('YYYY/MM/DD')
    }
  },
  mounted () {
    this.init()
  },
  filters: {},
  methods: {
    init () {
      getUserInfo()
    },
    partDays (part, subPart) {
      let sum = 0
      this.itemsList[part][subPart].forEach((data) => {
        if (this.selectedItems.includes(data)) {
          let temp = 0
          if (typeof (this.itemsDay[data]) !== 'undefined') temp = parseInt(this.itemsDay[data])
          sum += temp
        }
      })
      return sum
    }
  }
}
</script>

<style scoped>
</style>
