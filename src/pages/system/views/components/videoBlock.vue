<template>
  <div>
    <div @click="goToVideo" style="width: 362px; cursor:pointer; margin: auto; border: 1px solid #e8e8e8">
      <div v-if="!isNotBuy && isNotMembership" style="width: 360px; height: 270px;background-color: rgba(0,0,0,0.5);position: absolute">
        <p style="color: white; padding: 10px; font-weight: bolder; font-size: 20px">会员专享</p>
      </div>
      <div v-if="isNotBuy" style="width: 360px; height: 270px;background-color: rgba(0, 0, 0, 0.5);position: absolute">
        <p style="color: white; padding: 10px; font-weight: bolder; font-size: 20px">未购买</p>
      </div>
      <img style="width: 360px; height: 270px;" :src="form.thumbUrl"/>
      <div style="padding: 10px 20px; background: white">
        <p>
          <span style="font-size: 20px">{{ form.title }}</span>
          <span v-if="currentBlock === 'proBlock'" style="float: right; font-size: 20px; font-weight: bolder">{{ price ? ('价格：' + price) + ' 元' : ''}}</span>
        </p>
        <p style="font-size: 15px">
          <span>{{ form.desc ? form.desc: '暂无描述' }}</span>
          <span style="float: right;"><a-icon type="user" />{{ formatNum(form.watchedCount) }}</span>
        </p>
      </div>
    </div>
    <membership @closeMembershipModal="membershipVisible = false" :membershipVisible="membershipVisible"></membership>
    <buyItem :id="form.id" @closeBuyItem="buyItemVisible = false" :title="'购买视频'" :price="form.price" :content="'点击购买：' + form.title" :buyItemVisible="buyItemVisible"></buyItem>
  </div>
</template>

<script>
import utils from '@/utils/utils'
import membership from '../components/membership'
import buyItem from '../components/buyItem'
import videoApi from '@system/api/video'

export default {
  name: 'videoBlock',
  components: {
    membership,
    buyItem
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    thumbUrl: {
      type: String
    },
    getVideoFromID: {
      type: Number,
      default: 0
    },
    currentBlock: {
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
    watchedCount: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'getVideoFromID'() {
      this.init()
    }
  },
  data () {
    return {
      form: {
        thumbUrl: '',
        desc: '',
        id: 0,
        title: ''
      },
      membershipVisible: false,
      buyItemVisible: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.getVideoFromID) {
        videoApi.getVideo(this.getVideoFromID).then(res => {
          this.form.thumbUrl = JSON.parse(res.data.data.video.cover)[0].thumbUrl
          this.form.title = res.data.data.video.title
          this.form.desc = res.data.data.video.desc
          this.form.id = res.data.data.video.ID
          this.form.watchedCount = res.data.data.video.watchedCount
          this.form.price = res.data.data.video.price
        })
      } else {
        this.form.thumbUrl = this.thumbUrl
        this.form.price = this.price
        this.form.title = this.title
        this.form.desc = this.desc
        this.form.id = this.id
        this.form.watchedCount = this.watchedCount
      }
    },
    goToVideo () {
      if (this.disabled) {
        return
      }
      if (this.isNotMembership) {
        this.membershipVisible = true
        return
      }
      if (this.isNotBuy) {
        this.buyItemVisible = true
        return
      }
      this.$router.push('video/' + this.form.id)
    },
    formatNum (clickCount) {
      return utils.nFormatter(clickCount, 3)
    }
  }
}
</script>

<style scoped>

</style>
