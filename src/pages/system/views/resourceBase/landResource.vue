<template>
  <div>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="sub-gray-line">
          <a-col style="height: 100%" :span="2">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/home-icon.png"/>
          </a-col>
          <a-col :span="15" class="mt-20">
            <div style="display: inline-block">
              <span class="tag-title can-not-select">土地 / 资产信息</span>
              <br>
              <span class="tag-desc can-not-select">LAND / ASSETS</span>
            </div>
            <div style="display: inline-block;width: 40%;margin-left: 20px">
              <a-input-search></a-input-search>
            </div>
          </a-col>
          <a-col :span="7" class="mt-40">
            <a-button style="float: right" :disabled="!userInfo.ID" @click="goToAdd" type="primary">发布土地信息</a-button>
          </a-col>
        </a-row>

        <a-row class="mt-20 sub-gray-line">

          <a-col class="mt-10">
            省：
            <span :class="!selectedProvince.value ? 'selected' : 'clickable-txt'" @click="selectedProvince = {children: []}" :key="0">
              不选择
            </span>
            <span :class="selectedProvince === province ? 'selected' : 'clickable-txt'" @click="selectedProvince = province" v-for="province in options" :key="province.value">
              {{ province.value }}
            </span>
          </a-col>

          <a-col class="mt-10">
            市：
            <span :class="!selectedCity.value ? 'selected' : 'clickable-txt'" @click="selectedCity = {children: []}" :key="0">
              不选择
            </span>
            <span :class="selectedCity === city ? 'selected' : 'clickable-txt'" @click="selectedCity = city" v-for="city in selectedProvince.children" :key="city.value">
              {{ city.value }}
            </span>
          </a-col>

          <a-col class="mt-10">
            区：
            <span :class="!selectedArea.value ? 'selected' : 'clickable-txt'" @click="selectedArea = {children: []}" :key="0">
              不选择
            </span>
            <span :class="selectedArea === area ? 'selected' : 'clickable-txt'" @click="selectedArea = area" v-for="area in selectedCity.children" :key="area.value">
              {{ area.value }}
            </span>
          </a-col>

          <a-col class="mt-10">
            用地性质：
            <span :class="itemType === null ? 'selected' : 'clickable-txt'" @click="changeItemType(null)" :key="0">
              不选择
            </span>
            <span :class="itemType === item ? 'selected' : 'clickable-txt'" @click="changeItemType(item)" v-for="item in ITEM_TYPES" :key="item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            项目形态：
            <span :class="itemFormation === null ? 'selected' : 'clickable-txt'" @click="changeItemFormation(null)" :key="0">
              不选择
            </span>
            <span :class="itemFormation === item ? 'selected' : 'clickable-txt'" @click="changeItemFormation(item)" v-for="item in itemFormations" :key="item">
              {{ item }}
            </span>
          </a-col>

          <a-col class="mt-10">
            交易方式：
            <span :class="exchangeType === null ? 'selected' : 'clickable-txt'" @click="changeExchangeType(null)" :key="0">
              不选择
            </span>
            <span :class="exchangeType === exchange ? 'selected' : 'clickable-txt'" @click="changeExchangeType(exchange)" v-for="exchange in EXCHANGE_TYPES" :key="exchange">
              {{ exchange }}
            </span>
          </a-col>

          <a-row class="mt-10">
              排序：
            <span class="clickable-txt" @click="orderByUpdatedTime = 'ASC'" v-show="orderByUpdatedTime === ''">更新时间 </span>
            <span class="selected" @click="orderByUpdatedTime = 'DESC'" v-show="orderByUpdatedTime === 'ASC'">更新时间↓</span>
            <span class="selected" @click="orderByUpdatedTime = ''" v-show="orderByUpdatedTime === 'DESC'">更新时间↑</span>

            <span class="clickable-txt" @click="orderBySpace = 'ASC'" v-show="orderBySpace === ''">地上建筑面积 </span>
            <span class="selected" @click="orderBySpace = 'DESC'" v-show="orderBySpace === 'ASC'">地上建筑面积↓</span>
            <span class="selected" @click="orderBySpace = ''" v-show="orderBySpace === 'DESC'">地上建筑面积↑</span>

            <span class="clickable-txt" @click="orderByPrice = 'ASC'" v-show="orderByPrice === ''">交易对价 </span>
            <span class="selected" @click="orderByPrice = 'DESC'" v-show="orderByPrice === 'ASC'">交易对价↓</span>
            <span class="selected" @click="orderByPrice = ''" v-show="orderByPrice === 'DESC'">交易对价↑</span>

            <span class="clickable-txt" @click="orderByRecommendation = 'ASC'" v-show="orderByRecommendation === ''">推荐指数 </span>
            <span class="selected" @click="orderByRecommendation = 'DESC'" v-show="orderByRecommendation === 'ASC'">推荐指数↓</span>
            <span class="selected" @click="orderByRecommendation = ''" v-show="orderByRecommendation === 'DESC'">推荐指数↑</span>
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
                  <img v-for="i in (Math.floor(item.recommendation / 2))" :key="'full_star' + i" src="../../../../../static/imgs/fullstar.png"/>
                  <img v-if="item.recommendation % 2" src="../../../../../static/imgs/halfstar.png"/>
                  <img v-for="i in (Math.floor((10 - item.recommendation) / 2))" :key="'un_star' + i" src="../../../../../static/imgs/unstar.png"/>
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

const itemFormations = [
  '土地使用权',
  '在建工程',
  '现房',
  '一二级联动'
]

export default {
  name: 'landResource',
  data () {
    return {
      loading: false,
      selectedProvince: {children: []},
      selectedCity: {children: []},
      selectedArea: {children: []},
      options: options,
      ITEM_TYPES: ITEM_TYPES,
      EXCHANGE_TYPES: EXCHANGE_TYPES,
      pageSize: 10,
      pageIndex: 1,
      count: 0,
      itemType: null,
      itemFormation: null,
      itemFormations: itemFormations,
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
    'orderBySpace': function () {
      this.init()
    },
    'itemType': function () {
      this.init()
    },
    'orderByRecommendation': function () {
      this.init()
    },
    'orderByUpdatedTime': function () {
      this.init()
    },
    'exchangeType': function () {
      this.init()
    },
    'itemFormation': function () {
      this.init()
    },
    'selectedProvince': function () {
      this.init()
    },
    'selectedCity': function () {
      this.init()
    },
    'selectedArea': function () {
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
        orderByRecommendation: this.orderByRecommendation,
        orderByUpdatedTime: this.orderByUpdatedTime,
        orderBySpace: this.orderBySpace,
        province: this.selectedProvince.value,
        city: this.selectedCity.value,
        area: this.selectedArea.value
      }).then(res => {
        this.count = res.data.data.count
        this.itemList = res.data.data.landResources
        this.loading = false
      })
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
