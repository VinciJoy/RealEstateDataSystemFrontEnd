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
            <a-button style="float: right" @click="goToAdd" type="primary">发布土地信息</a-button>
          </a-col>
        </a-row>

        <a-row class="mt-20">
          <a-cascader style="width: 150px" v-model="place" :options="currentOptions" placeholder="项目位置"/>
          <a-select @change="changeItemType" placeholder="用地性质" style="width: 150px">
            <a-select-option :value="null" :key="0">
              不选择
            </a-select-option>
            <a-select-option v-for="itemType in ITEM_TYPES" :value="itemType" :key="itemType">
              {{ itemType }}
            </a-select-option>
          </a-select>
          <a-select placeholder="项目现状" style="width: 150px">
            <a-select-option value="jack">
              Jack
            </a-select-option>
          </a-select>
          <a-select @change="changeExchangeType" placeholder="交易方式" style="width: 150px">
            <a-select-option v-for="exchangeType in EXCHANGE_TYPES" :value="exchangeType" :key="exchangeType">
              {{ exchangeType }}
            </a-select-option>
          </a-select>
          <div class="tag-desc can-not-select" style="display: inline-block; float: right">
            排序：

            <span class="clickable-txt" @click="orderByUpdatedTime = 'ASC'" v-show="orderByUpdatedTime === ''">更新时间 </span>
            <a @click="orderByUpdatedTime = 'DESC'" v-show="orderByUpdatedTime === 'ASC'">更新时间↓</a>
            <a @click="orderByUpdatedTime = ''" v-show="orderByUpdatedTime === 'DESC'">更新时间↑</a>

            <span class="clickable-txt" @click="orderBySpace = 'ASC'" v-show="orderBySpace === ''">地上建筑面积 </span>
            <a @click="orderBySpace = 'DESC'" v-show="orderBySpace === 'ASC'">地上建筑面积↓</a>
            <a @click="orderBySpace = ''" v-show="orderBySpace === 'DESC'">地上建筑面积↑</a>

            交易对价

            <span class="clickable-txt" @click="orderByRecommendation = 'ASC'" v-show="orderByRecommendation === ''">推荐指数 </span>
            <a @click="orderByRecommendation = 'DESC'" v-show="orderByRecommendation === 'ASC'">推荐指数↓</a>
            <a @click="orderByRecommendation = ''" v-show="orderByRecommendation === 'DESC'">推荐指数↑</a>
          </div>
        </a-row>

        <a-row class="mt-20" style="text-align: center" v-if="!itemList || (itemList.length === 0)">
          <a-icon type="exclamation-circle" style="font-size: 50px"/>
          <p class="mt-10" style="font-size: 25px">
            抱歉，该筛选条件下没有土地 / 资产信息！
          </p>
        </a-row>

        <a-row v-for="item of itemList" :key="item.ID" class="mt-20" :gutter="20" style="height: 200px; cursor: pointer">
          <a-col @click="goToDetail(item.ID)" :span="6" style="background-color: gray; height: 100%; max-width: 100%">123</a-col>
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
                  土地价格：969 万元/亩
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
import utils from '@/utils/utils'

export default {
  name: 'landResource',
  data () {
    return {
      place: [],
      options: options,
      ITEM_TYPES: ITEM_TYPES,
      EXCHANGE_TYPES: EXCHANGE_TYPES,
      pageSize: 10,
      pageIndex: 1,
      count: 0,
      itemType: null,
      exchangeType: null,
      itemList: [],
      orderByRecommendation: '',
      orderByUpdatedTime: '',
      orderBySpace: '',
      currentOptions: []
    }
  },
  mounted () {
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
    'place': function () {
      this.init()
    }
  },
  methods: {
    init () {
      let a = utils.Copy(this.options)
      this.currentOptions = [{
        'code': '0',
        'value': '',
        'label': '不选择'
      }].concat(a)

      api.getLandResources({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        owner: false,
        itemType: this.itemType,
        exchangeType: this.exchangeType,
        visible: true,
        orderByRecommendation: this.orderByRecommendation,
        orderByUpdatedTime: this.orderByUpdatedTime,
        orderBySpace: this.orderBySpace,
        place: this.place.join('/')
      }).then(res => {
        this.count = res.data.data.count
        this.itemList = res.data.data.landResources
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
    }
  }
}
</script>

<style scoped>
</style>
