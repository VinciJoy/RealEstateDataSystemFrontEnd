<template>
  <a-row class="mt-20" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="20">
      <a-col :span="18">
        <video poster="../../../../../static/imgs/loading.gif" src="https://baidu.com/cat.mp4" style="width:100%; height: auto"></video>
        <a-col :span="24">
          <h1>
            {{ video.title }}
          </h1>
          <h3>
            {{ video.desc }}
          </h3>
        </a-col>
      </a-col>
      <a-col :span="6" style="background-color: #fafafa; padding: 10px 20px">
        <h2>
          {{ video.tag }}
        </h2>
        <div v-for="(v, index) in video.relatedVideo" :key="'video' + index">
          <img style="width: 100%" :src="getCover(v)"/>
          <h3>
            {{ v.title }}
          </h3>
        </div>
      </a-col>
    </a-col>
  </a-row>
</template>

<script>
import videoApi from '@system/api/video'

export default {
  name: 'videoDetail',
  data () {
    return {
      video: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      videoApi.getVideo(this.$route.params['id'], {watch: true}).then(res => {
        console.log(res.data.data.video)
        this.video = res.data.data.video
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
