<template>
  <div>
    <div @click="goToVideo" style="width: 362px; cursor:pointer; margin: auto; border: 1px solid #e8e8e8">
      <div v-if="isNotMembership" style="width: 360px; height: 270px;background-color: rgba(0,0,0,0.5);position: absolute">
        <p style="color: white; padding: 10px; font-weight: bolder; font-size: 20px">会员专享</p>
      </div>
      <div v-if="isNotBuy" style="width: 360px; height: 270px;background-color: rgba(0, 0, 0, 0.5);position: absolute">
        <p style="color: white; padding: 10px; font-weight: bolder; font-size: 20px">未购买</p>
      </div>
      <img style="width: 360px; height: 270px;" :src="thumbUrl"/>
      <div style="padding: 10px 20px; background: white">
        <p>
          <span style="font-size: 20px">{{ title }}</span>
          <span style="float: right; font-size: 20px; font-weight: bolder">{{ price ? ('价格：' + price) + ' 元' : ''}}</span>
        </p>
        <p style="font-size: 15px">
          <span>{{ desc ? desc: '暂无描述' }}</span>
          <span style="float: right;"><a-icon type="user" />{{ formatNum(clickCount) }}</span>
        </p>
      </div>
    </div>
    <membership @closeMembershipModal="membershipVisible = false" :membershipVisible="membershipVisible"></membership>
    <buyItem :id="id" @closeBuyItem="buyItemVisible = false" :title="'购买视频'" :price="price" :content="'点击购买：' + title" :buyItemVisible="buyItemVisible"></buyItem>
  </div>
</template>

<script>
import utils from '@/utils/utils'
import membership from '../components/membership'
import buyItem from '../components/buyItem'

export default {
  name: 'videoBlock',
  components: {
    membership,
    buyItem
  },
  props: {
    thumbUrl: {
      type: String
    },
    isNotMembership: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    isNotBuy: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    desc: {
      type: String,
      default: ''
    },
    clickCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      membershipVisible: false,
      buyItemVisible: false
    }
  },
  methods: {
    goToVideo () {
      if (this.isNotBuy) {
        this.buyItemVisible = true
        return
      }
      if (this.isNotMembership) {
        this.membershipVisible = true
        return
      }
      console.log('go to video')
    },
    formatNum (clickCount) {
      return utils.nFormatter(clickCount, 3)
    }
  }
}
</script>

<style scoped>

</style>
