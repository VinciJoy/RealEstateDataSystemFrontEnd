<template>
  <a-row class="mt-20" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="20">
      <a-col :span="16">
        <video poster="../../../../../static/imgs/bofang.jpg" :src="video.url" controls="controls" style="width:100%; height: auto"></video>
        <a-col :span="24">
          <h1>
            {{ video.title }}
          </h1>
          <h3>
            {{ video.desc }}
          </h3>
          <p v-if="video.fileList && video.fileList.length">
            附件下载：
            <a style="margin-left: 10px" :download="f.name" :href="f.url" v-for="(f, file_index) in video.fileList" :key="'file' + file_index">
            {{ f.name }}
          </a>
          </p>
        </a-col>
      </a-col>
      <a-col :span="8" style="background-color: #fafafa; padding: 10px 20px">
        <h2>
          {{ video.tag }}
        </h2>
        <template v-for="(v, index) in video.relatedVideo" v-if="index < 3">
          <div v-if="v.type === 1 && !userInfo.isMembership" :key="'video_cover' + index" style="width: 360px; height: 270px;background-color: rgba(0,0,0,0.5);position: absolute">
            <p style="color: white; padding: 10px; font-weight: bolder; font-size: 20px">会员专享</p>
          </div>
          <div :key="'video2_cover' + index" v-if="v.type === 2 && !buyVideoList.includes(v.ID + '')" style="width: 360px; height: 270px;background-color: rgba(0, 0, 0, 0.5);position: absolute">
            <p style="color: white; padding: 10px; font-weight: bolder; font-size: 20px">未购买</p>
          </div>
          <div @click="goToVideo(v)" :key="'video' + index">
            <img style="width: 360px; height: 270px;" :src="getCover(v)"/>
            <h3>
              {{ v.title }}
            </h3>
          </div>
        </template>
      </a-col>
    </a-col>
  </a-row>
</template>

<script>
import videoApi from '@system/api/video'
import {mapGetters} from 'vuex'

export default {
  name: 'videoDetail',
  data () {
    return {
      video: {},
      buyVideoList: []
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    '$route.params' () {
      this.init()
    }
  },
  methods: {
    goToVideo (v) {
      if (v.type === 1 && !this.userInfo.isMembership) {
        this.$error('请先开通会员!')
        return
      }
      if (v.type === 2 && !this.buyVideoList.includes(v.ID + '')) {
        this.$error('请先购买视频!')
        return
      }
      this.$router.push({name: 'video', params: {id: v.ID}})
    },
    init () {
      if (this.userInfo.buyVideo) {
        this.buyVideoList = this.userInfo.buyVideo.split(',')
      }
      videoApi.getVideo(this.$route.params['id'], {watch: true}).then(res => {
        this.video = res.data.data.video
        if (this.video.fileList) {
          this.video.fileList = JSON.parse(this.video.fileList)
        }
      })
    },
    getCover (video) {
      return JSON.parse(video.cover)[0].thumbUrl
    }
  }
}
</script>

<style scoped>
</style>
