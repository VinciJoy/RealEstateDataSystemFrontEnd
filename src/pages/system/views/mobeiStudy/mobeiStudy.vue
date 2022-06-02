<template>
  <div>
    <a-row>
      <a-carousel autoplay>
        <template v-for="(banner, index) in form.bannerList">
          <img :key="'banner' + index" :src="banner.url"/>
        </template>
      </a-carousel>
    </a-row>
    <a-row class="mt-20" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row style="background: #f5f5f5; padding: 10px 0 0 20px">
          <a-col @click="changeTab('freeBlock')" :class="'tab ' + (selectedTab === 'freeBlock'? 'blue selected' : 'clickable-txt')" :span="3">免费课程</a-col>
          <a-col @click="changeTab('vipBlock')" :class="'tab ' + (selectedTab === 'vipBlock'? 'blue selected' : 'clickable-txt')" :span="3">会员专享</a-col>
          <a-col @click="changeTab('proBlock')" :class="'tab ' + (selectedTab === 'proBlock'? 'blue selected' : 'clickable-txt')" :span="3">私房高阶</a-col>
        </a-row>
        <a-row style="border-bottom: #e0e0e0 solid 1px;padding-bottom: 40px" :key="'block' + index" v-for="(block, index) in form[selectedTab]">
          <a-col :span="24">
            <p class="block-title">{{ block.title }}</p>
          </a-col>
          <a-col style="margin-top: 10px" :span="6" :key="'block' + index + 'video' + index2" v-for="(video, index2) in block.videoList">
            <videoBlock :getVideoFromID="video" :currentBlock="selectedTab" :isNotBuy="selectedTab === 'proBlock' && !buyVideoList.includes(video + '')" :isNotMembership="selectedTab === 'vipBlock' && !userInfo.isMembership" v-if="index2 < (showCount[selectedTab][index] ? showCount[selectedTab][index] : 8)"></videoBlock>
          </a-col>
          <a-col v-if="block.videoList.length > 8" :span="24" class="mt-10" style="text-align: center">
            <p @click="changeShowCount(index, 999)" v-if="block.videoList.length > (showCount[selectedTab][index] ? showCount[selectedTab][index] : 8)" class="clickable-txt"><a-icon type="down" />显示全部视频</p>
            <p @click="changeShowCount(index, 8)" v-else class="clickable-txt"><a-icon type="up" />收起全部视频</p>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import mobeiApi from '@system/api/mobeiStudy'
import videoBlock from '../components/videoBlock'
import {mapGetters} from 'vuex'

export default {
  name: 'mobeiStudy',
  components: {
    videoBlock
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      selectedTab: 'freeBlock',
      form: {
        bannerList: []
      },
      buyVideoList: [],
      showCount: {
        'freeBlock': [],
        'vipBlock': [],
        'proBlock': []
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.userInfo.buyVideo) {
        this.buyVideoList = this.userInfo.buyVideo.split(',')
      }
      this.getMobeiStudy()
    },
    changeTab (tab) {
      this.selectedTab = tab
    },
    changeShowCount (index, count) {
      this.$set(this.showCount[this.selectedTab], index, count)
    },
    getMobeiStudy () {
      mobeiApi.getMobeiStudy().then(res => {
        this.form = JSON.parse(res.data.data.stringify)
      })
    }
  }
}
</script>

<style scoped>
.tab {
  padding: 15px 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bolder;
}

.selected {
  background: white;
}

.block-title {
  border: 10px #1890ff solid;
  border-top: 0px;
  border-right: 0px;
  border-bottom: 0px;
  padding: 10px;
  margin-top: 20px;
  font-weight: bolder;
  font-size: 20px;
}
</style>
