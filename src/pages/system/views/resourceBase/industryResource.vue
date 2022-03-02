<template>
  <div>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="sub-gray-line">
          <div style="height: 100px; width: 125px; display: inline-block">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/contract-icon.png"/>
          </div>
          <div class="mt-20" style="width: 500px;display: inline-block">
            <div style="display: inline-block">
              <span class="tag-title can-not-select">产业资源信息</span>
              <br>
              <span class="tag-desc can-not-select">INDUSTRY PROJECT</span>
            </div>
            <div style="display: inline-block;width: 40%;margin-left: 20px">
              <a-input-search></a-input-search>
            </div>
          </div>
          <div style="display: inline-block; float: right" class="mt-40">
            <a-button style="float: right" :disabled="!userInfo.ID" @click="goToAdd" type="primary">发布产业信息</a-button>
          </div>
        </a-row>

        <a-row class="mt-20 sub-gray-line">

          <a-col class="mt-10">
            选址要求：
            <span style="cursor: pointer" :class="!selectedAreaList.length ? 'blue' : 'clickable-txt'" @click="changeArea(null)" :key="'selectedAreaList' + 0">
              不选择
            </span>
            <span style="cursor: pointer" :class="selectedAreaList.includes(item) ? 'blue' : 'clickable-txt'" @click="changeArea(item)" v-for="item in areaOptions" :key="'selectedAreaList' + item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            产业分类：
            <span style="cursor: pointer" :class="!selectedIndustryTypeList.length ? 'blue' : 'clickable-txt'" @click="changeIndustryClass(null)" :key="'selectedIndustryTypeList' + 0">
              不选择
            </span>
            <span style="cursor: pointer" :class="selectedIndustryTypeList.includes(item) ? 'blue' : 'clickable-txt'" @click="changeIndustryClass(item)" v-for="item in industryClassOptions" :key="'selectedIndustryTypeList' + item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            合作形式：
            <span style="cursor: pointer" :class="!selectedCooperationFormList.length ? 'blue' : 'clickable-txt'" @click="changeCooperationForm(null)" :key="'selectedCooperationFormList' + 0">
              不选择
            </span>
            <span style="cursor: pointer" :class="selectedCooperationFormList.includes(item) ? 'blue' : 'clickable-txt'" @click="changeCooperationForm(item)" v-for="item in cooperationFormOptions" :key="'selectedCooperationFormList' + item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            项目案例：
            <span style="cursor: pointer" :class="!selectedOperationPlanList.length ? 'blue' : 'clickable-txt'" @click="changeOperationPlan(null)">
              不选择
            </span>
            <span style="cursor: pointer" :class="selectedOperationPlanList.includes('有经营案例') ? 'blue' : 'clickable-txt'" @click="changeOperationPlan('有经营案例')">
              有经营案例
            </span>
            <span style="cursor: pointer" :class="selectedOperationPlanList.includes('有规划方案') ? 'blue' : 'clickable-txt'" @click="changeOperationPlan('有规划方案')">
              有规划方案
            </span>
          </a-col>
          <a-row class="mt-10">
              排序：
            <span class="clickable-txt" @click="orderByUpdatedTime = 'ASC'" v-show="orderByUpdatedTime === ''">更新时间 </span>
            <span style="cursor: pointer" class="blue" @click="orderByUpdatedTime = 'DESC'" v-show="orderByUpdatedTime === 'ASC'">更新时间↓</span>
            <span style="cursor: pointer" class="blue" @click="orderByUpdatedTime = ''" v-show="orderByUpdatedTime === 'DESC'">更新时间↑</span>

<!--            <span class="clickable-txt" @click="orderBySpace = 'ASC'" v-show="orderBySpace === ''">地上占地面积 </span>-->
<!--            <span style="cursor: pointer" class="blue" @click="orderBySpace = 'DESC'" v-show="orderBySpace === 'ASC'">地上占地面积↓</span>-->
<!--            <span style="cursor: pointer" class="blue" @click="orderBySpace = ''" v-show="orderBySpace === 'DESC'">地上占地面积↑</span>-->

<!--            <span class="clickable-txt" @click="orderByPrice = 'ASC'" v-show="orderByPrice === ''">交易对价 </span>-->
<!--            <span style="cursor: pointer" class="blue" @click="orderByPrice = 'DESC'" v-show="orderByPrice === 'ASC'">交易对价↓</span>-->
<!--            <span style="cursor: pointer" class="blue" @click="orderByPrice = ''" v-show="orderByPrice === 'DESC'">交易对价↑</span>-->

            <span class="clickable-txt" @click="orderByRecommendation = 'ASC'" v-show="orderByRecommendation === ''">推荐指数 </span>
            <span style="cursor: pointer" class="blue" @click="orderByRecommendation = 'DESC'" v-show="orderByRecommendation === 'ASC'">推荐指数↓</span>
            <span style="cursor: pointer" class="blue" @click="orderByRecommendation = ''" v-show="orderByRecommendation === 'DESC'">推荐指数↑</span>
        </a-row>
        </a-row>

        <a-row class="mt-40" size="large" style="text-align: center" v-if="loading">
          <a-spin />
        </a-row>

        <a-row class="mt-20" style="text-align: center" v-if="!loading && (!itemList || (itemList.length === 0))">
          <a-icon type="exclamation-circle" style="font-size: 50px"/>
          <p class="mt-10" style="font-size: 25px">
            抱歉，该筛选条件下没有产业资源信息！
          </p>
        </a-row>

        <a-row v-for="item of itemList" :key="item.ID" class="mt-20" :gutter="20" style="height: 200px; cursor: pointer">
          <a-col @click="goToDetail(item.ID)" :span="6" style="height: 100%; max-width: 100%; display: flex; justify-content: center">
            <img v-if="item.coverPicUuid" style="max-width: 100%; max-height: 100%" :src="picBaseURL + item.coverPicUuid"/>
            <img v-else style="width: 100%; height: 100%" src="static/imgs/default-img.jpeg"/>
          </a-col>
          <a-col @click="goToDetail(item.ID)" :span="18" style="height: 100%;">
            <a-col>
              <h2>
                {{ item.title }}
              </h2>
            </a-col>
            <a-row class="can-not-select" :gutter="20" style="width: 100%; position: absolute; bottom: 0">
              <a-col style="font-size: 18px; line-height: 1.8">
                <a-col>
                  推荐指数:
                  <img v-for="i in (Math.floor(item.recommendation / 2))" :key="'full_star' + i" src="../../../../../static/imgs/fullstar.png"/>
                  <img v-if="item.recommendation % 2" src="../../../../../static/imgs/halfstar.png"/>
                  <img v-for="i in (Math.floor((10 - item.recommendation) / 2))" :key="'un_star' + i" src="../../../../../static/imgs/unstar.png"/>
                </a-col>
                <a-col>
                   产业功能：{{ item.functionOrClassList ? item.functionOrClassList : '无' }}
                </a-col>
                <a-col>
                  含 {{ item.caseNum }} 个经营案例，{{ item.planNum }} 个规划方案
                  <div class="info-desc-content" style="display: inline-block; float: right">更新时间：{{ item.updatedAt }} 300k</div>
                </a-col>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row class="mt-20" style="text-align: center">
          <a-pagination :page-size="pageSize" v-model="pageIndex" :total="count" />
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import api from '@system/api/industryResource'
import {mapGetters} from 'vuex'
import utils from '@/utils/utils'
import { AUDIT_STATUS } from '../../../../utils/constants'

const areaOptions = [
  '华北区域',
  '华东区域',
  '华中区域',
  '东北区域',
  '西北区域',
  '华南区域',
  '西南区域',
  '港澳台及海外'
]

const cooperationFormOptions = [
  '投资',
  '品牌导入',
  'IP 资源导入',
  '客户资源导入',
  ' + 运营'
]

const industryClassOptions = [
  '文化',
  '旅游',
  '教育',
  '体育',
  '医养',
  '商业',
  '产业园区',
  '总部经济'
]

export default {
  name: 'industryResource',
  data () {
    return {
      loading: false,
      selectedAreaList: [],
      selectedIndustryTypeList: [],
      selectedCooperationFormList: [],
      selectedOperationPlanList: [],
      industryClassOptions: industryClassOptions,
      cooperationFormOptions: cooperationFormOptions,
      areaOptions: areaOptions,
      pageSize: 10,
      pageIndex: 1,
      count: 0,
      itemList: [],
      orderByRecommendation: '',
      orderByUpdatedTime: '',
      picBaseURL: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.picBaseURL = process.env.API_ROOT + '/system/pics/temp/'
    this.init()
  },
  watch: {
    'pageIndex': function () {
      this.init()
    },
    'orderByUpdatedTime': function () {
      this.init()
    },
    'orderByRecommendation': function () {
      this.init()
    },
    'selectedCooperationFormList': function () {
      this.init()
    },
    'selectedOperationPlanList': function () {
      this.init()
    },
    'selectedIndustryTypeList': function () {
      this.init()
    },
    'selectedAreaList': function () {
      this.init()
    }
  },
  methods: {
    init () {
      this.loading = true
      api.getIndustryResources({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderByUpdatedTime: this.orderByUpdatedTime,
        orderByRecommendation: this.orderByRecommendation,
        selectedAreaList: this.selectedAreaList.join('/'),
        selectedCooperationFormList: this.selectedCooperationFormList.join('/'),
        selectedOperationPlanList: this.selectedOperationPlanList.join('/'),
        selectedIndustryTypeList: this.selectedIndustryTypeList.join('/'),
        owner: false,
        visible: true,
        auditStatus: AUDIT_STATUS.PASSED
      }).then(res => {
        this.count = res.data.data.count
        this.itemList = res.data.data.industryResources
        this.loading = false
      })
    },
    changeArea (item) {
      if (!item) {
        this.selectedAreaList = []
      } else {
        if (item === '全国') {
          this.selectedAreaList = utils.Copy(this.areaOptions)
          this.selectedAreaList.remove('全国')
          return
        }
        if (this.selectedAreaList.includes(item)) {
          this.selectedAreaList.remove(item)
        } else {
          this.selectedAreaList.push(item)
        }
      }
    },
    changeCooperationForm (item) {
      if (!item) {
        this.selectedCooperationFormList = []
      } else {
        if (item === '全部') {
          this.selectedCooperationFormList = utils.Copy(this.cooperationFormOptions)
          this.selectedCooperationFormList.remove('全部')
          return
        }
        if (this.selectedCooperationFormList.includes(item)) {
          this.selectedCooperationFormList.remove(item)
        } else {
          this.selectedCooperationFormList.push(item)
        }
      }
    },
    changeOperationPlan (item) {
      if (!item) {
        this.selectedOperationPlanList = []
      } else {
        if (this.selectedOperationPlanList.includes(item)) {
          this.selectedOperationPlanList.remove(item)
        } else {
          this.selectedOperationPlanList.push(item)
        }
      }
    },
    changeIndustryClass (item) {
      if (!item) {
        this.selectedIndustryTypeList = []
      } else {
        if (item === '全部') {
          this.selectedIndustryTypeList = utils.Copy(this.industryClassOptions)
          this.selectedIndustryTypeList.remove('全部')
          return
        }
        if (this.selectedIndustryTypeList.includes(item)) {
          this.selectedIndustryTypeList.remove(item)
        } else {
          this.selectedIndustryTypeList.push(item)
        }
      }
    },
    goToDetail (id) {
      this.$router.push({name: 'industryResourceDetail', params: { id }})
    },
    goToAdd () {
      this.$router.push({name: 'publishIndustryResource'})
    }
  }
}
</script>

<style scoped>
.selected{
    color: #40a9ff;
}
</style>
