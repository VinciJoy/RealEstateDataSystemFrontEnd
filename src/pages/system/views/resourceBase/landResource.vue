<template>
  <div>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="sub-gray-line">
          <div style="height: 100px; width: 125px; display: inline-block">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/home-icon.png"/>
          </div>
          <div class="mt-20" style="width: 500px;display: inline-block">
            <div style="display: inline-block">
              <span class="tag-title can-not-select">土地 / 资产信息</span>
              <br>
              <span class="tag-desc can-not-select">LAND / ASSETS</span>
            </div>
            <div style="display: inline-block;width: 40%;margin-left: 20px">
              <a-input-search></a-input-search>
            </div>
          </div>
          <div style="display: inline-block; float: right" class="mt-40">
            <a-button style="float: right" :disabled="!userInfo.ID" @click="goToAdd" type="primary">发布土地信息</a-button>
          </div>
        </a-row>

        <a-row class="mt-20 sub-gray-line">

          <a-col class="mt-10">
            地区选择：
            <span style="cursor: pointer" :class="!selectedArea ? 'blue' : 'clickable-txt'" @click="selectedArea = null">
              全部
            </span>
            <span style="cursor: pointer" :class="selectedArea === area ? 'blue' : 'clickable-txt'" @click="selectedArea = area" v-for="area in areaOptions" :key="area">
              {{ area }}
            </span>
          </a-col>

          <a-col class="mt-10">
            省份：
            <span style="cursor: pointer" :class="!selectedProvince ? 'blue' : 'clickable-txt'" @click="selectedProvince = null">
              全部
            </span>
            <span style="cursor: pointer" :class="selectedProvince === province ? 'blue' : 'clickable-txt'" @click="selectedProvince = province" v-for="province in provinceOptions[selectedArea]" :key="province">
              {{ province }}
            </span>
          </a-col>

          <a-col class="mt-10">
            用地性质：
            <span style="cursor: pointer" :class="itemType === null ? 'blue' : 'clickable-txt'" @click="changeItemType(null)">
              全部
            </span>
            <span style="cursor: pointer" :class="itemType === item ? 'blue' : 'clickable-txt'" @click="changeItemType(item)" v-for="item in ITEM_TYPES" :key="item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            项目形态：
            <span style="cursor: pointer" :class="itemFormation === null ? 'blue' : 'clickable-txt'" @click="changeItemFormation(null)">
              全部
            </span>
            <span style="cursor: pointer" :class="itemFormation === item ? 'blue' : 'clickable-txt'" @click="changeItemFormation(item)" v-for="item in itemFormations" :key="item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            交易方式：
            <span style="cursor: pointer" :class="exchangeType === null ? 'blue' : 'clickable-txt'" @click="changeExchangeType(null)">
              全部
            </span>
            <span style="cursor: pointer" :class="exchangeType === exchange ? 'blue' : 'clickable-txt'" @click="changeExchangeType(exchange)" v-for="exchange in EXCHANGE_TYPES" :key="exchange">
              {{ exchange }}
            </span>
          </a-col>

          <a-row class="mt-10">
              排序：
            <span class="clickable-txt" @click="orderByUpdatedTime = 'ASC'" v-show="orderByUpdatedTime === ''">更新时间 </span>
            <span style="cursor: pointer" class="blue" @click="orderByUpdatedTime = 'DESC'" v-show="orderByUpdatedTime === 'ASC'">更新时间↓</span>
            <span style="cursor: pointer" class="blue" @click="orderByUpdatedTime = ''" v-show="orderByUpdatedTime === 'DESC'">更新时间↑</span>

            <span class="clickable-txt" @click="orderBySpace = 'ASC'" v-show="orderBySpace === ''">地上建筑面积 </span>
            <span style="cursor: pointer" class="blue" @click="orderBySpace = 'DESC'" v-show="orderBySpace === 'ASC'">地上建筑面积↓</span>
            <span style="cursor: pointer" class="blue" @click="orderBySpace = ''" v-show="orderBySpace === 'DESC'">地上建筑面积↑</span>

            <span class="clickable-txt" @click="orderByPrice = 'ASC'" v-show="orderByPrice === ''">交易对价 </span>
            <span style="cursor: pointer" class="blue" @click="orderByPrice = 'DESC'" v-show="orderByPrice === 'ASC'">交易对价↓</span>
            <span style="cursor: pointer" class="blue" @click="orderByPrice = ''" v-show="orderByPrice === 'DESC'">交易对价↑</span>

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
            抱歉，该筛选条件下没有土地 / 资产信息！
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
                  <img v-for="i in 2" :key="'full_star' + i" src="../../../../../static/imgs/fullstar.png"/>
                  <template v-if="finalScore(item) <= 60">
                    <img src="../../../../../static/imgs/unstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                  </template>
                  <template v-if="finalScore(item) > 60 && finalScore(item) < 66">
                    <img src="../../../../../static/imgs/halfstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                  </template>
                  <template v-else-if="finalScore(item) >= 66 && finalScore(item) < 76">
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                  </template>
                  <template v-else-if="finalScore(item) >= 76 && finalScore(item) < 86">
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/halfstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                  </template>

                  <template v-else-if="finalScore(item) >= 86 && finalScore(item) < 96">
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/unstar.png"/>
                  </template>

                  <template v-else-if="finalScore(item) >= 96 && finalScore(item) < 101">
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/halfstar.png"/>
                  </template>

                  <template v-else-if="finalScore(item) >= 101">
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/fullstar.png"/>
                    <img src="../../../../../static/imgs/fullstar.png"/>
                  </template>

                </a-col>
                <a-col>用地性质：{{ item.itemType }}</a-col>
                <a-col>
                  土地价格：{{ item.landPrice.toFixed(2) + (['在建工程','现房'].includes(item.itemFormation) ? ' 元/㎡' : ' 万元/亩') }}
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
import options from '@/utils/cities'
import { ITEM_TYPES, EXCHANGE_TYPES } from '@/utils/constants'
import api from '@system/api/landResource'
import {mapGetters} from 'vuex'
import {AUDIT_STATUS} from "../../../../utils/constants";

const itemFormations = [
  '土地使用权',
  '在建工程',
  '现房',
  '一二级联动'
]

const areaOptions = [
  '华东区域',
  '华北区域',
  '华中区域',
  '东北区域',
  '西北区域',
  '华南区域',
  '西南区域',
  '港澳台海外'
]

const provinceOptions = {
  '华东区域': [
    '上海市',
    '江苏省',
    '浙江省',
    '福建省',
    '安徽省',
    '江西省',
    '山东省'
  ],
  '华北区域': [
    '北京市',
    '天津市',
    '河北省',
    '陕西省',
    '内蒙古自治区'
  ],
  '华中区域': [
    '湖北省',
    '湖南省',
    '河南省'
  ],
  '东北区域': [
    '辽宁省',
    '吉林省',
    '黑龙江省'
  ],
  '西北区域': [
    '陕西省',
    '甘肃省',
    '青海省',
    '宁夏自治区',
    '新疆自治区'
  ],
  '华南区域': [
    '广东省',
    '广西自治区',
    '海南省'
  ],
  '西南区域': [
    '重庆市',
    '四川省',
    '贵州省',
    '云南省',
    '西藏自治区'
  ],
  '港澳台海外': [
    '香港特别行政区',
    '澳门特别行政区',
    '海外'
  ]
}

export default {
  name: 'landResource',
  data () {
    return {
      loading: false,
      selectedProvince: null,
      selectedArea: null,
      options: options,
      ITEM_TYPES: ITEM_TYPES,
      EXCHANGE_TYPES: EXCHANGE_TYPES,
      pageSize: 10,
      pageIndex: 1,
      count: 0,
      itemType: null,
      itemFormation: null,
      provinceOptions: provinceOptions,
      itemFormations: itemFormations,
      areaOptions: areaOptions,
      exchangeType: null,
      itemList: [],
      orderByRecommendation: '',
      orderByPrice: '',
      orderByUpdatedTime: '',
      orderBySpace: '',
      picBaseURL: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    anyChanged () {
      let ret = ''
      const changedItem = [
        'pageIndex',
        'orderBySpace',
        'itemType',
        'orderByRecommendation',
        'orderByUpdatedTime',
        'exchangeType',
        'selectedProvince',
        'itemFormation'
      ]
      for (let item of changedItem) {
        ret += this[item]
      }
      return ret
    }
  },
  mounted () {
    this.picBaseURL = process.env.API_ROOT + '/system/pics/temp/'
    this.init()
  },
  watch: {
    'anyChanged' () {
      this.init()
    }
  },
  methods: {
    init () {
      this.loading = true
      api.getLandResources({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        owner: false,
        itemType: this.itemType,
        exchangeType: this.exchangeType,
        itemFormation: this.itemFormation,
        visible: true,
        auditStatus: AUDIT_STATUS.PASSED,
        orderByRecommendation: this.orderByRecommendation,
        orderByUpdatedTime: this.orderByUpdatedTime,
        orderBySpace: this.orderBySpace,
        province: this.selectedProvince
      }).then(res => {
        this.count = res.data.data.count
        this.itemList = res.data.data.landResources
        this.loading = false
      })
    },
    finalScore (item) {
      console.log('recommendation: ', item.recommendation)
      console.log('score: ', item.score)
      return (item.score - '') + (item.recommendation - '')
    },
    goToDetail (id) {
      this.$router.push({name: 'landResourceDetail', params: { id }})
    },
    goToAdd () {
      this.$router.push({name: 'publishLandResource'})
    },
    changeItemType (item) {
      this.itemType = item
    },
    changeExchangeType (item) {
      this.exchangeType = item
    },
    changeItemFormation (item) {
      this.itemFormation = item
    }
  }
}
</script>

<style scoped>
.selected{
    color: #40a9ff;
}
</style>
